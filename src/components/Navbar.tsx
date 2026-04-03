'use client'

import Image from 'next/image';
import Link from 'next/link';
import { useState } from "react";
import { Menu, X, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { label: "About", href: "/#about" },
    { label: "Services", href: "/#services" },
    { label: "How It Works", href: "/#how-it-works" },
    { label: "Testimonials", href: "/#testimonials" },
    { label: "Contact", href: "/#contact" },
    { label: "Providers", href: "/community" },
  ];

  return (
    <nav className="bg-secondary">
      <div className="container mx-auto px-5 py-4 flex items-center justify-between">

        <Link href="/" className="cursor-pointer">
          <div className="flex flex-row items-center gap-4 group relative z-50">
            <div className="shrink-0">
              <Image
                src="/logo.png"
                alt="Ashley Krause Logo"
                width={75}
                height={75}
                className="object-contain"
              />
            </div>
            <div className="flex flex-col justify-center">
              <span className="font-heading text-2xl font-bold text-foreground tracking-tight leading-tight">
                <span className="text-nowrap">Ashley Krause</span>
                <span className="text-foreground/20 font-light px-2 max-[1280px]:hidden">|</span>
                <span className="text-primary max-[1280px]:hidden inline-block whitespace-nowrap">Senior One Source</span>
              </span>
              <span className="text-sm text-secondary-foreground tracking-wider mt-1">
                Your Trusted Senior Living Advisor
              </span>
            </div>
          </div>
        </Link>

        {/* Desktop Nav */}
        <div className="flex-1 hidden min-[1130px]:flex items-center justify-end gap-8 text-secondary-foreground">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-md hover:text-secondary-foreground hover:underline transition-colors"
            >
              {link.label}
            </a>
          ))}
          <Button
            asChild
            size="lg"
            className="gap-2 shrink-0 relative z-50 hover:bg-primary/80 cursor-pointer p-3" 
          >
            <a
              href="tel:9719838363"
              aria-label="Call Ashley Krause at 971-983-8363"
            >
              <Phone className="w-4 h-4" />
              (971) 983-8363
            </a>
          </Button>
        </div>

        {/* Mobile Toggle */}
        <button
          className="min-[1130px]:hidden text-foreground ml-4"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>

      </div >

      {/* Mobile Menu */}
      {
        isOpen && (
          <div className="min-[1130px]:hidden bg-background border-b border-border px-6 pb-6">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="block py-2 text-secondary-foreground hover:text-foreground hover:underline transition-colors"
                onClick={() => setIsOpen(false)}
              >
                {link.label}
              </a>
            ))}
            <Button
              asChild
              size="lg"
              className="mt-3 gap-2 shrink-0 relative z-50 hover:bg-primary/80 cursor-pointer p-2"
            >
              <a
                href="tel:9719838363"
                aria-label="Call Ashley Krause at 971-983-8363"
              >
                <Phone className="w-4 h-4" />
                (971) 983-8363
              </a>
            </Button>
          </div>
        )
      }
    </nav >
  );
};

export default Navbar;
