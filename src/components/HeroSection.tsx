'use client'

import Image from 'next/image';
import Link from 'next/link';
import { motion } from "framer-motion";
import { ArrowRight, Heart } from "lucide-react";
import { Phone, Mail, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";

const HeroSection = () => {
  return (
    <section className="relative flex flex-col items-start pt-14 pb-38 px-2">

      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src="/hero-senior-living.jpg"
          alt="Beautiful senior living community"
          fill
          priority // Adds a performance boost for the main hero image
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-foreground/80 via-foreground/50 to-transparent" />
      </div>

      <div className="container mx-auto px-6 isolate relative">
        <div className="max-w-2xl isolate relative">
          <motion.div
            layout
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.15 }}
            className="flex items-start gap-4 mb-6 relative z-20"
          >
            <Image
              src="/ashley-krause.jpg"
              alt="Ashley Krause"
              width={408}    /* Original width */
              height={524}   /* Original height */
              className="w-31 h-[147px] sm:w-35 sm:h-[167px] lg:w-43 lg:h-[199px] rounded-xl object-cover border-2 border-accent shadow-lg shrink-0 mt-0"
            />
            <div>
              <h1 className="text-lg sm:text-xl lg:text-2xl font-heading font-bold text-primary-foreground leading-tight text-balance">
                Hi, I'm Ashley Krause<br />
              </h1>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-bold text-primary-foreground leading-tight text-balance">
                <span className="text-accent">Let's Find the Right Care for Your Next Chapter</span>
              </h1>
            </div>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-lg text-primary-foreground/80 mb-8 max-w-lg leading-relaxed"
          >
            My team and I help families in the Portland area and beyond navigate the journey to
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
            className="mt-12 flex items-center gap-8 text-primary-foreground/70 text-sm"
          >
            <div className="flex flex-col">
              <span className="text-2xl font-heading font-bold text-accent">5+</span>
              <span>Years Experience</span>
            </div>
            <div className="w-px h-10 bg-primary-foreground/20" />
            <div className="flex flex-col">
              <span className="text-2xl font-heading font-bold text-accent">100%</span>
              <span>Free Service</span>
            </div>
            <div className="w-px h-10 bg-primary-foreground/20" />
            <div className="flex flex-col">
              <span className="text-2xl font-heading font-bold text-accent">Serving Portland OR</span>
              <span>Metro and Beyond</span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
