'use client'

import Image from 'next/image';
import { Heart } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-foreground">
      <div className="container mx-auto px-6">
        <div className="py-4 flex flex-col md:flex-row items-center justify-between gap-6">
          <a href="#" className="font-heading text-2xl font-bold text-primary-foreground tracking-tight">        
            <span className="text-nowrap">Ashley Krause</span>
            <span className="text-primary-foreground/30 font-thin px-2 max-[480px]:hidden">|</span>
            <span className="text-primary max-[480px]:hidden inline-block whitespace-nowrap">Senior One Source</span>
          </a>

          <div className="flex flex-wrap items-center justify-center gap-4 md:gap-6 text-sm text-primary-foreground/60">
            <a href="#about" className="hover:text-primary-foreground transition-colors">About</a>
            <a href="#services" className="hover:text-primary-foreground transition-colors">Services</a>
            <a href="#how-it-works" className="hover:text-primary-foreground transition-colors">How It Works</a>
            <a href="#testimonials" className="hover:text-primary-foreground transition-colors">Testimonials</a>
            <a href="#contact" className="hover:text-primary-foreground transition-colors">Contact</a>
          </div>
        </div>

        <div className="border-t border-primary-foreground/20 py-5 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-primary-foreground/60">
          <p>© {new Date().getFullYear()} Ashley Krause, Senior Living Advisor. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Made with <Heart className="w-3 h-3 text-accent" /> for families everywhere
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
