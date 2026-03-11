'use client'

import Image from 'next/image';
import { motion } from "framer-motion";
import { Heart, GraduationCap, MapPin, Users } from "lucide-react";

export default function AboutSection() {
  return (
    <section id="about" className="pt-34 pb-12 bg-secondary">
      <div className="container mx-auto px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12">

            <span className="text-sm font-semibold uppercase tracking-widest text-primary mb-3 block">
              About Me
            </span>
            <h2 className="text-3xl sm:text-4xl font-heading font-bold text-foreground mb-4">
              Meet Ashley
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="bg-card rounded-2xl shadow-soft p-8 sm:p-12">

            <div className="grid md:grid-cols-2 gap-8 mb-10">
              <p className="text-muted-foreground text-lg leading-relaxed">
                My desire to serve seniors and their families began when my mother-in-law suffered from a traumatic health event.
                I learned how it feels to be in crisis with the need to quickly make decisions on care options and finances.
                I had wished for someone to walk alongside me as a knowledgeable resource who had my loved one's best interest in mind.
              </p>
              <p className="text-muted-foreground text-lg leading-relaxed">
                I started my journey working onsite for assisted living and memory care communities.
                With the knowledge and experience I have in the Salem-Portland area, I felt it was time to focus on families
                and helping them find the very best solution for their loved one. I understand the emotional toll moving can inflict on seniors and
                their families, and my desire is to make this effortless for my clients.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="font-heading font-semibold text-foreground text-sm">Based in Lake Oswego</p>
                  <p className="text-muted-foreground text-sm">Portland metro area</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <Heart className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="font-heading font-semibold text-foreground text-sm">Community Experience</p>
                  <p className="text-muted-foreground text-sm">Onsite associate turned senior living advisor</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <Users className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="font-heading font-semibold text-foreground text-sm">Family Focused</p>
                  <p className="text-muted-foreground text-sm">Mom of three, two labradoodles</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <GraduationCap className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="font-heading font-semibold text-foreground text-sm">Former Educator</p>
                  <p className="text-muted-foreground text-sm">Elementary school teacher</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
