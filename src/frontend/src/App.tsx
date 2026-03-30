import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Slider } from "@/components/ui/slider";
import {
  Activity,
  BarChart3,
  BookOpen,
  Building2,
  Calculator,
  Check,
  ChevronRight,
  ClipboardList,
  Factory,
  FileText,
  FlaskConical,
  Globe,
  Home,
  Landmark,
  Lock,
  MapPin,
  Menu,
  Mic,
  Monitor,
  Pill,
  Play,
  Scale,
  Shield,
  Sprout,
  Stethoscope,
  Truck,
  Users,
  Utensils,
  X,
  Zap,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import gsap from "./gsap-shim";
import { ScrollTrigger } from "./gsap-shim";

gsap.registerPlugin(ScrollTrigger);

// ─── Reusable scroll reveal hook ─────────────────────────────────────────────
function useReveal(selector: string) {
  useEffect(() => {
    const els = document.querySelectorAll<HTMLElement>(selector);
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.12 },
    );
    for (const el of els) observer.observe(el);
    return () => observer.disconnect();
  }, [selector]);
}

// ─── Smoky Black Canvas ───────────────────────────────────────────────────────
function WaveCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let t = 0;

    type Particle = {
      x: number;
      y: number;
      r: number;
      alpha: number;
      vx: number;
      vy: number;
      vr: number;
      phase: number;
    };

    const W = () => canvas.width;
    const H = () => canvas.height;

    const particles: Particle[] = Array.from({ length: 80 }, (_, _i) => ({
      x: Math.random() * (canvas.offsetWidth || 1200),
      y: Math.random() * (canvas.offsetHeight || 800),
      r: 30 + Math.random() * 80,
      alpha: 0.03 + Math.random() * 0.05,
      vx: (Math.random() - 0.5) * 0.25,
      vy: -(0.15 + Math.random() * 0.35),
      vr: 0.08 + Math.random() * 0.12,
      phase: Math.random() * Math.PI * 2,
    }));

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const draw = () => {
      ctx.clearRect(0, 0, W(), H());
      ctx.fillStyle = "#000000";
      ctx.fillRect(0, 0, W(), H());

      for (const p of particles) {
        const drift = Math.sin(t * 0.4 + p.phase) * 0.6;
        p.x += p.vx + drift;
        p.y += p.vy;
        p.r += p.vr;

        const lifeRatio = 1 - p.y / H();
        const fadeAlpha = p.alpha * Math.min(1, lifeRatio * 3);

        const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r);
        grad.addColorStop(0, `rgba(180,180,180,${fadeAlpha})`);
        grad.addColorStop(0.5, `rgba(120,120,120,${fadeAlpha * 0.5})`);
        grad.addColorStop(1, "rgba(80,80,80,0)");
        ctx.beginPath();
        ctx.fillStyle = grad;
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();

        if (p.y + p.r < 0 || p.r > 200) {
          p.x = Math.random() * W();
          p.y = H() + 50;
          p.r = 30 + Math.random() * 60;
          p.alpha = 0.03 + Math.random() * 0.05;
          p.vx = (Math.random() - 0.5) * 0.25;
          p.vy = -(0.15 + Math.random() * 0.35);
          p.vr = 0.08 + Math.random() * 0.12;
          p.phase = Math.random() * Math.PI * 2;
        }
      }

      t += 0.012;
      animId = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(animId);
      ro.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
    />
  );
}

