'use client'

import Image from 'next/image';
import { motion } from "framer-motion";
import { Phone, Mail, ClipboardList, Link } from "lucide-react";
import { Button } from "@/components/ui/button";

const CTAMiniSection = () => {
  return (
    <section id="contactmini" className="relative h-0 z-30 overflow-visible">
      <div className="container mx-auto">
        <div className="max-w-4xl mx-auto">

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="bg-card rounded-2xl bg-secondary-cream shadow-xl p-6 sm:p-7 -translate-y-1/2 relative z-30" >

            <div className="grid sm:grid-cols-3 gap-8">
              <a
                href="mailto:Ashley@SeniorOneSource.net"
                className="group text-secondary-foreground cursor-pointer block max-[640px]:hidden"
                aria-label="Email Ashley Krause at Ashley@SeniorOneSource.net"
              >
                <div className="flex flex-col items-center text-center gap-3">
                  <div className="w-15 h-15 rounded-full bg-primary/10 flex items-center justify-center transition-all duration-300 group-hover:bg-primary/20 group-hover:scale-110">
                    <Mail className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <p className="font-heading font-semibold text-foreground transition-colors group-hover:text-primary">
                      Email Us
                    </p>
                    <p className="text-secondary-foreground text-sm transition-colors group-hover:text-primary">
                      Schedule appointment
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
                    <p className="font-heading font-semibold text-foreground transition-colors group-hover:text-primary">
                      Call Us
                    </p>
                    {/* 3. Phone number turns darker/primary on hover */}
                    <p className="text-secondary-foreground text-sm transition-colors group-hover:text-primary">
                      Connect live
                    </p>
                  </div>
                </div>
              </a>
              <a
                href="/connect"
                className="group text-secondary-foreground cursor-pointer"
                aria-label="Share your details and we will contact you for an appointment."
              >
                <div className="flex flex-col items-center text-center gap-3">
                  <div className="w-15 h-15 rounded-full bg-primary/10 flex items-center justify-center transition-all duration-300 group-hover:bg-primary/20 group-hover:scale-110">
                    <ClipboardList className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                      <span className="block font-heading font-semibold text-foreground transition-colors group-hover:text-primary">
                        Tell Us Your Needs
                      </span>
                      <span className="block text-secondary-foreground text-sm transition-colors group-hover:text-primary">
                        Connect online
                      </span>
                  </div>
                </div>
              </a>
            </div>
          </motion.div>

        </div>
      </div >
    </section >);

};

export default CTAMiniSection;