import React, { useEffect, useRef, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useLocation,
} from "react-router-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  Menu,
  X,
  ArrowRight,
  MapPin,
  Users,
  CalendarClock,
} from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

// --- COMPONENTS ---

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const links = [
    { name: "HOME", path: "/" },
    { name: "HO GARDEN", path: "/hogarden" },
    { name: "ASSOCIATION", path: "/association" },
  ];

  // Close mobile menu on route change
  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  return (
    <header className="fixed top-0 w-full z-50 mix-blend-difference text-white">
      <nav className="max-w-[1400px] mx-auto px-6 py-6 flex justify-between items-center">
        <Link
          to="/"
          className="text-2xl font-display font-bold tracking-tighter hover:text-lime transition-colors"
        >
          WEN LIN TANG.
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex gap-12 text-sm font-medium tracking-widest">
          {links.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className={`hover:text-lime transition-colors ${location.pathname === link.path ? "text-lime" : "text-gray-400"}`}
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* Mobile Toggle */}
        <button
          className="md:hidden z-50 relative"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </nav>

      {/* Mobile Menu */}
      <div
        className={`fixed inset-0 bg-dark z-40 flex flex-col justify-center items-center gap-8 transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] ${isOpen ? "translate-y-0" : "-translate-y-full"}`}
      >
        {links.map((link) => (
          <Link
            key={link.name}
            to={link.path}
            className="text-4xl font-display font-bold hover:text-lime transition-colors"
          >
            {link.name}
          </Link>
        ))}
      </div>
    </header>
  );
};

const Footer = () => (
  <footer className="w-full py-12 px-6 border-t border-white/10 mt-32">
    <div className="max-w-[1400px] mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
      <p className="text-sm text-gray-500 font-medium tracking-wider uppercase">
        © 2026 Wen Lin Tang. Chung Chi College.
      </p>
      <div className="flex gap-8 text-sm font-medium tracking-widest text-gray-400">
        <a
          href="https://www.youtube.com/@wenlintangcuhk"
          target="_blank"
          rel="noreferrer"
          className="hover:text-lime transition-colors"
        >
          YOUTUBE
        </a>
        <a
          href="https://www.instagram.com/wenlintang_taiporoad/"
          target="_blank"
          rel="noreferrer"
          className="hover:text-lime transition-colors"
        >
          IG/TAIPOROAD
        </a>
      </div>
    </div>
  </footer>
);

// --- PAGES ---

