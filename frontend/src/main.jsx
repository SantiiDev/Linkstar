import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { initMercadoPago } from '@mercadopago/sdk-react'
import './index.css'
import App from './App.jsx'

// Initialize Mercado Pago with Public Key
initMercadoPago('APP_USR-b5e13fcd-d288-425b-a0eb-8c4401af0f63', {
  locale: 'es-AR',
})

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
