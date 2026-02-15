import React from 'react';
import Slide from '../Slide';
import { motion } from 'framer-motion';

const ConclusionSlide = () => {
    return (
        <Slide>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', textAlign: 'center' }}>
                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{ fontSize: '3rem', marginBottom: '2rem' }}
                >
                    From Weights to Wisdom?
                </motion.h2>

                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    style={{ maxWidth: '800px', fontSize: '1.2rem' }}
                >
                    We started with a simple mixing board. By stacking billions of these parameters,
                    training them on the entire internet, and using tokenization, we get models that can code, reason, and create.
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 1, duration: 0.8 }}
                    style={{
                        marginTop: '3rem',
                        padding: '2rem',
                        background: 'rgba(255,255,255,0.05)',
                        borderRadius: '1rem',
                        maxWidth: '600px'
                    }}
                >
                    <h3>What's Next?</h3>
                    <p style={{ margin: 0 }}>
                        The learning never stops. Just like the weights in our model, our understanding of AI is constantly being tuned.
                    </p>
                </motion.div>
            </div>
        </Slide>
    );
};

export default ConclusionSlide;
