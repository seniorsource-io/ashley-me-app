"use client";

import Link from "next/link";
import { motion } from "framer-motion";

const CTA = () => {
  return (
    <section id="contact" className="bg-[hsl(var(--background))]">
      <div className="mx-6 sm:mx-12 border-t border-[hsl(var(--border))]" />
      <div className="max-w-[1400px] mx-auto px-6 sm:px-12 py-14">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="bg-[#2E2E2E] rounded-2xl px-8 sm:px-12 py-14 text-center"
        >
          <p className="text-[11px] uppercase tracking-[2.5px] font-semibold text-[#A0A0A0] mb-3">
            Ready to Start?
          </p>
          <h2 className="font-heading text-[32px] font-medium tracking-tight text-[#FAF8F5] mb-3.5">
            Let us help you find the right place.
          </h2>
          <p className="text-[15px] text-[#A0A0A0] leading-[1.7] mb-8 max-w-lg mx-auto">
            It&apos;s free, it&apos;s personal, and it starts with a simple
            form. We&apos;ll take it from there.
          </p>
          <Link
            href="/customer"
            className="inline-flex items-center gap-2 bg-[#FAF8F5] text-[#2E2E2E] text-sm font-semibold px-8 py-4 rounded-[10px] hover:bg-[#F0EDE8] transition-colors mb-7"
          >
            Get Started &rarr;
          </Link>
          <div className="flex items-center justify-center gap-8 text-[13px] text-[#7A7570]">
            <a
              href="tel:5033831442"
              className="hover:text-[#A0A0A0] transition-colors"
            >
              (503) 383-1442
            </a>
            <a
              href="mailto:ashley@SeniorOneSource.net"
              className="hover:text-[#A0A0A0] transition-colors"
            >
              ashley@SeniorOneSource.net
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CTA;
