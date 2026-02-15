import React, { useState, useEffect, useRef } from 'react';
import Slide from '../Slide';
import { motion, AnimatePresence } from 'framer-motion';

const InteractivePlaygroundSlide = () => {
    const [input, setInput] = useState("The future of AI is");
    const [generatedText, setGeneratedText] = useState([]);
    const [isGenerating, setIsGenerating] = useState(false);
    const [probabilities, setProbabilities] = useState([]);
    const scrollRef = useRef(null);

    // Mock vocabulary
    const vocabulary = ["bright", "uncertain", "here", "now", "complex", "exciting", "scary", "automated", "digital", "human"];

    const generateNextToken = async () => {
        setIsGenerating(true);

        // Simulate processing time
        await new Promise(r => setTimeout(r, 500));

        // Generate mock probabilities
        const candidates = [];
        for (let i = 0; i < 3; i++) {
            const word = vocabulary[Math.floor(Math.random() * vocabulary.length)];
            const prob = (Math.random() * 0.5 + 0.1).toFixed(2);
            candidates.push({ word, prob: parseFloat(prob) });
        }
        // Normalize roughly (not strict math, just for visual)
        candidates.sort((a, b) => b.prob - a.prob);
        setProbabilities(candidates);

        // Pick top one
        const winner = candidates[0];

        // Add to generated text
        setGeneratedText(prev => [...prev, winner.word]);

        setIsGenerating(false);
    };

    const reset = () => {
        setInput("The future of AI is");
        setGeneratedText([]);
        setProbabilities([]);
        setIsGenerating(false);
    };

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [generatedText]);

    return (
        <Slide>
            <div style={{ display: 'flex', flexDirection: 'column', height: '100%', gap: '1.5rem' }}>
                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <h2>Interactive LLM Playground</h2>
                    <p>
                        See how the model predicts the <strong>Next Token</strong> based on probability.
                    </p>
                </motion.div>

                <div style={{ display: 'flex', gap: '2rem', flex: 1, minHeight: 0 }}>

                    {/* Main Terminal Area */}
                    <div style={{
                        flex: 2,
                        background: '#1e1e1e',
                        borderRadius: '1rem',
                        border: '1px solid #333',
                        display: 'flex',
                        flexDirection: 'column',
                        overflow: 'hidden'
                    }}>
                        <div style={{
                            padding: '0.5rem 1rem',
                            background: '#252526',
                            borderBottom: '1px solid #333',
                            display: 'flex',
                            gap: '0.5rem'
                        }}>
                            <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#ff5f56' }} />
                            <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#ffbd2e' }} />
                            <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#27c93f' }} />
                            <span style={{ marginLeft: '1rem', fontSize: '0.8rem', color: '#888', fontFamily: 'monospace' }}>ai-terminal</span>
                        </div>

                        <div
                            ref={scrollRef}
                            style={{
                                padding: '1.5rem',
                                flex: 1,
                                overflowY: 'auto',
                                fontFamily: 'monospace',
                                fontSize: '1.2rem',
                                lineHeight: 1.6
                            }}
                        >
                            <span style={{ color: 'var(--highlight-color)' }}>{input}</span>
                            {generatedText.map((word, i) => (
                                <motion.span
                                    key={i}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    style={{ color: '#fff' }}
                                >
                                    &nbsp;{word}
                                </motion.span>
                            ))}
                            {isGenerating && <span className="cursor-blink">|</span>}
                        </div>

                        <div style={{ padding: '1rem', borderTop: '1px solid #333', display: 'flex', gap: '1rem' }}>
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                disabled={generatedText.length > 0}
                                style={{
                                    flex: 1,
                                    background: '#111',
                                    border: '1px solid #444',
                                    color: 'white',
                                    padding: '0.5rem',
                                    borderRadius: '0.25rem'
                                }}
                                placeholder="Type your prompt here..."
                            />
                            <button
                                onClick={generateNextToken}
                                disabled={isGenerating}
                                className="feature-pill"
                                style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}
                            >
                                {isGenerating ? 'Thinking...' : 'Predict Next'}
                            </button>
                            <button
                                onClick={reset}
                                className="feature-pill"
                                style={{ padding: '0.5rem 1rem', fontSize: '0.9rem', background: 'rgba(255,100,100,0.2)' }}
                            >
                                Reset
                            </button>
                        </div>
                    </div>

                    {/* Probability Panel */}
                    <div style={{
                        flex: 1,
                        background: 'rgba(255,255,255,0.05)',
                        borderRadius: '1rem',
                        padding: '1.5rem',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '1rem'
                    }}>
                        <h3>Probability Distribution</h3>
                        {isGenerating ? (
                            <div style={{ textAlign: 'center', opacity: 0.5 }}>Calculating probabilities...</div>
                        ) : probabilities.length > 0 ? (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                                {probabilities.map((item, index) => (
                                    <motion.div
                                        key={index}
                                        initial={{ width: 0, opacity: 0 }}
                                        animate={{ width: '100%', opacity: 1 }}
                                        transition={{ delay: index * 0.1 }}
                                    >
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.2rem', fontSize: '0.9rem' }}>
                                            <span>"{item.word}"</span>
                                            <span>{(item.prob * 100).toFixed(1)}%</span>
                                        </div>
                                        <div style={{ width: '100%', height: '8px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px', overflow: 'hidden' }}>
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: `${item.prob * 100}%` }}
                                                style={{
                                                    height: '100%',
                                                    background: index === 0 ? 'var(--secondary-color)' : 'var(--primary-color)'
                                                }}
                                            />
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        ) : (
                            <p style={{ fontSize: '0.9rem', opacity: 0.6 }}>Click "Predict Next" to see the probability map for the next token.</p>
                        )}
                    </div>

                </div>
            </div>
        </Slide>
    );
};

export default InteractivePlaygroundSlide;