// ─── Laptop Scroll Section ────────────────────────────────────────────────────
function LaptopScrollSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const el = containerRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const total = Math.max(1, el.offsetHeight - window.innerHeight);
      const scrolled = -rect.top;
      const p = Math.max(0, Math.min(1, scrolled / total));
      setProgress(p);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // phase1: 0→1 during first half of scroll (laptop rises in)
  // phase2: 0→1 during second half of scroll (laptop fades out)
  const phase1 = Math.min(1, progress / 0.5);
  const phase2 = progress > 0.5 ? (progress - 0.5) / 0.5 : 0;
  const translateY = (1 - phase1) * 200; // rises from 200px below
  const opacity = 1 - phase2;

  return (
    <div
      ref={containerRef}
      style={{ minHeight: "280vh", background: "#000", position: "relative" }}
    >
      {/* Sticky viewport */}
      <div
        style={{
          position: "sticky",
          top: 0,
          height: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#000",
          overflow: "hidden",
        }}
      >
        {/* Smoky radial background */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(ellipse 70% 60% at 50% 60%, rgba(0,255,156,0.08) 0%, rgba(0,80,40,0.04) 50%, transparent 100%)",
            pointerEvents: "none",
          }}
        />
        <SmokeCanvas />

        <p
          style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            color: "rgba(255,255,255,0.92)",
            fontSize: "clamp(1.4rem, 3vw, 2.4rem)",
            fontWeight: 600,
            letterSpacing: "0.02em",
            marginBottom: "2.5rem",
            textAlign: "center",
            position: "relative",
            zIndex: 2,
            opacity: phase1 > 0.1 ? 1 : 0,
            transition: "opacity 0.4s ease",
          }}
        >
          See it in action
        </p>

        {/* Laptop wrapper — rises from below and fades out */}
        <div
          style={{
            opacity,
            transform: `translateY(${translateY}px)`,
            transition: "none",
            position: "relative",
            zIndex: 3,
            width: "min(640px, 92vw)",
          }}
        >
          {/* ── Screen (lid) ── */}
          <div
            style={{
              width: "100%",
              background: "linear-gradient(160deg, #1c1c1e 0%, #111 100%)",
              borderRadius: "12px 12px 0 0",
              border: "2px solid #2e2e2e",
              borderBottom: "none",
              boxShadow:
                "0 -4px 40px rgba(0,255,156,0.07), 0 0 0 1px rgba(255,255,255,0.04)",
              padding: "10px 10px 0 10px",
              position: "relative",
            }}
          >
            {/* Notch / camera */}
            <div
              style={{
                width: "100%",
                display: "flex",
                justifyContent: "center",
                paddingBottom: 6,
              }}
            >
              <div
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  background: "#2a2a2c",
                  border: "1px solid #3a3a3a",
                }}
              />
            </div>
            {/* Screen bezel */}
            <div
              style={{
                background: "#0a0a0a",
                borderRadius: 6,
                overflow: "hidden",
                aspectRatio: "16/10",
                position: "relative",
                border: "1px solid #222",
              }}
            >
              {/* Screen content — mini landing page preview */}
              <div
                style={{
                  width: "100%",
                  height: "100%",
                  background:
                    "linear-gradient(160deg, #0B0B0B 0%, #0a1a10 100%)",
                  display: "flex",
                  flexDirection: "column",
                  overflow: "hidden",
                  fontFamily: "'Playfair Display', Georgia, serif",
                }}
              >
                {/* Mini navbar */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "6px 12px",
                    background: "rgba(0,0,0,0.7)",
                    borderBottom: "1px solid rgba(0,255,156,0.15)",
                    flexShrink: 0,
                  }}
                >
                  <span
                    style={{
                      color: "#00FF9C",
                      fontSize: 10,
                      fontWeight: 700,
                      letterSpacing: 1,
                    }}
                  >
                    AI GIJIROKU
                  </span>
                  <div style={{ display: "flex", gap: 8 }}>
                    {["Scene", "App", "Price", "Blog"].map((l) => (
                      <span
                        key={l}
                        style={{ color: "rgba(255,255,255,0.5)", fontSize: 7 }}
                      >
                        {l}
                      </span>
                    ))}
                  </div>
                  <span
                    style={{
                      background: "#00FF9C",
                      color: "#000",
                      fontSize: 7,
                      padding: "2px 6px",
                      borderRadius: 3,
                      fontWeight: 700,
                    }}
                  >
                    Try Free
                  </span>
                </div>
                {/* Mini hero */}
                <div
                  style={{
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "10px 16px",
                    gap: 8,
                    background:
                      "radial-gradient(ellipse 80% 60% at 50% 40%, rgba(0,255,156,0.06) 0%, transparent 70%)",
                  }}
                >
                  <div
                    style={{
                      color: "rgba(0,255,156,0.8)",
                      fontSize: 8,
                      letterSpacing: 2,
                      textTransform: "uppercase",
                      border: "1px solid rgba(0,255,156,0.3)",
                      padding: "2px 8px",
                      borderRadius: 20,
                    }}
                  >
                    AI Meeting Assistant
                  </div>
                  <div
                    style={{
                      color: "#fff",
                      fontSize: "clamp(10px, 2vw, 14px)",
                      fontWeight: 700,
                      textAlign: "center",
                      lineHeight: 1.3,
                    }}
                  >
                    Transform Your Meetings
                    <br />
                    <span style={{ color: "#00FF9C" }}>
                      with AI Intelligence
                    </span>
                  </div>
                  <div
                    style={{
                      color: "rgba(255,255,255,0.5)",
                      fontSize: 7,
                      textAlign: "center",
                    }}
                  >
                    Automatic transcription · Real-time summaries · Action items
                  </div>
                  <div style={{ display: "flex", gap: 6, marginTop: 4 }}>
                    <div
                      style={{
                        background: "#00FF9C",
                        color: "#000",
                        fontSize: 7,
                        padding: "3px 10px",
                        borderRadius: 3,
                        fontWeight: 700,
                      }}
                    >
                      Start Free Trial
                    </div>
                    <div
                      style={{
                        border: "1px solid rgba(255,255,255,0.3)",
                        color: "#fff",
                        fontSize: 7,
                        padding: "3px 10px",
                        borderRadius: 3,
                      }}
                    >
                      Watch Demo
                    </div>
                  </div>
                  {/* Waveform decoration */}
                  <svg
                    width="80"
                    height="20"
                    viewBox="0 0 80 20"
                    style={{ opacity: 0.4, marginTop: 4 }}
                    aria-label="Waveform"
                    role="img"
                  >
                    {[
                      4, 6, 12, 8, 16, 10, 14, 6, 8, 12, 10, 6, 14, 8, 12, 6,
                      10, 14, 8, 6,
                    ].map((h, i) => (
                      <rect
                        key={`wave-${i}-${h}`}
                        x={i * 4}
                        y={(20 - h) / 2}
                        width={2}
                        height={h}
                        rx={1}
                        fill="#00FF9C"
                      />
                    ))}
                  </svg>
                </div>
              </div>
              {/* Screen glare overlay */}
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background:
                    "linear-gradient(135deg, rgba(255,255,255,0.04) 0%, transparent 50%)",
                  pointerEvents: "none",
                }}
              />
            </div>
          </div>

          {/* ── Base / keyboard ── */}
          <div
            style={{
              width: "100%",
              background: "linear-gradient(180deg, #2a2a2c 0%, #1c1c1e 100%)",
              borderRadius: "0 0 10px 10px",
              border: "2px solid #2e2e2e",
              borderTop: "1px solid #3a3a3a",
              padding: "8px 10px 6px",
              boxShadow:
                "0 20px 60px rgba(0,0,0,0.9), 0 8px 20px rgba(0,0,0,0.7)",
            }}
          >
            {/* Keyboard rows */}
            {[14, 13, 12, 11].map((keys, _row) => (
              <div
                key={`row-${keys}`}
                style={{
                  display: "flex",
                  gap: "2px",
                  justifyContent: "center",
                  marginBottom: 2,
                }}
              >
                {Array.from({ length: keys }, (_, i) => `k-${keys}-${i}`).map(
                  (keyId) => (
                    <div
                      key={keyId}
                      style={{
                        flex: 1,
                        height: "8px",
                        maxWidth: "30px",
                        background:
                          "linear-gradient(180deg, #3a3a3c 0%, #2c2c2e 100%)",
                        borderRadius: 2,
                        border: "1px solid #1a1a1a",
                      }}
                    />
                  ),
                )}
              </div>
            ))}
            {/* Touchpad */}
            <div
              style={{
                width: "28%",
                height: 14,
                background: "linear-gradient(180deg, #252527 0%, #1e1e20 100%)",
                margin: "4px auto 0",
                borderRadius: 4,
                border: "1px solid #333",
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Smoke Canvas ─────────────────────────────────────────────────────────────
function SmokeCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    const particles: {
      x: number;
      y: number;
      r: number;
      vx: number;
      vy: number;
      alpha: number;
      da: number;
    }[] = [];
    for (let i = 0; i < 60; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: 60 + Math.random() * 100,
        vx: (Math.random() - 0.5) * 0.3,
        vy: -0.2 - Math.random() * 0.3,
        alpha: 0.02 + Math.random() * 0.05,
        da: (Math.random() - 0.5) * 0.001,
      });
    }

    let raf: number;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (const p of particles) {
        const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r);
        grad.addColorStop(0, `rgba(0,255,156,${p.alpha})`);
        grad.addColorStop(1, "rgba(0,0,0,0)");
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
        p.x += p.vx;
        p.y += p.vy;
        p.alpha += p.da;
        if (p.alpha < 0.01) p.da = Math.abs(p.da);
        if (p.alpha > 0.08) p.da = -Math.abs(p.da);
        if (p.y + p.r < 0) p.y = canvas.height + p.r;
        if (p.x < -p.r) p.x = canvas.width + p.r;
        if (p.x > canvas.width + p.r) p.x = -p.r;
      }
      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        zIndex: 1,
      }}
    />
  );
}
// ─── Navbar ───────────────────────────────────────────────────────────────────
const navLinks = [
  { label: "Use Scene", href: "#features" },
  { label: "Mobile App", href: "#mobile" },
  { label: "Functions/Price", href: "#pricing" },
  { label: "Partners", href: "#partners" },
  { label: "Blog", href: "#blog" },
  { label: "Support", href: "#support" },
];

