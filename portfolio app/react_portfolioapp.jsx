import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Drop this component into a CRA/Vite project and render <PortfolioApp /> in App.jsx.
// Tailwind is assumed (per course template), but you can swap classes for plain CSS.
// Meets rubric: external+internal header links, smooth scroll, landing with avatar+bio,
// projects 2×2 grid of cards, contact form with validation, hide/show header on scroll with animation.

export default function PortfolioApp() {
  // --- Hide/Show header on scroll direction ---
  const [showHeader, setShowHeader] = useState(true);
  const lastY = useRef(0);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      const goingDown = y > lastY.current && y > 8;
      setShowHeader(!goingDown);
      lastY.current = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // --- Smooth scroll for internal anchors ---
  useEffect(() => {
    document.documentElement.style.scrollBehavior = "smooth";
    return () => (document.documentElement.style.scrollBehavior = "auto");
  }, []);

  // --- Contact form business logic ---
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState<null | { ok: boolean; msg: string }>(null);

  const emailOk = useMemo(() => /.+@.+\..+/.test(form.email), [form.email]);
  const canSubmit = form.name.trim() && emailOk && form.message.trim() && !submitting;

  const submit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!canSubmit) return;
    setSubmitting(true);
    setStatus(null);
    // Simulate API; replace with your endpoint
    await new Promise((r) => setTimeout(r, 700));
    setSubmitting(false);
    setStatus({ ok: true, msg: "Thanks! I’ll be in touch soon." });
    setForm({ name: "", email: "", message: "" });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-amber-300 selection:text-slate-900">
      {/* Animated Header */}
      <AnimatePresence initial={false}>
        {showHeader && (
          <motion.header
            initial={{ y: -80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -80, opacity: 0 }}
            transition={{ type: "spring", stiffness: 500, damping: 40 }}
            className="fixed inset-x-0 top-0 z-50 bg-slate-900/80 backdrop-blur border-b border-white/10"
          >
            <div className="mx-auto w-[min(1100px,92%)] flex items-center justify-between py-3">
              <a href="#home" className="font-extrabold tracking-tight text-xl">becc.dev</a>
              <nav aria-label="Primary" className="flex items-center gap-4">
                {/* Internal links */}
                <a className="navlink" href="#projects">Projects</a>
                <a className="navlink" href="#contact">Contact</a>
                {/* External links */}
                <a className="navlink" href="https://github.com/yourhandle" target="_blank" rel="noreferrer noopener" aria-label="GitHub">GitHub ↗</a>
                <a className="navlink" href="https://www.linkedin.com/in/yourhandle" target="_blank" rel="noreferrer noopener" aria-label="LinkedIn">LinkedIn ↗</a>
              </nav>
            </div>
          </motion.header>
        )}
      </AnimatePresence>

      <main id="home" className="mx-auto w-[min(1100px,92%)] pt-24">
        {/* Landing section */}
        <section className="grid grid-cols-1 md:grid-cols-[160px_1fr] gap-6 md:gap-8 items-center py-10 md:py-16">
          <img
            src="https://avatars.githubusercontent.com/u/9919?v=4"
            alt="Avatar"
            className="size-40 rounded-2xl object-cover border border-white/10 shadow-2xl"
          />
          <div>
            <h1 className="text-4xl md:text-5xl font-extrabold leading-tight">Becca Borsikova</h1>
            <p className="mt-3 text-slate-300 max-w-prose">
              Data‑science student turned front‑end tinkerer. I blend clean interfaces with
              curious analytics. Currently exploring React, data viz, and tiny fun tools.
            </p>
            <div className="mt-4 flex gap-3">
              <a href="#projects" className="btn">See Projects</a>
              <a href="#contact" className="btn btn-ghost">Contact Me</a>
            </div>
          </div>
        </section>

        {/* Projects 2×2 grid */}
        <section id="projects" className="py-8 md:py-12">
          <h2 className="text-3xl font-bold">Featured Projects</h2>
          <p className="text-slate-400 mb-5">Four quick peeks; click cards for details.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
            {PROJECTS.map((p) => (
              <article key={p.id} className="card group">
                <img src={p.img} alt="" className="rounded-xl" />
                <div className="mt-3">
                  <h3 className="text-xl font-semibold group-hover:text-amber-300 transition-colors">{p.title}</h3>
                  <p className="text-slate-400 text-sm mt-1">{p.desc}</p>
                </div>
                <div className="mt-4 flex gap-2">
                  {p.tags.map((t) => (
                    <span key={t} className="tag">{t}</span>
                  ))}
                </div>
                <div className="mt-4 flex gap-3">
                  <a href={p.demo} target="_blank" rel="noreferrer noopener" className="text-link">Live</a>
                  <a href={p.code} target="_blank" rel="noreferrer noopener" className="text-link">Code</a>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* Contact form */}
        <section id="contact" className="py-10 md:py-14">
          <h2 className="text-3xl font-bold">Contact Me</h2>
          <p className="text-slate-400 mb-4">Reach out for collaborations, internships, or coffee chats.</p>
          <form onSubmit={submit} className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6 max-w-3xl">
            <div className="sm:col-span-1">
              <label className="label" htmlFor="name">Name</label>
              <input id="name" className="input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
            </div>
            <div className="sm:col-span-1">
              <label className="label" htmlFor="email">Email</label>
              <input id="email" type="email" className={`input ${form.email && !emailOk ? "ring-2 ring-rose-500" : ""}`} value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
              {form.email && !emailOk && <p className="text-rose-400 text-xs mt-1">Please enter a valid email.</p>}
            </div>
            <div className="sm:col-span-2">
              <label className="label" htmlFor="message">Message</label>
              <textarea id="message" rows={5} className="input resize-y" value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} required />
            </div>
            <div className="sm:col-span-2 flex items-center gap-3">
              <button type="submit" className="btn" disabled={!canSubmit} aria-busy={submitting}>
                {submitting ? "Sending…" : "Send message"}
              </button>
              {status && (
                <span className={`text-sm ${status.ok ? "text-emerald-400" : "text-rose-400"}`}>{status.msg}</span>
              )}
            </div>
          </form>
        </section>

        <footer className="py-10 text-sm text-slate-400 border-t border-white/10">
          <p>© {new Date().getFullYear()} Becca Borsikova. Built with React.</p>
        </footer>
      </main>

      {/* Styles — Tailwind utility shortcuts */}
      <style>{`
        .navlink{padding:.4rem .7rem;border-radius:999px;border:1px solid transparent}
        .navlink:hover{background:rgba(255,255,255,.06);}
        .btn{background:#f59e0b;color:#111;padding:.6rem 1rem;border-radius:.8rem;font-weight:800;box-shadow:0 10px 25px rgba(0,0,0,.25);transition:transform .15s}
        .btn:hover{transform:translateY(-1px)}
        .btn:disabled{opacity:.5;cursor:not-allowed}
        .btn-ghost{background:transparent;color:#fde68a;border:1px solid #f59e0b}
        .card{background:linear-gradient(180deg,rgba(255,255,255,.06),rgba(255,255,255,.02));border:1px solid rgba(255,255,255,.08);padding:1rem;border-radius:1rem;box-shadow:0 10px 30px rgba(0,0,0,.25)}
        .text-link{color:#a5b4fc;border-bottom:1px dashed currentColor;text-decoration:none}
        .text-link:hover{color:#f59e0b}
        .tag{font-size:.75rem;color:#d1d5db;background:#0f172a;border:1px solid rgba(255,255,255,.1);padding:.2rem .5rem;border-radius:.5rem}
        .label{display:block;font-size:.85rem;margin-bottom:.35rem;color:#cbd5e1}
        .input{width:100%;background:#0b1220;border:1px solid rgba(255,255,255,.1);padding:.6rem .75rem;border-radius:.7rem;color:#e2e8f0;outline:none}
        .input:focus{border-color:#f59e0b;box-shadow:0 0 0 2px rgba(245,158,11,.4)}
      `}</style>
    </div>
  );
}

