'use client'

import Image from 'next/image';
import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    name: "Cheryl Myers",
    relation: "Daughter of Resident",
    quote:
      "Ashley was able to identify homes that would fit our loved one's requirements and made arrangements for us to visit four homes in one day. We were able to make a choice that day and move forward with placement. When a family is faced with needing to place a loved one within days; Ashley gives thoughtful direction to what can be an emotional and confusing situation.",
    rating: 5,
  },
  {
    name: "Debbie Cook",
    relation: "Daughter of Resident",
    quote:
      "Ashley was awesome in helping us find just the right place for our Dad. I can't say enough good things about the place and Ashley. Don't hesitate to call her — you will not be sorry.",
    rating: 5,
  },
  {
    name: "Gary Franke",
    relation: "Friend of Resident",
    quote:
      "I engaged Ashley on the referral of a friend and I am NOT sorry. Ashley and her team have been WONDERFUL helping us find a place for our loved one. I strongly recommend you do the same if you need help finding a safe, nurturing residential care environment for your loved one(s).",
    rating: 5,
  },
];

const TestimonialsSection = () => {
  return (
    <section id="testimonials" className="py-12 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/testimonial-bg.jpg"
          alt=""
          width={1024}    /* Original width */
          height={1024}   /* Original height */
          className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-foreground/85" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-sm font-semibold uppercase tracking-widest text-accent mb-3 block">
            Testimonials
          </span>
          <h2 className="text-3xl sm:text-4xl font-heading font-bold text-primary-foreground mb-4">
            Families We've Helped
          </h2>
          <p className="text-primary-foreground/70 max-w-2xl mx-auto text-lg">
            Hear from families who found peace of mind through my guidance.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((t, index) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-card/10 backdrop-blur-md rounded-xl p-8 border border-primary-foreground/10"
            >
              <Quote className="w-8 h-8 text-accent/60 mb-4" />
              <div className="flex gap-1 mb-4">
                {Array.from({ length: t.rating }).map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-accent text-accent" />
                ))}
              </div>
              <p className="text-primary-foreground/90 leading-relaxed mb-6 italic">
                "{t.quote}"
              </p>
              <div>
                <p className="font-heading font-semibold text-primary-foreground">{t.name}</p>
                <p className="text-sm text-primary-foreground/60">{t.relation}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
