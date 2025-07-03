import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import InstructionalDesignServices from './pages/InstructionalDesignServices';
import DroneServices from './pages/DroneServices';
import MultimediaServices from './pages/MultimediaServices';
import WebGraphicDesignServices from './pages/WebGraphicDesignServices';
import Header from './components/Header';
import Footer from './components/Footer';

function App() {
  return (
    <div className="min-h-screen">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/instructional-design-services" element={
          <>
            <Header />
            <InstructionalDesignServices />
            <Footer />
          </>
        } />
        <Route path="/drone-services" element={
          <>
            <Header />
            <DroneServices />
            <Footer />
          </>
        } />
        <Route path="/multimedia-services" element={
          <>
            <Header />
            <MultimediaServices />
            <Footer />
          </>
        } />
        <Route path="/web-graphic-design-services" element={
          <>
            <Header />
            <WebGraphicDesignServices />
            <Footer />
          </>
        } />
      </Routes>
    </div>
  );
}

export default App;