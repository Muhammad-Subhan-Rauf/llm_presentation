import React from 'react';
import Slide from '../Slide';
import { motion } from 'framer-motion';

const IntroSlide = () => {
    return (
        <Slide>
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100%',
                textAlign: 'center'
            }}>
                <motion.h1
                    initial={{ opacity: 0, y: -50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    style={{ fontSize: '3.5rem', marginBottom: '1.5rem' }}
                >
                    Demystifying AI & LLMs
                </motion.h1>

                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5, duration: 0.8 }}
                    style={{ maxWidth: '800px' }}
                >
                    <p style={{ fontSize: '1.5rem', color: '#aaa' }}>
                        "Any sufficiently advanced technology is indistinguishable from magic."
                    </p>
                    <p style={{ fontSize: '1.1rem', marginTop: '2rem' }}>
                        We will break down the complex math of AI Agents and Large Language Models
                        into conceptual mechanics you can touch and see.
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.5, duration: 1 }}
                    style={{ marginTop: '3rem', display: 'flex', gap: '2rem' }}
                >
                    {/* Decorative elements representing the 3 main parts */}
                    <div className="feature-pill">Neural Networks & Training</div>
                    <div className="feature-pill">From Text to Numbers</div>
                    <div className="feature-pill">Understanding & Generation</div>
                </motion.div>
            </div>
        </Slide>
    );
};

export default IntroSlide;
