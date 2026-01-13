import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  TbUsers,
  TbBuildingStore,
  TbWorld,
  TbPackage,
  TbCheck,
  TbMapPin,
  TbCompass,
  TbMessageCircle,
} from "react-icons/tb";

const statsConfig = [
  { label: "Markets", value: 128, icon: <TbBuildingStore size={60} /> },
  { label: "Vendors", value: 920, icon: <TbUsers size={60} /> },
  { label: "Products", value: 5400, icon: <TbPackage size={60} /> },
];

const LandingPage = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState(statsConfig.map(() => 0));
  const [hasAnimated, setHasAnimated] = useState(false);
  const statsRef = useRef(null);
  const featuresRef = useRef(null);

  const scrollToFeatures = () => {
    featuresRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  useEffect(() => {
    if (!statsRef.current) return;
    const animate = () => {
      const duration = 1200;
      const start = performance.now();
      const step = (now) => {
        const progress = Math.min((now - start) / duration, 1);
        setStats(statsConfig.map((item) => Math.round(item.value * progress)));
        if (progress < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting) && !hasAnimated) {
          setHasAnimated(true);
          animate();
        }
      },
      { threshold: 0.35 }
    );

    observer.observe(statsRef.current);
    return () => observer.disconnect();
  }, [hasAnimated]);

  return (
    <div
      className="font-inter text-[var(--black)] snap-y snap-mandatory"
      style={{
        background:
          "linear-gradient(to bottom, color-mix(in srgb, var(--orange) 10%, transparent) 0%, var(--white) 25%, var(--white) 100%)",
      }}
    >
      {/* HEADER (mobile-friendly, full-width) */}
      <header className="fixed top-0 left-0 w-full z-30">
        <div className="w-full px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between gap-3 backdrop-blur-lg bg-[color-mix(in srgb,var(--white) 30%,transparent)]">
          <div className="flex items-center gap-2 sm:gap-3">
            <img
              src="/tamulokal.png"
              alt="Tamukinabalu logo"
              className="h-8 w-8 sm:h-10 sm:w-10 object-contain"
            />
            <span className="text-base sm:text-xl font-semibold text-[var(--black)]">
              Tamukinabalu
            </span>
          </div>
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <button
              onClick={() => {
                // TODO: hook up language switcher logic
              }}
              className="inline-flex items-center gap-1.5 px-3 py-2 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-semibold transition shadow-sm hover:shadow-md border border-[var(--gray)] bg-[color-mix(in srgb,var(--white) 70%,transparent)] text-[var(--black)]"
            >
              <TbWorld className="text-base sm:text-lg" />
              EN
            </button>
          </div>
        </div>
      </header>

      {/* HERO */}
      <section className="min-h-screen snap-start flex flex-col justify-center items-center px-6 text-center relative overflow-hidden pt-28 pb-16 sm:pt-24">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `
              radial-gradient(circle at top left, color-mix(in srgb,var(--orange) 15%, transparent) 0%, transparent 35%),
              radial-gradient(circle at bottom right, color-mix(in srgb,var(--orange) 15%, transparent) 0%, transparent 35%)
            `,
          }}
        />
        <div className="max-w-4xl mx-auto relative">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight text-[var(--black)]">
            Your Tamu Adventure
            <span className="text-[var(--orange)]"> Starts Here</span>
          </h1>

          <p className="mt-4 md:mt-6 max-w-2xl mx-auto text-base md:text-lg text-[var(--black)]">
            Discover street markets near you in Kota Kinabalu—check what’s happening today, navigate easily, and plan your visit before you arrive.
          </p>

          <div className="mt-8 flex justify-center gap-3">
            <button
              onClick={scrollToFeatures}
              className="px-7 py-3 rounded-full text-sm font-semibold transition shadow-sm hover:shadow-md inline-flex items-center justify-center gap-2 border border-[var(--orange)] text-[var(--orange)] bg-[color-mix(in srgb,var(--white) 80%,transparent)]"
            >
              Learn More
            </button>
            <button
              onClick={() => navigate("/")}
              className="px-7 py-3 rounded-full text-sm font-semibold transition shadow-md hover:shadow-lg inline-flex items-center justify-center gap-2 bg-[var(--orange)] text-[var(--white)]"
            >
              Explore Now
            </button>
          </div>
        </div>
      </section>

      {/* FEATURES (scroll target for Learn More) */}
      <section
        ref={featuresRef}
        className="min-h-screen snap-start flex items-center px-6 bg-[var(--white)] pt-24 pb-16"
      >
        <div className="max-w-6xl mx-auto w-full">
          <div className="text-center mb-10">
            <p className="text-sm font-semibold uppercase tracking-[0.08em] text-[var(--orange)]">
              Features
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-[var(--black)] mt-2">
              Designed for visitors exploring Kota Kinabalu
            </h2>
            <p className="mt-3 text-[var(--gray)] max-w-3xl mx-auto">
              Find the best Tamu nearby, see what’s live right now, and plan your route before you head out.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <FeatureCard
              icon={<TbMapPin size={32} />}
              title="Find nearby markets"
              desc="See Tamu around you with distance and open/close times at a glance."
            />
            <FeatureCard
              icon={<TbCompass size={32} />}
              title="Navigate easily"
              desc="One-tap directions to markets, optimized for walking or driving."
            />
            <FeatureCard
              icon={<TbMessageCircle size={32} />}
              title="Engage with others"
              desc="Share your posts, tips, and join forum discussions with other market-goers."
            />
          </div>
        </div>
      </section>

      {/* STATS (animated on view, full screen, emphasized) */}
      <section
        ref={statsRef}
        className="min-h-screen snap-start flex items-center px-6 bg-[var(--white)] relative overflow-hidden pt-24 pb-16"
      >
        <div className="max-w-5xl mx-auto w-full">
          <div className="text-center mb-12">
            <p className="text-sm font-semibold uppercase tracking-[0.08em] text-[var(--orange)]">
              By the Numbers
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-[var(--black)] mt-2">
              A thriving community of markets, vendors, and products
            </h2>
            <p className="mt-3 text-[var(--gray)] max-w-2xl mx-auto">
              Real-time snapshots of Tamukinabalu’s ecosystem—growing every day to help
              visitors discover, vendors thrive, and organizers succeed.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {statsConfig.map((item, idx) => (
              <div
                key={item.label}
                className="rounded-2xl shadow-lg p-4 border bg-[var(--white)] border-[color-mix(in srgb,var(--orange) 20%, transparent)] flex flex-col items-center text-center gap-4"
              >
                <div className="w-16 h-16 flex items-center justify-center rounded-full text-3xl bg-[color-mix(in srgb,var(--orange) 18%, transparent)] text-[var(--gray)]">
                  {item.icon}
                </div>
                <div className="text-lg font-semibold text-[var(--black)]">
                  {item.label}
                </div>
                <div className="text-4xl md:text-5xl font-extrabold text-[var(--black)]">
                  {stats[idx].toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* JOIN AS VENDOR / ORGANIZER */}
      <section className="min-h-screen snap-start flex items-center px-6 bg-[color-mix(in srgb,var(--black) 5%, transparent)] pt-24 pb-16">
        <div className="max-w-5xl mx-auto w-full text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.08em] text-[var(--orange)]">
            Partner with Tamukinabalu
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-[var(--black)] mt-2">
            Grow your presence as a Vendor or Organizer
          </h2>
          <p className="mt-3 text-[var(--gray)] max-w-2xl mx-auto">
            Showcase products, manage applications, and run smoother events with our tools built for local markets.
          </p>

          <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6">
            <JoinCard
              title="Vendors"
              bullets={[
                "Apply to markets and secure spots",
                "Showcase products and offers",
                "Engage with visitors directly",
              ]}
              ctaText="Join as Vendor"
              onClick={() => {
                localStorage.setItem("signupRole", "vendor");
                navigate("/auth");
              }}
            />
            <JoinCard
              title="Organizers"
              bullets={[
                "Create and manage market events",
                "Approve vendors and assign slots",
                "Track performance and attendance",
              ]}
              ctaText="Start as Organizer"
              onClick={() => {
                localStorage.setItem("signupRole", "organizer");
                navigate("/auth");
              }}
            />
          </div>
        </div>
      </section>

      {/* READY TO EXPLORE */}
      <section className="min-h-screen snap-start flex items-center px-6 text-center bg-[var(--orange)] text-[var(--white)] pt-24 pb-16 relative overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `
              radial-gradient(circle at 20% 20%, rgba(255,255,255,0.18) 0%, transparent 35%),
              radial-gradient(circle at 80% 30%, rgba(255,255,255,0.12) 0%, transparent 32%),
              radial-gradient(circle at 40% 80%, rgba(255,255,255,0.14) 0%, transparent 32%)
            `,
          }}
        />
        <div className="max-w-4xl mx-auto relative">
          <p className="text-sm font-semibold tracking-[0.12em] uppercase opacity-90">
            🎉 Let’s Go
          </p>
          <h2 className="text-3xl md:text-4xl font-extrabold mt-2">
            Ready to Explore?
          </h2>
          <p className="mt-3 text-base md:text-lg opacity-90">
            Jump into Kota Kinabalu’s street markets and start your adventure today.
          </p>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <button
              onClick={() => navigate("/")}
              className="px-7 py-3 rounded-full text-sm font-semibold transition shadow-md hover:shadow-lg inline-flex items-center justify-center gap-2 bg-[var(--white)] text-[var(--orange)]"
            >
              Explore Now
            </button>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="text-sm py-8 px-6 text-center bg-[var(--black)] text-[var(--white)]">
        © {new Date().getFullYear()} Tamukinabalu. All rights reserved.
      </footer>
    </div>
  );
};

/* COMPONENTS */

const FeatureCard = ({ icon, title, desc }) => (
  <div className="rounded-xl shadow-sm border p-6 text-left bg-[var(--white)] border-[color-mix(in srgb,var(--black) 10%, transparent)]">
    <div className="w-12 h-12 flex items-center justify-center rounded-full text-xl mb-4 bg-[color-mix(in srgb,var(--orange) 15%, transparent)] text-[var(--orange)]">
      {icon}
    </div>
    <h3 className="font-semibold mb-2 text-lg text-[var(--black)]">{title}</h3>
    <p className="text-sm leading-relaxed text-[var(--gray)]">{desc}</p>
  </div>
);

const JoinCard = ({ title, bullets, ctaText, onClick }) => (
  <div className="rounded-xl shadow-sm border p-6 text-left bg-[var(--white)] border-[color-mix(in srgb,var(--black) 12%, transparent)] flex flex-col h-full">
    <h3 className="text-xl font-semibold text-[var(--black)] mb-3">{title}</h3>
    <ul className="space-y-2 text-[var(--gray)] text-sm flex-1">
      {bullets.map((b, i) => (
        <li key={i} className="flex gap-2 items-start">
          <TbCheck className="text-[var(--green)] mt-[2px]" />
          <span>{b}</span>
        </li>
      ))}
    </ul>
    <button
      onClick={onClick}
      className="mt-6 inline-flex items-center justify-center px-5 py-3 rounded-full text-sm font-semibold bg-[var(--orange)] text-[var(--white)] shadow-sm hover:shadow-md transition"
    >
      {ctaText}
    </button>
  </div>
);

export default LandingPage;