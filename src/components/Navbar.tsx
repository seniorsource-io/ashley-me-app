'use client'

import Link from 'next/link';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';

const navLinks = [
    { label: 'How It Works', href: '/#how-it-works' },
    { label: 'Testimonials', href: '/#testimonials' },
    { label: 'Contact', href: '/#contact' },
];

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <nav className="sticky top-0 z-50 bg-[hsl(var(--background))] border-b border-[hsl(var(--border))]">
            <div className="max-w-[1400px] mx-auto px-6 sm:px-12 py-4 flex items-center justify-between">
                <Link href="/" className="font-heading text-lg font-medium tracking-tight text-foreground">
                    Senior One Source
                </Link>

                {/* Desktop */}
                <div className="hidden md:flex items-center gap-7">
                    {navLinks.map((link) => (
                        <a
                            key={link.label}
                            href={link.href}
                            className="text-[13px] text-[hsl(var(--muted))] hover:text-foreground transition-colors"
                        >
                            {link.label}
                        </a>
                    ))}
                    <Link
                        href="/customer"
                        className="bg-foreground text-[hsl(var(--background))] text-xs font-semibold px-5 py-2 rounded-lg hover:bg-foreground/90 transition-colors"
                    >
                        Get Started
                    </Link>
                </div>

                {/* Mobile toggle */}
                <button
                    className="md:hidden text-foreground"
                    onClick={() => setIsOpen(!isOpen)}
                    aria-label="Toggle menu"
                >
                    {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
            </div>

            {/* Mobile menu */}
            {isOpen && (
                <div className="md:hidden border-t border-[hsl(var(--border))] px-6 pb-4">
                    {navLinks.map((link) => (
                        <a
                            key={link.label}
                            href={link.href}
                            className="block py-3 text-[hsl(var(--muted))] hover:text-foreground transition-colors"
                            onClick={() => setIsOpen(false)}
                        >
                            {link.label}
                        </a>
                    ))}
                    <Link
                        href="/customer"
                        className="inline-block mt-2 bg-foreground text-[hsl(var(--background))] text-sm font-semibold px-5 py-2.5 rounded-lg"
                        onClick={() => setIsOpen(false)}
                    >
                        Get Started
                    </Link>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
