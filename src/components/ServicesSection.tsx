'use client'

import Image from 'next/image';
import { motion } from "framer-motion";
import { Search, MapPin, ClipboardCheck, HeartHandshake, Home, Stethoscope, DollarSign, Shield } from "lucide-react";

const services = [
{
  icon: Home,
  title: "Assisted Living & Memory Care",
  description:
  "I help match your loved one with the right assisted living or memory care community based on their unique needs and preferences."
},
{
  icon: Search,
  title: "Independent Living & Group Homes",
  description:
  "From independent living to smaller group/foster care homes, I'll help you explore every option available in your area."
},
{
  icon: Stethoscope,
  title: "Home Care & Skilled Nursing",
  description:
  "Need in-home care, skilled nursing, rehab, hospice, or respite care? I can connect you with trusted providers."
},
{
  icon: DollarSign,
  title: "Financial & Legal Guidance",
  description:
  "I connect families with Medicaid resources, veteran solutions, elder law attorneys, and financial planning options."
}];


const ServicesSection = () => {
  return (
    <section id="services" className="py-12 bg-[sidebar-primary-foreground] bg-[#ededed]">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16">
          
          <span className="text-sm font-semibold uppercase tracking-widest text-primary mb-3 block">
            What We Provide
          </span>
          <h2 className="text-3xl sm:text-4xl font-heading font-bold text-foreground mb-4">
            Comprehensive Senior Living Guidance
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Every family's situation is different. My services are tailored to guide you through 
            every step of the senior living journey. We partner with communities 
            to provide this at no additional cost to you.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service, index) =>
          <motion.div
            key={service.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="bg-card rounded-xl p-8 shadow-soft hover:shadow-medium transition-shadow group">
            
              <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
                <service.icon className="w-7 h-7 text-primary" />
              </div>
              <h3 className="text-xl font-heading font-semibold text-foreground mb-3">
                {service.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {service.description}
              </p>
            </motion.div>
          )}
        </div>
      </div>
    </section>);

};

export default ServicesSection;