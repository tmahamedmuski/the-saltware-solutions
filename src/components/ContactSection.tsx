import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { Mail, Phone, MapPin, Send } from "lucide-react";

const ContactSection = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <section id="contact" className="py-24" ref={ref}>
      <div className="container mx-auto">
        <div className="grid gap-12 lg:grid-cols-2">
          {/* Info */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-accent">
              Contact Us
            </p>
            <h2 className="font-display text-3xl font-bold text-foreground sm:text-4xl">
              Let's build something{" "}
              <span className="text-gradient">great together</span>
            </h2>
            <p className="mt-4 text-muted-foreground">
              Ready to take your business to the next level? Reach out and let's
              discuss how Saltware can help you achieve your goals.
            </p>

            <div className="mt-10 flex flex-col gap-6">
              {[
                { icon: MapPin, text: "Puttalam, North Western Province, Sri Lanka" },
                { icon: Phone, text: "+94 XX XXX XXXX" },
                { icon: Mail, text: "info@saltware.lk" },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-accent">
                    <item.icon size={18} />
                  </div>
                  <span className="text-sm text-secondary-foreground">{item.text}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Form */}
          <motion.form
            onSubmit={handleSubmit}
            initial={{ opacity: 0, x: 40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="rounded-2xl border border-border bg-card p-8"
          >
            <div className="grid gap-5 sm:grid-cols-2">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-muted-foreground">Name</label>
                <input
                  required
                  type="text"
                  placeholder="Your name"
                  className="rounded-lg border border-border bg-secondary px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-muted-foreground">Email</label>
                <input
                  required
                  type="email"
                  placeholder="you@company.com"
                  className="rounded-lg border border-border bg-secondary px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
            </div>
            <div className="mt-5 flex flex-col gap-1.5">
              <label className="text-xs font-medium text-muted-foreground">Subject</label>
              <input
                required
                type="text"
                placeholder="How can we help?"
                className="rounded-lg border border-border bg-secondary px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
            <div className="mt-5 flex flex-col gap-1.5">
              <label className="text-xs font-medium text-muted-foreground">Message</label>
              <textarea
                required
                rows={4}
                placeholder="Tell us about your project..."
                className="resize-none rounded-lg border border-border bg-secondary px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
            <button
              type="submit"
              className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground transition-shadow hover:shadow-glow"
            >
              {submitted ? "Message Sent!" : <>Send Message <Send size={15} /></>}
            </button>
          </motion.form>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
