import React, { useEffect, useRef, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useLocation,
} from "react-router-dom";
import gsap from "https://esm.sh/gsap";
import { ScrollTrigger } from "https://esm.sh/gsap/ScrollTrigger";
import {
  Menu,
  X,
  ArrowRight,
  MapPin,
  Users,
  CalendarClock,
  BookOpen,
  Coffee,
  Wifi,
  Compass,
  Award,
  BookMarked,
} from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

// --- CUSTOM HOOKS ---

// Reusable hook for the Awwwards-style scroll fade-up effect
const useFadeUp = () => {
  const containerRef = useRef(null);

  useEffect(() => {
    let ctx = gsap.context(() => {
      gsap.utils.toArray(".fade-up").forEach((el) => {
        gsap.fromTo(
          el,
          { y: 60, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1.2,
            ease: "power3.out",
            scrollTrigger: {
              trigger: el,
              start: "top 85%",
              toggleActions: "play none none reverse",
            },
          },
        );
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return containerRef;
};

// --- COMPONENTS ---

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const links = [
    { name: "HOME", path: "/" },
    { name: "HO GARDEN", path: "/hogarden" },
    { name: "ASSOCIATION", path: "/association" },
  ];

  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  return (
    <header className="fixed top-0 w-full z-50 mix-blend-difference text-white">
      <nav className="max-w-[1400px] mx-auto px-6 py-8 flex justify-between items-center">
        <Link
          to="/"
          className="text-2xl md:text-3xl font-display font-bold tracking-tighter hover:text-lime transition-colors duration-500"
        >
          WEN LIN TANG.
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex gap-12 text-sm font-medium tracking-widest">
          {links.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className={`hover:text-lime transition-colors duration-300 ${
                location.pathname === link.path ? "text-lime" : "text-gray-400"
              }`}
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* Mobile Toggle */}
        <button
          className="md:hidden z-50 relative hover:text-lime transition-colors duration-300"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={32} /> : <Menu size={32} />}
        </button>
      </nav>

      {/* Mobile Menu */}
      <div
        className={`fixed inset-0 bg-dark z-40 flex flex-col justify-center items-center gap-10 transition-transform duration-700 ease-[cubic-bezier(0.76,0,0.24,1)] ${
          isOpen ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        {links.map((link) => (
          <Link
            key={link.name}
            to={link.path}
            className="text-5xl font-display font-bold hover:text-lime transition-colors duration-300"
          >
            {link.name}
          </Link>
        ))}
      </div>
    </header>
  );
};

const Footer = () => (
  <footer className="w-full py-16 px-6 border-t border-white/10 mt-32 bg-dark relative z-10">
    <div className="max-w-[1400px] mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-10">
      <div>
        <h4 className="text-2xl font-display font-bold mb-2">WEN LIN TANG</h4>
        <p className="text-sm text-gray-500 font-medium tracking-wider uppercase">
          Chung Chi College, CUHK. © 2026
        </p>
      </div>
      <div className="flex flex-wrap gap-8 text-sm font-medium tracking-widest text-gray-400">
        <a
          href="https://www.youtube.com/@wenlintangcuhk"
          target="_blank"
          rel="noreferrer"
          className="hover:text-lime transition-colors duration-300"
        >
          YOUTUBE
        </a>
        <a
          href="https://www.instagram.com/wenlintang_taiporoad/"
          target="_blank"
          rel="noreferrer"
          className="hover:text-lime transition-colors duration-300"
        >
          IG/TAIPOROAD
        </a>
        <a
          href="https://www.instagram.com/wenlintang_film/"
          target="_blank"
          rel="noreferrer"
          className="hover:text-lime transition-colors duration-300"
        >
          IG/FILM
        </a>
        <a
          href="https://www.instagram.com/wenlintang_hanlin/"
          target="_blank"
          rel="noreferrer"
          className="hover:text-lime transition-colors duration-300"
        >
          IG/HANLIN
        </a>
      </div>
    </div>
  </footer>
);

// --- PAGE TRANSITION WRAPPER ---
// This handles the smooth fade/blur transition when navigating between pages
const PageTransitionLayout = ({ children }) => {
  const location = useLocation();
  const transitionRef = useRef(null);

  useEffect(() => {
    window.scrollTo(0, 0);

    // Refresh ScrollTrigger after a tiny delay so it recalculates dimensions of the new page
    setTimeout(() => ScrollTrigger.refresh(), 100);

    gsap.fromTo(
      transitionRef.current,
      { opacity: 0, filter: "blur(10px)", y: 30 },
      {
        opacity: 1,
        filter: "blur(0px)",
        y: 0,
        duration: 1,
        ease: "power3.out",
        clearProps: "all",
      },
    );
  }, [location.pathname]);

  return <div ref={transitionRef}>{children}</div>;
};

// --- PAGES ---

const Home = () => {
  const containerRef = useRef(null);
  const row1Ref = useRef(null);
  const row2Ref = useRef(null);
  const row3Ref = useRef(null);
  const pageRef = useFadeUp(); // Apply our custom scroll hook

  useEffect(() => {
    let ctx = gsap.context(() => {
      // 1. SVG Merging Timeline
      gsap.set(row1Ref.current, { x: "100%" });
      gsap.set(row2Ref.current, { x: "-100%", zIndex: 2 });
      gsap.set(row3Ref.current, { x: "100%" });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "+=250%",
          pin: true,
          scrub: 1,
          anticipatePin: 1,
        },
      });

      tl.to(row1Ref.current, { x: "0%", duration: 1, ease: "none" }, 0)
        .to(row2Ref.current, { x: "0%", duration: 1, ease: "none" }, 0)
        .to(row3Ref.current, { x: "0%", duration: 1, ease: "none" }, 0);

      tl.to(row1Ref.current, { y: "100%", duration: 1, ease: "none" }, 1).to(
        row3Ref.current,
        { y: "-100%", duration: 1, ease: "none" },
        1,
      );

      tl.to(
        [row1Ref.current, row2Ref.current, row3Ref.current],
        { scale: 0.6, duration: 1, ease: "none" },
        2,
      );
    }, pageRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={pageRef} className="w-full">
      {/* 3-Row SVG Animation Section */}
      <section
        ref={containerRef}
        className="relative w-full h-screen flex flex-col justify-center items-center overflow-hidden bg-dark"
      >
        <div
          ref={row1Ref}
          className="relative w-full h-[30vh] px-8 will-change-transform"
        >
          <img
            src="/images/wenlintang.svg"
            alt="Wen Lin Tang SVG"
            className="w-full h-full object-contain"
          />
        </div>
        <div
          ref={row2Ref}
          className="relative w-full h-[30vh] px-8 will-change-transform"
        >
          <img
            src="/images/wenlintang.svg"
            alt="Wen Lin Tang SVG"
            className="w-full h-full object-contain"
          />
        </div>
        <div
          ref={row3Ref}
          className="relative w-full h-[30vh] px-8 will-change-transform"
        >
          <img
            src="/images/wenlintang.svg"
            alt="Wen Lin Tang SVG"
            className="w-full h-full object-contain"
          />
        </div>
      </section>

      {/* Hero Copy Section */}
      <section className="min-h-screen flex items-center justify-center px-6 py-24 relative z-10 bg-dark">
        <h1 className="fade-up text-4xl md:text-6xl lg:text-[5rem] font-display font-medium tracking-tight text-center max-w-[1200px] leading-[1.1] text-white/90">
          Offers an amazing living experience where{" "}
          <span className="text-lime">Chung Chi</span> students can grow,
          connect, and make lasting memories beyond the CUHK.
        </h1>
      </section>

      {/* College Identity Section (New) */}
      <section className="py-32 px-6 border-t border-white/5 bg-dark">
        <div className="max-w-[1400px] mx-auto grid md:grid-cols-2 gap-16 items-center">
          <div className="fade-up">
            <h2 className="text-4xl md:text-6xl lg:text-[4.5rem] font-display font-bold leading-[1.1] tracking-tight">
              The Premier Hostel of <br />
              <span className="text-lime">Chung Chi College.</span>
            </h2>
          </div>
          <div className="fade-up">
            <p className="text-xl md:text-2xl text-gray-400 font-light mb-12 leading-relaxed">
              Located gracefully on Tai Po Road, Wen Lin Tang (文林堂) is a
              distinguished student hostel under Chung Chi College at the
              Chinese University of Hong Kong. We offer an unparalleled
              environment that bridges academic rigor with profound personal
              growth.
            </p>
            <div className="grid grid-cols-2 gap-8 border-t border-white/10 pt-10">
              <div>
                <h4 className="text-5xl font-display text-white mb-2 font-bold">
                  1970s
                </h4>
                <p className="text-sm text-gray-500 uppercase tracking-widest font-bold">
                  Established
                </p>
              </div>
              <div>
                <h4 className="text-5xl font-display text-white mb-2 font-bold">
                  100+
                </h4>
                <p className="text-sm text-gray-500 uppercase tracking-widest font-bold">
                  Residents
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Expanded Introduction Section */}
      <section className="min-h-[80vh] px-6 py-32 border-t border-white/5 bg-[#0a0a0a]">
        <div className="max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-16">
          <div className="md:col-span-4 fade-up">
            <p className="font-display font-bold text-lime text-xl tracking-widest uppercase">
              01 / Heritage
            </p>
          </div>
          <div className="md:col-span-8 fade-up">
            <h2 className="text-4xl md:text-6xl lg:text-[4rem] font-display font-semibold mb-8 tracking-tight">
              A Legacy Built on Tai Po Road.
            </h2>
            <p className="text-xl md:text-2xl text-gray-400 font-light leading-relaxed mb-8">
              Situated away from the bustling main campus of the Chinese
              University of Hong Kong, Wen Lin Tang stands as a unique pillar
              within Chung Chi College. Originally established as a male hostel,
              it has evolved while keeping its core identity intact.
            </p>
            <p className="text-xl md:text-2xl text-gray-400 font-light leading-relaxed">
              Our unique geographical separation from the central campus isn't
              an isolation—it's an incubator. It fosters a fiercely loyal,
              closely-knit community dynamic and an intense spirit of
              brotherhood that defines the Wen Lin experience.
            </p>
          </div>
        </div>
      </section>

      {/* Location Section */}
      <section className="px-6 py-32 bg-[#050505]">
        <div className="max-w-[1400px] mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
            <h2 className="fade-up text-6xl md:text-8xl lg:text-[9rem] font-display font-black tracking-tighter uppercase leading-[0.85]">
              Find <br /> <span className="text-lime">Us.</span>
            </h2>
            <div className="fade-up flex flex-col items-start md:items-end gap-4">
              <p className="text-xl md:text-2xl text-gray-400 font-light flex items-center gap-4">
                <MapPin size={32} className="text-lime" />
                Tai Po Road, Ma Liu Shui
              </p>
              <p className="text-lg text-gray-500 font-light">
                Chung Chi College, CUHK
              </p>
            </div>
          </div>

          <div className="fade-up w-full h-[60vh] md:h-[75vh] rounded-[2rem] overflow-hidden shadow-[0_0_50px_rgba(50,205,50,0.05)] border border-white/5">
            <iframe
              title="Wen Lin Tang Location"
              width="100%"
              height="100%"
              frameBorder="0"
              className="map-iframe w-full h-full"
              src="https://maps.google.com/maps?q=Wen+Lin+Tang,+Chinese+University+of+Hong+Kong&t=&z=17&ie=UTF8&iwloc=&output=embed"
            />
          </div>
        </div>
      </section>
    </div>
  );
};

const HoGarden = () => {
  const pageRef = useFadeUp();

  return (
    <div ref={pageRef} className="min-h-screen pt-40 px-6 bg-dark">
      <div className="max-w-[1400px] mx-auto">
        <h1 className="fade-up text-6xl md:text-[8rem] lg:text-[12rem] font-display font-black tracking-tighter leading-[0.85] mb-12">
          HO <br />
          <span className="text-lime">GARDEN.</span>
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-32 mt-24 mb-32">
          <div className="fade-up">
            <p className="text-2xl md:text-4xl font-light text-gray-300 leading-relaxed mb-12">
              Experience a moment of profound peace and focused intellect in our
              dedicated sanctuary within Wen Lin Tang.
            </p>

            <div className="flex flex-col gap-8">
              <div className="flex items-start gap-6">
                <div className="p-4 bg-white/5 rounded-2xl text-lime">
                  <BookOpen size={24} />
                </div>
                <div>
                  <h4 className="text-xl font-display font-bold mb-2">
                    Dedicated Study Zones
                  </h4>
                  <p className="text-gray-400">
                    Silent areas engineered for deep focus, research, and
                    academic excellence away from hostel noise.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-6">
                <div className="p-4 bg-white/5 rounded-2xl text-lime">
                  <Coffee size={24} />
                </div>
                <div>
                  <h4 className="text-xl font-display font-bold mb-2">
                    Collaboration Spaces
                  </h4>
                  <p className="text-gray-400">
                    Comfortable seating for group projects, intellectual
                    debates, and late-night study sessions.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-6">
                <div className="p-4 bg-white/5 rounded-2xl text-lime">
                  <Wifi size={24} />
                </div>
                <div>
                  <h4 className="text-xl font-display font-bold mb-2">
                    High-Speed Access
                  </h4>
                  <p className="text-gray-400">
                    Fully equipped with CUHK Wi-Fi infrastructure and ample
                    power outlets for all your devices.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Booking Card */}
          <div className="fade-up bg-[#111] p-10 md:p-16 rounded-[2.5rem] border border-white/10 flex flex-col justify-center items-start group hover:border-lime/50 transition-colors duration-500">
            <CalendarClock size={48} className="text-lime mb-8" />
            <h3 className="text-4xl font-display font-bold mb-6">
              Reserve Your Spot
            </h3>
            <p className="text-gray-400 mb-12 text-xl leading-relaxed">
              Your next highly productive session is just a click away. Secure a
              desk at Ho Garden seamlessly through our digital booking system.
            </p>

            <a
              href="https://calendar.google.com/calendar/appointments/schedules/AcZssZ3WdFQMC6FD-QyzbkUIRQp5d9UOvDlhzvjcxVDFkaHnr6CJ4gXniWy98M_jEBPTu0xYG14eU3Z0?gv=true"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-4 bg-lime text-black px-8 py-5 rounded-full font-bold tracking-widest uppercase hover:bg-white transition-colors duration-300 text-sm md:text-base"
            >
              Access Calendar <ArrowRight size={20} />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

const Association = () => {
  const pageRef = useFadeUp();

  return (
    <div ref={pageRef} className="min-h-screen pt-40 px-6 pb-24 bg-dark">
      <div className="max-w-[1400px] mx-auto">
        {/* Minimalist Hero */}
        <h1 className="fade-up text-5xl md:text-[7rem] lg:text-[10rem] font-display font-black tracking-tighter leading-[0.85] mb-24 uppercase">
          The <br />
          <span className="text-lime">Association.</span>
        </h1>

        {/* Content Blocks */}
        <div className="flex flex-col gap-32">
          {/* Block 1 */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-16 items-start">
            <div className="md:col-span-4 fade-up">
              <h2 className="text-2xl md:text-3xl font-display font-bold text-gray-500 tracking-wider">
                01 / PURPOSE
              </h2>
            </div>
            <div className="md:col-span-8 fade-up">
              <h3 className="text-4xl md:text-6xl font-display font-semibold mb-8 tracking-tight leading-[1.1]">
                Driven by Students. <br />
                For the Residents.
              </h3>
              <p className="text-xl md:text-2xl text-gray-400 font-light leading-relaxed mb-8">
                The Wen Lin Tang Student Hostel Association (SHA) is the
                heartbeat of our community. Operating with complete autonomy, we
                are an elected body of residents dedicated to curating the
                ultimate college experience at Chung Chi.
              </p>
              <p className="text-xl md:text-2xl text-gray-400 font-light leading-relaxed">
                From maintaining the intellectual environment of spaces like the
                Ho Garden to organizing massive inter-hostel competitions, the
                SHA ensures that life on Tai Po Road is vibrant, engaging, and
                unforgettable.
              </p>
            </div>
          </div>

          {/* New Block: Events & Culture */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-16 items-start">
            <div className="md:col-span-4 fade-up">
              <h2 className="text-2xl md:text-3xl font-display font-bold text-gray-500 tracking-wider">
                02 / CULTURE
              </h2>
            </div>
            <div className="md:col-span-8 fade-up">
              <h3 className="text-4xl md:text-6xl font-display font-semibold mb-12 tracking-tight leading-[1.1]">
                The Chung Chi Spirit in Action.
              </h3>

              <div className="grid md:grid-cols-2 gap-8">
                <div className="bg-[#111] p-8 rounded-3xl border border-white/5">
                  <Compass size={32} className="text-lime mb-6" />
                  <h4 className="text-2xl font-display font-bold mb-4">
                    Orientation Camps
                  </h4>
                  <p className="text-gray-400 leading-relaxed">
                    Welcoming freshmen with our legendary traditions, breaking
                    the ice, and instilling the Wen Lin pride from day one.
                  </p>
                </div>
                <div className="bg-[#111] p-8 rounded-3xl border border-white/5">
                  <Award size={32} className="text-lime mb-6" />
                  <h4 className="text-2xl font-display font-bold mb-4">
                    Hostel Festivals
                  </h4>
                  <p className="text-gray-400 leading-relaxed">
                    Annual singing contests, sports intramurals, and cultural
                    nights that bring the entire Chung Chi College together.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Block 3 */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-16 items-center">
            <div className="md:col-span-4 fade-up">
              <h2 className="text-2xl md:text-3xl font-display font-bold text-gray-500 tracking-wider">
                03 / PHILOSOPHY
              </h2>
            </div>
            <div className="md:col-span-8 fade-up">
              <div className="p-10 md:p-16 rounded-[2.5rem] bg-lime text-black">
                <Users size={48} className="mb-8 opacity-80" />
                <h3 className="text-3xl md:text-5xl font-display font-bold leading-[1.2] mb-6">
                  "We believe that a hostel is not merely a place to sleep, but
                  a crucible for leadership, lifelong friendships, and academic
                  resilience."
                </h3>
                <p className="text-xl font-medium opacity-80 font-display uppercase tracking-widest">
                  — The Executive Committee
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- MAIN APP ---

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-dark text-white flex flex-col font-sans selection:bg-lime selection:text-black">
        <Navbar />

        {/* Wrap Routes in our Layout for transitions */}
        <main className="flex-grow">
          <PageTransitionLayout>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/hogarden" element={<HoGarden />} />
              <Route path="/association" element={<Association />} />
            </Routes>
          </PageTransitionLayout>
        </main>

        <Footer />
      </div>
    </Router>
  );
}
