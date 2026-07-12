import { useState } from 'react';
import { CartProvider } from './context/CartContext';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Features from './components/Features';
import HowItWorks from './components/HowItWorks';
import ReviewsCTA from './components/ReviewsCTA';
import FAQ from './components/FAQ';
import Contact from './components/Contact';
import Footer from './components/Footer';
import Shop from './components/Shop';
import LinkstarApp from './components/LinkstarApp';
import Cart from './components/Cart';
import Checkout from './components/Checkout';

export default function App() {
  const [page, setPage] = useState('home'); // 'home' | 'shop' | 'contact' | 'checkout'

  const goToShop = () => {
    setPage('shop');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const goHome = () => {
    setPage('home');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const goToContact = () => {
    setPage('contact');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const goToCheckout = () => {
    setPage('checkout');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const goToLinkstarApp = () => {
    setPage('linkstarapp');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <CartProvider>
      {page !== 'checkout' && (
        <Navbar onShop={goToShop} onHome={goHome} onContact={goToContact} onLinkstarApp={goToLinkstarApp} currentPage={page} />
      )}
      
      {page === 'checkout' && <Checkout onBack={goHome} />}

      {page === 'shop' && (
        <>
          <Shop onBack={goHome} />
          <Footer onContact={goToContact} onShop={goToShop} />
        </>
      )}

      {page === 'contact' && (
        <>
          <Contact />
          <Footer onContact={goToContact} onShop={goToShop} />
        </>
      )}

      {page === 'linkstarapp' && (
        <>
          <LinkstarApp onShop={goToShop} />
          <Footer onContact={goToContact} onShop={goToShop} />
        </>
      )}

      {page === 'home' && (
        <>
          <main>
            <Hero onShop={goToShop} onLinkstarApp={goToLinkstarApp} />
            <Features onShop={goToShop} />
            <HowItWorks onShop={goToShop} />
            <ReviewsCTA onShop={goToShop} />
            <FAQ onContact={goToContact} />
          </main>
          <Footer onContact={goToContact} onShop={goToShop} />
        </>
      )}

      <Cart onCheckout={goToCheckout} />
    </CartProvider>
  );
}
