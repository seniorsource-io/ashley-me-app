'use client'

import { motion } from 'framer-motion';

const testimonials = [
    {
        name: 'Sarah M.',
        relation: 'Daughter of client',
        quote: "We were overwhelmed trying to find the right place for my father. They made the entire process feel manageable and even hopeful.",
        rating: 5,
    },
    {
        name: 'David L.',
        relation: 'Son of client',
        quote: "I didn't know where to start. They walked us through every option, came to every tour, and helped us make a decision we feel good about.",
        rating: 5,
    },
];

const TestimonialsSection = () => {
    return (
        <section id="testimonials" className="bg-[hsl(var(--background))]">
            <div className="mx-6 sm:mx-12 border-t border-[hsl(var(--border))]" />
            <div className="max-w-[1400px] mx-auto px-6 sm:px-12 py-14">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                >
                    <p className="text-[11px] uppercase tracking-[2.5px] font-semibold text-[hsl(var(--faint))] mb-3">
                        What Families Say
                    </p>
                    <h2 className="font-heading text-[32px] font-medium tracking-tight text-foreground mb-10">
                        Trusted by hundreds of Portland families.
                    </h2>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {testimonials.map((t, index) => (
                        <motion.div
                            key={t.name}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className="bg-white rounded-xl p-7 border border-[hsl(var(--card-border))]"
                        >
                            <div className="flex gap-0.5 mb-3.5 text-[13px] text-[hsl(var(--star))]" style={{ letterSpacing: '2px' }}>
                                {'\u2605'.repeat(t.rating)}
                            </div>
                            <p className="text-sm text-[hsl(var(--muted))] leading-[1.7] mb-5 italic">
                                &ldquo;{t.quote}&rdquo;
                            </p>
                            <p className="text-[13px] font-semibold text-foreground">{t.name}</p>
                            <p className="text-[11px] text-[hsl(var(--subtle))]">{t.relation}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default TestimonialsSection;
