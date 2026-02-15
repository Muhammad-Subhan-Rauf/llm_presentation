import React, { useState, useCallback } from 'react';
import Slide from '../Slide';
import { motion, AnimatePresence } from 'framer-motion';

// Mock 2D embeddings (projected from high-dimensional space)
const WORDS = [
    // Royalty cluster
    { word: 'king', x: 320, y: 80, cluster: 'royalty' },
    { word: 'queen', x: 380, y: 70, cluster: 'royalty' },
    { word: 'prince', x: 350, y: 120, cluster: 'royalty' },
    { word: 'princess', x: 400, y: 110, cluster: 'royalty' },
    // Gender cluster
    { word: 'man', x: 180, y: 160, cluster: 'gender' },
    { word: 'woman', x: 240, y: 150, cluster: 'gender' },
    { word: 'boy', x: 160, y: 200, cluster: 'gender' },
    { word: 'girl', x: 220, y: 195, cluster: 'gender' },
    // Animal cluster
    { word: 'cat', x: 450, y: 260, cluster: 'animal' },
    { word: 'dog', x: 500, y: 240, cluster: 'animal' },
    { word: 'pet', x: 480, y: 290, cluster: 'animal' },
    { word: 'kitten', x: 430, y: 300, cluster: 'animal' },
    // Action cluster
    { word: 'run', x: 100, y: 320, cluster: 'action' },
    { word: 'walk', x: 140, y: 350, cluster: 'action' },
    { word: 'jump', x: 80, y: 360, cluster: 'action' },
    { word: 'swim', x: 130, y: 390, cluster: 'action' },
];

const CLUSTER_COLORS = {
    royalty: '#ffab40',
    gender: '#00e5ff',
    animal: '#ff4081',
    action: '#4caf50',
};

const CLUSTER_LABELS = {
    royalty: 'Royalty',
    gender: 'People',
    animal: 'Animals',
    action: 'Actions',
};

// Vector arithmetic: king - man + woman ≈ queen
const VECTOR_STEPS = [
    { label: 'Start: "king"', from: 'king', to: null, color: '#ffab40' },
    { label: 'Subtract: "man"', from: 'king', to: 'man', color: '#ff4081', op: '-' },
    { label: 'Add: "woman"', from: 'man', to: 'woman', color: '#00e5ff', op: '+' },
    { label: 'Result ≈ "queen"', from: 'woman', to: 'queen', color: '#4caf50', op: '≈' },
];

const SVG_WIDTH = 600;
const SVG_HEIGHT = 420;

