import React, { useState, useEffect, useRef, useCallback } from 'react';
import Slide from '../Slide';
import { motion, AnimatePresence } from 'framer-motion';

// Context-aware prediction map (bigram/trigram based)
const PREDICTION_MAP = {
    'default': [
        { word: 'the', prob: 0.15 }, { word: 'a', prob: 0.10 }, { word: 'and', prob: 0.08 },
        { word: 'to', prob: 0.07 }, { word: 'is', prob: 0.06 }, { word: 'in', prob: 0.05 },
        { word: 'of', prob: 0.05 }, { word: 'that', prob: 0.04 }, { word: 'it', prob: 0.04 },
        { word: 'for', prob: 0.03 },
    ],
    'the': [
        { word: 'future', prob: 0.12 }, { word: 'world', prob: 0.10 }, { word: 'best', prob: 0.08 },
        { word: 'most', prob: 0.07 }, { word: 'first', prob: 0.06 }, { word: 'new', prob: 0.05 },
        { word: 'same', prob: 0.04 }, { word: 'next', prob: 0.04 }, { word: 'way', prob: 0.03 },
        { word: 'end', prob: 0.03 },
    ],
    'future': [
        { word: 'of', prob: 0.25 }, { word: 'is', prob: 0.20 }, { word: 'will', prob: 0.10 },
        { word: 'looks', prob: 0.08 }, { word: 'holds', prob: 0.06 }, { word: 'for', prob: 0.05 },
        { word: 'depends', prob: 0.04 }, { word: 'remains', prob: 0.03 },
    ],
    'of': [
        { word: 'the', prob: 0.22 }, { word: 'AI', prob: 0.12 }, { word: 'a', prob: 0.08 },
        { word: 'our', prob: 0.06 }, { word: 'this', prob: 0.05 }, { word: 'all', prob: 0.04 },
        { word: 'human', prob: 0.04 }, { word: 'technology', prob: 0.03 },
    ],
    'ai': [
        { word: 'is', prob: 0.25 }, { word: 'will', prob: 0.15 }, { word: 'and', prob: 0.10 },
        { word: 'can', prob: 0.08 }, { word: 'has', prob: 0.06 }, { word: 'systems', prob: 0.05 },
        { word: 'models', prob: 0.04 }, { word: 'technology', prob: 0.03 },
    ],
    'is': [
        { word: 'a', prob: 0.12 }, { word: 'the', prob: 0.10 }, { word: 'not', prob: 0.08 },
        { word: 'bright', prob: 0.07 }, { word: 'exciting', prob: 0.06 }, { word: 'uncertain', prob: 0.06 },
        { word: 'going', prob: 0.05 }, { word: 'already', prob: 0.04 }, { word: 'here', prob: 0.04 },
        { word: 'transforming', prob: 0.03 },
    ],
    'bright': [
        { word: 'and', prob: 0.20 }, { word: 'but', prob: 0.12 }, { word: 'with', prob: 0.08 },
        { word: 'for', prob: 0.07 }, { word: 'as', prob: 0.06 }, { word: ',', prob: 0.15 },
        { word: '.', prob: 0.10 },
    ],
    'exciting': [
        { word: 'and', prob: 0.18 }, { word: 'but', prob: 0.12 }, { word: 'because', prob: 0.08 },
        { word: ',', prob: 0.15 }, { word: '.', prob: 0.10 }, { word: 'times', prob: 0.05 },
        { word: 'possibilities', prob: 0.04 },
    ],
    'uncertain': [
        { word: 'but', prob: 0.15 }, { word: 'and', prob: 0.12 }, { word: ',', prob: 0.12 },
        { word: '.', prob: 0.10 }, { word: 'as', prob: 0.08 }, { word: 'yet', prob: 0.06 },
        { word: 'territory', prob: 0.04 },
    ],
};

const softmaxWithTemperature = (probs, temperature) => {
    const logits = probs.map(p => Math.log(p.prob + 1e-10));
    const scaled = logits.map(l => l / temperature);
    const maxScaled = Math.max(...scaled);
    const exps = scaled.map(s => Math.exp(s - maxScaled));
    const sumExps = exps.reduce((a, b) => a + b, 0);
    return probs.map((p, i) => ({
        ...p,
        adjustedProb: exps[i] / sumExps,
    }));
};