function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const logoRef = useRef<HTMLDivElement>(null);
  const linksRef = useRef<HTMLUListElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const tl = gsap.timeline({ delay: 0.3 });
    if (logoRef.current) {
      tl.from(logoRef.current, {
        opacity: 0,
        x: -30,
        duration: 0.7,
        ease: "power3.out",
      });
    }
    if (linksRef.current) {
      tl.from(
        linksRef.current.querySelectorAll("li"),
        {
          opacity: 0,
          y: -14,
          duration: 0.5,
          stagger: 0.07,
          ease: "power2.out",
        },
        "-=0.3",
      );
    }
    if (ctaRef.current) {
      tl.from(
        ctaRef.current,
        { opacity: 0, x: 30, duration: 0.6, ease: "power3.out" },
        "-=0.4",
      );
    }
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-400 ${
        scrolled
          ? "bg-black/85 backdrop-blur-md border-b border-white/5"
          : "bg-transparent"
      }`}
    >
      <nav className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <div ref={logoRef} className="flex items-center gap-2">
          <div
            className="w-6 h-6 rounded-md flex items-center justify-center"
            style={{ background: "#00FF9C" }}
          >
            <Mic size={13} color="#0B0B0B" />
          </div>
          <a
            href="/"
            className="text-sm font-black tracking-tight no-underline text-white"
            data-ocid="nav.link"
          >
            AIGIJIROKU
          </a>
        </div>

        <ul ref={linksRef} className="hidden lg:flex items-center gap-6">
          {navLinks.map((link) => (
            <li key={link.label}>
              <a
                href={link.href}
                className="text-xs text-gray-400 hover:text-white transition-colors duration-200 font-medium"
                data-ocid="nav.link"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <div ref={ctaRef} className="hidden lg:flex items-center gap-3">
          <button
            type="button"
            className="flex items-center gap-1 text-xs text-gray-400 hover:text-white transition-colors"
            data-ocid="nav.button"
          >
            <Globe size={12} /> EN
          </button>
          <a
            href="#login"
            className="text-xs text-gray-400 hover:text-white transition-colors font-medium"
            data-ocid="nav.link"
          >
            Log In
          </a>
          <button
            type="button"
            className="btn-neon text-xs py-2 px-4"
            data-ocid="nav.primary_button"
          >
            Try for Free
          </button>
        </div>

        <button
          type="button"
          className="lg:hidden text-white"
          onClick={() => setMobileOpen(!mobileOpen)}
          data-ocid="nav.toggle"
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </nav>

      {mobileOpen && (
        <div className="lg:hidden bg-black/95 backdrop-blur-md border-t border-white/5 px-6 py-4">
          <ul className="flex flex-col gap-4">
            {navLinks.map((link) => (
              <li key={link.label}>
                <a
                  href={link.href}
                  className="text-sm text-gray-300 hover:text-white block"
                  onClick={() => setMobileOpen(false)}
                  data-ocid="nav.link"
                >
                  {link.label}
                </a>
              </li>
            ))}
            <li className="pt-2 border-t border-white/10">
              <button
                type="button"
                className="btn-neon w-full text-sm py-2.5"
                data-ocid="nav.primary_button"
              >
                Try for Free
              </button>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}

// ─── Section 1: Hero ─────────────────────────────────────────────────────────
function HeroSection() {
  const headingRef = useRef<HTMLHeadingElement>(null);
  const subRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const mockupRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const tl = gsap.timeline({ delay: 0.7 });
    if (headingRef.current) {
      tl.from(headingRef.current.querySelectorAll(".hero-word"), {
        opacity: 0,
        y: 70,
        rotateX: -25,
        duration: 0.9,
        stagger: 0.13,
        ease: "power4.out",
      });
    }
    if (subRef.current)
      tl.from(
        subRef.current,
        { opacity: 0, y: 24, duration: 0.6, ease: "power2.out" },
        "-=0.4",
      );
    if (ctaRef.current)
      tl.from(
        ctaRef.current,
        { opacity: 0, y: 20, duration: 0.55, ease: "power2.out" },
        "-=0.3",
      );
    if (mockupRef.current)
      tl.from(
        mockupRef.current,
        { opacity: 0, y: 60, scale: 0.93, duration: 1, ease: "power3.out" },
        "-=0.25",
      );
  }, []);

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center px-6 pt-20 pb-0 overflow-hidden bg-[#0B0B0B]">
      <WaveCanvas />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 40%, rgba(0,255,156,0.07) 0%, transparent 70%)",
        }}
      />

      <div className="relative z-10 max-w-4xl mx-auto text-center">
        <div
          className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-semibold mb-8"
          style={{
            background: "rgba(0,255,156,0.1)",
            border: "1px solid rgba(0,255,156,0.3)",
            color: "#00FF9C",
          }}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[#00FF9C] animate-pulse" />
          AI-Powered Meeting Transcription
        </div>

        <h1
          ref={headingRef}
          className="text-6xl md:text-8xl font-black leading-none mb-6 text-white tracking-tight"
          style={{ perspective: "700px" }}
        >
          {["AI", "GIJIROKU"].map((word) => (
            <span key={word} className="hero-word block">
              {word}
            </span>
          ))}
        </h1>

        <p
          ref={subRef}
          className="text-base md:text-xl text-gray-400 mb-10 max-w-lg mx-auto leading-relaxed"
        >
          Automatically transcribe, summarize, and share your meeting minutes
          with the power of AI.
        </p>

        <div
          ref={ctaRef}
          className="flex flex-col sm:flex-row gap-3 justify-center items-center"
        >
          <button
            type="button"
            className="btn-outline-white text-sm px-7 py-3 inline-flex items-center gap-2"
            data-ocid="hero.primary_button"
          >
            Try for Free <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* Laptop Mockup */}
      <div
        ref={mockupRef}
        className="relative z-10 mt-16 w-full max-w-4xl mx-auto"
      >
        <div className="laptop-frame">
          <div className="laptop-topbar">
            <span className="dot" style={{ background: "#ff5f57" }} />
            <span className="dot" style={{ background: "#ffbd2e" }} />
            <span className="dot" style={{ background: "#28c940" }} />
            <div className="url-bar">app.aigijiroku.com</div>
          </div>
          <div className="laptop-screen">
            <LaptopScreenContent />
          </div>
        </div>
        <div
          className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-3/4 h-16 blur-3xl pointer-events-none"
          style={{ background: "rgba(0,255,156,0.12)" }}
        />
      </div>
    </section>
  );
}

function LaptopScreenContent() {
  return (
    <div className="p-4 md:p-6 text-left">
      <div className="flex items-center justify-between mb-4">
        <span className="text-[10px] text-gray-500 font-mono uppercase tracking-wider">
          LIVE TRANSCRIPTION
        </span>
        <span
          className="text-[10px] px-2 py-0.5 rounded-full"
          style={{ background: "rgba(0,255,156,0.15)", color: "#00FF9C" }}
        >
          ● REC 00:08:24
        </span>
      </div>
      <div className="space-y-2.5">
        {[
          {
            name: "田中 太郎",
            color: "#00FF9C",
            text: "本日のアジェンダを確認しましょう。Q4の売上目標について議論します。",
            ai: false,
          },
          {
            name: "AI Summary",
            color: "#6ee7b7",
            text: "Key point: Q4 sales targets under discussion.",
            ai: true,
          },
          {
            name: "鈴木 花子",
            color: "#a78bfa",
            text: "前四半期比で15%の成長を目指しています。新規顧客獲得が重要です。",
            ai: false,
          },
          {
            name: "山田 健一",
            color: "#60a5fa",
            text: "マーケティング予算の増加を提案します。デジタル広告に注力しましょう。",
            ai: false,
          },
        ].map((line) => (
          <div
            key={line.name + line.color}
            className="flex gap-2.5 items-start"
          >
            <div
              className="w-6 h-6 rounded-full flex-shrink-0 flex items-center justify-center text-[9px] font-bold text-black mt-0.5"
              style={{ background: line.color }}
            >
              {line.name[0]}
            </div>
            <div
              className="flex-1 rounded-xl px-3 py-2 text-xs"
              style={{
                background: line.ai
                  ? "rgba(0,255,156,0.07)"
                  : "rgba(255,255,255,0.04)",
                border: line.ai
                  ? "1px solid rgba(0,255,156,0.2)"
                  : "1px solid rgba(255,255,255,0.06)",
                color: line.ai ? "#6ee7b7" : "#e2e8f0",
              }}
            >
              <span
                className="text-[9px] font-semibold block mb-0.5"
                style={{ color: line.color }}
              >
                {line.name}
              </span>
              {line.text}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Section 2: Trust/Stats ───────────────────────────────────────────────────
const partnerLogos = [
  "INHERITI",
  "SafeTech",
  "eMerge",
  "SBA",
  "Urban Land Institute",
  "FIBREE",
];

function TrustSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;
    const ctx = gsap.context(() => {
      gsap.from(sectionRef.current!.querySelectorAll(".trust-anim"), {
        opacity: 0,
        y: 50,
        duration: 0.9,
        stagger: 0.15,
        ease: "power3.out",
        scrollTrigger: { trigger: sectionRef.current!, start: "top 80%" },
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  // Counter animation
  useEffect(() => {
    if (!statsRef.current) return;
    const ctx = gsap.context(() => {
      const obj = { val: 0 };
      const el = statsRef.current!.querySelector(".counter-7000");
      if (!el) return;
      gsap.to(obj, {
        val: 7000,
        duration: 2,
        ease: "power2.out",
        scrollTrigger: { trigger: statsRef.current!, start: "top 75%" },
        onUpdate: () => {
          el.textContent = `${Math.round(obj.val).toLocaleString()}+`;
        },
      });
    }, statsRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative py-24 px-6 overflow-hidden bg-[#0B0B0B]"
    >
      <WaveCanvas />
      <div className="relative z-10 max-w-4xl mx-auto text-center">
        {/* Laptop mockup with white screen */}
        <div className="trust-anim mb-16">
          <div className="mx-auto max-w-2xl laptop-frame">
            <div className="laptop-topbar">
              <span className="dot" style={{ background: "#ff5f57" }} />
              <span className="dot" style={{ background: "#ffbd2e" }} />
              <span className="dot" style={{ background: "#28c940" }} />
              <div className="url-bar">app.aigijiroku.com</div>
            </div>
            <div className="laptop-screen" style={{ background: "#fff" }}>
              <div className="p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-20 h-3 rounded-full bg-gray-200" />
                  <div className="w-12 h-3 rounded-full bg-gray-100" />
                </div>
                <div className="space-y-2">
                  {["90%", "70%", "85%", "55%"].map((w) => (
                    <div key={w} className="flex items-center gap-2">
                      <div className="w-5 h-5 rounded-full bg-gray-200 flex-shrink-0" />
                      <div
                        className="h-2 rounded-full bg-gray-200"
                        style={{ width: w }}
                      />
                    </div>
                  ))}
                </div>
                <p className="text-[10px] text-gray-400 mt-3 font-medium">
                  議事録が自動で作成されました
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div
          ref={statsRef}
          className="trust-anim flex items-center justify-center gap-8 md:gap-16 mb-10"
        >
          <div className="text-center">
            <div
              className="counter-7000 text-5xl md:text-6xl font-black"
              style={{ color: "#00FF9C" }}
            >
              7000+
            </div>
            <div className="text-xs text-gray-400 mt-1">
              Introduced companies
            </div>
          </div>
          <div className="w-px h-12 bg-white/15" />
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-black text-white">
              Zoom
            </div>
            <div className="text-xs text-gray-400 mt-1">Integration</div>
          </div>
        </div>

        {/* Play button */}
        <div className="trust-anim mb-14">
          <button
            type="button"
            className="w-14 h-14 rounded-full flex items-center justify-center mx-auto transition-transform hover:scale-110"
            style={{
              background: "rgba(255,255,255,0.12)",
              border: "1.5px solid rgba(255,255,255,0.2)",
            }}
            data-ocid="trust.open_modal_button"
            aria-label="Watch overview"
          >
            <Play
              size={20}
              fill="white"
              color="white"
              style={{ marginLeft: 2 }}
            />
          </button>
        </div>

        {/* Partner logos */}
        <div className="trust-anim flex flex-wrap items-center justify-center gap-6 md:gap-10">
          {partnerLogos.map((logo) => (
            <span
              key={logo}
              className="text-xs font-semibold text-gray-500 hover:text-gray-300 transition-colors tracking-wide uppercase"
            >
              {logo}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Section 3: Zoom Features ─────────────────────────────────────────────────
const avatarData = [
  { name: "Danielle", flag: "🇩🇪", color: "#f97316", initial: "D" },
  { name: "Robert", flag: "🇺🇸", color: "#3b82f6", initial: "R" },
  { name: "Nina", flag: "🇫🇷", color: "#ec4899", initial: "N" },
  { name: "Wicki", flag: "🇯🇵", color: "#8b5cf6", initial: "W" },
];

function ZoomFeaturesSection() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;
    const ctx = gsap.context(() => {
      gsap.from(sectionRef.current!.querySelectorAll(".zoom-anim"), {
        opacity: 0,
        y: 40,
        duration: 0.85,
        stagger: 0.13,
        ease: "power3.out",
        scrollTrigger: { trigger: sectionRef.current!, start: "top 78%" },
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="features" className="py-24 px-6 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="zoom-anim text-center mb-12">
          <p className="text-xs text-gray-400 font-medium tracking-widest uppercase mb-3">
            1 / 3
          </p>
          <h2 className="text-3xl md:text-5xl font-black text-gray-900">
            AI GIJIROKU <span style={{ color: "#00A06A" }}>features</span>
          </h2>
        </div>
        <div className="grid md:grid-cols-2 gap-12 md:gap-20 items-center">
          <div className="zoom-anim">
            <h3 className="text-2xl md:text-3xl font-black text-gray-900 leading-tight mb-4">
              Just by linking to <span style={{ color: "#00A06A" }}>ZOOM.</span>
              <br />
              Subtitling of remarks.
            </h3>
            <p className="text-gray-500 text-sm leading-relaxed mb-6">
              Connect your Zoom account and AI GIJIROKU will automatically
              transcribe every participant's speech in real-time, generating
              structured meeting minutes instantly.
            </p>
            <button
              type="button"
              className="btn-green-outline text-sm"
              data-ocid="zoom.primary_button"
            >
              Mit der Zoom-Integration ein
            </button>
          </div>

          <div className="zoom-anim">
            <div
              className="rounded-2xl p-5 shadow-xl"
              style={{ background: "#f8f9fa", border: "1px solid #e9ecef" }}
            >
              <div className="grid grid-cols-2 gap-3 mb-4">
                {avatarData.map((av) => (
                  <div
                    key={av.name}
                    className="rounded-xl p-3 flex items-center gap-3 bg-white shadow-sm"
                    style={{ border: "1px solid #e9ecef" }}
                  >
                    <div className="relative">
                      <div
                        className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-white text-sm"
                        style={{ background: av.color }}
                      >
                        {av.initial}
                      </div>
                      <span className="absolute -bottom-0.5 -right-0.5 text-xs">
                        {av.flag}
                      </span>
                      <span className="absolute top-0 right-0 w-2.5 h-2.5 rounded-full bg-[#00A06A] border-2 border-white" />
                    </div>
                    <span className="text-xs font-semibold text-gray-700">
                      {av.name}
                    </span>
                  </div>
                ))}
              </div>
              {/* Chat bubble overlay */}
              <div className="rounded-xl p-3" style={{ background: "#1a1a2e" }}>
                <div className="flex items-start gap-2">
                  <div className="w-6 h-6 rounded-full bg-[#00FF9C] flex items-center justify-center text-[9px] font-bold text-black flex-shrink-0">
                    AI
                  </div>
                  <div className="text-[11px] text-gray-300 leading-relaxed">
                    📋 <span style={{ color: "#00FF9C" }}>Summary:</span>{" "}
                    Meeting connected via Zoom. 4 participants. Recording
                    started.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Section 4: Voice Recognition ────────────────────────────────────────────
const waveHeights = [
  20, 32, 48, 40, 56, 36, 52, 28, 44, 60, 38, 50, 24, 42, 58, 34, 46,
];

function PhoneMockup() {
  return (
    <div className="phone-frame mx-auto">
      <div className="phone-notch" />
      <div className="space-y-4 px-1">
        <p className="text-center text-[10px] text-gray-500 font-mono">
          RECORDING
        </p>
        <p
          className="text-center text-[11px] font-mono"
          style={{ color: "#00FF9C" }}
        >
          00:04:32
        </p>

        {/* 3 audio tracks */}
        {[
          { label: "Speaker 1", color: "#00FF9C" },
          { label: "Speaker 2", color: "#a78bfa" },
          { label: "Speaker 3", color: "#60a5fa" },
        ].map((track) => (
          <div key={track.label} className="flex items-center gap-2">
            <div
              className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0"
              style={{ background: track.color }}
            >
              <Play
                size={8}
                fill="#0B0B0B"
                color="#0B0B0B"
                style={{ marginLeft: 1 }}
              />
            </div>
            <div className="flex-1 flex items-center gap-0.5 h-6">
              {waveHeights.slice(0, 12).map((h, wIdx) => (
                <div
                  key={`${track.label}-${wIdx}`}
                  className="wave-bar"
                  style={{
                    height: `${h}px`,
                    background: track.color,
                    animationDelay: `${wIdx * 0.07 + (track.label.slice(-1) === "1" ? 0 : track.label.slice(-1) === "2" ? 0.3 : 0.6)}s`,
                  }}
                />
              ))}
            </div>
          </div>
        ))}

        {/* Mic button */}
        <div className="flex justify-center mt-4">
          <button
            type="button"
            className="w-12 h-12 rounded-full flex items-center justify-center mic-pulse"
            style={{ background: "#00FF9C" }}
            data-ocid="voice.toggle"
            aria-label="Toggle mic"
          >
            <Mic size={20} color="#0B0B0B" />
          </button>
        </div>
      </div>
    </div>
  );
}

function VoiceRecognitionSection() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;
    const ctx = gsap.context(() => {
      gsap.from(
        [
          sectionRef.current!.querySelector(".voice-left"),
          sectionRef.current!.querySelector(".voice-right"),
        ],
        {
          opacity: 0,
          x: (i) => (i === 0 ? -50 : 50),
          duration: 0.9,
          stagger: 0.15,
          ease: "power3.out",
          scrollTrigger: { trigger: sectionRef.current!, start: "top 78%" },
        },
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="py-24 px-6 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 md:gap-20 items-center">
          <div className="voice-left">
            <p className="text-xs text-gray-400 font-medium tracking-widest uppercase mb-4">
              2 / 3
            </p>
            <h2 className="text-3xl md:text-4xl font-black text-gray-900 leading-tight mb-4">
              Voice recognition accuracy{" "}
              <span style={{ color: "#00A06A" }}>99.8%</span>
            </h2>
            <p className="text-gray-600 font-medium mb-2">
              Accurately record your remarks and share information smoothly
            </p>
            <p className="text-gray-400 text-sm leading-relaxed mb-6">
              Our proprietary AI model handles multiple speakers, background
              noise, accents, and technical vocabulary with unprecedented
              accuracy across 30+ languages.
            </p>
            <button
              type="button"
              className="btn-green-outline text-sm"
              data-ocid="voice.secondary_button"
            >
              Various usage environments →
            </button>
          </div>
          <div className="voice-right flex justify-center">
            <PhoneMockup />
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Section 5: Real-time Translation ────────────────────────────────────────
const flagAvatars = [
  {
    flag: "🇩🇪",
    color: "#f97316",
    msg: "Hey! Wie geht's?",
    top: "0%",
    left: "0%",
  },
  {
    flag: "🇫🇷",
    color: "#ec4899",
    msg: "Hi! Comment ça va?",
    top: "25%",
    right: "0%",
  },
  { flag: "🇪🇸", color: "#8b5cf6", msg: null, top: "55%", left: "10%" },
  { flag: "🇨🇿", color: "#3b82f6", msg: null, top: "70%", right: "15%" },
];

function TranslationSection() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;
    const ctx = gsap.context(() => {
      gsap.from(sectionRef.current!.querySelectorAll(".trans-anim"), {
        opacity: 0,
        y: 40,
        duration: 0.85,
        stagger: 0.15,
        ease: "power3.out",
        scrollTrigger: { trigger: sectionRef.current!, start: "top 78%" },
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="py-24 px-6"
      style={{ background: "#f8f8f8" }}
    >
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 md:gap-20 items-center">
          <div className="trans-anim">
            <p className="text-xs text-gray-400 font-medium tracking-widest uppercase mb-4">
              3 / 3
            </p>
            <h2 className="text-3xl md:text-4xl font-black text-gray-900 leading-tight mb-4">
              Real-time translation available in{" "}
              <span style={{ color: "#00A06A" }}>30</span> languages.
            </h2>
            <p className="text-gray-600 font-medium mb-2">
              Ideal for meetings with foreign languages
            </p>
            <p className="text-gray-400 text-sm leading-relaxed mb-6">
              Break language barriers instantly. AI GIJIROKU translates speech
              in real-time, enabling seamless international collaboration across
              your entire organization.
            </p>
            <button
              type="button"
              className="btn-green-outline text-sm"
              data-ocid="translation.secondary_button"
            >
              List of supported languages →
            </button>
          </div>
          <div className="trans-anim">
            <div className="relative h-72 flex items-center justify-center">
              {flagAvatars.map((av, avIdx) => (
                <div
                  key={av.flag}
                  className="absolute float-avatar"
                  style={{
                    top: av.top,
                    left: (av as { left?: string }).left,
                    right: (av as { right?: string }).right,
                    animationDelay: `${avIdx * 0.5}s`,
                  }}
                >
                  <div className="flex items-center gap-2">
                    <div
                      className="w-12 h-12 rounded-full flex items-center justify-center text-2xl shadow-lg"
                      style={{
                        background: av.color,
                        border: "3px solid white",
                      }}
                    >
                      {av.flag}
                    </div>
                    {av.msg && (
                      <div
                        className="rounded-xl px-3 py-1.5 text-xs font-medium text-white shadow-md"
                        style={{ background: av.color }}
                      >
                        {av.msg}
                      </div>
                    )}
                  </div>
                </div>
              ))}
              {/* Central AI bubble */}
              <div
                className="rounded-2xl px-5 py-3 shadow-xl text-center z-10"
                style={{ background: "white", border: "1px solid #e9ecef" }}
              >
                <div className="text-2xl mb-1">🌐</div>
                <div className="text-xs font-bold text-gray-700">
                  AI Translation
                </div>
                <div className="text-[10px] text-gray-400">30 languages</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Section 6: Industry-specific voice (dark, marquee) ───────────────────────
const industryHighlights = [
  { icon: BookOpen, label: "Education", featured: true },
  { icon: Stethoscope, label: "Medical" },
  { icon: Scale, label: "Law" },
  { icon: BarChart3, label: "Finance" },
  { icon: Shield, label: "Insurance" },
  { icon: Factory, label: "Manufacturing" },
  { icon: Building2, label: "Parliament" },
  { icon: FlaskConical, label: "Chemistry" },
];

function IndustryVoiceSection() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;
    const ctx = gsap.context(() => {
      gsap.from(sectionRef.current!.querySelector(".industry-heading"), {
        opacity: 0,
        y: 50,
        duration: 0.9,
        ease: "power3.out",
        scrollTrigger: { trigger: sectionRef.current!, start: "top 80%" },
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative py-24 overflow-hidden bg-[#0B0B0B]"
    >
      <WaveCanvas />
      <div className="relative z-10">
        <div className="industry-heading text-center px-6 mb-14">
          <h2 className="text-3xl md:text-5xl font-black text-white mb-4">
            <span style={{ color: "#00FF9C" }}>Industry-specific</span> voice
            recognition
          </h2>
          <p className="text-gray-400 text-sm max-w-xl mx-auto">
            Optimized AI models trained on industry-specific terminology for
            unmatched accuracy in specialized fields.
          </p>
        </div>

        {/* Marquee */}
        <div className="overflow-hidden">
          <div className="marquee-track flex gap-5 pb-4">
            {[
              ...industryHighlights.map((it) => ({ ...it, _side: "a" })),
              ...industryHighlights.map((it) => ({ ...it, _side: "b" })),
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={`${item.label}-${item._side}`}
                  className={`flex-shrink-0 rounded-2xl p-6 flex flex-col items-center gap-3 w-36 transition-all ${
                    item.featured
                      ? "scale-110 shadow-neon"
                      : "opacity-70 hover:opacity-100"
                  }`}
                  style={{
                    background: item.featured
                      ? "rgba(0,255,156,0.1)"
                      : "rgba(255,255,255,0.04)",
                    border: item.featured
                      ? "1px solid rgba(0,255,156,0.4)"
                      : "1px solid rgba(255,255,255,0.07)",
                  }}
                >
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center"
                    style={{
                      background: item.featured
                        ? "#00FF9C"
                        : "rgba(0,255,156,0.15)",
                    }}
                  >
                    <Icon
                      size={22}
                      color={item.featured ? "#0B0B0B" : "#00FF9C"}
                    />
                  </div>
                  <span
                    className="text-xs font-semibold text-center"
                    style={{ color: item.featured ? "#00FF9C" : "#e2e8f0" }}
                  >
                    {item.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Section 7: Industry Categories Grid ─────────────────────────────────────
const industryCategories = [
  { icon: BarChart3, label: "Finance" },
  { icon: BookOpen, label: "Education" },
  { icon: Shield, label: "Insurance" },
  { icon: Scale, label: "Law" },
  { icon: Stethoscope, label: "Medical" },
  { icon: Landmark, label: "Municipality" },
  { icon: FlaskConical, label: "Chemistry" },
  { icon: Activity, label: "Corona Measures" },
  { icon: Building2, label: "Parliament" },
  { icon: Home, label: "Architecture" },
  { icon: Users, label: "Personnel & Labor" },
  { icon: Monitor, label: "IT Terms Glossary" },
  { icon: Pill, label: "Pharmaceutical" },
  { icon: Lock, label: "Info Security" },
  { icon: MapPin, label: "Real Estate" },
  { icon: Calculator, label: "Accounting Audit" },
  { icon: Sprout, label: "Agriculture" },
  { icon: Truck, label: "Logistics" },
  { icon: Factory, label: "Manufacturing" },
  { icon: Utensils, label: "Restaurant" },
];

function IndustryCategoriesSection() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;
    const ctx = gsap.context(() => {
      gsap.from(sectionRef.current!.querySelectorAll(".cat-card"), {
        opacity: 0,
        scale: 0.85,
        duration: 0.6,
        stagger: 0.05,
        ease: "back.out(1.4)",
        scrollTrigger: { trigger: sectionRef.current!, start: "top 78%" },
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative py-20 px-6 overflow-hidden bg-[#0B0B0B]"
    >
      <WaveCanvas />
      <div className="relative z-10 max-w-5xl mx-auto">
        <div className="grid grid-cols-4 sm:grid-cols-5 gap-3">
          {industryCategories.map(({ icon: Icon, label }) => (
            <div
              key={label}
              className="cat-card rounded-xl p-3 flex flex-col items-center gap-2 cursor-pointer hover:border-[rgba(0,255,156,0.4)] transition-colors"
              style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.07)",
              }}
              data-ocid="industry.card"
            >
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ background: "rgba(0,255,156,0.12)" }}
              >
                <Icon size={16} color="#00FF9C" />
              </div>
              <span className="text-[10px] text-gray-400 text-center leading-tight">
                {label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Section 8: Main Functions ────────────────────────────────────────────────
const mainFunctions = [
  {
    num: "01",
    icon: ClipboardList,
    title: "AI Summary Function",
    desc: "Automatically generates structured summaries with action items, decisions, and key points extracted from your meetings.",
  },
  {
    num: "02",
    icon: FileText,
    title: "Auto Transcription",
    desc: "Real-time transcription with speaker identification, timestamps, and 99.8% accuracy across 30 languages.",
  },
  {
    num: "03",
    icon: Zap,
    title: "Smart Search",
    desc: "Full-text search across all your meeting archives. Find any conversation, decision, or action item instantly.",
  },
];

function MainFunctionsSection() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;
    const ctx = gsap.context(() => {
      gsap.from(sectionRef.current!.querySelectorAll(".fn-card"), {
        opacity: 0,
        y: 50,
        duration: 0.85,
        stagger: 0.15,
        ease: "power3.out",
        scrollTrigger: { trigger: sectionRef.current!, start: "top 78%" },
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="py-24 px-6 bg-white">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-14">
          <h2 className="text-3xl md:text-5xl font-black">
            <span className="text-gray-900">Main </span>
            <span style={{ color: "#00A06A" }}>Functions</span>
          </h2>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {mainFunctions.map((fn) => {
            const Icon = fn.icon;
            return (
              <div
                key={fn.num}
                className="fn-card rounded-2xl p-7 relative overflow-hidden"
                style={{ background: "#f8f9fa", border: "1px solid #e9ecef" }}
              >
                <div
                  className="text-5xl font-black mb-4"
                  style={{ color: "rgba(0,160,106,0.12)" }}
                >
                  {fn.num}
                </div>
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                  style={{
                    background: "linear-gradient(135deg, #00A06A, #00FF9C)",
                    boxShadow: "0 4px 16px rgba(0,160,106,0.3)",
                  }}
                >
                  <Icon size={22} color="white" />
                </div>
                <h3 className="font-black text-gray-900 text-lg mb-2">
                  {fn.title}
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed">
                  {fn.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ─── Section 9: Service Overview Movie ───────────────────────────────────────
function ServiceOverviewSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    if (!sectionRef.current) return;
    const ctx = gsap.context(() => {
      gsap.from(sectionRef.current!.querySelector(".svc-content"), {
        opacity: 0,
        scale: 0.9,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: { trigger: sectionRef.current!, start: "top 75%" },
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative py-32 px-6 bg-black overflow-hidden flex items-center justify-center min-h-[60vh]"
    >
      {/* Concentric rings */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div
            key={i}
            className="absolute rounded-full"
            style={{
              width: `${i * 130}px`,
              height: `${i * 130}px`,
              border: `1px solid rgba(0,255,156,${0.12 - i * 0.015})`,
              animation: `ringPulse ${2.5 + i * 0.4}s ease-in-out infinite`,
              animationDelay: `${i * 0.25}s`,
            }}
          />
        ))}
      </div>

      <div className="svc-content relative z-10 text-center">
        <h2 className="text-3xl md:text-5xl font-black text-white mb-2">
          Service <span style={{ color: "#00FF9C" }}>overview</span>
        </h2>
        <p className="text-gray-400 text-lg mb-10">introduction movie</p>
        <button
          type="button"
          className="w-20 h-20 rounded-full flex items-center justify-center mx-auto transition-transform hover:scale-110"
          style={{
            background: "#00FF9C",
            boxShadow: "0 0 40px rgba(0,255,156,0.5)",
          }}
          onClick={() => setModalOpen(true)}
          data-ocid="service.open_modal_button"
          aria-label="Play service overview"
        >
          <Play
            size={32}
            fill="#0B0B0B"
            color="#0B0B0B"
            style={{ marginLeft: 4 }}
          />
        </button>
      </div>

      {/* Modal */}
      {modalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/90"
          data-ocid="service.modal"
        >
          <button
            type="button"
            className="absolute inset-0 w-full h-full cursor-default"
            onClick={() => setModalOpen(false)}
            aria-label="Close modal"
            tabIndex={-1}
          />
          <div className="relative z-10 w-full max-w-3xl">
            <button
              type="button"
              className="absolute -top-12 right-0 text-white hover:text-gray-300"
              onClick={() => setModalOpen(false)}
              data-ocid="service.close_button"
              aria-label="Close"
            >
              <X size={28} />
            </button>
            <div
              className="rounded-2xl overflow-hidden flex items-center justify-center"
              style={{
                background: "#111",
                aspectRatio: "16/9",
                border: "1px solid rgba(0,255,156,0.2)",
              }}
            >
              <div className="text-center">
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                  style={{ background: "rgba(0,255,156,0.15)" }}
                >
                  <Play size={24} style={{ color: "#00FF9C", marginLeft: 3 }} />
                </div>
                <p className="text-gray-400">Video player would appear here</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

// ─── Section 10: Simulation Calculator ───────────────────────────────────────
const sliderLabels = ["10", "100", "1,000", "More"];

function SimulationSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [sliderVal, setSliderVal] = useState([1]);
  const [users, setUsers] = useState(100);
  const [meetings, setMeetings] = useState(5);
  const [income, setIncome] = useState(4000000);

  const hoursSaved = useMemo(
    () => users * meetings * 5 * 52 * 0.5,
    [users, meetings],
  );
  const moneySaved = useMemo(
    () => Math.round(hoursSaved * (income / 2000) * 0.064),
    [hoursSaved, income],
  );

  useEffect(() => {
    if (!sectionRef.current) return;
    const ctx = gsap.context(() => {
      gsap.from(sectionRef.current!.querySelectorAll(".sim-anim"), {
        opacity: 0,
        y: 40,
        duration: 0.85,
        stagger: 0.15,
        ease: "power3.out",
        scrollTrigger: { trigger: sectionRef.current!, start: "top 78%" },
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="py-24 px-6 bg-white">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-14 sim-anim">
          <h2 className="text-3xl md:text-5xl font-black">
            <span style={{ color: "#00A06A" }}>Introduction effect</span>{" "}
            <span className="text-gray-900">simulation</span>
          </h2>
          <p className="text-gray-400 text-sm mt-3">
            Calculate the cost reduction effect by introducing AI GIJIROKU
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Conditions */}
          <div
            className="sim-anim rounded-2xl p-7"
            style={{ background: "#f8f9fa", border: "1px solid #e9ecef" }}
          >
            <h3 className="font-black text-gray-900 text-lg mb-6">Condition</h3>

            <div className="mb-6">
              <label
                htmlFor="slider-employees"
                className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-3"
              >
                Number of employees
              </label>
              <Slider
                id="slider-employees"
                value={sliderVal}
                onValueChange={setSliderVal}
                min={0}
                max={3}
                step={1}
                className="mb-2"
                data-ocid="sim.select"
              />
              <div className="flex justify-between">
                {sliderLabels.map((l) => (
                  <span key={l} className="text-[10px] text-gray-400">
                    {l}
                  </span>
                ))}
              </div>
            </div>

            {[
              {
                label: "Number of users",
                value: users,
                setter: setUsers,
                min: 1,
                max: 10000,
              },
              {
                label: "Meetings per day",
                value: meetings,
                setter: setMeetings,
                min: 1,
                max: 50,
              },
              {
                label: "Average annual income (JPY)",
                value: income,
                setter: setIncome,
                min: 1000000,
                max: 20000000,
              },
            ].map(({ label, value, setter, min, max }) => (
              <div key={label} className="mb-4">
                <label
                  htmlFor={`sim-${label}`}
                  className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1.5"
                >
                  {label}
                </label>
                <input
                  id={`sim-${label}`}
                  type="number"
                  value={value}
                  min={min}
                  max={max}
                  onChange={(e) => setter(Number(e.target.value))}
                  className="w-full rounded-xl px-4 py-2.5 text-sm font-semibold text-gray-900 bg-white border border-gray-200 focus:outline-none focus:border-[#00A06A] transition-colors"
                  data-ocid="sim.input"
                />
              </div>
            ))}
          </div>

          {/* Results */}
          <div className="sim-anim flex flex-col gap-4">
            <div
              className="rounded-2xl p-7 flex-1"
              style={{
                background: "linear-gradient(135deg, #00A06A 0%, #00FF9C 100%)",
              }}
            >
              <p className="text-sm font-semibold text-black/60 mb-4">
                Reduction effect based on input content
              </p>
              <div className="mb-4">
                <div className="text-4xl md:text-5xl font-black text-white">
                  {moneySaved.toLocaleString()}
                </div>
                <div className="text-sm text-white/70 mt-1">JPY per year</div>
              </div>
              <div className="border-t border-white/20 pt-4">
                <div className="text-2xl font-black text-white">
                  {Math.round(hoursSaved).toLocaleString()}
                </div>
                <div className="text-sm text-white/70">hours saved</div>
              </div>
            </div>

            <div className="rounded-2xl p-5" style={{ background: "#1a1a1a" }}>
              <p className="text-xs text-gray-500 mb-1">Recommended plan</p>
              <div className="flex items-center gap-3">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{ background: "#00FF9C" }}
                >
                  <Zap size={16} color="#0B0B0B" />
                </div>
                <span className="font-black text-white">Business Plan</span>
                <ChevronRight size={16} className="text-gray-500 ml-auto" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Section 11+12: Features & Plans ─────────────────────────────────────────
interface PricingPlan {
  name: string;
  monthlyPrice: string;
  annualPrice: string;
  highlighted: boolean;
  cta: string;
}

const pricingPlans: PricingPlan[] = [
  {
    name: "Free",
    monthlyPrice: "0",
    annualPrice: "0",
    highlighted: false,
    cta: "Get Started",
  },
  {
    name: "Personal",
    monthlyPrice: "2,200",
    annualPrice: "16,500",
    highlighted: true,
    cta: "Start Free Trial",
  },
  {
    name: "Team",
    monthlyPrice: "27,300",
    annualPrice: "327,800",
    highlighted: false,
    cta: "Start Free Trial",
  },
  {
    name: "Business",
    monthlyPrice: "Contact",
    annualPrice: "2,200,000",
    highlighted: false,
    cta: "Contact Sales",
  },
];

type CellVal = string | boolean | null;
interface CompRow {
  feature: string;
  note?: string;
  free: CellVal;
  personal: CellVal;
  team: CellVal;
  business: CellVal;
}

const comparisonRows: CompRow[] = [
  {
    feature: "Speaker identification",
    free: true,
    personal: true,
    team: true,
    business: true,
  },
  {
    feature: "Keyword search",
    free: true,
    personal: true,
    team: true,
    business: true,
  },
  {
    feature: "Editing of Text",
    note: "※2",
    free: false,
    personal: true,
    team: true,
    business: true,
  },
  {
    feature: "Text download",
    free: false,
    personal: true,
    team: true,
    business: true,
  },
  {
    feature: "Calendar linkage",
    free: false,
    personal: false,
    team: true,
    business: true,
  },
  {
    feature: "Email share function",
    free: false,
    personal: true,
    team: true,
    business: true,
  },
  {
    feature: "SNS share function",
    free: false,
    personal: true,
    team: true,
    business: true,
  },
  {
    feature: "Zoom linkage",
    free: false,
    personal: false,
    team: true,
    business: true,
  },
  {
    feature: "Translation function",
    note: "※1",
    free: false,
    personal: "100K chars",
    team: "1M chars",
    business: "10M chars",
  },
  {
    feature: "Minutes recording time",
    free: "View only",
    personal: "10 hrs/mo",
    team: "100 hrs/mo",
    business: "1,000 hrs/mo",
  },
  {
    feature: "Payment management",
    free: false,
    personal: false,
    team: true,
    business: true,
  },
  {
    feature: "Central management",
    free: false,
    personal: false,
    team: false,
    business: true,
  },
  {
    feature: "Customer support",
    free: false,
    personal: "Email",
    team: "Email",
    business: "Email",
  },
  {
    feature: "Data logging (beta)",
    free: false,
    personal: false,
    team: true,
    business: true,
  },
];

function CellDisplay({ val }: { val: CellVal }) {
  if (val === true)
    return <Check size={16} style={{ color: "#00FF9C" }} className="mx-auto" />;
  if (val === false || val === null)
    return <span className="text-gray-700 text-sm">—</span>;
  return <span className="text-[11px] text-gray-300">{val}</span>;
}

function PricingSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [annual, setAnnual] = useState(true);

  useEffect(() => {
    if (!sectionRef.current) return;
    const ctx = gsap.context(() => {
      gsap.from(sectionRef.current!.querySelectorAll(".price-card"), {
        opacity: 0,
        y: 50,
        duration: 0.85,
        stagger: 0.1,
        ease: "power3.out",
        scrollTrigger: { trigger: sectionRef.current!, start: "top 78%" },
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="pricing" className="py-24 px-6 bg-[#0B0B0B]">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-5xl font-black mb-6">
            <span className="text-gray-500">Features &amp; </span>
            <span className="text-white">Plans</span>
          </h2>

          {/* Toggle */}
          <div
            className="inline-flex rounded-full p-1 gap-1"
            style={{
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.1)",
            }}
          >
            <button
              type="button"
              onClick={() => setAnnual(false)}
              className={`rounded-full px-5 py-2 text-sm font-semibold transition-all ${
                !annual
                  ? "bg-white text-black"
                  : "text-gray-400 hover:text-white"
              }`}
              data-ocid="pricing.toggle"
            >
              Monthly
            </button>
            <button
              type="button"
              onClick={() => setAnnual(true)}
              className={`rounded-full px-5 py-2 text-sm font-semibold transition-all flex items-center gap-2 ${
                annual ? "text-black" : "text-gray-400 hover:text-white"
              }`}
              style={annual ? { background: "#00FF9C" } : {}}
              data-ocid="pricing.toggle"
            >
              Annually
              {annual && (
                <span className="text-[10px] font-black bg-black/20 px-2 py-0.5 rounded-full">
                  1 month free
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Pricing cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {pricingPlans.map((plan, i) => (
            <div
              key={plan.name}
              className={`price-card rounded-2xl p-5 flex flex-col ${
                plan.highlighted ? "relative -mt-3 md:-mt-4" : ""
              }`}
              style={{
                background: plan.highlighted
                  ? "rgba(255,255,255,0.07)"
                  : "rgba(255,255,255,0.03)",
                border: plan.highlighted
                  ? "1.5px solid rgba(0,255,156,0.4)"
                  : "1px solid rgba(255,255,255,0.07)",
              }}
              data-ocid={`pricing.card.${i + 1}`}
            >
              {plan.name === "Business" && (
                <div
                  className="absolute top-3 right-3 w-6 h-6 rounded-full flex items-center justify-center"
                  style={{ background: "#00FF9C" }}
                >
                  <span className="text-[8px] font-black text-black">★</span>
                </div>
              )}
              <div className="text-xs font-semibold text-gray-400 mb-3">
                {plan.name}
              </div>
              <div className="mb-4">
                {plan.monthlyPrice === "Contact" ? (
                  <div className="text-xl font-black text-white">Contact</div>
                ) : (
                  <>
                    <span className="text-2xl md:text-3xl font-black text-white">
                      {annual ? plan.annualPrice : plan.monthlyPrice}
                    </span>
                    <span className="text-xs text-gray-500 ml-1">
                      JPY/{annual ? "yr" : "mo"}
                    </span>
                  </>
                )}
              </div>
              <button
                type="button"
                className={`w-full rounded-xl py-2.5 text-xs font-bold transition-all mt-auto ${
                  plan.highlighted
                    ? "bg-[#00FF9C] text-black hover:shadow-neon"
                    : "border border-white/20 text-white hover:border-white/40"
                }`}
                data-ocid={`pricing.primary_button.${i + 1}`}
              >
                {plan.cta}
              </button>
            </div>
          ))}
        </div>

        <div className="text-center mb-6">
          <button
            type="button"
            className="border border-white/20 text-white/60 text-sm px-6 py-2.5 rounded-xl hover:border-white/40 hover:text-white transition-all"
            data-ocid="pricing.secondary_button"
          >
            See More Details ↓
          </button>
        </div>

        {/* Comparison table */}
        <div
          className="overflow-x-auto rounded-2xl"
          style={{ border: "1px solid rgba(255,255,255,0.07)" }}
        >
          <table className="w-full text-sm">
            <thead>
              <tr
                style={{
                  background: "rgba(255,255,255,0.04)",
                  borderBottom: "1px solid rgba(255,255,255,0.07)",
                }}
              >
                <th className="text-left py-4 px-4 text-xs font-semibold text-gray-400 w-1/3">
                  Feature
                </th>
                {pricingPlans.map((p) => (
                  <th
                    key={p.name}
                    className="py-4 px-3 text-xs font-semibold text-center"
                    style={{ color: p.highlighted ? "#00FF9C" : "#9ca3af" }}
                  >
                    {p.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {comparisonRows.map((row, i) => (
                <tr
                  key={row.feature}
                  style={{
                    borderBottom: "1px solid rgba(255,255,255,0.04)",
                    background:
                      i % 2 === 0 ? "transparent" : "rgba(255,255,255,0.01)",
                  }}
                >
                  <td className="py-3 px-4 text-xs text-gray-300">
                    {row.feature}
                    {row.note && (
                      <span className="text-gray-600 ml-1">{row.note}</span>
                    )}
                  </td>
                  {(["free", "personal", "team", "business"] as const).map(
                    (col) => (
                      <td key={col} className="py-3 px-3 text-center">
                        <CellDisplay val={row[col]} />
                      </td>
                    ),
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

// ─── Section 13: FAQ ──────────────────────────────────────────────────────────
const faqItems = [
  {
    q: "What browsers can I use?",
    a: "AI GIJIROKU supports the latest versions of Chrome, Safari, and Microsoft Edge. For the best experience, we recommend using Google Chrome.",
  },
  {
    q: "Please tell me the equipment that can be used.",
    a: "You can use AI GIJIROKU on Windows, macOS, Linux, iOS, and Android. Any device with a supported browser and microphone access will work.",
  },
  {
    q: "Is it possible to transcribe external data?",
    a: "You can use it easily by using the import function. The audio file formats currently available are as follows: wav, mp3, m4a, ogg. Please check the usage for details. https://gijiroku.ai/support/",
  },
  {
    q: "Please tell me about support for smartphones.",
    a: "AI GIJIROKU has a dedicated mobile app for iOS and Android. You can record, view, and share meeting minutes directly from your smartphone.",
  },
  {
    q: "Is it possible to link with video chat (Zoom / Skype / Teams, etc.)?",
    a: "Yes! AI GIJIROKU integrates natively with Zoom. Skype and Teams integrations are currently in beta. Once linked, transcription starts automatically when a meeting begins.",
  },
];

function FAQSection() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;
    const ctx = gsap.context(() => {
      gsap.from(sectionRef.current!.querySelectorAll(".faq-item"), {
        opacity: 0,
        x: -30,
        duration: 0.7,
        stagger: 0.1,
        ease: "power2.out",
        scrollTrigger: { trigger: sectionRef.current!, start: "top 78%" },
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="py-24 px-6 bg-white">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-5xl font-black text-gray-900">
            Frequently <span style={{ color: "#00A06A" }}>Asked</span>
            <br />
            Questions
          </h2>
        </div>

        <Accordion type="single" collapsible className="space-y-3">
          {faqItems.map((item, faqIdx) => (
            <AccordionItem
              key={item.q}
              value={`faq-${faqIdx}`}
              className="faq-item rounded-xl overflow-hidden"
              style={{ border: "1px solid #e9ecef" }}
            >
              <AccordionTrigger
                className="px-5 py-4 text-sm font-semibold text-gray-900 hover:no-underline hover:bg-gray-50 transition-colors [&>svg]:text-[#00A06A]"
                data-ocid={`faq.toggle.${faqIdx + 1}`}
              >
                {item.q}
              </AccordionTrigger>
              <AccordionContent className="px-5 pb-4 text-sm text-gray-500 leading-relaxed">
                {item.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}

// ─── Footer ───────────────────────────────────────────────────────────────────
const footerProduct = ["Use Scene", "Mobile App", "Functions", "Pricing"];
const footerCompany = ["Blog", "Partners", "Support", "Privacy"];

function Footer() {
  const year = new Date().getFullYear();
  const hostname =
    typeof window !== "undefined" ? window.location.hostname : "";
  const caffeineUrl = `https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(hostname)}`;

  return (
    <footer
      className="py-16 px-6"
      style={{
        background: "#080808",
        borderTop: "1px solid rgba(255,255,255,0.05)",
      }}
    >
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-4 gap-8 mb-12">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-3">
              <div
                className="w-7 h-7 rounded-md flex items-center justify-center"
                style={{ background: "#00FF9C" }}
              >
                <Mic size={14} color="#0B0B0B" />
              </div>
              <span className="text-lg font-black text-white">AIGIJIROKU</span>
            </div>
            <p className="text-gray-500 text-sm leading-relaxed max-w-xs">
              The future of meeting documentation. AI-powered transcription
              trusted by 7,000+ companies worldwide.
            </p>
          </div>
          <div>
            <h4 className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-4">
              Product
            </h4>
            <ul className="space-y-2">
              {footerProduct.map((l) => (
                <li key={l}>
                  <a
                    href={`#${l.toLowerCase().replace(/\s+/g, "-")}`}
                    className="text-sm text-gray-400 hover:text-white transition-colors"
                    data-ocid="footer.link"
                  >
                    {l}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-4">
              Company
            </h4>
            <ul className="space-y-2">
              {footerCompany.map((l) => (
                <li key={l}>
                  <a
                    href={`#${l.toLowerCase()}`}
                    className="text-sm text-gray-400 hover:text-white transition-colors"
                    data-ocid="footer.link"
                  >
                    {l}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div
          className="flex flex-col md:flex-row items-center justify-between pt-8 gap-4"
          style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}
        >
          <p className="text-xs text-gray-600">
            © {year} AI GIJIROKU. All rights reserved.
          </p>
          <p className="text-xs text-gray-600">
            Built with ❤️ using{" "}
            <a
              href={caffeineUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-gray-400 transition-colors underline underline-offset-2"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}

// ─── App ──────────────────────────────────────────────────────────────────────
export default function App() {
  useReveal(".reveal");

  return (
    <div className="min-h-screen bg-[#0B0B0B]">
      <Navbar />
      <main>
        <HeroSection />
        <LaptopScrollSection />
        <TrustSection />
        <ZoomFeaturesSection />
        <VoiceRecognitionSection />
        <TranslationSection />
        <IndustryVoiceSection />
        <IndustryCategoriesSection />
        <MainFunctionsSection />
        <ServiceOverviewSection />
        <SimulationSection />
        <PricingSection />
        <FAQSection />
      </main>
      <Footer />
    </div>
  );
}
