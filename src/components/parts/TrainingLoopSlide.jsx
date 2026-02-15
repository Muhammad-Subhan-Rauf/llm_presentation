import React, { useState, useMemo } from 'react';
import Slide from '../Slide';
import { motion, AnimatePresence } from 'framer-motion';

// --- Network Layout ---
const LAYERS = [
    { id: 'input', x: 100, nodes: [
        { id: 'i0', y: 110, label: 'Ears' },
        { id: 'i1', y: 210, label: 'Fur' },
        { id: 'i2', y: 310, label: 'Whiskers' },
    ]},
    { id: 'hidden', x: 400, nodes: [
        { id: 'h0', y: 80 },
        { id: 'h1', y: 170 },
        { id: 'h2', y: 260 },
        { id: 'h3', y: 350 },
    ]},
    { id: 'output', x: 700, nodes: [
        { id: 'o0', y: 110, label: 'Cat' },
        { id: 'o1', y: 210, label: 'Dog' },
        { id: 'o2', y: 310, label: 'Toaster' },
    ]},
];

const NODE_RADIUS = 18;
const LABELED_CONNECTIONS = new Set(['i0-h0', 'i2-h3', 'h1-o0', 'h3-o2']);

const generateConnections = (layers) => {
    const connections = [];
    for (let l = 0; l < layers.length - 1; l++) {
        const fromLayer = layers[l];
        const toLayer = layers[l + 1];
        for (const fromNode of fromLayer.nodes) {
            for (const toNode of toLayer.nodes) {
                connections.push({
                    id: `${fromNode.id}-${toNode.id}`,
                    from: { x: fromLayer.x, y: fromNode.y },
                    to: { x: toLayer.x, y: toNode.y },
                    layerIndex: l,
                });
            }
        }
    }
    return connections;
};

const generateInitialWeights = (count) => {
    const w = [];
    for (let i = 0; i < count; i++) {
        w.push(parseFloat((Math.random() * 2 - 1).toFixed(2)));
    }
    return w;
};

const TARGET_WEIGHTS = [
    0.9, 0.3, -0.7, 0.1, 0.1, 0.8, -0.4, 0.6,
    -0.5, -0.2, 0.7, 0.3, 0.85, -0.3, 0.2, -0.6,
    0.1, 0.7, -0.5, 0.4, -0.8, 0.15, 0.6, -0.9,
];

// --- Helpers ---
const getNodeColor = (nodeId, step) => {
    if (step === 0) return '#00e5ff';
    if (step === 1) {
        if (nodeId === 'o0') return '#4caf50';
        if (nodeId === 'o2') return '#ff4081';
        return '#555';
    }
    if (step === 2) return '#ff4081';
    if (step === 3) return '#00e5ff';
    return '#555';
};

const getNodeDelay = (layerIndex, step) => {
    if (step === 0) return layerIndex * 0.4;
    if (step === 2) return (2 - layerIndex) * 0.4;
    return 0;
};

const getEdgeColor = (layerIndex, step) => {
    if (step === 0) return '#00e5ff';
    if (step === 2) return '#ff4081';
    if (step === 3) return '#00e5ff';
    return '#333';
};

const getEdgeDelay = (layerIndex, step) => {
    if (step === 0) return 0.2 + layerIndex * 0.4;
    if (step === 2) return 0.2 + (1 - layerIndex) * 0.4;
    return 0;
};

// Compute loss based on how far weights are from target
const computeLoss = (weights) => {
    let totalDiff = 0;
    for (let i = 0; i < weights.length; i++) {
        totalDiff += (weights[i] - TARGET_WEIGHTS[i]) ** 2;
    }
    return Math.min(totalDiff / weights.length, 1.0);
};

