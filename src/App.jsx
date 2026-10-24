import { useLayoutEffect } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import './App.css'
import Navbar from './components/navbar/Navbar'
import Home from './components/home/home';
import About from "./components/about/about";
import Contact from "./components/contact/contact";
import Services from "./components/services/services";
import Footer from "./components/footer/footer";
import Admin from "./components/admin/admin";

function ScrollToTop() {
  const { pathname } = useLocation();

  useLayoutEffect(() => {
    window.history.scrollRestoration = "manual";
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

function PageFooter() {
  const { pathname } = useLocation();

  return pathname === "/admin" ? null : <Footer />;
}

function App() {

  return (
    <BrowserRouter>
      <ScrollToTop />
      <div className="app-shell">
        <Navbar />
        <main className="app-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/services" element={<Services />} />
            <Route path="/admin" element={<Admin />} />
          </Routes>
        </main>
        <PageFooter />
      </div>
    </BrowserRouter>
  )
}

export default App