const EmbeddingsSlide = () => {
    const [hoveredWord, setHoveredWord] = useState(null);
    const [vectorStep, setVectorStep] = useState(-1);
    const [showArithmetic, setShowArithmetic] = useState(false);

    const getWordPos = useCallback((wordStr) => {
        const w = WORDS.find(w => w.word === wordStr);
        return w ? { x: w.x, y: w.y } : { x: 0, y: 0 };
    }, []);

    // Find nearest neighbors
    const getNeighbors = useCallback((wordStr) => {
        const target = WORDS.find(w => w.word === wordStr);
        if (!target) return [];
        return WORDS
            .filter(w => w.word !== wordStr)
            .map(w => ({
                ...w,
                dist: Math.sqrt((w.x - target.x) ** 2 + (w.y - target.y) ** 2),
            }))
            .sort((a, b) => a.dist - b.dist)
            .slice(0, 3);
    }, []);

    const neighbors = hoveredWord ? getNeighbors(hoveredWord) : [];
    const hoveredWordData = WORDS.find(w => w.word === hoveredWord);

    const advanceVector = () => {
        if (vectorStep < VECTOR_STEPS.length - 1) {
            setVectorStep(prev => prev + 1);
        } else {
            setVectorStep(-1);
            setShowArithmetic(false);
        }
    };

    const startArithmetic = () => {
        setShowArithmetic(true);
        setVectorStep(0);
        setHoveredWord(null);
    };

    return (
        <Slide>
            <div style={{ display: 'flex', flexDirection: 'column', height: '100%', gap: '1rem' }}>
                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <h2>Part 5: Embeddings - Tokens to Vectors</h2>
                    <p>
                        Now that we've split text into tokens, each token gets mapped to a <strong>high-dimensional
                        vector</strong> (an embedding). These vectors capture meaning - similar words cluster
                        together. Hover over a word to see its nearest neighbors.
                    </p>
                </motion.div>

                <div style={{ display: 'flex', gap: '1.5rem', flex: 1, minHeight: 0 }}>

                    {/* Left: Scatter plot */}
                    <div style={{
                        flex: 3,
                        background: '#1a1a1a',
                        borderRadius: '1rem',
                        position: 'relative',
                        overflow: 'hidden',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}>
                        <svg
                            viewBox={`0 0 ${SVG_WIDTH} ${SVG_HEIGHT}`}
                            style={{ width: '100%', height: '100%' }}
                            preserveAspectRatio="xMidYMid meet"
                        >
                            <defs>
                                {Object.entries(CLUSTER_COLORS).map(([cluster, color]) => (
                                    <filter key={cluster} id={`glow-${cluster}`} x="-50%" y="-50%" width="200%" height="200%">
                                        <feGaussianBlur stdDeviation="3" result="blur" />
                                        <feFlood floodColor={color} floodOpacity="0.5" result="color" />
                                        <feComposite in="color" in2="blur" operator="in" result="glow" />
                                        <feMerge>
                                            <feMergeNode in="glow" />
                                            <feMergeNode in="SourceGraphic" />
                                        </feMerge>
                                    </filter>
                                ))}
                            </defs>

                            {/* Cluster ellipses (background) */}
                            {Object.entries(CLUSTER_COLORS).map(([cluster, color]) => {
                                const clusterWords = WORDS.filter(w => w.cluster === cluster);
                                const cx = clusterWords.reduce((s, w) => s + w.x, 0) / clusterWords.length;
                                const cy = clusterWords.reduce((s, w) => s + w.y, 0) / clusterWords.length;
                                return (
                                    <g key={cluster}>
                                        <ellipse
                                            cx={cx}
                                            cy={cy}
                                            rx={75}
                                            ry={55}
                                            fill={`${color}08`}
                                            stroke={`${color}30`}
                                            strokeWidth={1}
                                            strokeDasharray="4 4"
                                        />
                                        <text
                                            x={cx}
                                            y={cy - 48}
                                            fill={`${color}60`}
                                            fontSize="10"
                                            textAnchor="middle"
                                            fontFamily="Inter, sans-serif"
                                        >
                                            {CLUSTER_LABELS[cluster]}
                                        </text>
                                    </g>
                                );
                            })}

                            {/* Neighbor lines */}
                            {hoveredWordData && neighbors.map((n, i) => (
                                <motion.line
                                    key={n.word}
                                    x1={hoveredWordData.x}
                                    y1={hoveredWordData.y}
                                    x2={n.x}
                                    y2={n.y}
                                    stroke="#fff"
                                    strokeWidth={1}
                                    strokeOpacity={0.3}
                                    strokeDasharray="4 4"
                                    initial={{ pathLength: 0, opacity: 0 }}
                                    animate={{ pathLength: 1, opacity: 1 }}
                                    transition={{ duration: 0.3, delay: i * 0.1 }}
                                />
                            ))}

                            {/* Vector arithmetic arrows */}
                            {showArithmetic && VECTOR_STEPS.slice(1, vectorStep + 1).map((step, i) => {
                                const from = getWordPos(step.from);
                                const to = getWordPos(step.to);
                                return (
                                    <motion.g key={i}>
                                        <motion.line
                                            x1={from.x}
                                            y1={from.y}
                                            x2={to.x}
                                            y2={to.y}
                                            stroke={step.color}
                                            strokeWidth={2.5}
                                            strokeOpacity={0.8}
                                            initial={{ pathLength: 0 }}
                                            animate={{ pathLength: 1 }}
                                            transition={{ duration: 0.5 }}
                                            markerEnd="url(#arrow)"
                                        />
                                        <motion.text
                                            x={(from.x + to.x) / 2}
                                            y={(from.y + to.y) / 2 - 10}
                                            fill={step.color}
                                            fontSize="14"
                                            fontWeight="bold"
                                            textAnchor="middle"
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            transition={{ delay: 0.3 }}
                                        >
                                            {step.op}
                                        </motion.text>
                                    </motion.g>
                                );
                            })}

                            {/* Arrow marker */}
                            <defs>
                                <marker id="arrow" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
                                    <path d="M0,0 L8,4 L0,8 Z" fill="#fff" fillOpacity="0.7" />
                                </marker>
                            </defs>

                            {/* Word dots */}
                            {WORDS.map((w) => {
                                const isHovered = hoveredWord === w.word;
                                const isNeighbor = neighbors.some(n => n.word === w.word);
                                const isVectorActive = showArithmetic && vectorStep >= 0 &&
                                    VECTOR_STEPS.slice(0, vectorStep + 1).some(s => s.from === w.word || s.to === w.word);
                                const color = CLUSTER_COLORS[w.cluster];

                                return (
                                    <g
                                        key={w.word}
                                        style={{ cursor: 'pointer' }}
                                        onMouseEnter={() => !showArithmetic && setHoveredWord(w.word)}
                                        onMouseLeave={() => !showArithmetic && setHoveredWord(null)}
                                    >
                                        <motion.circle
                                            cx={w.x}
                                            cy={w.y}
                                            initial={false}
                                            animate={{
                                                r: isHovered || isVectorActive ? 8 : isNeighbor ? 6 : 5,
                                                fillOpacity: isHovered || isNeighbor || isVectorActive ? 1 : 0.6,
                                            }}
                                            fill={color}
                                            style={{
                                                filter: isHovered || isVectorActive ? `url(#glow-${w.cluster})` : 'none',
                                            }}
                                            transition={{ duration: 0.2 }}
                                        />
                                        <text
                                            x={w.x}
                                            y={w.y - 12}
                                            fill={isHovered || isNeighbor || isVectorActive ? '#fff' : '#aaa'}
                                            fontSize={isHovered || isVectorActive ? '12' : '10'}
                                            fontWeight={isHovered || isVectorActive ? 'bold' : 'normal'}
                                            textAnchor="middle"
                                            fontFamily="Inter, sans-serif"
                                        >
                                            {w.word}
                                        </text>
                                    </g>
                                );
                            })}
                        </svg>
                    </div>

                    {/* Right: Info panel */}
                    <div style={{
                        flex: 2,
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '0.75rem',
                        minWidth: 0,
                    }}>

                        {/* Neighbors panel */}
                        <div style={{
                            background: 'rgba(255,255,255,0.05)',
                            borderRadius: '1rem',
                            padding: '1rem',
                            flex: 1,
                        }}>
                            <h3 style={{ fontSize: '0.9rem', marginBottom: '0.75rem' }}>
                                {hoveredWord ? `Nearest to "${hoveredWord}"` : 'Hover a word'}
                            </h3>
                            <AnimatePresence mode="wait">
                                {hoveredWord ? (
                                    <motion.div
                                        key={hoveredWord}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}
                                    >
                                        {neighbors.map((n, i) => (
                                            <div key={n.word} style={{
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                alignItems: 'center',
                                                padding: '0.4rem 0.6rem',
                                                background: `${CLUSTER_COLORS[n.cluster]}15`,
                                                borderRadius: '0.5rem',
                                                border: `1px solid ${CLUSTER_COLORS[n.cluster]}30`,
                                                fontSize: '0.85rem',
                                            }}>
                                                <span style={{ color: CLUSTER_COLORS[n.cluster], fontWeight: 'bold' }}>
                                                    {n.word}
                                                </span>
                                                <span style={{ fontSize: '0.75rem', color: '#888', fontFamily: 'monospace' }}>
                                                    d={n.dist.toFixed(0)}
                                                </span>
                                            </div>
                                        ))}
                                    </motion.div>
                                ) : (
                                    <motion.p
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 0.5 }}
                                        style={{ fontSize: '0.8rem' }}
                                    >
                                        Hover over any word in the plot to see which words are closest in embedding space.
                                    </motion.p>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Vector Arithmetic */}
                        <div style={{
                            background: 'rgba(255,255,255,0.05)',
                            borderRadius: '1rem',
                            padding: '1rem',
                        }}>
                            <h3 style={{ fontSize: '0.9rem', marginBottom: '0.5rem' }}>Vector Arithmetic</h3>
                            {!showArithmetic ? (
                                <div>
                                    <p style={{ fontSize: '0.8rem', color: '#aaa', marginBottom: '0.5rem' }}>
                                        Embeddings capture relationships so well that you can do math with them:
                                    </p>
                                    <button
                                        onClick={startArithmetic}
                                        className="feature-pill"
                                        style={{ cursor: 'pointer', fontSize: '0.8rem', padding: '0.5rem 1rem' }}
                                    >
                                        Show: king - man + woman = ?
                                    </button>
                                </div>
                            ) : (
                                <div>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem', marginBottom: '0.5rem' }}>
                                        {VECTOR_STEPS.map((step, i) => (
                                            <motion.div
                                                key={i}
                                                initial={{ opacity: 0.3 }}
                                                animate={{ opacity: i <= vectorStep ? 1 : 0.3 }}
                                                style={{
                                                    fontSize: '0.8rem',
                                                    color: i <= vectorStep ? step.color : '#555',
                                                    fontWeight: i === vectorStep ? 'bold' : 'normal',
                                                    padding: '0.2rem 0.5rem',
                                                    borderRadius: '0.25rem',
                                                    background: i === vectorStep ? `${step.color}15` : 'transparent',
                                                }}
                                            >
                                                {step.label}
                                            </motion.div>
                                        ))}
                                    </div>
                                    <button
                                        onClick={advanceVector}
                                        className="feature-pill"
                                        style={{ cursor: 'pointer', fontSize: '0.8rem', padding: '0.4rem 0.75rem' }}
                                    >
                                        {vectorStep >= VECTOR_STEPS.length - 1 ? 'Reset' : 'Next Step'}
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Key insight */}
                        <div style={{
                            background: 'rgba(0,0,0,0.4)',
                            padding: '0.75rem',
                            borderRadius: '0.5rem',
                            borderLeft: '4px solid var(--secondary-color)',
                            fontSize: '0.8rem',
                            lineHeight: 1.4,
                        }}>
                            <strong>Key Insight:</strong> LLMs don&rsquo;t just see token IDs - they learn rich
                            numerical representations where similar concepts are close together in high-dimensional space.
                        </div>
                    </div>
                </div>
            </div>
        </Slide>
    );
};

export default EmbeddingsSlide;
