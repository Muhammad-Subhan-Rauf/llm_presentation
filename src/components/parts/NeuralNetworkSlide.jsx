import React, { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import Slide from '../Slide';
import { motion, AnimatePresence } from 'framer-motion';

// --- Network Layout ---
const LAYERS = [
    { id: 'input', x: 80, nodes: [
        { id: 'i0', y: 100, label: 'Ears' },
        { id: 'i1', y: 200, label: 'Fur' },
        { id: 'i2', y: 300, label: 'Whiskers' },
    ]},
    { id: 'hidden', x: 300, nodes: [
        { id: 'h0', y: 70 },
        { id: 'h1', y: 160 },
        { id: 'h2', y: 250 },
        { id: 'h3', y: 340 },
    ]},
    { id: 'output', x: 520, nodes: [
        { id: 'o0', y: 100, label: 'Cat' },
        { id: 'o1', y: 200, label: 'Dog' },
        { id: 'o2', y: 300, label: 'Toaster' },
    ]},
];

const NODE_RADIUS = 16;
const INPUT_VALUES = [0.9, 0.8, 0.85]; // Features of a cat image
const OUTPUT_LABELS = ['Cat', 'Dog', 'Toaster'];
const OUTPUT_EMOJI = ['🐱', '🐶', '🍞'];

const TARGET_WEIGHTS = [
    0.8, -0.3, 0.1, -0.2, 0.2, 0.9, -0.1, 0.3,
    -0.4, 0.1, 0.7, -0.5, 0.9, -0.2, -0.5, 0.1,
    -0.3, 0.8, 0.2, -0.7, -0.6, 0.1, 0.3, 0.85,
];

const generateConnections = (layers) => {
    const connections = [];
    for (let l = 0; l < layers.length - 1; l++) {
        const fromLayer = layers[l];
        const toLayer = layers[l + 1];
        for (const fromNode of fromLayer.nodes) {
            for (const toNode of toLayer.nodes) {
                connections.push({
                    id: `${fromNode.id}-${toNode.id}`,
                    fromId: fromNode.id,
                    toId: toNode.id,
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
        w.push(parseFloat((Math.random() * 1.6 - 0.8).toFixed(2)));
    }
    return w;
};

// --- Math helpers ---
const relu = (x) => Math.max(0, x);

const softmax = (arr) => {
    const max = Math.max(...arr);
    const exps = arr.map(v => Math.exp(v - max));
    const sum = exps.reduce((a, b) => a + b, 0);
    return exps.map(e => e / sum);
};

const computeActivations = (weights, connections) => {
    // Hidden layer activations (ReLU)
    const hidden = [0, 0, 0, 0];
    for (let c = 0; c < 12; c++) {
        const conn = connections[c];
        const inputIdx = parseInt(conn.fromId[1]);
        const hiddenIdx = parseInt(conn.toId[1]);
        hidden[hiddenIdx] += INPUT_VALUES[inputIdx] * weights[c];
    }
    const hiddenAct = hidden.map(relu);

    // Output layer (raw scores for softmax)
    const output = [0, 0, 0];
    for (let c = 12; c < 24; c++) {
        const conn = connections[c];
        const hiddenIdx = parseInt(conn.fromId[1]);
        const outputIdx = parseInt(conn.toId[1]);
        output[outputIdx] += hiddenAct[hiddenIdx] * weights[c];
    }
    const probs = softmax(output);

    return { hidden: hiddenAct, output, probs };
};

// --- Component ---
const NeuralNetworkSlide = () => {
    const [weights, setWeights] = useState(() => generateInitialWeights(24));
    const [selectedEdge, setSelectedEdge] = useState(null);
    const [isRunning, setIsRunning] = useState(false);
    const [forwardPhase, setForwardPhase] = useState(-1); // -1 = idle, 0-2 = layer being highlighted
    const [showParamInfo, setShowParamInfo] = useState(false);
    const [highlightedParam, setHighlightedParam] = useState(-1); // for sequential highlight animation
    const tuneRef = useRef(null);
    const paramAnimRef = useRef(null);

    const connections = useMemo(() => generateConnections(LAYERS), []);
    const activations = useMemo(() => computeActivations(weights, connections), [weights, connections]);

    const winnerIdx = activations.probs.indexOf(Math.max(...activations.probs));
    const isCorrect = winnerIdx === 0; // Cat is correct

    // Connection description for info card
    const getEdgeDescription = (idx) => {
        if (idx === null) return null;
        const conn = connections[idx];
        const fromLabel = LAYERS.find(l => l.nodes.some(n => n.id === conn.fromId))
            ?.nodes.find(n => n.id === conn.fromId)?.label || conn.fromId;
        const toLabel = LAYERS.find(l => l.nodes.some(n => n.id === conn.toId))
            ?.nodes.find(n => n.id === conn.toId)?.label || conn.toId;
        return `Weight w${idx + 1}: ${fromLabel} → ${toLabel}`;
    };

    const handleEdgeClick = useCallback((idx) => {
        setSelectedEdge(prev => prev === idx ? null : idx);
    }, []);

    const handleWeightChange = useCallback((value) => {
        if (selectedEdge === null) return;
        setWeights(prev => {
            const next = [...prev];
            next[selectedEdge] = parseFloat(value);
            return next;
        });
    }, [selectedEdge]);

    const randomize = useCallback(() => {
        setWeights(generateInitialWeights(24));
        setSelectedEdge(null);
    }, []);

    const autoTune = useCallback(() => {
        if (tuneRef.current) return;
        let step = 0;
        tuneRef.current = setInterval(() => {
            setWeights(prev => {
                const next = [...prev];
                const idx = step % 24;
                next[idx] = prev[idx] + 0.2 * (TARGET_WEIGHTS[idx] - prev[idx]);
                return next;
            });
            step++;
            if (step >= 72) { // 3 passes through all weights
                clearInterval(tuneRef.current);
                tuneRef.current = null;
            }
        }, 40);
    }, []);

    useEffect(() => {
        return () => {
            if (tuneRef.current) clearInterval(tuneRef.current);
            if (paramAnimRef.current) clearInterval(paramAnimRef.current);
        };
    }, []);

    const toggleParamInfo = useCallback(() => {
        setShowParamInfo(prev => {
            const next = !prev;
            if (next) {
                // Sequentially highlight each connection
                let idx = 0;
                if (paramAnimRef.current) clearInterval(paramAnimRef.current);
                paramAnimRef.current = setInterval(() => {
                    setHighlightedParam(idx);
                    idx++;
                    if (idx >= 24) {
                        clearInterval(paramAnimRef.current);
                        paramAnimRef.current = null;
                        setHighlightedParam(-1);
                    }
                }, 60);
            } else {
                if (paramAnimRef.current) {
                    clearInterval(paramAnimRef.current);
                    paramAnimRef.current = null;
                }
                setHighlightedParam(-1);
            }
            return next;
        });
    }, []);

    const runForwardPass = useCallback(() => {
        if (isRunning) return;
        setIsRunning(true);
        setForwardPhase(0);
        setTimeout(() => setForwardPhase(1), 400);
        setTimeout(() => setForwardPhase(2), 800);
        setTimeout(() => {
            setForwardPhase(-1);
            setIsRunning(false);
        }, 1600);
    }, [isRunning]);

    // Edge visual properties
    const getEdgeStroke = (w) => w >= 0 ? '#00e5ff' : '#ff4081';
    const getEdgeWidth = (w) => Math.abs(w) * 3 + 0.5;

    return (
        <Slide>
            <div style={{ display: 'flex', flexDirection: 'column', height: '100%', gap: '0.75rem' }}>
                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <h2>Part 1: Weights & Parameters</h2>
                    <p>
                        A neural network is a web of connections. Each connection has a <strong>weight</strong> that
                        controls how much signal passes through. Click any connection to adjust its weight.
                    </p>
                </motion.div>

                {/* Main content */}
                <div style={{ display: 'flex', gap: '1rem', flex: 1, minHeight: 0 }}>

                    {/* Left: SVG Network */}
                    <div style={{
                        flex: 3,
                        background: '#1a1a1a',
                        borderRadius: '1rem',
                        position: 'relative',
                        overflow: 'hidden',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '0.5rem',
                    }}>
                        <svg
                            viewBox="0 0 600 400"
                            style={{ width: '100%', height: '100%' }}
                            preserveAspectRatio="xMidYMid meet"
                        >
                            <defs>
                                <filter id="nn-glow-cyan" x="-50%" y="-50%" width="200%" height="200%">
                                    <feGaussianBlur stdDeviation="4" result="blur" />
                                    <feFlood floodColor="#00e5ff" floodOpacity="0.6" result="color" />
                                    <feComposite in="color" in2="blur" operator="in" result="glow" />
                                    <feMerge><feMergeNode in="glow" /><feMergeNode in="SourceGraphic" /></feMerge>
                                </filter>
                                <filter id="nn-glow-green" x="-50%" y="-50%" width="200%" height="200%">
                                    <feGaussianBlur stdDeviation="4" result="blur" />
                                    <feFlood floodColor="#4caf50" floodOpacity="0.6" result="color" />
                                    <feComposite in="color" in2="blur" operator="in" result="glow" />
                                    <feMerge><feMergeNode in="glow" /><feMergeNode in="SourceGraphic" /></feMerge>
                                </filter>
                            </defs>

                            {/* Layer labels */}
                            <text x={80} y={38} fill="#888" fontSize="13" textAnchor="middle" fontFamily="Inter, sans-serif">Input</text>
                            <text x={300} y={38} fill="#888" fontSize="13" textAnchor="middle" fontFamily="Inter, sans-serif">Hidden</text>
                            <text x={520} y={38} fill="#888" fontSize="13" textAnchor="middle" fontFamily="Inter, sans-serif">Output</text>

                            {/* Cat emoji */}
                            <text x={18} y={208} fontSize="24" textAnchor="middle">🐱</text>

                            {/* Connections (clickable) */}
                            {connections.map((conn, idx) => {
                                const w = weights[idx];
                                const isSelected = selectedEdge === idx;
                                const isParamHighlighted = showParamInfo && (highlightedParam === -1 || idx <= highlightedParam);
                                const stroke = getEdgeStroke(w);
                                const sw = getEdgeWidth(w);

                                return (
                                    <g key={conn.id} style={{ cursor: 'pointer' }} onClick={() => handleEdgeClick(idx)}>
                                        {/* Invisible wider hit area */}
                                        <line
                                            x1={conn.from.x} y1={conn.from.y}
                                            x2={conn.to.x} y2={conn.to.y}
                                            stroke="transparent"
                                            strokeWidth={12}
                                        />
                                        <motion.line
                                            x1={conn.from.x} y1={conn.from.y}
                                            x2={conn.to.x} y2={conn.to.y}
                                            initial={false}
                                            animate={{
                                                stroke: isParamHighlighted ? '#ffab40' : stroke,
                                                strokeWidth: isSelected ? sw + 1.5 : (isParamHighlighted ? 2.5 : sw),
                                                strokeOpacity: isSelected ? 1 : (isParamHighlighted ? 0.85 : 0.4),
                                            }}
                                            strokeDasharray={isSelected ? '8 4' : 'none'}
                                            transition={{ duration: 0.2 }}
                                        />
                                        {/* Weight value on selected */}
                                        {isSelected && (
                                            <text
                                                x={(conn.from.x + conn.to.x) / 2}
                                                y={(conn.from.y + conn.to.y) / 2 - 8}
                                                fill="#fff"
                                                fontSize="11"
                                                textAnchor="middle"
                                                fontFamily="monospace"
                                                fontWeight="bold"
                                            >
                                                {w.toFixed(2)}
                                            </text>
                                        )}
                                    </g>
                                );
                            })}

                            {/* Nodes */}
                            {LAYERS.map((layer, layerIdx) =>
                                layer.nodes.map((node, nodeIdx) => {
                                    // Determine activation value to show inside node
                                    let actValue = null;
                                    if (layerIdx === 0) actValue = INPUT_VALUES[nodeIdx];
                                    else if (layerIdx === 1) actValue = activations.hidden[nodeIdx];
                                    else actValue = activations.probs[nodeIdx];

                                    const isForwardActive = forwardPhase >= layerIdx && forwardPhase >= 0;
                                    const isWinnerNode = layerIdx === 2 && nodeIdx === winnerIdx;
                                    let glowFilter = 'none';
                                    if (isForwardActive) glowFilter = 'url(#nn-glow-cyan)';
                                    else if (isWinnerNode && isCorrect) glowFilter = 'url(#nn-glow-green)';

                                    return (
                                        <g key={node.id}>
                                            <motion.circle
                                                cx={layer.x}
                                                cy={node.y}
                                                r={NODE_RADIUS}
                                                fill="#1e1e1e"
                                                initial={false}
                                                animate={{
                                                    stroke: isForwardActive ? '#00e5ff'
                                                        : (isWinnerNode && isCorrect) ? '#4caf50'
                                                        : '#555',
                                                }}
                                                style={{ filter: glowFilter }}
                                                strokeWidth={2}
                                                transition={{ delay: isForwardActive ? layerIdx * 0.3 : 0, duration: 0.3 }}
                                            />
                                            {/* Activation value inside node */}
                                            <text
                                                x={layer.x}
                                                y={node.y + 4}
                                                fill="#ccc"
                                                fontSize="9"
                                                textAnchor="middle"
                                                fontFamily="monospace"
                                            >
                                                {actValue.toFixed(2)}
                                            </text>
                                            {/* Node label below */}
                                            {node.label && (
                                                <text
                                                    x={layer.x}
                                                    y={node.y + NODE_RADIUS + 14}
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
                        </svg>
                    </div>

                    {/* Right: Output & Info */}
                    <div style={{
                        flex: 2,
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '0.75rem',
                        minWidth: 0,
                    }}>
                        {/* Output Probabilities */}
                        <div style={{
                            background: 'rgba(255,255,255,0.05)',
                            borderRadius: '1rem',
                            padding: '1rem',
                            flex: 1,
                        }}>
                            <h3 style={{ fontSize: '0.95rem', marginBottom: '0.75rem' }}>Output Probabilities</h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.7rem' }}>
                                {activations.probs.map((prob, i) => {
                                    const isWinner = i === winnerIdx;
                                    return (
                                        <div key={i}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem', fontSize: '0.85rem' }}>
                                                <span style={{ fontWeight: isWinner ? 'bold' : 'normal' }}>
                                                    {OUTPUT_EMOJI[i]} {OUTPUT_LABELS[i]}
                                                </span>
                                                <span style={{ fontFamily: 'monospace', color: isWinner ? (i === 0 ? '#4caf50' : '#ff4081') : '#aaa' }}>
                                                    {(prob * 100).toFixed(1)}%
                                                </span>
                                            </div>
                                            <div style={{
                                                width: '100%',
                                                height: '8px',
                                                background: 'rgba(255,255,255,0.1)',
                                                borderRadius: '4px',
                                                overflow: 'hidden',
                                            }}>
                                                <motion.div
                                                    initial={false}
                                                    animate={{ width: `${prob * 100}%` }}
                                                    transition={{ duration: 0.3 }}
                                                    style={{
                                                        height: '100%',
                                                        background: isWinner
                                                            ? (i === 0 ? '#4caf50' : '#ff4081')
                                                            : 'var(--primary-color)',
                                                        borderRadius: '4px',
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* What is a Parameter? */}
                        <div style={{
                            background: 'rgba(255,255,255,0.05)',
                            borderRadius: '1rem',
                            padding: '0.75rem 1rem',
                        }}>
                            <button
                                onClick={toggleParamInfo}
                                style={{
                                    background: showParamInfo ? 'rgba(255,171,64,0.2)' : 'rgba(255,255,255,0.08)',
                                    border: `1px solid ${showParamInfo ? '#ffab40' : 'rgba(255,255,255,0.15)'}`,
                                    borderRadius: '0.5rem',
                                    padding: '0.4rem 0.75rem',
                                    color: showParamInfo ? '#ffab40' : '#ccc',
                                    cursor: 'pointer',
                                    fontSize: '0.8rem',
                                    fontWeight: 'bold',
                                    width: '100%',
                                    textAlign: 'left',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                }}
                            >
                                <span>What is a Parameter?</span>
                                <span style={{
                                    fontSize: '0.7rem',
                                    background: 'rgba(100,108,255,0.3)',
                                    padding: '0.1rem 0.5rem',
                                    borderRadius: '1rem',
                                    color: '#646cff',
                                }}>
                                    24 total
                                </span>
                            </button>
                            <AnimatePresence>
                                {showParamInfo && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                        style={{ overflow: 'hidden' }}
                                    >
                                        <div style={{ paddingTop: '0.6rem', fontSize: '0.8rem', lineHeight: 1.5, color: '#ccc' }}>
                                            <p style={{ margin: '0 0 0.4rem 0', fontSize: '0.8rem' }}>
                                                A <strong style={{ color: '#ffab40' }}>parameter</strong> is any adjustable value the network learns during training.
                                                In this network:
                                            </p>
                                            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.4rem' }}>
                                                <div style={{
                                                    flex: 1,
                                                    background: 'rgba(255,171,64,0.1)',
                                                    borderRadius: '0.5rem',
                                                    padding: '0.4rem',
                                                    textAlign: 'center',
                                                    border: '1px solid rgba(255,171,64,0.2)',
                                                }}>
                                                    <div style={{ fontSize: '1.1rem', fontWeight: 'bold', color: '#ffab40' }}>12</div>
                                                    <div style={{ fontSize: '0.65rem', color: '#aaa' }}>Input→Hidden</div>
                                                </div>
                                                <div style={{ display: 'flex', alignItems: 'center', color: '#555' }}>+</div>
                                                <div style={{
                                                    flex: 1,
                                                    background: 'rgba(255,171,64,0.1)',
                                                    borderRadius: '0.5rem',
                                                    padding: '0.4rem',
                                                    textAlign: 'center',
                                                    border: '1px solid rgba(255,171,64,0.2)',
                                                }}>
                                                    <div style={{ fontSize: '1.1rem', fontWeight: 'bold', color: '#ffab40' }}>12</div>
                                                    <div style={{ fontSize: '0.65rem', color: '#aaa' }}>Hidden→Output</div>
                                                </div>
                                                <div style={{ display: 'flex', alignItems: 'center', color: '#555' }}>=</div>
                                                <div style={{
                                                    flex: 1,
                                                    background: 'rgba(100,108,255,0.15)',
                                                    borderRadius: '0.5rem',
                                                    padding: '0.4rem',
                                                    textAlign: 'center',
                                                    border: '1px solid rgba(100,108,255,0.3)',
                                                }}>
                                                    <div style={{ fontSize: '1.1rem', fontWeight: 'bold', color: '#646cff' }}>24</div>
                                                    <div style={{ fontSize: '0.65rem', color: '#aaa' }}>Parameters</div>
                                                </div>
                                            </div>
                                            <p style={{ margin: 0, fontSize: '0.75rem', color: '#999' }}>
                                                GPT-4 has ~1.8 <em>trillion</em> parameters. This toy network has just 24!
                                            </p>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Context info */}
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={selectedEdge !== null ? `edge-${selectedEdge}` : (isCorrect ? 'correct' : 'default')}
                                initial={{ opacity: 0, y: 5 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -5 }}
                                style={{
                                    background: 'rgba(255,255,255,0.05)',
                                    borderRadius: '0.75rem',
                                    padding: '0.5rem 0.75rem',
                                    fontSize: '0.8rem',
                                    lineHeight: 1.4,
                                    color: '#bbb',
                                }}
                            >
                                {selectedEdge !== null
                                    ? getEdgeDescription(selectedEdge)
                                    : isCorrect
                                        ? '✅ The network correctly classifies the cat!'
                                        : 'Click any connection to adjust its weight.'
                                }
                            </motion.div>
                        </AnimatePresence>

                        {/* Prediction result */}
                        <motion.div
                            initial={false}
                            animate={{
                                borderColor: isCorrect ? '#4caf50' : '#ff4081',
                            }}
                            style={{
                                background: 'rgba(255,255,255,0.05)',
                                borderRadius: '1rem',
                                padding: '0.75rem 1rem',
                                textAlign: 'center',
                                border: '1px solid',
                            }}
                        >
                            <span style={{ fontSize: '0.75rem', color: '#888' }}>Prediction: </span>
                            <motion.span
                                initial={false}
                                animate={{ color: isCorrect ? '#4caf50' : '#ff4081' }}
                                style={{ fontWeight: 'bold', fontSize: '1.1rem' }}
                            >
                                {OUTPUT_EMOJI[winnerIdx]} {OUTPUT_LABELS[winnerIdx]}
                            </motion.span>
                        </motion.div>
                    </div>
                </div>

                {/* Weight slider (when edge selected) */}
                <AnimatePresence>
                    {selectedEdge !== null && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            style={{
                                background: 'rgba(255,255,255,0.05)',
                                borderRadius: '0.75rem',
                                padding: '0.5rem 1rem',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '1rem',
                            }}
                        >
                            <span style={{ fontSize: '0.8rem', color: '#aaa', minWidth: '60px' }}>
                                w{selectedEdge + 1}
                            </span>
                            <input
                                type="range"
                                min="-1"
                                max="1"
                                step="0.01"
                                value={weights[selectedEdge]}
                                onChange={(e) => handleWeightChange(e.target.value)}
                                style={{
                                    flex: 1,
                                    accentColor: weights[selectedEdge] >= 0 ? '#00e5ff' : '#ff4081',
                                    height: '6px',
                                }}
                            />
                            <span style={{ fontSize: '0.85rem', fontFamily: 'monospace', minWidth: '50px', textAlign: 'right' }}>
                                {weights[selectedEdge].toFixed(2)}
                            </span>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Buttons */}
                <div style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem' }}>
                    <button className="feature-pill" onClick={randomize} style={{ cursor: 'pointer', fontSize: '0.85rem', padding: '0.6rem 1.2rem' }}>
                        Randomize
                    </button>
                    <button className="feature-pill" onClick={autoTune} style={{ cursor: 'pointer', fontSize: '0.85rem', padding: '0.6rem 1.2rem', borderColor: 'var(--highlight-color)' }}>
                        Auto-Tune (Train)
                    </button>
                    <button className="feature-pill" onClick={runForwardPass} style={{ cursor: 'pointer', fontSize: '0.85rem', padding: '0.6rem 1.2rem', borderColor: 'var(--primary-color)' }} disabled={isRunning}>
                        {isRunning ? 'Running...' : 'Run Forward Pass'}
                    </button>
                </div>
            </div>
        </Slide>
    );
};

export default NeuralNetworkSlide;