const Home = () => {
  const containerRef = useRef(null);
  const row1Ref = useRef(null);
  const row2Ref = useRef(null);
  const row3Ref = useRef(null);

  useEffect(() => {
    // GSAP ScrollTrigger for 3-row effect
    let ctx = gsap.context(() => {
      // Setup initial positions
      gsap.set(row1Ref.current, { x: "100%" });
      gsap.set(row2Ref.current, { x: "-100%", zIndex: 2 });
      gsap.set(row3Ref.current, { x: "100%" });

      // Horizontal scrub
      ScrollTrigger.create({
        trigger: containerRef.current,
        start: "top bottom",
        end: "top top",
        scrub: 0.5,
        onUpdate: (self) => {
          gsap.set(row1Ref.current, { x: `${100 - self.progress * 100}%` });
          gsap.set(row2Ref.current, { x: `${-100 + self.progress * 100}%` });
          gsap.set(row3Ref.current, { x: `${100 - self.progress * 100}%` });
        },
      });

      // Vertical stack and scale
      ScrollTrigger.create({
        trigger: containerRef.current,
        start: "top top",
        end: `+=${window.innerHeight * 2}`,
        pin: true,
        scrub: 0.5,
        pinSpacing: true,
        anticipatePin: 1,
        onUpdate: (self) => {
          if (self.progress <= 0.5) {
            const yProgress = self.progress / 0.5;
            gsap.set(row1Ref.current, { y: `${yProgress * 100}%` });
            gsap.set(row3Ref.current, { y: `${yProgress * -100}%` });
            gsap.set([row1Ref.current, row2Ref.current, row3Ref.current], {
              scale: 1,
            });
          } else {
            gsap.set(row1Ref.current, { y: "100%" });
            gsap.set(row3Ref.current, { y: "-100%" });
            const scaleProgress = (self.progress - 0.5) / 0.5;
            const minScale = 0.5;
            const scale = 1 - scaleProgress * (1 - minScale);
            gsap.set([row1Ref.current, row2Ref.current, row3Ref.current], {
              scale,
            });
          }
        },
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div className="w-full">
      {/* 3-Row Animation Section */}
      <section ref={containerRef} className="services-container bg-dark">
        <div ref={row1Ref} className="services-header h-[25vh] md:h-[30vh]">
          <img src="/images/wenlintang.svg" alt="Wen Lin Tang SVG Row 1" />
        </div>
        <div ref={row2Ref} className="services-header h-[25vh] md:h-[30vh]">
          <img src="/images/wenlintang.svg" alt="Wen Lin Tang SVG Row 2" />
        </div>
        <div ref={row3Ref} className="services-header h-[25vh] md:h-[30vh]">
          <img src="/images/wenlintang.svg" alt="Wen Lin Tang SVG Row 3" />
        </div>
      </section>

      {/* Copy Section */}
      <section className="min-h-screen flex items-center justify-center px-6 py-24">
        <h1 className="text-4xl md:text-6xl lg:text-8xl font-display font-medium tracking-tight text-center max-w-[1200px] leading-tight text-white/90">
          Offers an amazing living experience where{" "}
          <span className="text-lime">Chung Chi</span> students can grow,
          connect, and make lasting memories beyond the CUHK.
        </h1>
      </section>

      {/* Location Section */}
      <section className="px-6 py-32 bg-[#050505]">
        <div className="max-w-[1400px] mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
            <h2 className="text-6xl md:text-8xl font-display font-black tracking-tighter uppercase">
              Find <br /> <span className="text-lime">Us.</span>
            </h2>
            <p className="text-xl md:text-2xl text-gray-400 font-light max-w-md flex items-center gap-4">
              <MapPin size={32} className="text-lime" />
              Wen Lin Tang, Chung Chi College, CUHK
            </p>
          </div>
          <div className="w-full h-[60vh] md:h-[70vh] rounded-3xl overflow-hidden shadow-[0_0_50px_rgba(50,205,50,0.1)] border border-white/5">
            <iframe
              title="Wen Lin Tang Location"
              width="100%"
              height="100%"
              frameBorder="0"
              className="map-iframe"
              src="https://maps.google.com/maps?q=Wen+Lin+Tang,+Chinese+University+of+Hong+Kong&t=&z=17&ie=UTF8&iwloc=&output=embed"
            />
          </div>
        </div>
      </section>
    </div>
  );
};

const HoGarden = () => {
  return (
    <div className="min-h-screen pt-32 px-6">
      <div className="max-w-[1400px] mx-auto">
        <h1 className="text-6xl md:text-[10rem] font-display font-black tracking-tighter leading-none mb-12">
          HO <br />
          <span className="text-lime">GARDEN.</span>
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-32 mt-24">
          <div>
            <p className="text-2xl md:text-4xl font-light text-gray-300 leading-relaxed">
              Experience a moment of profound peace and focused intellect in our
              dedicated sanctuary.
            </p>
          </div>

          {/* Booking Card */}
          <div className="bg-[#111] p-10 md:p-16 rounded-[2.5rem] border border-white/10 flex flex-col justify-center items-start group hover:border-lime/50 transition-colors duration-500">
            <CalendarClock size={48} className="text-lime mb-8" />
            <h3 className="text-3xl font-display font-bold mb-4">
              Reserve Your Spot
            </h3>
            <p className="text-gray-400 mb-12 text-lg">
              Your next focused session is just a click away. Book a desk at Ho
              Garden seamlessly.
            </p>

            <a
              href="https://calendar.google.com/calendar/appointments/schedules/AcZssZ3WdFQMC6FD-QyzbkUIRQp5d9UOvDlhzvjcxVDFkaHnr6CJ4gXniWy98M_jEBPTu0xYG14eU3Z0?gv=true"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-4 bg-lime text-black px-8 py-4 rounded-full font-bold tracking-widest uppercase hover:bg-white transition-colors duration-300"
            >
              Book Now <ArrowRight size={20} />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

const Association = () => {
  return (
    <div className="min-h-screen pt-32 px-6 pb-24">
      <div className="max-w-[1400px] mx-auto">
        {/* Minimalist Hero */}
        <h1 className="text-6xl md:text-[8rem] lg:text-[10rem] font-display font-black tracking-tighter leading-[0.85] mb-24 uppercase">
          The <br />
          <span className="text-lime">Association.</span>
        </h1>

        {/* Content Blocks */}
        <div className="flex flex-col gap-32">
          {/* Block 1 */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-16 items-start">
            <div className="md:col-span-4">
              <h2 className="text-3xl font-display font-bold text-gray-400">
                01 / Heritage
              </h2>
            </div>
            <div className="md:col-span-8">
              <h3 className="text-4xl md:text-6xl font-display font-semibold mb-8 tracking-tight">
                A Legacy Built on Tai Po Road.
              </h3>
              <p className="text-xl md:text-2xl text-gray-400 font-light leading-relaxed">
                Situated away from the bustling main campus of the Chinese
                University of Hong Kong, Wen Lin Tang stands as a unique pillar
                within Chung Chi College. Originally established as a male
                hostel, it has fostered generations of students who value
                independence, brotherhood, and a closely-knit community dynamic
                that only this distinct geographical separation can forge.
              </p>
            </div>
          </div>

          {/* Block 2 */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-16 items-start">
            <div className="md:col-span-4">
              <h2 className="text-3xl font-display font-bold text-gray-400">
                02 / Culture
              </h2>
            </div>
            <div className="md:col-span-8">
              <h3 className="text-4xl md:text-6xl font-display font-semibold mb-8 tracking-tight">
                The Chung Chi Spirit.
              </h3>
              <p className="text-xl md:text-2xl text-gray-400 font-light leading-relaxed mb-8">
                To reside in Wen Lin Tang is to inherit a tradition of
                excellence and active participation. Our Student Hostel
                Association operates with complete autonomy, driving events,
                welfare initiatives, and maintaining the intellectual
                environment of spaces like the Ho Garden.
              </p>
              <div className="p-8 rounded-3xl bg-lime text-black mt-12">
                <Users size={32} className="mb-6" />
                <p className="text-xl font-medium">
                  "We believe that a hostel is not merely a place to sleep, but
                  a crucible for leadership, lifelong friendships, and academic
                  resilience."
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- ROUTER SETUP ---

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-dark flex flex-col">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/hogarden" element={<HoGarden />} />
            <Route path="/association" element={<Association />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}