const InteractivePlaygroundSlide = () => {
    const [input, setInput] = useState("The future of AI is");
    const [generatedText, setGeneratedText] = useState([]);
    const [isGenerating, setIsGenerating] = useState(false);
    const [probabilities, setProbabilities] = useState([]);
    const [temperature, setTemperature] = useState(1.0);
    const [topK, setTopK] = useState(5);
    const [autoMode, setAutoMode] = useState(false);
    const scrollRef = useRef(null);
    const autoRef = useRef(null);

    const getLastWord = useCallback(() => {
        if (generatedText.length > 0) {
            return generatedText[generatedText.length - 1].toLowerCase();
        }
        const words = input.trim().split(/\s+/);
        return words[words.length - 1].toLowerCase();
    }, [input, generatedText]);

    const generateNextToken = useCallback(async () => {
        setIsGenerating(true);
        await new Promise(r => setTimeout(r, 400));

        const lastWord = getLastWord();
        const basePredictions = PREDICTION_MAP[lastWord] || PREDICTION_MAP['default'];

        // Apply temperature
        const withTemp = softmaxWithTemperature(basePredictions, temperature);

        // Sort by adjusted probability
        withTemp.sort((a, b) => b.adjustedProb - a.adjustedProb);

        // Apply top-k
        const topKPredictions = withTemp.slice(0, topK);

        // Re-normalize top-k
        const topKSum = topKPredictions.reduce((s, p) => s + p.adjustedProb, 0);
        const normalized = topKPredictions.map(p => ({
            ...p,
            finalProb: p.adjustedProb / topKSum,
        }));

        setProbabilities(normalized);

        // Sample from distribution (weighted random)
        const rand = Math.random();
        let cumulative = 0;
        let winner = normalized[0];
        for (const p of normalized) {
            cumulative += p.finalProb;
            if (rand <= cumulative) {
                winner = p;
                break;
            }
        }

        setGeneratedText(prev => [...prev, winner.word]);
        setIsGenerating(false);
    }, [getLastWord, temperature, topK]);

    // Auto-generate mode
    useEffect(() => {
        if (autoMode && !isGenerating) {
            autoRef.current = setTimeout(() => {
                generateNextToken();
            }, 800);
        }
        return () => {
            if (autoRef.current) clearTimeout(autoRef.current);
        };
    }, [autoMode, isGenerating, generatedText, generateNextToken]);

    const reset = () => {
        setAutoMode(false);
        setInput("The future of AI is");
        setGeneratedText([]);
        setProbabilities([]);
        setIsGenerating(false);
    };

    const toggleAutoMode = () => {
        setAutoMode(prev => !prev);
    };

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [generatedText]);

    return (
        <Slide>
            <div style={{ display: 'flex', flexDirection: 'column', height: '100%', gap: '1rem' }}>
                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <h2>Interactive LLM Playground</h2>
                    <p>
                        You've seen tokenization, embeddings, and attention. Now see the result: the model
                        predicts the <strong>Next Token</strong> based on all that context. Adjust <strong>temperature</strong> and <strong>top-k</strong> to see how sampling changes.
                    </p>
                </motion.div>

                <div style={{ display: 'flex', gap: '1.5rem', flex: 1, minHeight: 0 }}>

                    {/* Main Terminal Area */}
                    <div style={{
                        flex: 2,
                        background: '#1e1e1e',
                        borderRadius: '1rem',
                        border: '1px solid #333',
                        display: 'flex',
                        flexDirection: 'column',
                        overflow: 'hidden',
                    }}>
                        <div style={{
                            padding: '0.5rem 1rem',
                            background: '#252526',
                            borderBottom: '1px solid #333',
                            display: 'flex',
                            gap: '0.5rem',
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
                                fontSize: '1.1rem',
                                lineHeight: 1.6,
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

                        <div style={{ padding: '0.75rem', borderTop: '1px solid #333', display: 'flex', gap: '0.5rem' }}>
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
                                    borderRadius: '0.25rem',
                                    fontFamily: 'monospace',
                                }}
                                placeholder="Type your prompt here..."
                            />
                            <button
                                onClick={generateNextToken}
                                disabled={isGenerating || autoMode}
                                className="feature-pill"
                                style={{ padding: '0.4rem 0.75rem', fontSize: '0.8rem' }}
                            >
                                {isGenerating ? 'Thinking...' : 'Predict'}
                            </button>
                            <button
                                onClick={toggleAutoMode}
                                className="feature-pill"
                                style={{
                                    padding: '0.4rem 0.75rem',
                                    fontSize: '0.8rem',
                                    background: autoMode ? 'rgba(76,175,80,0.2)' : 'transparent',
                                    borderColor: autoMode ? '#4caf50' : undefined,
                                    color: autoMode ? '#4caf50' : undefined,
                                }}
                            >
                                {autoMode ? 'Stop' : 'Auto'}
                            </button>
                            <button
                                onClick={reset}
                                className="feature-pill"
                                style={{ padding: '0.4rem 0.75rem', fontSize: '0.8rem', background: 'rgba(255,100,100,0.15)' }}
                            >
                                Reset
                            </button>
                        </div>
                    </div>

                    {/* Right Panel */}
                    <div style={{
                        flex: 1,
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '0.75rem',
                        minWidth: 0,
                    }}>

                        {/* Probability Distribution */}
                        <div style={{
                            background: 'rgba(255,255,255,0.05)',
                            borderRadius: '1rem',
                            padding: '1rem',
                            flex: 1,
                        }}>
                            <h3 style={{ fontSize: '0.85rem', marginBottom: '0.5rem' }}>Probability Distribution</h3>
                            {isGenerating ? (
                                <div style={{ textAlign: 'center', opacity: 0.5, fontSize: '0.85rem' }}>Calculating...</div>
                            ) : probabilities.length > 0 ? (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                    {probabilities.map((item, index) => (
                                        <motion.div
                                            key={`${index}-${item.word}`}
                                            initial={{ opacity: 0, x: 10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: index * 0.05 }}
                                        >
                                            <div style={{
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                marginBottom: '0.15rem',
                                                fontSize: '0.8rem',
                                            }}>
                                                <span style={{ fontWeight: index === 0 ? 'bold' : 'normal' }}>
                                                    &ldquo;{item.word}&rdquo;
                                                </span>
                                                <span style={{ fontFamily: 'monospace', fontSize: '0.75rem' }}>
                                                    {(item.finalProb * 100).toFixed(1)}%
                                                </span>
                                            </div>
                                            <div style={{
                                                width: '100%',
                                                height: '6px',
                                                background: 'rgba(255,255,255,0.1)',
                                                borderRadius: '3px',
                                                overflow: 'hidden',
                                            }}>
                                                <motion.div
                                                    initial={{ width: 0 }}
                                                    animate={{ width: `${item.finalProb * 100}%` }}
                                                    style={{
                                                        height: '100%',
                                                        background: index === 0 ? 'var(--secondary-color)' : 'var(--primary-color)',
                                                        borderRadius: '3px',
                                                    }}
                                                />
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            ) : (
                                <p style={{ fontSize: '0.8rem', opacity: 0.6 }}>Click "Predict" to see probabilities.</p>
                            )}
                        </div>

                        {/* Temperature Control */}
                        <div style={{
                            background: 'rgba(255,255,255,0.05)',
                            borderRadius: '1rem',
                            padding: '0.75rem 1rem',
                        }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.3rem' }}>
                                <span style={{ fontSize: '0.8rem', fontWeight: 'bold', color: '#ccc' }}>Temperature</span>
                                <span style={{ fontSize: '0.8rem', fontFamily: 'monospace', color: '#00e5ff' }}>{temperature.toFixed(1)}</span>
                            </div>
                            <input
                                type="range"
                                min="0.1"
                                max="2.0"
                                step="0.1"
                                value={temperature}
                                onChange={(e) => setTemperature(parseFloat(e.target.value))}
                                style={{ width: '100%', accentColor: '#00e5ff', height: '4px' }}
                            />
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.6rem', color: '#666', marginTop: '0.15rem' }}>
                                <span>Focused</span>
                                <span>Creative</span>
                            </div>
                        </div>

                        {/* Top-K Control */}
                        <div style={{
                            background: 'rgba(255,255,255,0.05)',
                            borderRadius: '1rem',
                            padding: '0.75rem 1rem',
                        }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.3rem' }}>
                                <span style={{ fontSize: '0.8rem', fontWeight: 'bold', color: '#ccc' }}>Top-K</span>
                                <span style={{ fontSize: '0.8rem', fontFamily: 'monospace', color: '#ffab40' }}>{topK}</span>
                            </div>
                            <div style={{ display: 'flex', gap: '0.3rem' }}>
                                {[1, 3, 5, 10].map(k => (
                                    <button
                                        key={k}
                                        onClick={() => setTopK(k)}
                                        style={{
                                            flex: 1,
                                            padding: '0.25rem',
                                            borderRadius: '0.4rem',
                                            border: `1px solid ${topK === k ? '#ffab40' : 'rgba(255,255,255,0.1)'}`,
                                            background: topK === k ? 'rgba(255,171,64,0.15)' : 'transparent',
                                            color: topK === k ? '#ffab40' : '#888',
                                            cursor: 'pointer',
                                            fontSize: '0.75rem',
                                            fontWeight: 'bold',
                                        }}
                                    >
                                        k={k}
                                    </button>
                                ))}
                            </div>
                            <p style={{ fontSize: '0.6rem', color: '#666', margin: '0.3rem 0 0 0' }}>
                                Only consider the top K most likely tokens.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </Slide>
    );
};

export default InteractivePlaygroundSlide;
