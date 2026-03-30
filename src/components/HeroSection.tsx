'use client'

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Home, ClipboardList, Handshake } from 'lucide-react';

const features = [
    {
        icon: Home,
        title: 'Personalized Matching',
        description: 'Matched to care needs, budget, and location',
        iconBg: 'bg-[hsl(var(--icon-orange))]',
    },
    {
        icon: ClipboardList,
        title: 'Guided Tours',
        description: 'We schedule and accompany every visit',
        iconBg: 'bg-[hsl(var(--icon-green))]',
    },
    {
        icon: Handshake,
        title: 'Move-In Support',
        description: 'Paperwork, coordination, and follow-up',
        iconBg: 'bg-[hsl(var(--icon-blue))]',
    },
];

const trustItems = [
    { number: '600+', label: 'families\nhelped' },
    { number: '100%', label: 'free\nservice' },
    { number: '4.9\u2605', label: 'client\nrating' },
];

const HeroSection = () => {
    return (
        <section className="bg-[hsl(var(--background))]">
            <div className="max-w-[1400px] mx-auto px-6 sm:px-12 pt-14 pb-12">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
                    {/* Left column */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="flex flex-col justify-center"
                    >
                        <h1 className="font-heading text-4xl sm:text-[46px] font-medium leading-[1.08] tracking-tight text-foreground mb-5">
                            The right senior living, found for you.
                        </h1>
                        <p className="text-[15px] text-[hsl(var(--muted))] leading-[1.7] mb-7 max-w-lg">
                            Free, expert guidance for families navigating senior care in Portland.
                            We do the research, scheduling, and comparison — you make the final call.
                        </p>
                        <div className="flex items-center gap-3.5">
                            <Link
                                href="/customer"
                                className="inline-flex items-center gap-2 bg-foreground text-[hsl(var(--background))] text-sm font-semibold px-8 py-4 rounded-[10px] hover:bg-foreground/90 transition-colors"
                            >
                                Get Started &rarr;
                            </Link>
                            <a
                                href="#how-it-works"
                                className="text-sm text-[hsl(var(--muted))] py-4 px-4 hover:text-foreground transition-colors"
                            >
                                Learn how it works
                            </a>
                        </div>
                    </motion.div>

                    {/* Right column — feature cards */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.15 }}
                        className="flex flex-col gap-3 justify-center"
                    >
                        {features.map((feature) => (
                            <div
                                key={feature.title}
                                className="flex items-center gap-4 bg-white rounded-xl px-6 py-5 border border-[hsl(var(--card-border))] shadow-card"
                            >
                                <div className={`w-10 h-10 rounded-[10px] ${feature.iconBg} flex items-center justify-center shrink-0`}>
                                    <feature.icon className="w-5 h-5 text-foreground/70" />
                                </div>
                                <div>
                                    <p className="text-[13px] font-semibold text-foreground mb-0.5">
                                        {feature.title}
                                    </p>
                                    <p className="text-[11px] text-[hsl(var(--subtle))]">
                                        {feature.description}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </motion.div>
                </div>
            </div>

            {/* Trust strip */}
            <div className="border-t border-[hsl(var(--border))]">
                <div className="max-w-[1400px] mx-auto px-6 sm:px-12 py-6 flex items-center justify-center gap-10 sm:gap-12">
                    {trustItems.map((item, i) => (
                        <div key={item.number} className="flex items-center gap-10 sm:gap-12">
                            {i > 0 && (
                                <div className="w-1 h-1 rounded-full bg-[hsl(var(--dot))]" />
                            )}
                            <div className="flex items-center gap-2.5">
                                <span className="font-heading text-2xl font-semibold text-foreground">
                                    {item.number}
                                </span>
                                <span className="text-[11px] text-[hsl(var(--subtle))] leading-tight whitespace-pre-line">
                                    {item.label}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default HeroSection;
