'use client'

import Image from 'next/image';
import { motion } from "framer-motion";
import { PhoneCall, Users, Home, Smile } from "lucide-react";

const steps = [
{
  icon: PhoneCall,
  step: "01",
  title: "Schedule a Call",
  description: "Reach out for a free, no-obligation consultation. I'll listen to your needs and answer your questions."
},
{
  icon: Users,
  step: "02",
  title: "Personalized Matching",
  description: "Based on your unique situation, I identify the best senior living options that fit your criteria."
},
{
  icon: Home,
  step: "03",
  title: "Tour & Compare",
  description: "I arrange tours, accompany you to visits, and help you compare communities side by side."
},
{
  icon: Smile,
  step: "04",
  title: "Move-In & Beyond",
  description: "I assist with the transition and continue to check in to ensure complete satisfaction."
}];


const HowItWorksSection = () => {
  return (
    <section id="how-it-works" className="py-12 bg-slate-50">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16">
          
          <span className="text-sm font-semibold uppercase tracking-widest text-primary mb-3 block">
            Simple Process
          </span>
          <h2 className="text-3xl sm:text-4xl font-heading font-bold text-foreground mb-4">
            How It Works
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Finding the right senior living community doesn't have to be overwhelming. 
            Here's our straightforward approach.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 relative">
          {/* Connector line (desktop) */}
          <div className="hidden lg:block absolute top-16 left-[12.5%] right-[12.5%] h-0.5 bg-border" />

          {steps.map((step, index) =>
          <motion.div
            key={step.step}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.12 }}
            className="text-center relative">
            
              <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center mx-auto mb-6 relative z-10 shadow-warm">
                <step.icon className="w-7 h-7 text-primary-foreground" />
              </div>
              <span className="text-sm font-bold uppercase tracking-wider mb-2 block text-primary">
                Step {step.step}
              </span>
              <h3 className="text-xl font-heading font-semibold text-foreground mb-3">
                {step.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {step.description}
              </p>
            </motion.div>
          )}
        </div>
      </div>
    </section>);

};

export default HowItWorksSection;