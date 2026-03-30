"use client";

import { motion } from "framer-motion";

const steps = [
  {
    number: "01",
    title: "Tell Us Your Needs",
    description:
      "Fill out a short form about care requirements, budget, and preferred location.",
  },
  {
    number: "02",
    title: "We Call You",
    description:
      "A quick conversation to understand your family's situation and answer questions.",
  },
  {
    number: "03",
    title: "Tour & Compare",
    description:
      "We schedule tours at matched communities and help you compare options side by side.",
  },
  {
    number: "04",
    title: "Move In",
    description:
      "We handle coordination with the community and support you through move-in day.",
  },
];

const HowItWorks = () => {
  return (
    <section id="how-it-works" className="bg-[hsl(var(--background))]">
      <div className="mx-6 sm:mx-12 border-t border-[hsl(var(--border))]" />
      <div className="max-w-[1400px] mx-auto px-6 sm:px-12 py-14">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <p className="text-[11px] uppercase tracking-[2.5px] font-semibold text-[hsl(var(--faint))] mb-3">
            How It Works
          </p>
          <h2 className="font-heading text-[32px] font-medium tracking-tight text-foreground mb-10">
            Four steps to the right fit.
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, index) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="relative"
            >
              <p className="font-heading text-4xl font-medium text-[hsl(var(--step-number))] mb-3 leading-none">
                {step.number}
              </p>
              <h3 className="text-sm font-semibold text-foreground mb-1.5">
                {step.title}
              </h3>
              <p className="text-xs text-[hsl(var(--subtle))] leading-relaxed">
                {step.description}
              </p>
              {index < steps.length - 1 && (
                <span className="hidden lg:block absolute top-4 -right-3 text-[hsl(var(--dot))] text-sm">
                  &rarr;
                </span>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