const TrainingLoopSlide = () => {
    const [step, setStep] = useState(0);
    const [epoch, setEpoch] = useState(1);
    const [weights, setWeights] = useState(() => generateInitialWeights(24));
    const [lossHistory, setLossHistory] = useState([]);

    const connections = useMemo(() => generateConnections(LAYERS), []);

    const currentLoss = computeLoss(weights);

    const steps = [
        {
            title: "1. Forward Pass (The Guess)",
            desc: "Input data flows forward through the network. Each node multiplies inputs by weights, sums them, and passes the result to the next layer.",
        },
        {
            title: "2. Loss Function (The Scorecard)",
            desc: `The network predicted 'Toaster' but the answer is 'Cat'. Loss: ${currentLoss.toFixed(3)} - ${currentLoss > 0.5 ? 'still learning!' : currentLoss > 0.1 ? 'getting better!' : 'nearly perfect!'}`,
        },
        {
            title: "3. Backpropagation (The Blame Game)",
            desc: "Error gradients flow backward through the network, finding which weights were most responsible for the mistake.",
        },
        {
            title: "4. The Optimizer (The Adjustment)",
            desc: "Weights are nudged in the direction that reduces the error. Larger gradients get larger adjustments.",
        },
        {
            title: "5. Repeat",
            desc: `Epoch ${epoch} complete. Loss dropped to ${currentLoss.toFixed(3)}. This cycle repeats thousands of times until the network learns.`,
        },
    ];

    const nextStep = () => {
        const nextVal = (step + 1) % steps.length;
        if (nextVal === 3) {
            setWeights(prev => prev.map((w, i) => {
                const nudged = w + 0.15 * (TARGET_WEIGHTS[i] - w);
                return parseFloat(nudged.toFixed(2));
            }));
        }
        if (nextVal === 0 && step === 4) {
            setEpoch(prev => prev + 1);
            setLossHistory(prev => [...prev, currentLoss]);
        }
        if (nextVal === 4) {
            // Record loss when we reach the repeat step
            setLossHistory(prev => {
                if (prev.length === 0 || prev[prev.length - 1] !== currentLoss) {
                    return [...prev, currentLoss];
                }
                return prev;
            });
        }
        setStep(nextVal);
    };

    const isActive = step === 0 || step === 2 || step === 3;

    // Loss chart dimensions
    const CHART_W = 160;
    const CHART_H = 70;
    const chartPoints = lossHistory.length > 0
        ? lossHistory.map((loss, i) => {
            const x = (i / Math.max(lossHistory.length - 1, 1)) * (CHART_W - 10) + 5;
            const y = CHART_H - 5 - (1 - loss) * (CHART_H - 10);
            return `${x},${y}`;
        }).join(' ')
        : '';

    return (
        <Slide>
            <div style={{ display: 'flex', flexDirection: 'column', height: '100%', gap: '1rem' }}>
                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                >
                    <h2>Part 2: The Training Loop</h2>
                    <p>How does the AI actually learn? Watch data flow through a neural network.</p>
                </motion.div>

                {/* SVG Visualization */}
                <div style={{
                    flex: 1,
                    background: '#1a1a1a',
                    borderRadius: '1rem',
                    position: 'relative',
                    overflow: 'hidden',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '1rem',
                    minHeight: 0,
                }}>
                    <svg
                        viewBox="0 0 800 420"
                        style={{ width: '100%', height: '100%', maxHeight: '100%' }}
                        preserveAspectRatio="xMidYMid meet"
                    >
                        <defs>
                            <filter id="glow-cyan" x="-50%" y="-50%" width="200%" height="200%">
                                <feGaussianBlur stdDeviation="4" result="blur" />
                                <feFlood floodColor="#00e5ff" floodOpacity="0.6" result="color" />
                                <feComposite in="color" in2="blur" operator="in" result="glow" />
                                <feMerge>
                                    <feMergeNode in="glow" />
                                    <feMergeNode in="SourceGraphic" />
                                </feMerge>
                            </filter>
                            <filter id="glow-pink" x="-50%" y="-50%" width="200%" height="200%">
                                <feGaussianBlur stdDeviation="4" result="blur" />
                                <feFlood floodColor="#ff4081" floodOpacity="0.6" result="color" />
                                <feComposite in="color" in2="blur" operator="in" result="glow" />
                                <feMerge>
                                    <feMergeNode in="glow" />
                                    <feMergeNode in="SourceGraphic" />
                                </feMerge>
                            </filter>
                            <filter id="glow-green" x="-50%" y="-50%" width="200%" height="200%">
                                <feGaussianBlur stdDeviation="4" result="blur" />
                                <feFlood floodColor="#4caf50" floodOpacity="0.6" result="color" />
                                <feComposite in="color" in2="blur" operator="in" result="glow" />
                                <feMerge>
                                    <feMergeNode in="glow" />
                                    <feMergeNode in="SourceGraphic" />
                                </feMerge>
                            </filter>
                        </defs>

                        {/* Layer labels */}
                        <text x={100} y={45} fill="#888" fontSize="14" textAnchor="middle" fontFamily="Inter, sans-serif">Input</text>
                        <text x={400} y={45} fill="#888" fontSize="14" textAnchor="middle" fontFamily="Inter, sans-serif">Hidden</text>
                        <text x={700} y={45} fill="#888" fontSize="14" textAnchor="middle" fontFamily="Inter, sans-serif">Output</text>

                        {/* Cat emoji input label */}
                        <text x={32} y={218} fontSize="28" textAnchor="middle">🐱</text>

                        {/* Connections */}
                        {connections.map((conn, idx) => {
                            const edgeActive = isActive;
                            const color = edgeActive ? getEdgeColor(conn.layerIndex, step) : '#333';
                            const delay = edgeActive ? getEdgeDelay(conn.layerIndex, step) : 0;
                            const showWeight = LABELED_CONNECTIONS.has(conn.id);

                            return (
                                <g key={conn.id}>
                                    <motion.line
                                        x1={conn.from.x}
                                        y1={conn.from.y}
                                        x2={conn.to.x}
                                        y2={conn.to.y}
                                        initial={false}
                                        animate={{
                                            stroke: color,
                                            strokeWidth: edgeActive ? 2 : 1,
                                            strokeOpacity: edgeActive ? 0.7 : 0.12,
                                        }}
                                        strokeDasharray={step === 2 ? '6 4' : 'none'}
                                        transition={{ delay, duration: 0.4 }}
                                    />
                                    {showWeight && (
                                        <motion.text
                                            x={(conn.from.x + conn.to.x) / 2}
                                            y={(conn.from.y + conn.to.y) / 2 - 8}
                                            fill="#888"
                                            fontSize="10"
                                            textAnchor="middle"
                                            fontFamily="monospace"
                                            initial={false}
                                            animate={{
                                                fill: step === 3 ? '#00e5ff' : '#888',
                                            }}
                                            transition={{ delay: step === 3 ? 0.2 : 0, duration: 0.3 }}
                                        >
                                            {weights[idx].toFixed(2)}
                                        </motion.text>
                                    )}
                                </g>
                            );
                        })}

                        {/* Nodes */}
                        {LAYERS.map((layer, layerIdx) =>
                            layer.nodes.map((node) => {
                                const nodeColor = getNodeColor(node.id, step);
                                const delay = getNodeDelay(layerIdx, step);
                                const isNodeActive = isActive || step === 1;

                                let glowFilter = 'none';
                                if (step === 0) glowFilter = 'url(#glow-cyan)';
                                else if (step === 2) glowFilter = 'url(#glow-pink)';
                                else if (step === 3) glowFilter = 'url(#glow-cyan)';
                                else if (step === 1 && node.id === 'o0') glowFilter = 'url(#glow-green)';
                                else if (step === 1 && node.id === 'o2') glowFilter = 'url(#glow-pink)';

                                return (
                                    <g key={node.id}>
                                        <motion.circle
                                            cx={layer.x}
                                            cy={node.y}
                                            r={NODE_RADIUS}
                                            fill="#1e1e1e"
                                            initial={false}
                                            animate={{
                                                stroke: nodeColor,
                                                r: step === 3 ? [NODE_RADIUS, NODE_RADIUS + 3, NODE_RADIUS] : NODE_RADIUS,
                                            }}
                                            style={{
                                                filter: isNodeActive ? glowFilter : 'none',
                                            }}
                                            strokeWidth={2.5}
                                            transition={{ delay, duration: 0.4 }}
                                        />
                                        {node.label && (
                                            <text
                                                x={layer.x}
                                                y={node.y + NODE_RADIUS + 16}
                                                fill="#aaa"
                                                fontSize="11"
                                                textAnchor="middle"
                                                fontFamily="Inter, sans-serif"
                                            >
                                                {node.label}
                                            </text>
                                        )}
                                    </g>
                                );
                            })
                        )}

                        {/* Loss indicator */}
                        <AnimatePresence>
                            {step >= 1 && step <= 2 && (
                                <motion.g
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                >
                                    <motion.text
                                        x={700}
                                        y={45}
                                        fill="#ff4081"
                                        fontSize="15"
                                        fontWeight="bold"
                                        textAnchor="middle"
                                        initial={{ opacity: 0, y: 55 }}
                                        animate={{ opacity: 1, y: 45 }}
                                    >
                                        Loss: {currentLoss.toFixed(3)}
                                    </motion.text>
                                    <text x={738} y={115} fill="#4caf50" fontSize="16" fontWeight="bold">✓</text>
                                    <text x={738} y={315} fill="#ff4081" fontSize="16" fontWeight="bold">✗</text>
                                </motion.g>
                            )}
                        </AnimatePresence>

                        {/* Backprop direction indicator */}
                        <AnimatePresence>
                            {step === 2 && (
                                <motion.g
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                >
                                    <motion.line
                                        x1={670}
                                        y1={400}
                                        x2={130}
                                        y2={400}
                                        stroke="#ff4081"
                                        strokeWidth={2}
                                        strokeOpacity={0.7}
                                        initial={{ pathLength: 0 }}
                                        animate={{ pathLength: 1 }}
                                        transition={{ duration: 1 }}
                                    />
                                    <motion.polygon
                                        points="130,394 130,406 118,400"
                                        fill="#ff4081"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: 0.9 }}
                                    />
                                    <text
                                        x={400}
                                        y={418}
                                        fill="#ff4081"
                                        fontSize="12"
                                        textAnchor="middle"
                                        fontFamily="Inter, sans-serif"
                                    >
                                        ← Gradient flow (backpropagation)
                                    </text>
                                </motion.g>
                            )}
                        </AnimatePresence>

                        {/* Optimizer overlay */}
                        <AnimatePresence>
                            {step === 3 && (
                                <motion.text
                                    x={400}
                                    y={410}
                                    fill="#00e5ff"
                                    fontSize="14"
                                    fontWeight="bold"
                                    textAnchor="middle"
                                    fontFamily="Inter, sans-serif"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: [0, 1, 1, 0.7] }}
                                    exit={{ opacity: 0 }}
                                >
                                    Adjusting weights...
                                </motion.text>
                            )}
                        </AnimatePresence>
                    </svg>

                    {/* Epoch badge */}
                    <div style={{
                        position: 'absolute',
                        top: '0.75rem',
                        right: '1rem',
                        background: 'rgba(100,108,255,0.3)',
                        padding: '0.25rem 0.75rem',
                        borderRadius: '1rem',
                        fontSize: '0.8rem',
                        color: '#646cff',
                        fontWeight: 'bold',
                    }}>
                        Epoch {epoch}
                    </div>

                    {/* Loss chart (bottom-right corner) */}
                    {lossHistory.length > 0 && (
                        <div style={{
                            position: 'absolute',
                            bottom: '0.75rem',
                            right: '0.75rem',
                            background: 'rgba(0,0,0,0.6)',
                            borderRadius: '0.5rem',
                            padding: '0.4rem',
                            border: '1px solid rgba(255,255,255,0.1)',
                        }}>
                            <div style={{ fontSize: '0.6rem', color: '#888', marginBottom: '0.2rem', textAlign: 'center' }}>
                                Loss over epochs
                            </div>
                            <svg width={CHART_W} height={CHART_H} viewBox={`0 0 ${CHART_W} ${CHART_H}`}>
                                {/* Grid line */}
                                <line x1="5" y1={CHART_H - 5} x2={CHART_W - 5} y2={CHART_H - 5} stroke="#333" strokeWidth="1" />
                                <line x1="5" y1="5" x2="5" y2={CHART_H - 5} stroke="#333" strokeWidth="1" />
                                {/* Loss line */}
                                {lossHistory.length > 1 && (
                                    <polyline
                                        points={chartPoints}
                                        fill="none"
                                        stroke="#ff4081"
                                        strokeWidth="2"
                                        strokeLinejoin="round"
                                    />
                                )}
                                {/* Data points */}
                                {lossHistory.map((loss, i) => {
                                    const x = (i / Math.max(lossHistory.length - 1, 1)) * (CHART_W - 10) + 5;
                                    const y = CHART_H - 5 - (1 - loss) * (CHART_H - 10);
                                    return (
                                        <circle key={i} cx={x} cy={y} r="3" fill="#ff4081" />
                                    );
                                })}
                            </svg>
                        </div>
                    )}

                    {/* Accuracy indicator */}
                    <div style={{
                        position: 'absolute',
                        top: '0.75rem',
                        left: '1rem',
                        background: 'rgba(0,0,0,0.5)',
                        padding: '0.25rem 0.75rem',
                        borderRadius: '1rem',
                        fontSize: '0.75rem',
                        color: currentLoss < 0.1 ? '#4caf50' : currentLoss < 0.5 ? '#ffab40' : '#ff4081',
                        fontWeight: 'bold',
                        border: `1px solid ${currentLoss < 0.1 ? '#4caf5040' : currentLoss < 0.5 ? '#ffab4040' : '#ff408140'}`,
                    }}>
                        Accuracy: {((1 - currentLoss) * 100).toFixed(0)}%
                    </div>
                </div>

                {/* Controls */}
                <div style={{ textAlign: 'center' }}>
                    <h3 style={{ color: 'var(--highlight-color)' }}>{steps[step].title}</h3>
                    <p style={{ height: '3rem', margin: '0.5rem 0', fontSize: '0.9rem' }}>{steps[step].desc}</p>
                    <button
                        onClick={nextStep}
                        className="feature-pill"
                        style={{
                            marginTop: '0.5rem',
                            cursor: 'pointer',
                            background: 'var(--primary-color)',
                            minWidth: '200px',
                            color: 'white',
                            border: 'none',
                        }}
                    >
                        {step === 4 ? "Restart Cycle" : "Next Step"}
                    </button>
                </div>
            </div>
        </Slide>
    );
};

export default TrainingLoopSlide;
