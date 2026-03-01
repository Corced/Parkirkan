'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface FadeInProps {
    children: ReactNode;
    className?: string;
    delay?: number;
    duration?: number;
    direction?: 'up' | 'down' | 'left' | 'right' | 'none';
    distance?: number;
}

const directionMap = {
    up: { y: 30 },
    down: { y: -30 },
    left: { x: 30 },
    right: { x: -30 },
    none: {},
};

export default function FadeIn({
    children,
    className,
    delay = 0,
    duration = 0.5,
    direction = 'up',
    distance,
}: FadeInProps) {
    const dirOffset = directionMap[direction];
    const initial: Record<string, number> = { opacity: 0 };

    if ('y' in dirOffset) initial.y = distance ?? dirOffset.y;
    if ('x' in dirOffset) initial.x = distance ?? dirOffset.x;

    return (
        <motion.div
            initial={initial}
            animate={{ opacity: 1, x: 0, y: 0 }}
            transition={{ duration, delay, ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number] }}
            className={className}
        >
            {children}
        </motion.div>
    );
}
