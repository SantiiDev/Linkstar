import { useState } from 'react';
import { CartProvider } from './context/CartContext';
import Navbar from './components/layout/Navbar/Navbar';
import Hero from './components/sections/Hero/Hero';
import Features from './components/sections/Features/Features';
import HowItWorks from './components/sections/HowItWorks/HowItWorks';
import ReviewsCTA from './components/sections/ReviewsCTA/ReviewsCTA';
import FAQ from './components/sections/FAQ/FAQ';
import Contact from './pages/Contact/Contact';
import Footer from './components/layout/Footer/Footer';
import Shop from './pages/Shop/Shop';
import LinkstarApp from './pages/LinkstarApp/LinkstarApp';
import Cart from './components/common/Cart/Cart';
import Checkout from './pages/Checkout/Checkout';
import Legal from './pages/Info/Legal';
import Privacy from './pages/Info/Privacy';
import Terms from './pages/Info/Terms';
import Warranty from './pages/Info/Warranty';
import About from './pages/Info/About';

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

  const navigateTo = (pageName) => {
    setPage(pageName);
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
          <Footer onContact={goToContact} onShop={goToShop} onLinkstarApp={goToLinkstarApp} onNavigate={navigateTo} />
        </>
      )}

      {page === 'contact' && (
        <>
          <Contact />
          <Footer onContact={goToContact} onShop={goToShop} onLinkstarApp={goToLinkstarApp} onNavigate={navigateTo} />
        </>
      )}

      {page === 'linkstarapp' && (
        <>
          <LinkstarApp onShop={goToShop} onContact={goToContact} />
          <Footer onContact={goToContact} onShop={goToShop} onLinkstarApp={goToLinkstarApp} onNavigate={navigateTo} />
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
          <Footer onContact={goToContact} onShop={goToShop} onLinkstarApp={goToLinkstarApp} onNavigate={navigateTo} />
        </>
      )}

      {page === 'legal' && (
        <>
          <Legal />
          <Footer onContact={goToContact} onShop={goToShop} onLinkstarApp={goToLinkstarApp} onNavigate={navigateTo} />
        </>
      )}

      {page === 'privacy' && (
        <>
          <Privacy />
          <Footer onContact={goToContact} onShop={goToShop} onLinkstarApp={goToLinkstarApp} onNavigate={navigateTo} />
        </>
      )}

      {page === 'terms' && (
        <>
          <Terms />
          <Footer onContact={goToContact} onShop={goToShop} onLinkstarApp={goToLinkstarApp} onNavigate={navigateTo} />
        </>
      )}

      {page === 'warranty' && (
        <>
          <Warranty />
          <Footer onContact={goToContact} onShop={goToShop} onLinkstarApp={goToLinkstarApp} onNavigate={navigateTo} />
        </>
      )}

      {page === 'about' && (
        <>
          <About />
          <Footer onContact={goToContact} onShop={goToShop} onLinkstarApp={goToLinkstarApp} onNavigate={navigateTo} />
        </>
      )}

      <Cart onCheckout={goToCheckout} />
    </CartProvider>
  );
}
