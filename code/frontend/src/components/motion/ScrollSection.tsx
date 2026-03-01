'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface ScrollSectionProps {
    children: ReactNode;
    className?: string;
    direction?: 'up' | 'down' | 'left' | 'right';
    distance?: number;
    duration?: number;
    delay?: number;
}

const directionOffset = {
    up: { y: 80, x: 0 },
    down: { y: -80, x: 0 },
    left: { x: 80, y: 0 },
    right: { x: -80, y: 0 },
};

export default function ScrollSection({
    children,
    className,
    direction = 'up',
    distance,
    duration = 0.7,
    delay = 0,
}: ScrollSectionProps) {
    const offset = directionOffset[direction];
    const initialX = distance !== undefined ? (offset.x > 0 ? distance : offset.x < 0 ? -distance : 0) : offset.x;
    const initialY = distance !== undefined ? (offset.y > 0 ? distance : offset.y < 0 ? -distance : 0) : offset.y;

    return (
        <motion.div
            initial={{ opacity: 0, x: initialX, y: initialY }}
            whileInView={{ opacity: 1, x: 0, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration, delay, ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number] }}
            className={className}
        >
            {children}
        </motion.div>
    );
}
