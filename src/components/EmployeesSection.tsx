import { motion, useInView } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { User } from "lucide-react";

interface Employee {
  id: string;
  name: string;
  position: string;
  photo_url: string | null;
  sort_order: number;
}

const EmployeesSection = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [employees, setEmployees] = useState<Employee[]>([]);

  useEffect(() => {
    supabase.from("employees").select("*").order("sort_order").then(({ data }) => {
      if (data) setEmployees(data as Employee[]);
    });
  }, []);

  if (employees.length === 0) return null;

  return (
    <section id="team" className="py-24" ref={ref}>
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          className="mx-auto mb-16 max-w-2xl text-center"
        >
          <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-accent">
            Our Team
          </p>
          <h2 className="font-display text-3xl font-bold text-foreground sm:text-4xl">
            Meet the <span className="text-gradient">people behind Saltware</span>
          </h2>
          <p className="mt-4 text-muted-foreground">
            Dedicated professionals committed to delivering excellence.
          </p>
        </motion.div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {employees.map((e, i) => (
            <motion.div
              key={e.id}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.08 }}
              className="flex flex-col items-center text-center"
            >
              <div className="mb-4 h-24 w-24 overflow-hidden rounded-full border-2 border-primary/20 bg-secondary">
                {e.photo_url ? (
                  <img
                    src={e.photo_url}
                    alt={e.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-muted-foreground">
                    <User size={36} />
                  </div>
                )}
              </div>
              <h3 className="font-display font-semibold text-foreground">{e.name}</h3>
              <p className="text-sm text-muted-foreground">{e.position}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default EmployeesSection;
