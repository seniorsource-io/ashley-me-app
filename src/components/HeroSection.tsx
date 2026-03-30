'use client'

import Image from 'next/image';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

const HeroSection = () => {
  return (
    <section className="relative flex flex-col items-start pt-10 pb-32 px-2">

      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src="/hero-senior-living.jpg"
          alt="Beautiful senior living community"
          fill
          priority // Adds a performance boost for the main hero image
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-foreground/94 via-foreground/82 to-foreground/35" />
      </div>

      <div className="container mx-auto px-4 isolate relative">
        <div className="max-w-2xl isolate relative">
          <motion.div
            layout
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.15 }}
            className="flex items-start gap-5 mb-6 relative z-20"
          >
            <Image
              src="/ashley-krause.jpg"
              alt="Ashley Krause"
              width={408}    /* Original width */
              height={524}   /* Original height */
              className="w-30 h-[141px] sm:w-30 sm:h-[141px] lg:w-38 lg:h-[183px] rounded-xl object-cover border-2 border-accent shadow-lg shrink-0 mt-0"
            />
            <div>
              <h1 className="-mt-1 sm:mt-1 lg:mt-1 text-3xl sm:text-4xl lg:text-5xl font-heading font-bold text-primary-foreground leading-tight text-balance">
                <span className="text-accent">Personalized Senior Care Solutions for Your Peace of Mind</span><br />
              </h1>
            </div>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-lg text-primary-foreground/80 mb-7 max-w-lg leading-relaxed"
          >
            My team and I help families in the greater Portland area navigate the journey to
            senior living with personalized guidance, compassion, and expertise — at no cost to you.
          </motion.p>

          <motion.div
            layout
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.45 }}
            className="relative z-50 flex flex-col sm:flex-row gap-4"
          >
            <Link href="#services" className="cursor-pointer">
              <Button className="text-base gap-2 px-8 py-6 shadow-warm hover:bg-primary/80 cursor-pointer">
                What We Provide
                <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
            <Link href="#how-it-works" className="cursor-pointer">
              <Button
                className="text-base gap-2 px-8 py-6 shadow-warm hover:bg-primary/80 cursor-pointer"
              >
                Learn How It Works
                <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
          </motion.div>

          <motion.div
            layout
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="mt-8 flex items-center gap-8 text-primary-foreground/70 text-sm"
          >
            <div className="flex flex-col">
              <span className="text-2xl font-heading font-bold text-accent">Serving Portland</span>
              <span>Metro and Beyond</span>
            </div>
            <div className="w-px h-10 bg-primary-foreground/20" />
            <div className="flex flex-col">
              <span className="text-2xl font-heading font-bold text-accent">100%</span>
              <span>Free Service</span>
            </div>
            <div className="w-px h-10 bg-primary-foreground/20" />
            <div className="flex flex-col">
              <span className="text-2xl font-heading font-bold text-accent">Over 600+</span>
              <span>Clients Served</span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
