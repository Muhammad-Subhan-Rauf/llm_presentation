import React from 'react';
import Slide from '../Slide';
import { motion } from 'framer-motion';

const ROADMAP = [
    {
        step: 1,
        label: 'Tokenization',
        desc: 'Split text into small pieces',
        color: '#ff4081',
        icon: '🔤',
    },
    {
        step: 2,
        label: 'Embeddings',
        desc: 'Turn pieces into number vectors',
        color: '#00e5ff',
        icon: '📐',
    },
    {
        step: 3,
        label: 'Attention',
        desc: 'Let vectors understand each other',
        color: '#ffab40',
        icon: '🔍',
    },
];

const BridgeSlide = () => {
    return (
        <Slide>
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100%',
                gap: '2rem',
                textAlign: 'center',
            }}>
                <motion.div
                    initial={{ opacity: 0, y: -30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <h2 style={{ fontSize: '2.2rem', marginBottom: '0.5rem' }}>
                        From Numbers to Language
                    </h2>
                    <p style={{ color: '#aaa', fontSize: '1.1rem', maxWidth: '700px', margin: '0 auto' }}>
                        We trained a neural network to recognize cats from images.
                        <br />
                        But what if the input isn't an image - it's a <strong style={{ color: '#fff' }}>sentence</strong>?
                    </p>
                </motion.div>

                {/* Text → ??? → Numbers visualization */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.4, duration: 0.6 }}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '1.5rem',
                        flexWrap: 'wrap',
                        justifyContent: 'center',
                    }}
                >
                    {/* Text box */}
                    <div style={{
                        background: 'rgba(255,255,255,0.08)',
                        border: '1px solid rgba(255,255,255,0.15)',
                        borderRadius: '0.75rem',
                        padding: '1rem 1.5rem',
                        fontFamily: 'monospace',
                        fontSize: '1.1rem',
                        color: '#fff',
                        maxWidth: '280px',
                    }}>
                        "The cat sat on the mat"
                    </div>

                    {/* Arrow with question mark */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.8, duration: 0.5 }}
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: '0.25rem',
                        }}
                    >
                        <span style={{ fontSize: '1.5rem', color: '#ffab40', fontWeight: 'bold' }}>?</span>
                        <span style={{ fontSize: '2rem', color: '#888' }}>→</span>
                    </motion.div>

                    {/* Numbers box */}
                    <div style={{
                        background: 'rgba(0,229,255,0.08)',
                        border: '1px solid rgba(0,229,255,0.2)',
                        borderRadius: '0.75rem',
                        padding: '1rem 1.5rem',
                        fontFamily: 'monospace',
                        fontSize: '0.85rem',
                        color: '#00e5ff',
                        maxWidth: '280px',
                        lineHeight: 1.6,
                    }}>
                        [0.12, -0.34, 0.78, ...]<br />
                        [0.56, 0.91, -0.23, ...]<br />
                        [0.33, -0.67, 0.45, ...]
                    </div>
                </motion.div>

                {/* Key question */}
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.0, duration: 0.6 }}
                    style={{
                        fontSize: '1.15rem',
                        color: '#ccc',
                        maxWidth: '600px',
                    }}
                >
                    Neural networks only understand numbers. So how do we turn
                    <strong style={{ color: '#fff' }}> text </strong>
                    into something a network can process?
                </motion.p>

                {/* Roadmap cards */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.4, duration: 0.6 }}
                    style={{
                        display: 'flex',
                        gap: '1.5rem',
                        flexWrap: 'wrap',
                        justifyContent: 'center',
                    }}
                >
                    {ROADMAP.map((item, i) => (
                        <motion.div
                            key={item.label}
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 1.6 + i * 0.15, duration: 0.4 }}
                            style={{
                                background: `${item.color}10`,
                                border: `1px solid ${item.color}30`,
                                borderRadius: '0.75rem',
                                padding: '1rem 1.25rem',
                                minWidth: '180px',
                                textAlign: 'center',
                            }}
                        >
                            <div style={{ fontSize: '1.5rem', marginBottom: '0.3rem' }}>{item.icon}</div>
                            <div style={{
                                fontSize: '0.75rem',
                                color: item.color,
                                fontWeight: 'bold',
                                marginBottom: '0.2rem',
                            }}>
                                Step {item.step}
                            </div>
                            <div style={{
                                fontSize: '1rem',
                                fontWeight: 'bold',
                                color: '#fff',
                                marginBottom: '0.25rem',
                            }}>
                                {item.label}
                            </div>
                            <div style={{ fontSize: '0.8rem', color: '#aaa' }}>
                                {item.desc}
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </Slide>
    );
};

export default BridgeSlide;
