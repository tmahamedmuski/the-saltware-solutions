import { motion, useInView } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface Stat {
  id: string;
  value: string;
  label: string;
  sort_order: number;
}

const StatsSection = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [stats, setStats] = useState<Stat[]>([]);

  useEffect(() => {
    supabase.from("stats").select("*").order("sort_order").then(({ data }) => {
      if (data) setStats(data as Stat[]);
    });
  }, []);

  return (
    <section className="py-20" ref={ref}>
      <div className="container mx-auto">
        <div className="rounded-2xl border border-primary/20 bg-gradient-card p-12">
          <div className="grid grid-cols-2 gap-8 lg:grid-cols-4">
            {stats.map((s, i) => (
              <motion.div
                key={s.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={inView ? { opacity: 1, scale: 1 } : {}}
                transition={{ delay: i * 0.1 }}
                className="text-center"
              >
                <p className="font-display text-4xl font-bold text-gradient sm:text-5xl">
                  {s.value}
                </p>
                <p className="mt-2 text-sm text-muted-foreground">{s.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
