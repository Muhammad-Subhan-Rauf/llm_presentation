import React from 'react';
import { motion } from 'framer-motion';

const Slide = ({ title, children }) => {
    return (
        <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            {title && <h1>{title}</h1>}
            <div style={{ flex: 1, position: 'relative' }}>
                {children}
            </div>
        </div>
    );
};

export default Slide;
