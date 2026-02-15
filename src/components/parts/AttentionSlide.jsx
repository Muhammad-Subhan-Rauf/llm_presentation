import React, { useState, useCallback } from 'react';
import Slide from '../Slide';
import { motion, AnimatePresence } from 'framer-motion';

const DEFAULT_SENTENCE = "The cat sat on the mat because it was tired";

// Mock attention weights for Head 1 (syntactic / positional)
const ATTENTION_HEAD_1 = {
    "The":     [0.30, 0.40, 0.05, 0.05, 0.05, 0.05, 0.02, 0.03, 0.03, 0.02],
    "cat":     [0.15, 0.35, 0.20, 0.05, 0.05, 0.05, 0.03, 0.05, 0.04, 0.03],
    "sat":     [0.05, 0.25, 0.30, 0.15, 0.10, 0.05, 0.03, 0.03, 0.02, 0.02],
    "on":      [0.03, 0.05, 0.30, 0.25, 0.20, 0.10, 0.02, 0.02, 0.02, 0.01],
    "the":     [0.02, 0.03, 0.05, 0.10, 0.35, 0.30, 0.05, 0.05, 0.03, 0.02],
    "mat":     [0.02, 0.05, 0.20, 0.15, 0.15, 0.30, 0.03, 0.05, 0.03, 0.02],
    "because": [0.03, 0.10, 0.15, 0.05, 0.05, 0.10, 0.30, 0.10, 0.07, 0.05],
    "it":      [0.05, 0.60, 0.05, 0.02, 0.02, 0.03, 0.05, 0.05, 0.05, 0.08],
    "was":     [0.02, 0.05, 0.05, 0.02, 0.02, 0.03, 0.05, 0.15, 0.35, 0.26],
    "tired":   [0.03, 0.15, 0.05, 0.02, 0.02, 0.05, 0.10, 0.20, 0.08, 0.30],
};

// Mock attention weights for Head 2 (semantic / coreference)
const ATTENTION_HEAD_2 = {
    "The":     [0.40, 0.30, 0.05, 0.05, 0.05, 0.05, 0.02, 0.03, 0.03, 0.02],
    "cat":     [0.10, 0.20, 0.10, 0.03, 0.03, 0.05, 0.02, 0.10, 0.07, 0.30],
    "sat":     [0.05, 0.35, 0.15, 0.20, 0.03, 0.15, 0.02, 0.02, 0.02, 0.01],
    "on":      [0.02, 0.05, 0.15, 0.20, 0.05, 0.40, 0.03, 0.03, 0.05, 0.02],
    "the":     [0.35, 0.05, 0.03, 0.05, 0.20, 0.20, 0.02, 0.03, 0.04, 0.03],
    "mat":     [0.02, 0.05, 0.35, 0.25, 0.05, 0.15, 0.03, 0.03, 0.04, 0.03],
    "because": [0.02, 0.15, 0.10, 0.03, 0.03, 0.05, 0.15, 0.15, 0.12, 0.20],
    "it":      [0.03, 0.55, 0.03, 0.02, 0.02, 0.05, 0.05, 0.05, 0.05, 0.15],
    "was":     [0.02, 0.10, 0.05, 0.02, 0.02, 0.03, 0.10, 0.30, 0.16, 0.20],
    "tired":   [0.02, 0.40, 0.03, 0.02, 0.02, 0.03, 0.15, 0.10, 0.13, 0.10],
};

const QKV_CARDS = [
    { label: 'Q', title: 'Query', desc: '"What am I looking for?"', color: '#00e5ff' },
    { label: 'K', title: 'Key', desc: '"What do I contain?"', color: '#ffab40' },
    { label: 'V', title: 'Value', desc: '"What information do I send?"', color: '#ff4081' },
];

