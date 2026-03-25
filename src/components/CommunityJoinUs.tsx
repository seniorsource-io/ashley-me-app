'use client'

import { motion } from "framer-motion";
import { Presentation, Sprout, SendHorizontal, Network} from "lucide-react";

const services = [
{
  icon: SendHorizontal,
  title: "Real-time Communication",
  description:
  "Connect with me instantly via notifications and messaging on new clients and your vancancies."
},
{
  icon: Presentation,
  title: "Training and Events",
  description:
  "Join me for workshops, training on latest trends in senior living, and community events."
},
{
  icon: Network,
  title: "High Performing Network",
  description:
  "Connect with our circle of senior advisors and network of providers dedicated to quality senior care."
},
{
  icon: Sprout,
  title: "Support for Your Business",
  description:
  "Coming soon: Tools, technology, and resources to help support your business and growth."
}];

const JoinUsSection = () => {
  return (
    <section id="join-us" className="py-7 bg-secondary-paper">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8">
          
          <span className="text-lg font-semibold uppercase tracking-widest text-primary mb-3 block">
            Partner with Us
          </span>
          <h2 className="text-3xl sm:text-4xl font-heading font-bold text-foreground mb-0">
            Join Our Provider Community
          </h2>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service, index) =>
          <motion.div
            key={service.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="bg-card-secondary rounded-xl p-8 shadow-lg">
            
              <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-6">
                <service.icon className="w-7 h-7 text-primary" />
              </div>
              <h3 className="text-xl font-heading font-semibold text-foreground mb-3">
                {service.title}
              </h3>
              <p className="text-secondary-foreground leading-relaxed">
                {service.description}
              </p>
            </motion.div>
          )}
        </div>
      </div>
    </section>
    );
};

export default JoinUsSection;