const PROJECTS = [
  {
    id: 1,
    title: "Study Planner",
    desc: "A tiny PWA that schedules spaced-repetition sessions.",
    tags: ["React", "PWA", "Hooks"],
    img: "https://picsum.photos/seed/study/640/360",
    demo: "https://example.com/demo1",
    code: "https://github.com/yourhandle/demo1",
  },
  {
    id: 2,
    title: "Coffee Finder",
    desc: "Map-based app for cafés with lactose-free options.",
    tags: ["React", "Leaflet"],
    img: "https://picsum.photos/seed/coffee/640/360",
    demo: "https://example.com/demo2",
    code: "https://github.com/yourhandle/demo2",
  },
  {
    id: 3,
    title: "Workout Log",
    desc: "Track progressive overload with pretty charts.",
    tags: ["Recharts", "Context"],
    img: "https://picsum.photos/seed/workout/640/360",
    demo: "https://example.com/demo3",
    code: "https://github.com/yourhandle/demo3",
  },
  {
    id: 4,
    title: "Data Viz Bits",
    desc: "Mini visualizations of curious datasets.",
    tags: ["D3", "Vite"],
    img: "https://picsum.photos/seed/viz/640/360",
    demo: "https://example.com/demo4",
    code: "https://github.com/yourhandle/demo4",
  },
];
