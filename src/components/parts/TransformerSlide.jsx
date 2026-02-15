import React, { useState } from 'react';
import Slide from '../Slide';
import { motion, AnimatePresence } from 'framer-motion';

const PIPELINE_BLOCKS = [
    {
        id: 'input',
        label: 'Input Text',
        icon: '📝',
        color: '#aaa',
        desc: 'Raw text goes in: "The cat sat on the mat"',
        slideRef: null,
    },
    {
        id: 'tokenizer',
        label: 'Tokenizer',
        icon: '🔤',
        color: '#ff4081',
        desc: 'Text is split into subword tokens and converted to IDs.',
        slideRef: 'Slide 5: Tokenization (Part 4)',
    },
    {
        id: 'embedding',
        label: 'Embedding',
        icon: '📐',
        color: '#00e5ff',
        desc: 'Token IDs are mapped to dense vectors in a learned embedding space.',
        slideRef: 'Slide 6: Embeddings (Part 5)',
    },
    {
        id: 'attention',
        label: 'Self-Attention',
        icon: '🔍',
        color: '#ffab40',
        desc: 'Each token attends to all others via Q/K/V matrices. This is where context understanding happens.',
        slideRef: 'Slide 7: Attention (Part 6)',
    },
    {
        id: 'ffn',
        label: 'Feed-Forward',
        icon: '⚡',
        color: '#4caf50',
        desc: 'A dense neural network processes each position independently, adding learned transformations.',
        slideRef: 'Slide 2: Weights & Parameters',
    },
    {
        id: 'repeat',
        label: '× N Layers',
        icon: '🔁',
        color: '#646cff',
        desc: 'Attention + Feed-Forward blocks are stacked N times (GPT-3 has 96 layers, GPT-4 has even more).',
        slideRef: null,
    },
    {
        id: 'output',
        label: 'Output Probs',
        icon: '📊',
        color: '#ff9800',
        desc: 'Final layer produces probability distribution over all possible next tokens.',
        slideRef: 'Slide 8: Playground',
    },
];

const MODEL_SIZES = [
    { name: 'GPT-2', params: 1.5, unit: 'B', year: '2019', color: '#4caf50' },
    { name: 'GPT-3', params: 175, unit: 'B', year: '2020', color: '#00e5ff' },
    { name: 'Llama 3', params: 405, unit: 'B', year: '2024', color: '#ffab40' },
    { name: 'GPT-4', params: 1800, unit: 'B', year: '2023', color: '#ff4081' },
];

const MAX_PARAMS = 1800;

