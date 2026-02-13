import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { LogOut, Plus, Pencil, Trash2, Save, X } from "lucide-react";

type Tab = "services" | "employees" | "projects" | "industries" | "stats";

interface ServiceRow { id: string; icon: string; title: string; description: string; sort_order: number; }
interface EmployeeRow { id: string; name: string; position: string; photo_url: string | null; sort_order: number; }
interface ProjectRow { id: string; title: string; description: string; image_url: string | null; link: string | null; sort_order: number; }
interface IndustryRow { id: string; icon: string; title: string; sort_order: number; }
interface StatRow { id: string; value: string; label: string; sort_order: number; }

const AdminDashboard = () => {
  const { user, isAdmin, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>("services");

  useEffect(() => {
    if (!loading && (!user || !isAdmin)) {
      navigate("/admin/access");
    }
  }, [user, isAdmin, loading, navigate]);

  if (loading) return <div className="flex min-h-screen items-center justify-center bg-background text-foreground">Loading...</div>;
  if (!user || !isAdmin) return null;

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="container mx-auto flex items-center justify-between py-4">
          <h1 className="font-display text-xl font-bold text-foreground">Saltware Admin</h1>
          <button onClick={() => { signOut(); navigate("/"); }} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
            <LogOut size={16} /> Sign Out
          </button>
        </div>
      </header>

      <div className="container mx-auto py-8">
        <div className="mb-8 flex flex-wrap gap-2">
          {(["services", "employees", "projects", "industries", "stats"] as Tab[]).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`rounded-lg px-4 py-2 text-sm font-medium capitalize transition-colors ${
                tab === t ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground hover:bg-muted"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {tab === "services" && <ServicesPanel />}
        {tab === "employees" && <EmployeesPanel />}
        {tab === "projects" && <ProjectsPanel />}
        {tab === "industries" && <IndustriesPanel />}
        {tab === "stats" && <StatsPanel />}
      </div>
    </div>
  );
};

// ─── Services ─────────────────────────────────────────
const ServicesPanel = () => {
  const [items, setItems] = useState<ServiceRow[]>([]);
  const [editing, setEditing] = useState<ServiceRow | null>(null);
  const [isNew, setIsNew] = useState(false);

  const fetch = async () => {
    const { data } = await supabase.from("services").select("*").order("sort_order");
    if (data) setItems(data as ServiceRow[]);
  };
  useEffect(() => { fetch(); }, []);

  const save = async () => {
    if (!editing) return;
    if (isNew) {
      await supabase.from("services").insert({ icon: editing.icon, title: editing.title, description: editing.description, sort_order: editing.sort_order });
    } else {
      await supabase.from("services").update({ icon: editing.icon, title: editing.title, description: editing.description, sort_order: editing.sort_order }).eq("id", editing.id);
    }
    setEditing(null);
    setIsNew(false);
    fetch();
  };

  const remove = async (id: string) => {
    await supabase.from("services").delete().eq("id", id);
    fetch();
  };

  return (
    <CrudPanel
      title="Services"
      onAdd={() => { setEditing({ id: "", icon: "Code2", title: "", description: "", sort_order: items.length + 1 }); setIsNew(true); }}
    >
      {editing && (
        <EditCard onSave={save} onCancel={() => { setEditing(null); setIsNew(false); }}>
          <Field label="Icon name" value={editing.icon} onChange={(v) => setEditing({ ...editing, icon: v })} />
          <Field label="Title" value={editing.title} onChange={(v) => setEditing({ ...editing, title: v })} />
          <Field label="Description" value={editing.description} onChange={(v) => setEditing({ ...editing, description: v })} textarea />
          <Field label="Sort order" value={String(editing.sort_order)} onChange={(v) => setEditing({ ...editing, sort_order: Number(v) })} />
        </EditCard>
      )}
      {items.map((s) => (
        <ItemRow key={s.id} label={s.title} sub={s.description} onEdit={() => { setEditing(s); setIsNew(false); }} onDelete={() => remove(s.id)} />
      ))}
    </CrudPanel>
  );
};

// ─── Employees ────────────────────────────────────────
const EmployeesPanel = () => {
  const [items, setItems] = useState<EmployeeRow[]>([]);
  const [editing, setEditing] = useState<EmployeeRow | null>(null);
  const [isNew, setIsNew] = useState(false);

  const fetch = async () => {
    const { data } = await supabase.from("employees").select("*").order("sort_order");
    if (data) setItems(data as EmployeeRow[]);
  };
  useEffect(() => { fetch(); }, []);

  const save = async () => {
    if (!editing) return;
    if (isNew) {
      await supabase.from("employees").insert({ name: editing.name, position: editing.position, photo_url: editing.photo_url, sort_order: editing.sort_order });
    } else {
      await supabase.from("employees").update({ name: editing.name, position: editing.position, photo_url: editing.photo_url, sort_order: editing.sort_order }).eq("id", editing.id);
    }
    setEditing(null);
    setIsNew(false);
    fetch();
  };

  const remove = async (id: string) => {
    await supabase.from("employees").delete().eq("id", id);
    fetch();
  };

  return (
    <CrudPanel
      title="Employees"
      onAdd={() => { setEditing({ id: "", name: "", position: "", photo_url: null, sort_order: items.length + 1 }); setIsNew(true); }}
    >
      {editing && (
        <EditCard onSave={save} onCancel={() => { setEditing(null); setIsNew(false); }}>
          <Field label="Name" value={editing.name} onChange={(v) => setEditing({ ...editing, name: v })} />
          <Field label="Position" value={editing.position} onChange={(v) => setEditing({ ...editing, position: v })} />
          <Field label="Photo URL" value={editing.photo_url || ""} onChange={(v) => setEditing({ ...editing, photo_url: v || null })} />
          <Field label="Sort order" value={String(editing.sort_order)} onChange={(v) => setEditing({ ...editing, sort_order: Number(v) })} />
        </EditCard>
      )}
      {items.map((e) => (
        <ItemRow key={e.id} label={e.name} sub={e.position} onEdit={() => { setEditing(e); setIsNew(false); }} onDelete={() => remove(e.id)} />
      ))}
    </CrudPanel>
  );
};

// ─── Projects ─────────────────────────────────────────
const ProjectsPanel = () => {
  const [items, setItems] = useState<ProjectRow[]>([]);
  const [editing, setEditing] = useState<ProjectRow | null>(null);
  const [isNew, setIsNew] = useState(false);

  const fetch = async () => {
    const { data } = await supabase.from("projects").select("*").order("sort_order");
    if (data) setItems(data as ProjectRow[]);
  };
  useEffect(() => { fetch(); }, []);

  const save = async () => {
    if (!editing) return;
    if (isNew) {
      await supabase.from("projects").insert({ title: editing.title, description: editing.description, image_url: editing.image_url, link: editing.link, sort_order: editing.sort_order });
    } else {
      await supabase.from("projects").update({ title: editing.title, description: editing.description, image_url: editing.image_url, link: editing.link, sort_order: editing.sort_order }).eq("id", editing.id);
    }
    setEditing(null);
    setIsNew(false);
    fetch();
  };

  const remove = async (id: string) => {
    await supabase.from("projects").delete().eq("id", id);
    fetch();
  };

  return (
    <CrudPanel
      title="Projects"
      onAdd={() => { setEditing({ id: "", title: "", description: "", image_url: null, link: null, sort_order: items.length + 1 }); setIsNew(true); }}
    >
      {editing && (
        <EditCard onSave={save} onCancel={() => { setEditing(null); setIsNew(false); }}>
          <Field label="Title" value={editing.title} onChange={(v) => setEditing({ ...editing, title: v })} />
          <Field label="Description" value={editing.description} onChange={(v) => setEditing({ ...editing, description: v })} textarea />
          <Field label="Image URL" value={editing.image_url || ""} onChange={(v) => setEditing({ ...editing, image_url: v || null })} />
          <Field label="Link (optional)" value={editing.link || ""} onChange={(v) => setEditing({ ...editing, link: v || null })} />
          <Field label="Sort order" value={String(editing.sort_order)} onChange={(v) => setEditing({ ...editing, sort_order: Number(v) })} />
        </EditCard>
      )}
      {items.map((p) => (
        <ItemRow key={p.id} label={p.title} sub={p.description} onEdit={() => { setEditing(p); setIsNew(false); }} onDelete={() => remove(p.id)} />
      ))}
    </CrudPanel>
  );
};

// ─── Industries ───────────────────────────────────────
const IndustriesPanel = () => {
  const [items, setItems] = useState<IndustryRow[]>([]);
  const [editing, setEditing] = useState<IndustryRow | null>(null);
  const [isNew, setIsNew] = useState(false);

  const fetch = async () => {
    const { data } = await supabase.from("industries").select("*").order("sort_order");
    if (data) setItems(data as IndustryRow[]);
  };
  useEffect(() => { fetch(); }, []);

  const save = async () => {
    if (!editing) return;
    if (isNew) {
      await supabase.from("industries").insert({ icon: editing.icon, title: editing.title, sort_order: editing.sort_order });
    } else {
      await supabase.from("industries").update({ icon: editing.icon, title: editing.title, sort_order: editing.sort_order }).eq("id", editing.id);
    }
    setEditing(null);
    setIsNew(false);
    fetch();
  };

  const remove = async (id: string) => {
    await supabase.from("industries").delete().eq("id", id);
    fetch();
  };

  return (
    <CrudPanel
      title="Industries"
      onAdd={() => { setEditing({ id: "", icon: "Building2", title: "", sort_order: items.length + 1 }); setIsNew(true); }}
    >
      {editing && (
        <EditCard onSave={save} onCancel={() => { setEditing(null); setIsNew(false); }}>
          <Field label="Icon name" value={editing.icon} onChange={(v) => setEditing({ ...editing, icon: v })} />
          <Field label="Title" value={editing.title} onChange={(v) => setEditing({ ...editing, title: v })} />
          <Field label="Sort order" value={String(editing.sort_order)} onChange={(v) => setEditing({ ...editing, sort_order: Number(v) })} />
        </EditCard>
      )}
      {items.map((ind) => (
        <ItemRow key={ind.id} label={ind.title} sub={`Icon: ${ind.icon}`} onEdit={() => { setEditing(ind); setIsNew(false); }} onDelete={() => remove(ind.id)} />
      ))}
    </CrudPanel>
  );
};

// ─── Stats ────────────────────────────────────────────
const StatsPanel = () => {
  const [items, setItems] = useState<StatRow[]>([]);
  const [editing, setEditing] = useState<StatRow | null>(null);
  const [isNew, setIsNew] = useState(false);

  const fetch = async () => {
    const { data } = await supabase.from("stats").select("*").order("sort_order");
    if (data) setItems(data as StatRow[]);
  };
  useEffect(() => { fetch(); }, []);

  const save = async () => {
    if (!editing) return;
    if (isNew) {
      await supabase.from("stats").insert({ value: editing.value, label: editing.label, sort_order: editing.sort_order });
    } else {
      await supabase.from("stats").update({ value: editing.value, label: editing.label, sort_order: editing.sort_order }).eq("id", editing.id);
    }
    setEditing(null);
    setIsNew(false);
    fetch();
  };

  const remove = async (id: string) => {
    await supabase.from("stats").delete().eq("id", id);
    fetch();
  };

  return (
    <CrudPanel
      title="Stats"
      onAdd={() => { setEditing({ id: "", value: "", label: "", sort_order: items.length + 1 }); setIsNew(true); }}
    >
      {editing && (
        <EditCard onSave={save} onCancel={() => { setEditing(null); setIsNew(false); }}>
          <Field label="Value" value={editing.value} onChange={(v) => setEditing({ ...editing, value: v })} />
          <Field label="Label" value={editing.label} onChange={(v) => setEditing({ ...editing, label: v })} />
          <Field label="Sort order" value={String(editing.sort_order)} onChange={(v) => setEditing({ ...editing, sort_order: Number(v) })} />
        </EditCard>
      )}
      {items.map((s) => (
        <ItemRow key={s.id} label={s.value} sub={s.label} onEdit={() => { setEditing(s); setIsNew(false); }} onDelete={() => remove(s.id)} />
      ))}
    </CrudPanel>
  );
};

// ─── Shared UI ────────────────────────────────────────
const CrudPanel = ({ title, onAdd, children }: { title: string; onAdd: () => void; children: React.ReactNode }) => (
  <div>
    <div className="mb-4 flex items-center justify-between">
      <h2 className="font-display text-lg font-semibold text-foreground">{title}</h2>
      <button onClick={onAdd} className="flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
        <Plus size={16} /> Add
      </button>
    </div>
    <div className="flex flex-col gap-3">{children}</div>
  </div>
);

const EditCard = ({ onSave, onCancel, children }: { onSave: () => void; onCancel: () => void; children: React.ReactNode }) => (
  <div className="mb-4 rounded-xl border border-primary/30 bg-card p-6">
    <div className="grid gap-4 sm:grid-cols-2">{children}</div>
    <div className="mt-4 flex gap-2">
      <button onClick={onSave} className="flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"><Save size={14} /> Save</button>
      <button onClick={onCancel} className="flex items-center gap-1.5 rounded-lg bg-secondary px-4 py-2 text-sm font-medium text-secondary-foreground"><X size={14} /> Cancel</button>
    </div>
  </div>
);

const ItemRow = ({ label, sub, onEdit, onDelete }: { label: string; sub: string; onEdit: () => void; onDelete: () => void }) => (
  <div className="flex items-center justify-between rounded-lg border border-border bg-card px-5 py-4">
    <div>
      <p className="text-sm font-medium text-foreground">{label}</p>
      <p className="text-xs text-muted-foreground line-clamp-1">{sub}</p>
    </div>
    <div className="flex gap-2">
      <button onClick={onEdit} className="rounded-lg p-2 text-muted-foreground hover:bg-secondary hover:text-foreground"><Pencil size={15} /></button>
      <button onClick={onDelete} className="rounded-lg p-2 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"><Trash2 size={15} /></button>
    </div>
  </div>
);

const Field = ({ label, value, onChange, textarea }: { label: string; value: string; onChange: (v: string) => void; textarea?: boolean }) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-xs font-medium text-muted-foreground">{label}</label>
    {textarea ? (
      <textarea value={value} onChange={(e) => onChange(e.target.value)} rows={3} className="resize-none rounded-lg border border-border bg-secondary px-4 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary" />
    ) : (
      <input value={value} onChange={(e) => onChange(e.target.value)} className="rounded-lg border border-border bg-secondary px-4 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary" />
    )}
  </div>
);

export default AdminDashboard;
