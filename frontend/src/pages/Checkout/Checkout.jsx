import { useState, useEffect } from 'react';
import { CardPayment } from '@mercadopago/sdk-react';
import { useCart } from '../../context/CartContext';
import './Checkout.css';

const API_URL = 'http://localhost:3001';

export default function Checkout({ onBack }) {
  const { items, totalPrice, clearCart } = useCart();
  const [step, setStep] = useState('info'); // info | payment | success | transfer-success
  const [form, setForm] = useState({
    name: '', email: '', phone: '', address: '', city: '', zip: '',
    cardName: '', cardNumber: '', cardExpiry: '', cardCvv: '',
    payMethod: 'card',
  });
  const [errors, setErrors] = useState({});
  const [processing, setProcessing] = useState(false);
  const [payError, setPayError] = useState('');
  const [orderNumber, setOrderNumber] = useState('');
  const [savedTotal, setSavedTotal] = useState(0);

  // Check for MP redirect (success/failure/pending)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const paymentStatus = params.get('payment');
    const order = params.get('order');

    if (paymentStatus === 'success' && order) {
      setOrderNumber(order);
      setStep('success');
      clearCart();
      // Clean URL
      window.history.replaceState({}, '', window.location.pathname);
    } else if (paymentStatus === 'failure' && order) {
      setPayError('El pago fue rechazado. Por favor, intentá con otro método de pago.');
      setStep('payment');
      window.history.replaceState({}, '', window.location.pathname);
    } else if (paymentStatus === 'pending' && order) {
      setOrderNumber(order);
      setStep('success');
      clearCart();
      window.history.replaceState({}, '', window.location.pathname);
    }
  }, [clearCart]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
    if (errors[name]) setErrors(err => ({ ...err, [name]: '' }));
    if (payError) setPayError('');
  };

  const validateInfo = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Requerido';
    if (!form.email.trim()) e.email = 'Requerido';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Email inválido';
    if (!form.address.trim()) e.address = 'Requerido';
    if (!form.city.trim()) e.city = 'Requerido';
    return e;
  };

  const handleContinue = () => {
    const errs = validateInfo();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setStep('payment');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // ── Pay with Mercado Pago (redirect for MP wallet) ──
  const handlePayMP = async () => {
    setProcessing(true);
    setPayError('');

    try {
      const response = await fetch(`${API_URL}/api/create-preference`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: items.map(i => ({
            id: i.id,
            key: i.key,
            name: i.name,
            price: i.price,
            qty: i.qty,
            color: i.color,
            image: i.image,
          })),
          customer: {
            name: form.name,
            email: form.email,
            phone: form.phone,
            address: form.address,
            city: form.city,
            zip: form.zip,
          },
          payMethod: form.payMethod,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error al procesar el pago');
      }

      window.location.href = data.init_point;
    } catch (err) {
      console.error('Payment error:', err);
      setPayError(err.message || 'Ocurrió un error al procesar el pago. Intentá de nuevo.');
      setProcessing(false);
    }
  };

  // ── Pay with Card (CardPayment Brick onSubmit) ──
  const handleCardSubmit = async (formData) => {
    setProcessing(true);
    setPayError('');

    try {
      const response = await fetch(`${API_URL}/api/process-payment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          formData,
          customer: {
            name: form.name,
            email: form.email,
            phone: form.phone,
            address: form.address,
            city: form.city,
            zip: form.zip,
          },
          cartItems: items.map(i => ({
            id: i.id,
            key: i.key,
            name: i.name,
            price: i.price,
            qty: i.qty,
            color: i.color,
            image: i.image,
          })),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error al procesar el pago');
      }

      if (data.status === 'approved') {
        setOrderNumber(data.order_number);
        setSavedTotal(total);
        setStep('success');
        clearCart();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else if (data.status === 'in_process' || data.status === 'pending') {
        setOrderNumber(data.order_number);
        setSavedTotal(total);
        setStep('success');
        clearCart();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        setPayError('El pago fue rechazado. Intentá con otra tarjeta o método de pago.');
      }
    } catch (err) {
      console.error('Card payment error:', err);
      setPayError(err.message || 'Error al procesar el pago con tarjeta.');
    } finally {
      setProcessing(false);
    }
  };

  // ── Pay with Transfer ──
  const handlePayTransfer = async () => {
    setProcessing(true);
    setPayError('');

    try {
      const response = await fetch(`${API_URL}/api/orders/transfer`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: items.map(i => ({
            id: i.id,
            key: i.key,
            name: i.name,
            price: i.price,
            qty: i.qty,
            color: i.color,
            image: i.image,
          })),
          customer: {
            name: form.name,
            email: form.email,
            phone: form.phone,
            address: form.address,
            city: form.city,
            zip: form.zip,
          },
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error al crear la orden');
      }

      setOrderNumber(data.order_number);
      setSavedTotal(total);
      setStep('transfer-success');
      clearCart();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      console.error('Transfer order error:', err);
      setPayError(err.message || 'Ocurrió un error al procesar la orden. Intentá de nuevo.');
    } finally {
      setProcessing(false);
    }
  };

  const handlePay = () => {
    if (form.payMethod === 'transfer') {
      handlePayTransfer();
    } else {
      handlePayMP();
    }
  };

  const shipping = 0;
  const total = totalPrice + shipping;

  // ── Success screen (Mercado Pago) ──
  if (step === 'success') {
    return (
      <section className="checkout">
        <div className="container checkout__inner">
          <div className="checkout__success">
            <div className="checkout__success-icon">
              <svg width="52" height="52" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
            </div>
            <h2 className="checkout__success-title">¡Pedido confirmado!</h2>
            <p className="checkout__success-text">
              Tu pago fue procesado exitosamente. Recibirás un email de confirmación con los detalles de tu envío.
            </p>
            <p className="checkout__success-order">Orden {orderNumber}</p>
            <button className="checkout__success-btn" onClick={onBack}>
              Volver al inicio
            </button>
          </div>
        </div>
      </section>
    );
  }

  // ── Transfer success screen ──
  if (step === 'transfer-success') {
    return (
      <section className="checkout">
        <div className="container checkout__inner">
          <div className="checkout__success">
            <div className="checkout__success-icon checkout__success-icon--transfer">
              <svg width="52" height="52" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <path d="M3 9h18M9 21V9" />
              </svg>
            </div>
            <h2 className="checkout__success-title">¡Orden registrada!</h2>
            <p className="checkout__success-text">
              Tu pedido fue registrado exitosamente. Realizá la transferencia con los datos que figuran abajo y envianos el comprobante por email.
            </p>
            <p className="checkout__success-order">Orden {orderNumber}</p>

            <div className="checkout__bank-details">
              <h4 className="checkout__bank-title">Datos para transferencia</h4>
              <div className="checkout__bank-row">
                <span className="checkout__bank-label">Titular</span>
                <span className="checkout__bank-value">Santino Gallo</span>
              </div>
              <div className="checkout__bank-row">
                <span className="checkout__bank-label">CVU</span>
                <span className="checkout__bank-value">0000003100079982912854</span>
              </div>
              <div className="checkout__bank-row">
                <span className="checkout__bank-label">Alias</span>
                <span className="checkout__bank-value">santinogallo1</span>
              </div>
              <div className="checkout__bank-row">
                <span className="checkout__bank-label">Total a transferir</span>
                <span className="checkout__bank-value checkout__bank-value--total">${savedTotal.toLocaleString('es-AR')}</span>
              </div>
              <p className="checkout__bank-note">
                📧 Enviá el comprobante a <strong>pagos@linkstar.com</strong> indicando tu número de orden.
              </p>
            </div>

            <button className="checkout__success-btn" onClick={onBack}>
              Volver al inicio
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="checkout">
      <div className="container checkout__inner">
        {/* Header */}
        <div className="checkout__header">
          <button className="checkout__back" onClick={onBack}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" />
            </svg>
            Volver
          </button>
          <h1 className="checkout__title">Finalizar compra</h1>
          {/* Steps indicator */}
          <div className="checkout__steps">
            <div className={`checkout__step ${step === 'info' ? 'checkout__step--active' : 'checkout__step--done'}`}>
              <span className="checkout__step-num">1</span>
              <span className="checkout__step-label">Información</span>
            </div>
            <div className="checkout__step-line" />
            <div className={`checkout__step ${step === 'payment' ? 'checkout__step--active' : ''}`}>
              <span className="checkout__step-num">2</span>
              <span className="checkout__step-label">Pago</span>
            </div>
          </div>
        </div>

        <div className="checkout__grid">
          {/* Left: Form */}
          <div className="checkout__form-col">
            {step === 'info' && (
              <div className="checkout__section">
                <h3 className="checkout__section-title">Datos de contacto</h3>
                <div className="checkout__form-row">
                  <div className={`checkout__field ${errors.name ? 'checkout__field--error' : ''}`}>
                    <label htmlFor="ck-name">Nombre completo *</label>
                    <input id="ck-name" name="name" value={form.name} onChange={handleChange} placeholder="Juan Pérez" autoComplete="name" />
                    {errors.name && <span className="checkout__error">{errors.name}</span>}
                  </div>
                  <div className={`checkout__field ${errors.email ? 'checkout__field--error' : ''}`}>
                    <label htmlFor="ck-email">Email *</label>
                    <input id="ck-email" name="email" type="email" value={form.email} onChange={handleChange} placeholder="tu@email.com" autoComplete="email" />
                    {errors.email && <span className="checkout__error">{errors.email}</span>}
                  </div>
                </div>
                <div className="checkout__field">
                  <label htmlFor="ck-phone">Teléfono <span className="checkout__optional">(opcional)</span></label>
                  <input id="ck-phone" name="phone" type="tel" value={form.phone} onChange={handleChange} placeholder="+54 9 11 0000-0000" autoComplete="tel" />
                </div>

                <h3 className="checkout__section-title" style={{ marginTop: 'var(--space-6)' }}>Dirección de envío</h3>
                <div className={`checkout__field ${errors.address ? 'checkout__field--error' : ''}`}>
                  <label htmlFor="ck-address">Dirección *</label>
                  <input id="ck-address" name="address" value={form.address} onChange={handleChange} placeholder="Calle 123, Piso 4, Depto B" autoComplete="street-address" />
                  {errors.address && <span className="checkout__error">{errors.address}</span>}
                </div>
                <div className="checkout__form-row">
                  <div className={`checkout__field ${errors.city ? 'checkout__field--error' : ''}`}>
                    <label htmlFor="ck-city">Ciudad *</label>
                    <input id="ck-city" name="city" value={form.city} onChange={handleChange} placeholder="Buenos Aires" autoComplete="address-level2" />
                    {errors.city && <span className="checkout__error">{errors.city}</span>}
                  </div>
                  <div className="checkout__field">
                    <label htmlFor="ck-zip">Código postal</label>
                    <input id="ck-zip" name="zip" value={form.zip} onChange={handleChange} placeholder="C1000" autoComplete="postal-code" />
                  </div>
                </div>

                <button className="checkout__continue" onClick={handleContinue}>
                  Continuar al pago
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
                  </svg>
                </button>
              </div>
            )}

            {step === 'payment' && (
              <div className="checkout__section">
                <h3 className="checkout__section-title">Método de pago</h3>

                {/* Payment method selector */}
                <div className="checkout__pay-methods">
                  <button
                    className={`checkout__pay-method ${form.payMethod === 'card' ? 'checkout__pay-method--active' : ''}`}
                    onClick={() => setForm(f => ({ ...f, payMethod: 'card' }))}
                    disabled={processing}
                  >
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
                      <line x1="1" y1="10" x2="23" y2="10" />
                    </svg>
                    Tarjeta
                  </button>
                  <button
                    className={`checkout__pay-method ${form.payMethod === 'transfer' ? 'checkout__pay-method--active' : ''}`}
                    onClick={() => setForm(f => ({ ...f, payMethod: 'transfer' }))}
                    disabled={processing}
                  >
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M3 3h18v18H3z" /><path d="M12 8v8M8 12h8" />
                    </svg>
                    Transferencia
                  </button>
                  <button
                    className={`checkout__pay-method ${form.payMethod === 'mp' ? 'checkout__pay-method--active' : ''}`}
                    onClick={() => setForm(f => ({ ...f, payMethod: 'mp' }))}
                    disabled={processing}
                  >
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10" />
                      <path d="M12 6v12M6 12h12" />
                    </svg>
                    Mercado Pago
                  </button>
                </div>

                {form.payMethod === 'card' && (
                  <div className="checkout__card-brick">
                    <CardPayment
                      initialization={{ amount: total }}
                      customization={{
                        visual: {
                          style: {
                            customVariables: {
                              formBackgroundColor: '#ffffff',
                              baseColor: '#D8572E',
                            },
                          },
                        },
                      }}
                      onSubmit={handleCardSubmit}
                      onReady={() => console.log('CardPayment Brick ready')}
                      onError={(error) => {
                        console.error('CardPayment Brick error:', error);
                        setPayError('Error al cargar el formulario de pago. Recargá la página.');
                      }}
                    />
                  </div>
                )}

                {form.payMethod === 'mp' && (
                  <div className="checkout__mp-info">
                    <div className="checkout__mp-info-icon">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0110 0v4" />
                      </svg>
                    </div>
                    <p>Al confirmar, serás redirigido a Mercado Pago para completar tu pago con tu cuenta o saldo disponible.</p>
                  </div>
                )}

                {form.payMethod === 'transfer' && (
                  <div className="checkout__transfer-info">
                    <p>Al confirmar, te mostraremos los datos bancarios para que realices la transferencia. Tu pedido quedará reservado.</p>
                  </div>
                )}

                {/* Error message */}
                {payError && (
                  <div className="checkout__pay-error">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" />
                    </svg>
                    {payError}
                  </div>
                )}

                <div className="checkout__pay-actions">
                  <button
                    className="checkout__back-btn"
                    onClick={() => { setStep('info'); setPayError(''); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                    disabled={processing}
                  >
                    ← Volver
                  </button>
                  {/* Only show confirm button for transfer and MP (Card has its own button via Brick) */}
                  {form.payMethod !== 'card' && (
                    <button
                      className={`checkout__pay-btn ${processing ? 'checkout__pay-btn--processing' : ''}`}
                      onClick={handlePay}
                      disabled={processing}
                    >
                      {processing ? (
                        <>
                          <span className="checkout__pay-spinner" />
                          Procesando...
                        </>
                      ) : (
                        <>
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0110 0v4" />
                          </svg>
                          {form.payMethod === 'transfer'
                            ? `Confirmar pedido · $${total.toLocaleString('es-AR')}`
                            : `Pagar con Mercado Pago · $${total.toLocaleString('es-AR')}`
                          }
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Right: Order summary */}
          <div className="checkout__summary">
            <h3 className="checkout__summary-title">Resumen del pedido</h3>
            <ul className="checkout__summary-items">
              {items.map(item => (
                <li className="checkout__summary-item" key={item.key}>
                  <div className={`checkout__summary-img checkout__summary-img--${item.color}`}>
                    <img src={item.image} alt={item.name} />
                  </div>
                  <div className="checkout__summary-info">
                    <span className="checkout__summary-name">{item.name}</span>
                    <span className="checkout__summary-meta">{item.color === 'negro' ? 'Negro' : 'Blanco'} × {item.qty}</span>
                  </div>
                  <span className="checkout__summary-price">${(item.price * item.qty).toLocaleString('es-AR')}</span>
                </li>
              ))}
            </ul>
            <div className="checkout__summary-divider" />
            <div className="checkout__summary-row">
              <span>Subtotal</span>
              <span>${totalPrice.toLocaleString('es-AR')}</span>
            </div>
            <div className="checkout__summary-row">
              <span>Envío</span>
              <span className="checkout__summary-free">Gratis</span>
            </div>
            <div className="checkout__summary-divider" />
            <div className="checkout__summary-row checkout__summary-row--total">
              <span>Total</span>
              <span>${total.toLocaleString('es-AR')}</span>
            </div>
            <div className="checkout__summary-trust">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0110 0v4" />
              </svg>
              Pago 100% seguro y encriptado
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
