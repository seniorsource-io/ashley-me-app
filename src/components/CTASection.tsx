'use client'

import { motion } from "framer-motion";
import { Phone, Mail, ClipboardList } from "lucide-react";
import { useRef } from 'react';
import { PopupButton } from '@typeform/embed-react';

const CTASection = () => {

  const ref = useRef<any>(null); // Initialize with null
  const openPopup = () => ref.current?.open();

  const handleSubmit = () => {
    // 1. Optional: Wait a moment so they see the "Thank You" screen
    setTimeout(() => {
      ref.current?.close();
    }, 3000); // 3 seconds delay
  };

  return (
    <section id="contact" className="py-12 bg-secondary-cream">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12">

            <span className="text-sm font-semibold uppercase tracking-widest text-primary mb-3 block">
              Get Started
            </span>
            <h2 className="text-3xl sm:text-4xl font-heading font-bold text-foreground mb-4">
              Ready to Find the Perfect Home?
            </h2>
            <p className="text-secondary-foreground text-lg max-w-2xl mx-auto">
              Take the first step today. My consultation is completely free, and I'm here
              to support your family every step of the way.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="bg-card rounded-2xl shadow-lg p-8 sm:p-12" >

            <div className="grid sm:grid-cols-3 gap-8 mb-10">
              <a
                href="mailto:Ashley@SeniorOneSource.net"
                className="group text-secondary-foreground cursor-pointer block"
                aria-label="Email Ashley Krause at Ashley@SeniorOneSource.net"
              >
                <div className="flex flex-col items-center text-center gap-3">
                  <div className="w-15 h-15 rounded-full bg-primary/10 flex items-center justify-center transition-all duration-300 group-hover:bg-primary/20 group-hover:scale-110">
                    <Mail className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <p className="font-heading font-semibold text-secondary-foreground group-hover:text-primary">
                      Email Us
                    </p>
                    <p className="text-secondary-foreground text-sm transition-colors group-hover:text-primary">
                      ashley@SeniorOneSource.net
                    </p>
                  </div>
                </div>
              </a>
              <a
                href="tel:9716455401"
                /* 1. Added 'group' to the parent */
                className="group cursor-pointer block"
                aria-label="Call Ashley Krause at 971-645-5401"
              >
                <div className="flex flex-col items-center text-center gap-3">
                  {/* 2. Icon circle grows slightly and gets darker on hover */}
                  <div className="w-15 h-15 rounded-full bg-primary/10 flex items-center justify-center transition-all duration-300 group-hover:bg-primary/20 group-hover:scale-110">
                    <Phone className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <p className="font-heading font-semibold text-secondary-foreground group-hover:text-primary">
                      Call Us
                    </p>
                    {/* 3. Phone number turns darker/primary on hover */}
                    <p className="text-secondary-foreground text-sm transition-colors group-hover:text-primary">
                      (971) 645-5401
                    </p>
                  </div>
                </div>
              </a>
              <a
                onClick={openPopup}
                className="group text-secondary-foreground cursor-pointer block"
                aria-label="Share your details and we will contact you for an appointment."
              >
                <div className="flex flex-col items-center text-center gap-3">

                  <div className="w-15 h-15 rounded-full bg-primary/10 flex items-center justify-center transition-all duration-300 group-hover:bg-primary/20 group-hover:scale-110">
                    <ClipboardList className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <p className="font-heading font-semibold text-secondary-foreground group-hover:text-primary">
                      Tell Us Your Needs
                    </p>
                    <p className="text-secondary-foreground text-sm transition-colors group-hover:text-primary">
                      Connect online
                    </p>
                  </div>
                </div>
              </a>
              <PopupButton
                id="BGG10VPS" 
                embedRef={ref}
                style={{ display: 'none' }} // Completely hides the default button
                width="390px"
                height="600px"  
                onSubmit={handleSubmit} // Trigger the close logic here
                enableSandbox
              >
              </PopupButton>
            </div>
            <div className="text-center">
              <p className="text-md text-secondary-foreground mt-2">
                Schedule your free consultation today.
              </p>
              <p className="text-md text-secondary-foreground mt-2">
                No cost. No obligation. Just guidance from someone who cares.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>);

};

export default CTASection;