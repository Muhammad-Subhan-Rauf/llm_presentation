import React, { useState, useEffect, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import IntroSlide from './components/parts/IntroSlide';
import NeuralNetworkSlide from './components/parts/NeuralNetworkSlide';
import TrainingLoopSlide from './components/parts/TrainingLoopSlide';
import AttentionSlide from './components/parts/AttentionSlide';
import TokenizationSlide from './components/parts/TokenizationSlide';
import EmbeddingsSlide from './components/parts/EmbeddingsSlide';
import InteractivePlaygroundSlide from './components/parts/InteractivePlaygroundSlide';
import TransformerSlide from './components/parts/TransformerSlide';
import ConclusionSlide from './components/parts/ConclusionSlide';
import BridgeSlide from './components/parts/BridgeSlide';
import './index.css';

const slides = [
  { id: 'intro', component: IntroSlide, title: 'Introduction' },
  { id: 'neural', component: NeuralNetworkSlide, title: 'Weights & Parameters' },
  { id: 'training', component: TrainingLoopSlide, title: 'Training Loop' },
  { id: 'bridge', component: BridgeSlide, title: 'From Numbers to Language' },
  { id: 'token', component: TokenizationSlide, title: 'Tokenization' },
  { id: 'embeddings', component: EmbeddingsSlide, title: 'Embeddings' },
  { id: 'attention', component: AttentionSlide, title: 'Attention' },
  { id: 'playground', component: InteractivePlaygroundSlide, title: 'Playground' },
  { id: 'transformer', component: TransformerSlide, title: 'Transformer' },
  { id: 'conclusion', component: ConclusionSlide, title: 'Conclusion' },
];

function App() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = useCallback(() => {
    setCurrentSlide(prev => Math.min(prev + 1, slides.length - 1));
  }, []);

  const prevSlide = useCallback(() => {
    setCurrentSlide(prev => Math.max(prev - 1, 0));
  }, []);

  const goToSlide = useCallback((index) => {
    setCurrentSlide(index);
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Don't navigate if user is typing in an input/textarea
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

      if (e.key === 'ArrowRight' || e.key === ' ') {
        e.preventDefault();
        nextSlide();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        prevSlide();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [nextSlide, prevSlide]);

  const CurrentComponent = slides[currentSlide].component;
  const progress = (currentSlide / (slides.length - 1)) * 100;

  return (
    <div className="app-container">
      {/* Progress bar */}
      <div className="progress-bar-container">
        <motion.div
          className="progress-bar-fill"
          initial={false}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
        />
      </div>

      {/* Progress dots */}
      <div className="progress-dots">
        {slides.map((slide, i) => (
          <button
            key={slide.id}
            className={`progress-dot ${i === currentSlide ? 'active' : ''} ${i < currentSlide ? 'visited' : ''}`}
            onClick={() => goToSlide(i)}
            title={slide.title}
          />
        ))}
      </div>

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
