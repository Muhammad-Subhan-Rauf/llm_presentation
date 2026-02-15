import React from 'react';
import Slide from '../Slide';
import { motion } from 'framer-motion';

const CONCEPTS = [
    { icon: '🧠', label: 'Weights', desc: 'Learnable parameters' },
    { icon: '🔄', label: 'Training', desc: 'Iterative optimization' },
    { icon: '🔤', label: 'Tokens', desc: 'Subword encoding' },
    { icon: '📐', label: 'Embeddings', desc: 'Vector representations' },
    { icon: '🔍', label: 'Attention', desc: 'Context understanding' },
    { icon: '⚡', label: 'Transformer', desc: 'Full architecture' },
];

const TAKEAWAYS = [
    'LLMs are statistical pattern matchers trained on massive text data',
    'Attention lets models understand context and relationships between words',
    'Tokens, not words, are the fundamental unit LLMs operate on',
    'Temperature and top-k control the creativity vs. predictability trade-off',
    'Scale matters - more parameters + more data = more capable models',
];

const ConclusionSlide = () => {
    return (
        <Slide>
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100%',
                textAlign: 'center',
                gap: '1.5rem',
            }}>
                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}
                >
                    From Weights to Wisdom?
                </motion.h2>

                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    style={{ maxWidth: '800px', fontSize: '1.1rem', margin: 0 }}
                >
                    We started with a simple mixing board. By stacking billions of parameters,
                    training them on the entire internet, and using tokenization + attention,
                    we get models that can code, reason, and create.
                </motion.p>

                {/* Concept recap row */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    style={{
                        display: 'flex',
                        gap: '0.75rem',
                        flexWrap: 'wrap',
                        justifyContent: 'center',
                        maxWidth: '900px',
                    }}
                >
                    {CONCEPTS.map((c, i) => (
                        <motion.div
                            key={c.label}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.6 + i * 0.08 }}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                padding: '0.5rem 0.85rem',
                                background: 'rgba(255,255,255,0.05)',
                                borderRadius: '0.75rem',
                                border: '1px solid rgba(255,255,255,0.1)',
                            }}
                        >
                            <span style={{ fontSize: '1.2rem' }}>{c.icon}</span>
                            <div style={{ textAlign: 'left' }}>
                                <div style={{ fontSize: '0.8rem', fontWeight: 'bold', color: '#ccc' }}>{c.label}</div>
                                <div style={{ fontSize: '0.65rem', color: '#888' }}>{c.desc}</div>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>

                {/* Key takeaways */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1 }}
                    style={{
                        maxWidth: '700px',
                        textAlign: 'left',
                        background: 'rgba(255,255,255,0.05)',
                        borderRadius: '1rem',
                        padding: '1rem 1.5rem',
                        width: '100%',
                    }}
                >
                    <h3 style={{ fontSize: '1rem', marginBottom: '0.5rem' }}>Key Takeaways</h3>
                    <ul style={{ margin: 0, paddingLeft: '1.2rem', display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                        {TAKEAWAYS.map((t, i) => (
                            <motion.li
                                key={i}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 1.1 + i * 0.1 }}
                                style={{ fontSize: '0.85rem', lineHeight: 1.4, color: '#ccc' }}
                            >
                                {t}
                            </motion.li>
                        ))}
                    </ul>
                </motion.div>

                {/* Limitations callout */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.8 }}
                    style={{
                        maxWidth: '700px',
                        padding: '0.75rem 1.25rem',
                        background: 'rgba(255,64,129,0.08)',
                        border: '1px solid rgba(255,64,129,0.2)',
                        borderRadius: '0.75rem',
                        fontSize: '0.8rem',
                        color: '#ccc',
                        lineHeight: 1.4,
                    }}
                >
                    <strong style={{ color: '#ff4081' }}>Important caveat:</strong> LLMs can hallucinate, don't truly
                    "understand" meaning, and are fundamentally statistical pattern matchers - impressive ones,
                    but not sentient. Always verify AI outputs.
                </motion.div>
            </div>
        </Slide>
    );
};

export default ConclusionSlide;
