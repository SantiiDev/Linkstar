import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { createClient } from '@supabase/supabase-js';

// ─── Config ───────────────────────────────────────────────
const app = express();
const PORT = process.env.PORT || 3001;
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

app.use(cors({ origin: FRONTEND_URL }));
app.use(express.json());

// ─── Supabase ─────────────────────────────────────────────
// El schema en supabase/migrations/0006_rls.sql niega insert/update/delete
// sobre `orders` y ejecución de `resolve_scan` a `anon`/`authenticated` a
// propósito: sólo un cliente de confianza (este backend) puede escribir ahí.
// Por eso este cliente usa la service_role key, no la publishable/anon.
if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
  console.warn(
    '⚠️  Falta SUPABASE_SERVICE_ROLE_KEY en .env — las escrituras a `orders` y ' +
    'las funciones resolve_scan/record_webhook_event van a fallar por RLS. ' +
    'Buscala en el dashboard de Supabase: Project Settings → API → service_role secret.'
  );
}

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { persistSession: false } },
);

// ─── Helpers ──────────────────────────────────────────────
function generateOrderNumber() {
  return `LS-${Date.now().toString(36).toUpperCase()}${Math.random().toString(36).substring(2, 5).toUpperCase()}`;
}

// Inserta la orden + sus renglones (public.orders / public.order_items,
// ver supabase/migrations/0005_billing_and_orders.sql). Lanza si algo falla:
// mejor un 500 explícito que un pedido "fantasma" sin order_items.
async function createOrder({ orderNumber, buyer, items, total }) {
  const { data: order, error: orderError } = await supabase
    .from('orders')
    .insert({
      order_number: orderNumber,
      status: 'pending',
      buyer_name: buyer.name,
      buyer_email: buyer.email,
      buyer_phone: buyer.phone || null,
      shipping_address: {
        address: buyer.address,
        city: buyer.city,
        zip: buyer.zip || null,
      },
      subtotal: total,
      shipping_cost: 0,
      discount: 0,
      total,
    })
    .select()
    .single();

  if (orderError) throw orderError;

  const orderItems = items.map((item) => ({
    order_id: order.id,
    sku: String(item.id ?? item.key),
    product_name: `${item.name}${item.color ? ` - ${item.color === 'negro' ? 'Negro' : 'Blanco'}` : ''}`,
    quantity: item.qty,
    unit_price: item.price,
    total_price: item.price * item.qty,
  }));

  const { error: itemsError } = await supabase.from('order_items').insert(orderItems);
  if (itemsError) throw itemsError;

  return order;
}

// ─── Routes ───────────────────────────────────────────────

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ──────────────────────────────────────────────────────────
// GET /d/:publicId
// Resuelve un toque de NFC/QR: llama a resolve_scan() (SECURITY DEFINER,
// sólo service_role) y redirige. SIEMPRE responde con un destino, incluso
// si algo falla — ver supabase/migrations/0007_functions_and_jobs.sql.
// ──────────────────────────────────────────────────────────
app.get('/d/:publicId', async (req, res) => {
  const fallback = 'https://linkstar.com.ar';
  try {
    const ip = (req.headers['x-forwarded-for']?.split(',')[0] || req.socket.remoteAddress || '').trim();

    const { data, error } = await supabase.rpc('resolve_scan', {
      p_public_id: req.params.publicId,
      p_ip: ip || null,
      p_user_agent: req.headers['user-agent'] || null,
      p_referrer: req.headers['referer'] || null,
    });

    if (error) throw error;

    return res.redirect(302, data?.destination || fallback);
  } catch (err) {
    console.error('Error resolviendo escaneo:', err);
    return res.redirect(302, fallback);
  }
});

// ──────────────────────────────────────────────────────────
// POST /api/orders
// Registra un pedido (sin pago online) en Supabase.
// El aviso por mail (Web3Forms) lo dispara el frontend directamente: el
// plan gratuito de Web3Forms rechaza las llamadas server-to-server
// ("Use our API in client side..."), así que server.js no puede mandarlo.
// ──────────────────────────────────────────────────────────
app.post('/api/orders', async (req, res) => {
  try {
    const { items, customer } = req.body;

    if (!items?.length || !customer?.name || !customer?.email) {
      return res.status(400).json({ error: 'Datos incompletos' });
    }

    const orderNumber = generateOrderNumber();
    const total = items.reduce((sum, i) => sum + i.price * i.qty, 0);

    await createOrder({
      orderNumber,
      buyer: customer,
      items,
      total,
    });

    res.json({
      order_number: orderNumber,
      total,
    });
  } catch (err) {
    console.error('Error creating order:', err);
    res.status(500).json({ error: 'Error al registrar el pedido' });
  }
});

// ──────────────────────────────────────────────────────────
// GET /api/orders/:orderNumber
// Get order status
// ──────────────────────────────────────────────────────────
app.get('/api/orders/:orderNumber', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('orders')
      .select('*, order_items(*)')
      .eq('order_number', req.params.orderNumber)
      .single();

    if (error || !data) {
      return res.status(404).json({ error: 'Orden no encontrada' });
    }

    res.json(data);
  } catch (err) {
    console.error('Error fetching order:', err);
    res.status(500).json({ error: 'Error al obtener la orden' });
  }
});

// ─── Start ────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`
  ╔════════════════════════════════════════════╗
  ║   🚀  Linkstar Backend running            ║
  ║   📍  http://localhost:${PORT}              ║
  ║   🔗  Frontend: ${FRONTEND_URL}    ║
  ╚════════════════════════════════════════════╝
  `);
});