const AttentionSlide = () => {
    const tokens = DEFAULT_SENTENCE.split(' ');
    const [selectedRow, setSelectedRow] = useState(7); // "it" by default
    const [activeHead, setActiveHead] = useState(1);

    const attentionData = activeHead === 1 ? ATTENTION_HEAD_1 : ATTENTION_HEAD_2;

    const getColor = useCallback((weight) => {
        const intensity = Math.round(weight * 255);
        return `rgba(0, 229, 255, ${weight * 0.9 + 0.05})`;
    }, []);

    const selectedToken = tokens[selectedRow];
    const selectedWeights = attentionData[selectedToken] || [];

    // Get top attended tokens for the selected row
    const topAttended = selectedWeights
        .map((w, i) => ({ token: tokens[i], weight: w, index: i }))
        .sort((a, b) => b.weight - a.weight)
        .slice(0, 3);

    const CELL_SIZE = 36;
    const LABEL_WIDTH = 70;
    const GRID_SIZE = tokens.length * CELL_SIZE;

    return (
        <Slide>
            <div style={{ display: 'flex', flexDirection: 'column', height: '100%', gap: '1rem' }}>
                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <h2>Part 6: Attention - How LLMs Focus</h2>
                    <p>
                        We have our embedding vectors - but how does the model know which words are related?
                        The <strong>attention mechanism</strong> lets each token look at every other token and decide
                        which ones matter most. Click a row to see what a token &ldquo;attends to.&rdquo;
                    </p>
                </motion.div>

                <div style={{ display: 'flex', gap: '1.5rem', flex: 1, minHeight: 0 }}>

                    {/* Left: Attention Heatmap */}
                    <div style={{
                        flex: 3,
                        background: 'rgba(0,0,0,0.3)',
                        borderRadius: '1rem',
                        padding: '1rem',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '0.75rem',
                        overflow: 'hidden',
                    }}>
                        {/* Head toggle */}
                        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                            <span style={{ fontSize: '0.8rem', color: '#888' }}>Attention Head:</span>
                            {[1, 2].map(h => (
                                <button
                                    key={h}
                                    onClick={() => setActiveHead(h)}
                                    style={{
                                        padding: '0.25rem 0.75rem',
                                        borderRadius: '1rem',
                                        border: `1px solid ${activeHead === h ? '#00e5ff' : 'rgba(255,255,255,0.15)'}`,
                                        background: activeHead === h ? 'rgba(0,229,255,0.15)' : 'transparent',
                                        color: activeHead === h ? '#00e5ff' : '#888',
                                        cursor: 'pointer',
                                        fontSize: '0.75rem',
                                        fontWeight: 'bold',
                                    }}
                                >
                                    Head {h} {h === 1 ? '(Syntax)' : '(Semantics)'}
                                </button>
                            ))}
                        </div>

                        {/* Heatmap */}
                        <div style={{ overflow: 'auto', flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'flex-start', paddingTop: '3rem'}}>
                            <div style={{ position: 'relative' }}>
                                {/* Column labels */}
                                <div style={{ display: 'flex', marginLeft: LABEL_WIDTH, marginBottom: '2px' }}>
                                    {tokens.map((t, i) => (
                                        <div key={i} style={{
                                            width: CELL_SIZE,
                                            textAlign: 'center',
                                            fontSize: '0.65rem',
                                            color: selectedRow !== null && selectedWeights[i] > 0.15 ? '#00e5ff' : '#888',
                                            fontWeight: selectedRow !== null && selectedWeights[i] > 0.15 ? 'bold' : 'normal',
                                            transform: 'rotate(-45deg)',
                                            transformOrigin: 'bottom left',
                                            height: 30,
                                            whiteSpace: 'nowrap',
                                        }}>
                                            {t}
                                        </div>
                                    ))}
                                </div>

                                {/* Rows */}
                                {tokens.map((rowToken, rowIdx) => {
                                    const rowWeights = attentionData[rowToken] || [];
                                    const isSelected = rowIdx === selectedRow;
                                    return (
                                        <div
                                            key={rowIdx}
                                            style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                cursor: 'pointer',
                                            }}
                                            onClick={() => setSelectedRow(rowIdx)}
                                        >
                                            {/* Row label */}
                                            <div style={{
                                                width: LABEL_WIDTH,
                                                textAlign: 'right',
                                                paddingRight: '8px',
                                                fontSize: '0.7rem',
                                                color: isSelected ? '#00e5ff' : '#aaa',
                                                fontWeight: isSelected ? 'bold' : 'normal',
                                                whiteSpace: 'nowrap',
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                            }}>
                                                {rowToken}
                                            </div>
                                            {/* Cells */}
                                            {rowWeights.map((weight, colIdx) => (
                                                <motion.div
                                                    key={colIdx}
                                                    initial={false}
                                                    animate={{
                                                        backgroundColor: getColor(weight),
                                                        borderColor: isSelected ? 'rgba(0,229,255,0.4)' : 'rgba(255,255,255,0.05)',
                                                    }}
                                                    style={{
                                                        width: CELL_SIZE,
                                                        height: CELL_SIZE,
                                                        border: '1px solid',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        fontSize: '0.55rem',
                                                        fontFamily: 'monospace',
                                                        color: weight > 0.3 ? '#000' : '#aaa',
                                                        fontWeight: weight > 0.3 ? 'bold' : 'normal',
                                                        borderRadius: '2px',
                                                    }}
                                                    transition={{ duration: 0.2 }}
                                                >
                                                    {weight.toFixed(2)}
                                                </motion.div>
                                            ))}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    {/* Right: Info Panel */}
                    <div style={{
                        flex: 2,
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '0.75rem',
                        minWidth: 0,
                    }}>

                        {/* Selected token attention */}
                        <div style={{
                            background: 'rgba(255,255,255,0.05)',
                            borderRadius: '1rem',
                            padding: '1rem',
                        }}>
                            <h3 style={{ fontSize: '0.9rem', marginBottom: '0.5rem' }}>
                                &ldquo;{selectedToken}&rdquo; attends to:
                            </h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                {topAttended.map((item, i) => (
                                    <motion.div
                                        key={`${activeHead}-${selectedRow}-${i}`}
                                        initial={{ opacity: 0, x: 10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: i * 0.08 }}
                                    >
                                        <div style={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            marginBottom: '0.2rem',
                                            fontSize: '0.85rem',
                                        }}>
                                            <span style={{ fontWeight: i === 0 ? 'bold' : 'normal' }}>
                                                &ldquo;{item.token}&rdquo;
                                            </span>
                                            <span style={{
                                                fontFamily: 'monospace',
                                                color: i === 0 ? '#00e5ff' : '#aaa'
                                            }}>
                                                {(item.weight * 100).toFixed(0)}%
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
                                                animate={{ width: `${item.weight * 100}%` }}
                                                style={{
                                                    height: '100%',
                                                    background: i === 0 ? '#00e5ff' : 'var(--primary-color)',
                                                    borderRadius: '3px',
                                                }}
                                                transition={{ duration: 0.4, delay: i * 0.08 }}
                                            />
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>

                        {/* Q / K / V Cards */}
                        <div style={{
                            background: 'rgba(255,255,255,0.05)',
                            borderRadius: '1rem',
                            padding: '0.75rem',
                        }}>
                            <h3 style={{ fontSize: '0.85rem', marginBottom: '0.5rem' }}>How Attention Works</h3>
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                {QKV_CARDS.map((card) => (
                                    <motion.div
                                        key={card.label}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.3 }}
                                        style={{
                                            flex: 1,
                                            background: `${card.color}15`,
                                            border: `1px solid ${card.color}40`,
                                            borderRadius: '0.5rem',
                                            padding: '0.5rem',
                                            textAlign: 'center',
                                        }}
                                    >
                                        <div style={{
                                            fontSize: '1.2rem',
                                            fontWeight: 'bold',
                                            color: card.color,
                                            marginBottom: '0.2rem',
                                        }}>
                                            {card.label}
                                        </div>
                                        <div style={{ fontSize: '0.65rem', color: '#aaa', fontWeight: 'bold' }}>
                                            {card.title}
                                        </div>
                                        <div style={{ fontSize: '0.6rem', color: '#777', marginTop: '0.15rem' }}>
                                            {card.desc}
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                            <p style={{ fontSize: '0.7rem', color: '#888', marginTop: '0.5rem', marginBottom: 0 }}>
                                Score = Q &middot; K (dot product), then softmax to get weights, then multiply by V.
                            </p>
                        </div>

                        {/* Key insight */}
                        <div style={{
                            background: 'rgba(0,0,0,0.4)',
                            padding: '0.75rem',
                            borderRadius: '0.5rem',
                            borderLeft: '4px solid #ffab40',
                            fontSize: '0.8rem',
                            lineHeight: 1.4,
                        }}>
                            <strong style={{ color: '#ffab40' }}>Key Insight:</strong>{' '}
                            This is why LLMs understand that &ldquo;it&rdquo; refers to &ldquo;cat&rdquo; - the
                            attention mechanism learns to connect related words regardless of distance in the sentence.
                        </div>
                    </div>
                </div>
            </div>
        </Slide>
    );
};

export default AttentionSlide;
