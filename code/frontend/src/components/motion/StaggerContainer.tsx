'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface StaggerContainerProps {
    children: ReactNode;
    className?: string;
    staggerDelay?: number;
    delay?: number;
}

interface StaggerItemProps {
    children: ReactNode;
    className?: string;
}

const containerVariants = (staggerDelay: number, delay: number) => ({
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            delayChildren: delay,
            staggerChildren: staggerDelay,
        },
    },
});

const itemVariants = {
    hidden: { opacity: 0, y: 24 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.5,
            ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number],
        },
    },
};

export function StaggerContainer({
    children,
    className,
    staggerDelay = 0.1,
    delay = 0,
}: StaggerContainerProps) {
    return (
        <motion.div
            variants={containerVariants(staggerDelay, delay)}
            initial="hidden"
            animate="visible"
            className={className}
        >
            {children}
        </motion.div>
    );
}

export function StaggerItem({ children, className }: StaggerItemProps) {
    return (
        <motion.div variants={itemVariants} className={className}>
            {children}
        </motion.div>
    );
}
