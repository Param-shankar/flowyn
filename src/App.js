// App.js — Flowyn Landing Page | Struere Aesthetic + Aceternity UI
import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import Lenis from "lenis";
import "./App.css";
import img from './image-removebg-preview.png'
// eslint-disable-next-line no-unused-vars
/* ── Aceternity: Floating particles background ──────────────────── */
function SparkleCanvas() {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let raf;
    const particles = Array.from({ length: 60 }, () => ({
      x: Math.random() * canvas.offsetWidth,
      y: Math.random() * canvas.offsetHeight,
      r: Math.random() * 1.5 + 0.5,
      dx: (Math.random() - 0.5) * 0.3,
      dy: (Math.random() - 0.5) * 0.3,
      alpha: Math.random() * 0.4 + 0.1,
    }));

    const resize = () => {
      canvas.width  = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        p.x += p.dx; p.y += p.dy;
        if (p.x < 0 || p.x > canvas.width)  p.dx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.dy *= -1;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,79,0,${p.alpha})`;
        ctx.fill();
      });
      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize); };
  }, []);
  return (
    <canvas
      ref={canvasRef}
      style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }}
    />
  );
}

/* ── Aceternity: Text Generate Effect ──────────────────────────── */
function AnimatedHeading({ children }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.4 });
  return (
    <motion.h1
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.h1>
  );
}

/* ── Aceternity: Card Spotlight hover effect ───────────────────── */
function SpotlightCard({ children, className = "" }) {
  const cardRef = useRef(null);
  const handleMouseMove = useCallback((e) => {
    const rect = cardRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    cardRef.current.style.setProperty("--mouse-x", x + "%");
    cardRef.current.style.setProperty("--mouse-y", y + "%");
  }, []);
  return (
    <div ref={cardRef} onMouseMove={handleMouseMove} className={className}>
      {children}
    </div>
  );
}

/* ── Aceternity: Scroll-triggered fade-up ─────────────────────── */
function FadeUp({ children, delay = 0, className = "" }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.2 });
  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y: 32 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.65, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}


/* ── Logo SVG ──────────────────────────────────────────────────── */
function FlowynIcon({ size = 16, fill = "white" }) {
  return (
    <div style={{ height: 100, width: 100 }}>
      <img src={img} alt="Flowyn Logo" />
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════ */
/*  MAIN APP                                                       */
/* ═══════════════════════════════════════════════════════════════ */
function App() {
  const [form, setForm] = useState({ name: "", company: "", email: "", warehouseSize: "Under 200", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    // Basic standard scroll listener
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll);

    // Initialize Lenis for premium smooth scrolling
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // smooth easing
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // Intercept anchor links for Lenis to scroll perfectly
    const handleAnchorClick = (e) => {
      const target = e.currentTarget.getAttribute("href");
      if (target && target.startsWith("#")) {
        e.preventDefault();
        lenis.scrollTo(target, { offset: -80 }); // offset for floating header
      }
    };

    const anchors = document.querySelectorAll('a[href^="#"]');
    anchors.forEach((a) => a.addEventListener("click", handleAnchorClick));

    return () => {
      window.removeEventListener("scroll", onScroll);
      anchors.forEach((a) => a.removeEventListener("click", handleAnchorClick));
      lenis.destroy();
    };
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("FLOWYN LEAD:", form);
    setSubmitted(true);
  };

  return (
    <>
     {/* ── Floating Pill Navbar ── */}
      <header className="fy-header">
        <motion.div
          className="fy-nav-inner"
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          style={scrolled ? { boxShadow: "0 8px 32px rgba(0,0,0,0.10)" } : {}}
        >
          <div className="fy-logo">
            <div className="fy-logo-icon"></div>
          </div>
          <nav className="fy-nav-links">
            <a href="#how">How it works</a>
            <a href="#why">Why Flowyn</a>
            <a href="#contact" className="fy-nav-cta">Request early access</a>
          </nav>
        </motion.div>
      </header>
    <div className="flowyn-page">

      {/* ── Announcement Banner ──
      <div className="fy-banner">
        <div className="fy-container">
          <span className="fy-banner-dot" />
          Soft Launch: India SMB Warehouses — Request early access today
        </div>
      </div> */}

      <main>

        {/* ── HERO ── */}
        <section className="fy-hero">
          <SparkleCanvas />
          <div className="fy-container" style={{ position: "relative", zIndex: 1 }}>

            <motion.div
              className="fy-hero-badge"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <span className="fy-hero-badge-dot" />
              Soft Launch · India SMB Warehouses
            </motion.div>

            <AnimatedHeading>
              Make warehouse workflow
              <br />
              <span className="fy-highlight">seamless.</span>
            </AnimatedHeading>

            <motion.p
              className="fy-hero-desc"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.25 }}
            >
              Flowyn is a light operations platform that models your warehouse workflows
              exactly — organize inventory, define picking logic, and automate dispatch
              decisions without forcing your team into rigid WMS constraints.
            </motion.p>

            <motion.a
              href="#contact"
              className="fy-hero-cta"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.35 }}
              style={{ display: "inline-flex" }}
            >
              Get early access
              <span className="fy-hero-cta-arrow">→</span>
            </motion.a>

            {/* Dashboard Preview — CardSpotlight */}
            <FadeUp delay={0.2}>
              <SpotlightCard className="fy-dashboard-preview" style={{ marginTop: "72px" }}>
                <div className="fy-preview-header">
                  <p>Warehouse Operations Live</p>
                  <span>847 SKUs · g23 bays</span>
                </div>
                <div className="fy-metrics">
                  {[
                    { label: "Active Orders", value: "1,847", change: "+8.1% vs yesterday" },
                    { label: "Fill Rate",     value: "98.7%", change: "+0.4% vs yesterday" },
                    { label: "Avg. Dispatch", value: "2h 14m", change: "−12m vs yesterday" },
                  ].map((m) => (
                    <div className="fy-metric" key={m.label}>
                      <div className="fy-metric-label">{m.label}</div>
                      <div className="fy-metric-value">{m.value}</div>
                      <span className="fy-metric-change">{m.change}</span>
                    </div>
                  ))}
                </div>
                <div className="fy-recent-orders">
                  <div className="fy-orders-header">
                    <span>Recent Dispatch</span>
                    <span>847 records</span>
                  </div>
                  <table className="fy-orders-table">
                    <thead>
                      <tr>
                        <th>Order ID</th>
                        <th>Customer</th>
                        <th>Items</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { id: "ORD-2847", cust: "Acme Retail",  items: 42, status: "Dispatched", cls: "dispatched" },
                        { id: "ORD-2846", cust: "TechFlow Inc", items: 18, status: "Packed",     cls: "packed"     },
                        { id: "ORD-2845", cust: "DataMart Ltd", items: 67, status: "Picking",    cls: "picking"    },
                      ].map((row) => (
                        <tr key={row.id}>
                          <td style={{ fontFamily: "monospace", fontWeight: 600 }}>{row.id}</td>
                          <td>{row.cust}</td>
                          <td>{row.items}</td>
                          <td><span className={`fy-status-badge ${row.cls}`}>{row.status}</span></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </SpotlightCard>
            </FadeUp>
          </div>
        </section>

        {/* ── CORE FUNCTIONS — HoverEffect Cards ── */}
        <section className="fy-core" id="why">
          <div className="fy-container">
            <FadeUp>
              <div className="fy-section-label">Core capabilities</div>
              <h2 className="fy-section-title">Every warehouse performs<br />four core functions.</h2>
              <p className="fy-section-desc">
                Flowyn strengthens and automates the fundamental operations every SMB warehouse already performs.
              </p>
            </FadeUp>

            <div className="fy-functions">
              {[
                { num: "01", icon: "📦", title: "Inventory Organization",  desc: "Structure SKUs, locations, and stock levels with clear relationships and real-time accuracy." },
                { num: "02", icon: "⚙️", title: "Workflow Logic",          desc: "Create, update, and route picking/packing tasks dynamically — without breaking your daily flow." },
                { num: "03", icon: "🔍", title: "Operations Visibility",   desc: "Search, filter, and track every order and bay instantly across all shifts." },
                { num: "04", icon: "🚀", title: "Smart Dispatch",          desc: "Detect bottlenecks, surface exceptions, and recommend actions using warehouse intelligence." },
              ].map((fn, i) => (
                <FadeUp key={fn.num} delay={i * 0.08}>
                  <div className="fy-function">
                    <div className="fy-fn-top">
                      <div className="fy-fn-icon">{fn.icon}</div>
                      <span className="fy-fn-num">{fn.num}</span>
                    </div>
                    <h3>{fn.title}</h3>
                    <p>{fn.desc}</p>
                  </div>
                </FadeUp>
              ))}
            </div>
          </div>
        </section>

        {/* ── THE REALITY — BackgroundGradient comparison ── */}
        <section className="fy-reality">
          <div className="fy-container">
            <FadeUp>
              <div className="fy-section-label">The reality</div>
              <div className="fy-reality-intro">
                <h2 className="fy-section-title">Most warehouses are running<br />on patched-together tools.</h2>
                <p>
                  Every SMB warehouse has processes no off-the-shelf WMS quite fits.
                  Teams end up patching together spreadsheets, WhatsApp groups, and basic ERPs —
                  because no tool was built for their exact workflow.
                </p>
              </div>
            </FadeUp>

            <div className="fy-comparison">
              <FadeUp delay={0}>
                <div className="fy-compare-card bad">
                  <h3>Rigid WMS</h3>
                  <ul className="fy-compare-list">
                    {[
                      "Enterprise pricing for SMB needs",
                      "You adapt to their workflows",
                      "Months of implementation",
                      "IT team required",
                    ].map((item) => (
                      <li key={item}>
                        <span className="fy-check-icon">✕</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </FadeUp>
              <FadeUp delay={0.12}>
                <div className="fy-compare-card good">
                  <h3>Flowyn</h3>
                  <ul className="fy-compare-list">
                    {[
                      "Built for SMB / SME warehouses",
                      "Your workflows, your rules",
                      "Live in days, not months",
                      "Floor team first — no IT required",
                    ].map((item) => (
                      <li key={item}>
                        <span className="fy-check-icon">✓</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </FadeUp>
            </div>
          </div>
        </section>

        {/* ── HOW IT WORKS ── */}
        <section className="fy-how" id="how">
          <div className="fy-container">
            <FadeUp>
              <div className="fy-section-label">How it works</div>
              <h2 className="fy-section-title">Bring your data. Define your logic.<br />Let it run.</h2>
            </FadeUp>

            {/* Dashed connector */}
            <div className="fy-how-connector" style={{ marginTop: 40 }}>
              <div className="fy-how-connector-dot" />
              <div className="fy-how-connector-line" />
              <div className="fy-how-connector-dot" />
              <div className="fy-how-connector-line" />
              <div className="fy-how-connector-dot" />
            </div>

            <div className="fy-how-grid">
              {[
                {
                  n: "01",
                  title: "Bring your data",
                  desc: "Import from Excel, your order system, or create records directly. Flowyn infers your warehouse structure automatically.",
                },
                {
                  n: "02",
                  title: "Define your logic",
                  desc: "Map your picking, packing, and dispatch rules in a centralized engine that runs consistently across all shifts.",
                },
                {
                  n: "03",
                  title: "Let it run",
                  desc: "Flowyn monitors bays, routes tasks, flags exceptions, and keeps operations running — without manual intervention.",
                },
              ].map((step, i) => (
                <FadeUp key={step.n} delay={i * 0.1}>
                  <div className="fy-how-step">
                    <div className="fy-how-step-num">{step.n}</div>
                    <h3>{step.title}</h3>
                    <p>{step.desc}</p>
                  </div>
                </FadeUp>
              ))}
            </div>

            {/* Automation block — dark terminal card */}
            <FadeUp delay={0.1}>
              <div className="fy-automation">
                <div>
                  <div className="fy-auto-label">Automation example</div>
                  <h3>Turn conditions<br />into actions</h3>
                  <p>No code required</p>
                </div>
                <div className="fy-auto-code">
                  <div className="fy-auto-line">
                    <span className="fy-auto-key">Trigger:</span>
                    <span className="fy-auto-val">Bay occupancy &gt; 85%</span>
                  </div>
                  <div className="fy-auto-line">
                    <span className="fy-auto-key">Condition:</span>
                    <span className="fy-auto-val">Orders pending &gt; 50</span>
                  </div>
                  <div className="fy-auto-line">
                    <span className="fy-auto-key">Action:</span>
                    <span className="fy-auto-val">Notify supervisor + reroute pickers</span>
                  </div>
                </div>
              </div>
            </FadeUp>
          </div>
        </section>

        {/* ── CONTACT ── */}
        <section className="fy-contact" id="contact">
          <div className="fy-container">
            <FadeUp>
              <div className="fy-section-label">Early access</div>
              <h2 className="fy-section-title">Request early access</h2>
              <p className="fy-section-desc">
                Limited soft-launch for SMB / SME warehouses in India. Join the waitlist for
                preferred pricing and priority onboarding.
              </p>
            </FadeUp>

            <FadeUp delay={0.1}>
              <div className="fy-form">
                <AnimatePresence mode="wait">
                  {submitted ? (
                    <motion.div
                      key="success"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      style={{ textAlign: "center", padding: "40px 0" }}
                    >
                      <div style={{ fontSize: 48, marginBottom: 16 }}>✅</div>
                      <h3 style={{ fontSize: 22, fontWeight: 800, marginBottom: 8 }}>You're on the list!</h3>
                      <p style={{ color: "var(--text-muted)" }}>
                        We'll reach out shortly with next steps and early-access pricing.
                      </p>
                    </motion.div>
                  ) : (
                    <motion.form key="form" onSubmit={handleSubmit}>
                      <div className="fy-form-row">
                        <div className="fy-form-field">
                          <label>Your Name *</label>
                          <input type="text" name="name" required value={form.name} onChange={handleChange} placeholder="Rahul Sharma" />
                        </div>
                        <div className="fy-form-field">
                          <label>Warehouse / Company *</label>
                          <input type="text" name="company" required value={form.company} onChange={handleChange} placeholder="Sharma Logistics Pvt. Ltd." />
                        </div>
                      </div>
                      <div className="fy-form-field">
                        <label>Work Email *</label>
                        <input type="email" name="email" required value={form.email} onChange={handleChange} placeholder="rahul@company.com" />
                      </div>
                      <div className="fy-form-row">
                        <div className="fy-form-field">
                          <label>Orders processed per day</label>
                          <select name="warehouseSize" value={form.warehouseSize} onChange={handleChange}>
                            <option>Under 200</option>
                            <option>200–1,000</option>
                            <option>1,000–5,000</option>
                            <option>5,000+</option>
                          </select>
                        </div>
                        <div className="fy-form-field">
                          <label>Biggest challenge right now</label>
                          <input type="text" name="message" value={form.message} onChange={handleChange} placeholder="Dispatch delays, stock accuracy…" />
                        </div>
                      </div>
                      <button type="submit" className="fy-submit">
                        Join the soft launch →
                      </button>
                    </motion.form>
                  )}
                </AnimatePresence>
              </div>
            </FadeUp>
          </div>
        </section>
      </main>

      {/* ── FOOTER ── */}
      <footer className="fy-footer">
        <div className="fy-footer-logo">
          <div className="fy-footer-icon"><FlowynIcon size={14} /></div>
          Flowyn
        </div>
        <p>Warehouse workflows, made seamless.</p>
        <p>Serving SMB / SME warehouses · Soft launch 2026</p>
      </footer>
      </div>
    </>
  );
}

export default App;
