import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import IntroSlide from './components/parts/IntroSlide';
import NeuralNetworkSlide from './components/parts/NeuralNetworkSlide';
import TokenizationSlide from './components/parts/TokenizationSlide';
import TrainingLoopSlide from './components/parts/TrainingLoopSlide';
import ConclusionSlide from './components/parts/ConclusionSlide';
import InteractivePlaygroundSlide from './components/parts/InteractivePlaygroundSlide';
import './index.css';

const slides = [
  { id: 'intro', component: IntroSlide },
  { id: 'neural', component: NeuralNetworkSlide },
  { id: 'training', component: TrainingLoopSlide },
  { id: 'token', component: TokenizationSlide },
  { id: 'playground', component: InteractivePlaygroundSlide },
  { id: 'conclusion', component: ConclusionSlide },
];

function App() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    }
  };

  const prevSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  };

  const CurrentComponent = slides[currentSlide].component;

  return (
    <div className="app-container">
      <div className="slides-wrapper">
        <AnimatePresence mode="wait">
          <motion.div
            key={slides[currentSlide].id}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.5 }}
            className="slide-content"
          >
            <CurrentComponent />
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="navigation-controls">
        <button
          onClick={prevSlide}
          disabled={currentSlide === 0}
          className="nav-btn"
        >
          <ChevronLeft size={24} />
        </button>
        <span className="slide-indicator">
          {currentSlide + 1} / {slides.length}
        </span>
        <button
          onClick={nextSlide}
          disabled={currentSlide === slides.length - 1}
          className="nav-btn"
        >
          <ChevronRight size={24} />
        </button>
      </div>
    </div>
  );
}

export default App;
