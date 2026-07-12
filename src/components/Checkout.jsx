import { useState } from 'react';
import { useCart } from '../context/CartContext';
import './Checkout.css';

export default function Checkout({ onBack }) {
  const { items, totalPrice, clearCart } = useCart();
  const [step, setStep] = useState('info'); // info | payment | success
  const [form, setForm] = useState({
    name: '', email: '', phone: '', address: '', city: '', zip: '',
    cardName: '', cardNumber: '', cardExpiry: '', cardCvv: '',
    payMethod: 'card',
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
    if (errors[name]) setErrors(err => ({ ...err, [name]: '' }));
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

  const validatePayment = () => {
    const e = {};
    if (form.payMethod === 'card') {
      if (!form.cardName.trim()) e.cardName = 'Requerido';
      if (!form.cardNumber.trim()) e.cardNumber = 'Requerido';
      if (!form.cardExpiry.trim()) e.cardExpiry = 'Requerido';
      if (!form.cardCvv.trim()) e.cardCvv = 'Requerido';
    }
    return e;
  };

  const handleContinue = () => {
    const errs = validateInfo();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setStep('payment');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePay = () => {
    const errs = validatePayment();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setStep('success');
    clearCart();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const shipping = 0; // free shipping
  const total = totalPrice + shipping;

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
              Tu orden ha sido procesada exitosamente. Recibirás un email de confirmación con los detalles de tu envío.
            </p>
            <p className="checkout__success-order">Orden #LS-{Math.floor(Math.random() * 90000 + 10000)}</p>
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
                  >
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M3 3h18v18H3z" /><path d="M12 8v8M8 12h8" />
                    </svg>
                    Transferencia
                  </button>
                  <button
                    className={`checkout__pay-method ${form.payMethod === 'mp' ? 'checkout__pay-method--active' : ''}`}
                    onClick={() => setForm(f => ({ ...f, payMethod: 'mp' }))}
                  >
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10" />
                      <path d="M12 6v12M6 12h12" />
                    </svg>
                    Mercado Pago
                  </button>
                </div>

                {form.payMethod === 'card' && (
                  <>
                    <div className={`checkout__field ${errors.cardName ? 'checkout__field--error' : ''}`}>
                      <label htmlFor="ck-cardname">Titular de la tarjeta *</label>
                      <input id="ck-cardname" name="cardName" value={form.cardName} onChange={handleChange} placeholder="Como figura en la tarjeta" />
                      {errors.cardName && <span className="checkout__error">{errors.cardName}</span>}
                    </div>
                    <div className={`checkout__field ${errors.cardNumber ? 'checkout__field--error' : ''}`}>
                      <label htmlFor="ck-cardnum">Número de tarjeta *</label>
                      <input id="ck-cardnum" name="cardNumber" value={form.cardNumber} onChange={handleChange} placeholder="0000 0000 0000 0000" />
                      {errors.cardNumber && <span className="checkout__error">{errors.cardNumber}</span>}
                    </div>
                    <div className="checkout__form-row">
                      <div className={`checkout__field ${errors.cardExpiry ? 'checkout__field--error' : ''}`}>
                        <label htmlFor="ck-exp">Vencimiento *</label>
                        <input id="ck-exp" name="cardExpiry" value={form.cardExpiry} onChange={handleChange} placeholder="MM/AA" />
                        {errors.cardExpiry && <span className="checkout__error">{errors.cardExpiry}</span>}
                      </div>
                      <div className={`checkout__field ${errors.cardCvv ? 'checkout__field--error' : ''}`}>
                        <label htmlFor="ck-cvv">CVV *</label>
                        <input id="ck-cvv" name="cardCvv" value={form.cardCvv} onChange={handleChange} placeholder="123" />
                        {errors.cardCvv && <span className="checkout__error">{errors.cardCvv}</span>}
                      </div>
                    </div>
                  </>
                )}

                {form.payMethod === 'transfer' && (
                  <div className="checkout__transfer-info">
                    <p>Al confirmar, te enviaremos los datos bancarios por email para que realices la transferencia.</p>
                  </div>
                )}

                {form.payMethod === 'mp' && (
                  <div className="checkout__transfer-info">
                    <p>Al confirmar, serás redirigido a Mercado Pago para completar tu pago de forma segura.</p>
                  </div>
                )}

                <div className="checkout__pay-actions">
                  <button className="checkout__back-btn" onClick={() => { setStep('info'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>
                    ← Volver
                  </button>
                  <button className="checkout__pay-btn" onClick={handlePay}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0110 0v4" />
                    </svg>
                    Confirmar pago · ${total.toLocaleString('es-AR')}
                  </button>
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
