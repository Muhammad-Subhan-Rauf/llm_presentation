import React, { useState, useMemo } from 'react';
import Slide from '../Slide';
import { motion, AnimatePresence } from 'framer-motion';

// Mock BPE vocabulary - common subword splits
const BPE_RULES = [
    // Prefixes
    { prefix: 'un', rest: true },
    { prefix: 're', rest: true },
    { prefix: 'pre', rest: true },
    { prefix: 'dis', rest: true },
    // Suffixes (applied after prefix extraction)
    { suffix: 'tion' },
    { suffix: 'sion' },
    { suffix: 'ness' },
    { suffix: 'ment' },
    { suffix: 'able' },
    { suffix: 'ible' },
    { suffix: 'ful' },
    { suffix: 'less' },
    { suffix: 'ing' },
    { suffix: 'ous' },
    { suffix: 'ive' },
    { suffix: 'ly' },
    { suffix: 'ed' },
    { suffix: 'er' },
    { suffix: 'est' },
    { suffix: 'ize' },
    { suffix: 'ity' },
];

const PRESETS = [
    { label: 'Default', text: 'The quick brown fox jumps over the lazy dog.' },
    { label: 'Subwords', text: 'Playing unhappily with tokenization and preprocessing.' },
    { label: 'Long word', text: 'Pneumonoultramicroscopicsilicovolcanoconiosis is a disease.' },
    { label: 'Multilingual', text: 'Hello world! 你好世界 مرحبا بالعالم' },
];

