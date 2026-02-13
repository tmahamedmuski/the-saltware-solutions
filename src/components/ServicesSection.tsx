import { motion, useInView } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import * as Icons from "lucide-react";

interface Service {
  id: string;
  icon: string;
  title: string;
  description: string;
  sort_order: number;
}

const iconMap: Record<string, any> = {
  Code2: Icons.Code2,
  Cloud: Icons.Cloud,
  Settings: Icons.Settings,
  Headphones: Icons.Headphones,
  BarChart3: Icons.BarChart3,
  Database: Icons.Database,
  Smartphone: Icons.Smartphone,
  ShieldCheck: Icons.ShieldCheck,
  Globe: Icons.Globe,
  Cpu: Icons.Cpu,
  Monitor: Icons.Monitor,
  Wifi: Icons.Wifi,
  Server: Icons.Server,
  Lock: Icons.Lock,
};

const ServicesSection = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [services, setServices] = useState<Service[]>([]);

  useEffect(() => {
    supabase.from("services").select("*").order("sort_order").then(({ data }) => {
      if (data) setServices(data as Service[]);
    });
  }, []);

  return (
    <section id="services" className="py-24" ref={ref}>
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          className="mx-auto mb-16 max-w-2xl text-center"
        >
          <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-accent">
            Solutions & Services
          </p>
          <h2 className="font-display text-3xl font-bold text-foreground sm:text-4xl">
            Comprehensive IT solutions{" "}
            <span className="text-gradient">for every need</span>
          </h2>
          <p className="mt-4 text-muted-foreground">
            From strategic consulting to hands-on support, we deliver end-to-end
            technology services that drive real business results.
          </p>
        </motion.div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {services.map((s, i) => {
            const IconComp = iconMap[s.icon] || Icons.Code2;
            return (
              <motion.div
                key={s.id}
                initial={{ opacity: 0, y: 30 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: i * 0.08 }}
                className="group rounded-xl border border-border bg-card p-6 transition-all duration-300 hover:border-primary/40 hover:shadow-glow"
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-accent transition-colors group-hover:bg-primary/20">
                  <IconComp size={22} />
                </div>
                <h3 className="mb-2 font-display text-base font-semibold text-foreground">
                  {s.title}
                </h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {s.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