const TransformerSlide = () => {
    const [selectedBlock, setSelectedBlock] = useState(null);

    return (
        <Slide>
            <div style={{ display: 'flex', flexDirection: 'column', height: '100%', gap: '1rem' }}>
                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <h2>Putting It All Together: The Transformer</h2>
                    <p>
                        Every modern LLM follows this architecture. Click any block to learn more.
                    </p>
                </motion.div>

                <div style={{ display: 'flex', gap: '1.5rem', flex: 1, minHeight: 0 }}>

                    {/* Left: Pipeline diagram */}
                    <div style={{
                        flex: 3,
                        background: '#1a1a1a',
                        borderRadius: '1rem',
                        padding: '1.5rem',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        gap: '0.4rem',
                        overflow: 'hidden',
                    }}>
                        {PIPELINE_BLOCKS.map((block, i) => (
                            <React.Fragment key={block.id}>
                                <motion.div
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: i * 0.1 }}
                                    onClick={() => setSelectedBlock(selectedBlock === block.id ? null : block.id)}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.75rem',
                                        padding: '0.6rem 1.2rem',
                                        borderRadius: '0.75rem',
                                        border: `2px solid ${selectedBlock === block.id ? block.color : `${block.color}40`}`,
                                        background: selectedBlock === block.id ? `${block.color}20` : 'rgba(255,255,255,0.03)',
                                        cursor: 'pointer',
                                        width: '100%',
                                        maxWidth: '400px',
                                        transition: 'all 0.2s',
                                    }}
                                >
                                    <span style={{ fontSize: '1.3rem' }}>{block.icon}</span>
                                    <div style={{ flex: 1 }}>
                                        <div style={{
                                            fontWeight: 'bold',
                                            fontSize: '0.9rem',
                                            color: selectedBlock === block.id ? block.color : '#ccc',
                                        }}>
                                            {block.label}
                                        </div>
                                    </div>
                                    {/* Layer repeat indicator */}
                                    {(block.id === 'attention' || block.id === 'ffn') && (
                                        <div style={{
                                            fontSize: '0.6rem',
                                            padding: '0.15rem 0.4rem',
                                            borderRadius: '1rem',
                                            background: 'rgba(100,108,255,0.2)',
                                            color: '#646cff',
                                            fontWeight: 'bold',
                                        }}>
                                            repeated
                                        </div>
                                    )}
                                </motion.div>

                                {/* Arrow between blocks */}
                                {i < PIPELINE_BLOCKS.length - 1 && (
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 0.3 }}
                                        transition={{ delay: i * 0.1 + 0.05 }}
                                        style={{
                                            color: '#555',
                                            fontSize: '0.9rem',
                                            textAlign: 'center',
                                        }}
                                    >
                                        ▼
                                    </motion.div>
                                )}
                            </React.Fragment>
                        ))}
                    </div>

                    {/* Right: Info + Scale */}
                    <div style={{
                        flex: 2,
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '0.75rem',
                        minWidth: 0,
                    }}>

                        {/* Block detail */}
                        <div style={{
                            background: 'rgba(255,255,255,0.05)',
                            borderRadius: '1rem',
                            padding: '1rem',
                            flex: 1,
                        }}>
                            <h3 style={{ fontSize: '0.9rem', marginBottom: '0.5rem' }}>
                                {selectedBlock ? PIPELINE_BLOCKS.find(b => b.id === selectedBlock)?.label : 'Block Details'}
                            </h3>
                            <AnimatePresence mode="wait">
                                {selectedBlock ? (
                                    <motion.div
                                        key={selectedBlock}
                                        initial={{ opacity: 0, y: 5 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -5 }}
                                    >
                                        <p style={{ fontSize: '0.85rem', color: '#ccc', lineHeight: 1.5, margin: '0 0 0.5rem 0' }}>
                                            {PIPELINE_BLOCKS.find(b => b.id === selectedBlock)?.desc}
                                        </p>
                                        {PIPELINE_BLOCKS.find(b => b.id === selectedBlock)?.slideRef && (
                                            <div style={{
                                                fontSize: '0.75rem',
                                                color: '#888',
                                                padding: '0.3rem 0.6rem',
                                                background: 'rgba(255,255,255,0.05)',
                                                borderRadius: '0.5rem',
                                                display: 'inline-block',
                                            }}>
                                                Covered in: {PIPELINE_BLOCKS.find(b => b.id === selectedBlock)?.slideRef}
                                            </div>
                                        )}
                                    </motion.div>
                                ) : (
                                    <motion.p
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 0.5 }}
                                        style={{ fontSize: '0.8rem' }}
                                    >
                                        Click any block in the pipeline to see details.
                                    </motion.p>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Model scale comparison */}
                        <div style={{
                            background: 'rgba(255,255,255,0.05)',
                            borderRadius: '1rem',
                            padding: '1rem',
                        }}>
                            <h3 style={{ fontSize: '0.9rem', marginBottom: '0.75rem' }}>Model Scale Comparison</h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                                {MODEL_SIZES.map((model, i) => (
                                    <motion.div
                                        key={model.name}
                                        initial={{ opacity: 0, x: 10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.5 + i * 0.1 }}
                                    >
                                        <div style={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            marginBottom: '0.2rem',
                                            fontSize: '0.8rem',
                                        }}>
                                            <span style={{ fontWeight: 'bold', color: model.color }}>
                                                {model.name}
                                                <span style={{ fontWeight: 'normal', color: '#666', marginLeft: '0.5rem', fontSize: '0.7rem' }}>
                                                    ({model.year})
                                                </span>
                                            </span>
                                            <span style={{ fontFamily: 'monospace', color: '#aaa', fontSize: '0.75rem' }}>
                                                {model.params >= 1000 ? `${(model.params / 1000).toFixed(1)}T` : `${model.params}B`}
                                            </span>
                                        </div>
                                        <div style={{
                                            width: '100%',
                                            height: '8px',
                                            background: 'rgba(255,255,255,0.08)',
                                            borderRadius: '4px',
                                            overflow: 'hidden',
                                        }}>
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: `${Math.max((Math.log10(model.params) / Math.log10(MAX_PARAMS)) * 100, 5)}%` }}
                                                transition={{ duration: 0.8, delay: 0.6 + i * 0.1 }}
                                                style={{
                                                    height: '100%',
                                                    background: model.color,
                                                    borderRadius: '4px',
                                                }}
                                            />
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                            <p style={{ fontSize: '0.7rem', color: '#666', marginTop: '0.5rem', marginBottom: 0 }}>
                                Scale is logarithmic. GPT-4 is ~1,200x larger than GPT-2.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </Slide>
    );
};

export default TransformerSlide;