// Simple mock BPE tokenizer
const tokenizeBPE = (text) => {
    const rawTokens = text.trim().split(/(\s+)/).filter(t => t.length > 0);
    const result = [];

    for (const raw of rawTokens) {
        if (/^\s+$/.test(raw)) {
            result.push({ text: raw, type: 'space' });
            continue;
        }

        // Remove punctuation at the end
        let word = raw;
        let punct = '';
        const punctMatch = word.match(/([.,!?;:'")\]}>]+)$/);
        if (punctMatch) {
            punct = punctMatch[1];
            word = word.slice(0, -punct.length);
        }

        // Leading punctuation
        let leadPunct = '';
        const leadPunctMatch = word.match(/^(['"(\[{<]+)/);
        if (leadPunctMatch) {
            leadPunct = leadPunctMatch[1];
            word = word.slice(leadPunct.length);
        }

        if (leadPunct) result.push({ text: leadPunct, type: 'punct' });

        if (word.length <= 3) {
            if (word.length > 0) result.push({ text: word, type: 'word' });
        } else {
            const parts = [];

            // Check for prefix
            let remaining = word.toLowerCase();
            let originalRemaining = word;
            let foundPrefix = false;

            for (const rule of BPE_RULES) {
                if (rule.prefix && remaining.startsWith(rule.prefix) && remaining.length > rule.prefix.length + 2) {
                    parts.push({ text: originalRemaining.slice(0, rule.prefix.length), type: 'prefix' });
                    originalRemaining = originalRemaining.slice(rule.prefix.length);
                    remaining = remaining.slice(rule.prefix.length);
                    foundPrefix = true;
                    break;
                }
            }

            // Check for suffix
            let foundSuffix = false;
            for (const rule of BPE_RULES) {
                if (rule.suffix && remaining.endsWith(rule.suffix) && remaining.length > rule.suffix.length + 1) {
                    const stemLen = remaining.length - rule.suffix.length;
                    parts.push({ text: originalRemaining.slice(0, stemLen), type: 'stem' });
                    parts.push({ text: originalRemaining.slice(stemLen), type: 'suffix' });
                    foundSuffix = true;
                    break;
                }
            }

            if (!foundSuffix) {
                parts.push({ text: originalRemaining, type: foundPrefix ? 'stem' : 'word' });
            }

            result.push(...parts);
        }

        if (punct) result.push({ text: punct, type: 'punct' });
    }

    return result;
};

// Simple word-level tokenizer
const tokenizeWord = (text) => {
    return text.trim().split(/(\s+)/).filter(t => t.length > 0).map(t => ({
        text: t,
        type: /^\s+$/.test(t) ? 'space' : 'word',
    }));
};

const hashToken = (text) => Math.abs(text.split('').reduce((acc, char) => acc + char.charCodeAt(0) * 31, 0) % 50257);

const TYPE_COLORS = {
    word: (text) => `hsl(${Math.abs(text.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0) % 360)}, 70%, 60%)`,
    prefix: () => '#ff4081',
    stem: (text) => `hsl(${Math.abs(text.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0) % 360)}, 70%, 60%)`,
    suffix: () => '#ffab40',
    punct: () => '#888',
    space: () => 'rgba(255,255,255,0.1)',
};

const TokenizationSlide = () => {
    const [inputText, setInputText] = useState(PRESETS[0].text);
    const [mode, setMode] = useState('bpe'); // 'word' or 'bpe'
    const [showInfo, setShowInfo] = useState(false);

    const tokens = useMemo(() => {
        if (mode === 'word') return tokenizeWord(inputText);
        return tokenizeBPE(inputText);
    }, [inputText, mode]);

    const visibleTokens = tokens.filter(t => t.type !== 'space');

    return (
        <Slide>
            <div style={{ display: 'flex', flexDirection: 'column', height: '100%', gap: '1.5rem' }}>
                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <h2>Part 4: Tokenization</h2>
                    <p>
                        How does text become numbers? Step one: <strong>split it into pieces</strong>. LLMs don't read
                        whole words - they break text into <strong>subword tokens</strong> using algorithms like BPE
                        (Byte Pair Encoding). Try typing below to see how the AI sees your text.
                    </p>
                </motion.div>

                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1rem' }}>

                    {/* Controls row */}
                    <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
                        {/* Mode toggle */}
                        <div style={{ display: 'flex', gap: '0.25rem', background: 'rgba(255,255,255,0.05)', borderRadius: '0.5rem', padding: '0.2rem' }}>
                            {['word', 'bpe'].map(m => (
                                <button
                                    key={m}
                                    onClick={() => setMode(m)}
                                    style={{
                                        padding: '0.3rem 0.75rem',
                                        borderRadius: '0.4rem',
                                        border: 'none',
                                        background: mode === m ? 'rgba(0,229,255,0.2)' : 'transparent',
                                        color: mode === m ? '#00e5ff' : '#888',
                                        cursor: 'pointer',
                                        fontSize: '0.8rem',
                                        fontWeight: 'bold',
                                    }}
                                >
                                    {m === 'word' ? 'Word-level' : 'Subword (BPE)'}
                                </button>
                            ))}
                        </div>

                        {/* Presets */}
                        <div style={{ display: 'flex', gap: '0.3rem', marginLeft: 'auto' }}>
                            {PRESETS.map((preset) => (
                                <button
                                    key={preset.label}
                                    onClick={() => setInputText(preset.text)}
                                    style={{
                                        padding: '0.25rem 0.6rem',
                                        borderRadius: '1rem',
                                        border: '1px solid rgba(255,255,255,0.15)',
                                        background: inputText === preset.text ? 'rgba(255,171,64,0.15)' : 'transparent',
                                        color: inputText === preset.text ? '#ffab40' : '#888',
                                        cursor: 'pointer',
                                        fontSize: '0.7rem',
                                    }}
                                >
                                    {preset.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Input Section */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <label style={{ fontWeight: 'bold', color: 'var(--highlight-color)', fontSize: '0.9rem' }}>Input Text:</label>
                        <textarea
                            value={inputText}
                            onChange={(e) => setInputText(e.target.value)}
                            style={{
                                width: '100%',
                                height: '70px',
                                padding: '0.75rem',
                                borderRadius: '0.5rem',
                                border: '1px solid rgba(255,255,255,0.2)',
                                background: 'rgba(0,0,0,0.3)',
                                color: 'white',
                                fontSize: '1rem',
                                fontFamily: 'monospace',
                                resize: 'none',
                            }}
                        />
                    </div>

                    {/* Visualization Section */}
                    <div style={{
                        background: 'rgba(255,255,255,0.05)',
                        padding: '1.25rem',
                        borderRadius: '1rem',
                        border: '1px solid rgba(255,255,255,0.1)',
                        flex: 1,
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                            <h3 style={{ margin: 0 }}>Tokenized View (What AI Sees)</h3>
                            {mode === 'bpe' && (
                                <div style={{ display: 'flex', gap: '0.75rem', fontSize: '0.65rem' }}>
                                    <span><span style={{ display: 'inline-block', width: 8, height: 8, borderRadius: '50%', background: '#ff4081', marginRight: 4 }} />prefix</span>
                                    <span><span style={{ display: 'inline-block', width: 8, height: 8, borderRadius: '50%', background: '#ffab40', marginRight: 4 }} />suffix</span>
                                    <span><span style={{ display: 'inline-block', width: 8, height: 8, borderRadius: '50%', background: '#aaa', marginRight: 4 }} />stem/word</span>
                                </div>
                            )}
                        </div>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                            <AnimatePresence>
                                {visibleTokens.map((token, index) => {
                                    const colorFn = TYPE_COLORS[token.type] || TYPE_COLORS.word;
                                    const bg = colorFn(token.text);
                                    const id = hashToken(token.text);
                                    return (
                                        <motion.div
                                            key={`${index}-${token.text}-${mode}`}
                                            initial={{ opacity: 0, scale: 0.8 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0.5 }}
                                            transition={{ duration: 0.2 }}
                                            style={{
                                                padding: '4px 8px',
                                                borderRadius: '4px',
                                                background: bg,
                                                color: '#000',
                                                fontWeight: 'bold',
                                                fontFamily: 'monospace',
                                                display: 'flex',
                                                flexDirection: 'column',
                                                alignItems: 'center',
                                                minWidth: '30px',
                                                textAlign: 'center',
                                                fontSize: '0.9rem',
                                            }}
                                        >
                                            <span>{token.text}</span>
                                            <span style={{ fontSize: '0.6em', opacity: 0.7 }}>[{id}]</span>
                                        </motion.div>
                                    );
                                })}
                            </AnimatePresence>
                        </div>
                    </div>

                    {/* Bottom row */}
                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <div style={{
                            flex: 1,
                            background: 'rgba(0,0,0,0.4)',
                            padding: '0.75rem',
                            borderRadius: '0.5rem',
                            borderLeft: '4px solid var(--secondary-color)',
                        }}>
                            <strong>Context Window:</strong> The AI looks at all these tokens at once to guess what comes next.
                            Token count: <strong>{visibleTokens.length}</strong>
                            {mode === 'bpe' && (
                                <span style={{ color: '#888', fontSize: '0.8rem' }}>
                                    {' '}(word-level would be {inputText.trim().split(/\s+/).length})
                                </span>
                            )}
                        </div>

                        <button
                            onClick={() => setShowInfo(!showInfo)}
                            style={{
                                padding: '0.5rem 0.75rem',
                                borderRadius: '0.5rem',
                                border: `1px solid ${showInfo ? '#ffab40' : 'rgba(255,255,255,0.15)'}`,
                                background: showInfo ? 'rgba(255,171,64,0.15)' : 'rgba(255,255,255,0.05)',
                                color: showInfo ? '#ffab40' : '#aaa',
                                cursor: 'pointer',
                                fontSize: '0.8rem',
                                fontWeight: 'bold',
                                whiteSpace: 'nowrap',
                            }}
                        >
                            Why subwords?
                        </button>
                    </div>

                    <AnimatePresence>
                        {showInfo && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                style={{ overflow: 'hidden' }}
                            >
                                <div style={{
                                    background: 'rgba(255,171,64,0.08)',
                                    border: '1px solid rgba(255,171,64,0.2)',
                                    borderRadius: '0.75rem',
                                    padding: '0.75rem 1rem',
                                    fontSize: '0.8rem',
                                    lineHeight: 1.5,
                                    color: '#ccc',
                                }}>
                                    <strong style={{ color: '#ffab40' }}>Why subword tokenization?</strong>
                                    <ul style={{ margin: '0.3rem 0 0 1rem', padding: 0 }}>
                                        <li><strong>Smaller vocabulary:</strong> ~50K tokens instead of millions of words</li>
                                        <li><strong>Handles new words:</strong> "unhappiness" → ["un", "happi", "ness"] - each piece is known</li>
                                        <li><strong>Efficient:</strong> Common words stay as one token; rare words get split</li>
                                        <li><strong>Multilingual:</strong> Non-English text uses more tokens per word (visible in the multilingual preset)</li>
                                    </ul>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </Slide>
    );
};

export default TokenizationSlide;
