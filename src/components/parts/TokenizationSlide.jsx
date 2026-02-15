import React, { useState } from 'react';
import Slide from '../Slide';
import { motion, AnimatePresence } from 'framer-motion';

const TokenizationSlide = () => {
    const [inputText, setInputText] = useState("The quick brown fox jumps over the lazy dog.");

    // Mock tokenizer: splits by spaces and assigns "IDs"
    const tokens = inputText.trim().split(/(\s+)/).filter(t => t.length > 0).map((t, i) => ({
        text: t,
        id: Math.abs(t.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % 10000), // deterministically "hash" to an ID
        color: `hsl(${Math.abs(t.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % 360)}, 70%, 60%)`
    }));

    return (
        <Slide>
            <div style={{ display: 'flex', flexDirection: 'column', height: '100%', gap: '2rem' }}>
                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <h2>Part 3: LLM Basics & Tokenization</h2>
                    <p>
                        Large Language Models don't read words like we do. They turn text into numbers called <strong>Tokens</strong>.
                        <br />
                        A token is roughly 3/4 of a word. Try typing below to see how the AI sees your text.
                    </p>
                </motion.div>

                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '2rem' }}>

                    {/* Input Section */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <label style={{ fontWeight: 'bold', color: 'var(--highlight-color)' }}>Input Text:</label>
                        <textarea
                            value={inputText}
                            onChange={(e) => setInputText(e.target.value)}
                            style={{
                                width: '100%',
                                height: '80px',
                                padding: '1rem',
                                borderRadius: '0.5rem',
                                border: '1px solid rgba(255,255,255,0.2)',
                                background: 'rgba(0,0,0,0.3)',
                                color: 'white',
                                fontSize: '1.1rem',
                                fontFamily: 'monospace',
                                resize: 'none'
                            }}
                        />
                    </div>

                    {/* Visualization Section */}
                    <div style={{
                        background: 'rgba(255,255,255,0.05)',
                        padding: '1.5rem',
                        borderRadius: '1rem',
                        border: '1px solid rgba(255,255,255,0.1)'
                    }}>
                        <h3 style={{ marginBottom: '1rem' }}>Tokenized View (What AI Sees)</h3>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                            <AnimatePresence>
                                {tokens.map((token, index) => (
                                    <motion.div
                                        key={`${index}-${token.text}`}
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.5 }}
                                        transition={{ duration: 0.2 }}
                                        style={{
                                            padding: '4px 8px',
                                            borderRadius: '4px',
                                            background: token.color,
                                            color: '#000',
                                            fontWeight: 'bold',
                                            fontFamily: 'monospace',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            alignItems: 'center',
                                            minWidth: '30px',
                                            textAlign: 'center'
                                        }}
                                    >
                                        <span>{token.text.replace(/\s+/g, '\u00A0')}</span> {/* Preserve spaces visually */}
                                        <span style={{ fontSize: '0.7em', opacity: 0.7 }}>[{token.id}]</span>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>
                    </div>

                    <div style={{
                        background: 'rgba(0,0,0,0.4)',
                        padding: '1rem',
                        borderRadius: '0.5rem',
                        borderLeft: '4px solid var(--secondary-color)'
                    }}>
                        <strong>Context Window:</strong> The AI looks at all these tokens at once to guess what comes next.
                        Current token count: <strong>{tokens.length}</strong>
                    </div>

                </div>
            </div>
        </Slide>
    );
};

export default TokenizationSlide;
