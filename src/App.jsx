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
  PlaySquare,
} from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

// --- CUSTOM HOOKS ---

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
    { name: "首頁", path: "/" },
    { name: "設施與環境", path: "/hogarden" },
    { name: "宿生會", path: "/association" },
    { name: "影片", path: "/videos" },
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
          香港中文大學 崇基學院. © 2026
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
const PageTransitionLayout = ({ children }) => {
  const location = useLocation();
  const transitionRef = useRef(null);

  useEffect(() => {
    window.scrollTo(0, 0);

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
  const pageRef = useFadeUp();

  useEffect(() => {
    let ctx = gsap.context(() => {
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
          提供一流嘅住宿體驗，畀各位 <span className="text-lime">崇基</span>{" "}
          人喺中大出面都可以一齊成長、一齊玩，留低最正嘅回憶！
        </h1>
      </section>

      {/* College Identity Section */}
      <section className="py-32 px-6 border-t border-white/5 bg-dark">
        <div className="max-w-[1400px] mx-auto grid md:grid-cols-2 gap-16 items-center">
          <div className="fade-up">
            <h2 className="text-4xl md:text-6xl lg:text-[4.5rem] font-display font-bold leading-[1.1] tracking-tight">
              崇基學院嘅 <br />
              <span className="text-lime">世一宿舍。</span>
            </h2>
          </div>
          <div className="fade-up">
            <p className="text-xl md:text-2xl text-gray-400 font-light mb-12 leading-relaxed">
              文林堂喺1972年由聖公會港澳教區奉獻畀崇基學院。座落喺大埔公路隔離，崇基門對出，雖然喺中大出面，但我哋係崇基十間宿舍之中，房間平均面積最大！
            </p>
            <div className="grid grid-cols-2 gap-8 border-t border-white/10 pt-10">
              <div>
                <h4 className="text-5xl font-display text-white mb-2 font-bold">
                  1972
                </h4>
                <p className="text-sm text-gray-500 uppercase tracking-widest font-bold">
                  年 由聖公會奉獻
                </p>
              </div>
              <div>
                <h4 className="text-5xl font-display text-white mb-2 font-bold">
                  57
                </h4>
                <p className="text-sm text-gray-500 uppercase tracking-widest font-bold">
                  個 男宿位
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
              01 / 歷史與兄弟情
            </p>
          </div>
          <div className="md:col-span-8 fade-up">
            <h2 className="text-4xl md:text-6xl lg:text-[4rem] font-display font-semibold mb-8 tracking-tight">
              閉門一家親，同聲同氣。
            </h2>
            <p className="text-xl md:text-2xl text-gray-400 font-light leading-relaxed mb-8">
              遠離中文大學主校園，文林堂是崇基學院中獨特的存在。本身最初用作招待訪問學者，早期亦曾為男女生宿舍，後來才改建為不設女宿位的純男生宿舍。
            </p>
            <p className="text-xl md:text-2xl text-gray-400 font-light leading-relaxed">
              搭車返hall❌ I go to Wen Lin on foot⭕️
            </p>
          </div>
        </div>
      </section>

      {/* Location Section */}
      <section className="px-6 py-32 bg-[#050505]">
        <div className="max-w-[1400px] mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
            <h2 className="fade-up text-6xl md:text-8xl lg:text-[9rem] font-display font-black tracking-tighter uppercase leading-[0.85]">
              搵 <br /> <span className="text-lime">我哋</span>
            </h2>
            <div className="fade-up flex flex-col items-start md:items-end gap-4">
              <p className="text-xl md:text-2xl text-gray-400 font-light flex items-center gap-4">
                <MapPin size={32} className="text-lime" />
                馬料水大埔公路馬料水段
              </p>
              <p className="text-lg text-gray-500 font-light">
                香港中文大學 崇基學院
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
          設施 <br />
          <span className="text-lime">與環境。</span>
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-32 mt-24 mb-32">
          <div className="fade-up">
            <p className="text-2xl md:text-4xl font-light text-gray-300 leading-relaxed mb-12">
              文林堂有三層高，總共32間房，全部都係雙人房或者三人房。房間特別寬敞，可以一覽崇基靚景，面向崇基方向嘅房仲有無敵吐露港海景，令人心曠神怡！
            </p>

            <div className="flex flex-col gap-8">
              <div className="flex items-start gap-6">
                <div className="p-4 bg-white/5 rounded-2xl text-lime">
                  <BookOpen size={24} />
                </div>
                <div>
                  <h4 className="text-xl font-display font-bold mb-2">
                    「柴房」
                  </h4>
                  <p className="text-gray-400">
                    2層31號房因為面積比較細，通風稍差，被兄弟們稱為「柴房」。不過住柴房嘅兄弟會有宿費優惠㗎！至於其他房，每位兄弟都會有一套書枱櫈、一張床、一個衣櫃，配埋風扇同冷氣機。
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-6">
                <div className="p-4 bg-white/5 rounded-2xl text-lime">
                  <Coffee size={24} />
                </div>
                <div>
                  <h4 className="text-xl font-display font-bold mb-2">
                    齊全生活設施
                  </h4>
                  <p className="text-gray-400">
                    地面層（G/F）設有廚房，配備微波爐、烤箱同兩個電爐灶。地下室就係洗衣房，有兩部免費大洗衣機同兩部乾衣機。
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-6">
                <div className="p-4 bg-white/5 rounded-2xl text-lime">
                  <Wifi size={24} />
                </div>
                <div>
                  <h4 className="text-xl font-display font-bold mb-2">
                    沖涼與熱水供應
                  </h4>
                  <p className="text-gray-400">
                    每層樓都有洗手間同浴室，熱水24小時全天候供應，大家做完運動幾夜返嚟沖涼都冇問題！
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Booking Card */}
          <div className="fade-up bg-[#111] p-10 md:p-16 rounded-[2.5rem] border border-white/10 flex flex-col justify-center items-start group hover:border-lime/50 transition-colors duration-500">
            <CalendarClock size={48} className="text-lime mb-8" />
            <h3 className="text-4xl font-display font-bold mb-6">宿費資訊</h3>
            <p className="text-gray-400 mb-12 text-xl leading-relaxed">
              2025/26學年標準房間宿費為每人每學年 $16,826，特別房間
              $13,460。想知多啲可以去崇基網頁睇睇。
            </p>

            <a
              href="https://www.ccc.cuhk.edu.hk/tc/content.php?wid=121"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-4 bg-lime text-black px-8 py-5 rounded-full font-bold tracking-widest uppercase hover:bg-white transition-colors duration-300 text-sm md:text-base"
            >
              了解更多 <ArrowRight size={20} />
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
        <h1 className="fade-up text-5xl md:text-[7rem] lg:text-[10rem] font-display font-black tracking-tighter leading-[0.85] mb-24 uppercase">
          文林 <br />
          <span className="text-lime">宿生會。</span>
        </h1>

        <div className="flex flex-col gap-32">
          {/* Block 1 */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-16 items-start">
            <div className="md:col-span-4 fade-up">
              <h2 className="text-2xl md:text-3xl font-display font-bold text-gray-500 tracking-wider">
                01 / 宗旨
              </h2>
            </div>
            <div className="md:col-span-8 fade-up">
              <h3 className="text-4xl md:text-6xl font-display font-semibold mb-8 tracking-tight leading-[1.1]">
                全叔都firm！
                <br />
                為兄弟們服務。
              </h3>
              <p className="text-xl md:text-2xl text-gray-400 font-light leading-relaxed mb-8">
                文林堂同其他中大宿舍一樣，都有自己嘅宿生會。雖然我哋地處偏僻，但生活絕對唔平靜！我哋由兄弟們選出，為大家策劃最難忘嘅大學生活。
              </p>
            </div>
          </div>

          {/* Block 2: Events & Culture */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-16 items-start">
            <div className="md:col-span-4 fade-up">
              <h2 className="text-2xl md:text-3xl font-display font-bold text-gray-500 tracking-wider">
                02 / 活動與文化
              </h2>
            </div>
            <div className="md:col-span-8 fade-up">
              <h3 className="text-4xl md:text-6xl font-display font-semibold mb-12 tracking-tight leading-[1.1]">
                生活多姿多采！
              </h3>

              <div className="grid md:grid-cols-2 gap-8">
                <div className="bg-[#111] p-8 rounded-3xl border border-white/5">
                  <Award size={32} className="text-lime mb-6" />
                  <h4 className="text-2xl font-display font-bold mb-4">
                    糖水會與迎新
                  </h4>
                  <p className="text-gray-400 leading-relaxed">
                    每逢大時大節都有活動，糖水會、迎新活動等鱗次櫛比，為細細嘅文林堂帶嚟無盡歡樂。
                  </p>
                </div>
                <div className="bg-[#111] p-8 rounded-3xl border border-white/5">
                  <Compass size={32} className="text-lime mb-6" />
                  <h4 className="text-2xl font-display font-bold mb-4">
                    千人宴與活動
                  </h4>
                  <p className="text-gray-400 leading-relaxed">
                    仲有堂慶盆菜宴、一齊大合唱，十幾年後回望都會記起呢班癲佬一齊笑嘅畫面。
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Block 3 */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-16 items-center">
            <div className="md:col-span-4 fade-up">
              <h2 className="text-2xl md:text-3xl font-display font-bold text-gray-500 tracking-wider">
                03 / 精神
              </h2>
            </div>
            <div className="md:col-span-8 fade-up">
              <div className="p-10 md:p-16 rounded-[2.5rem] bg-lime text-black">
                <Users size={48} className="mb-8 opacity-80" />
                <h3 className="text-3xl md:text-5xl font-display font-bold leading-[1.2] mb-6">
                  「送暖❌ 加油打氣⭕️，
                  <br />
                  dem beat❌ 攞彩⭕️」
                </h3>
                <p className="text-xl font-medium opacity-80 font-display uppercase tracking-widest">
                  — 最緊要開心
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Videos = () => {
  const pageRef = useFadeUp();

  const videos = [
    // ---------------- 常規活動 & 回憶錄 ----------------
    {
      id: "L_h7UCobhhU",
      title: "文林堂 Wen Lin Tang",
      thumbnail: "https://i.ytimg.com/vi/L_h7UCobhhU/maxresdefault.jpg",
      url: "https://www.youtube.com/watch?v=L_h7UCobhhU",
    },
    {
      id: "Bc4Qhh7wydY",
      title: "[文林堂] 千人特祭舍音盃回憶錄",
      thumbnail: "https://i.ytimg.com/vi/Bc4Qhh7wydY/maxresdefault.jpg",
      url: "https://www.youtube.com/watch?v=Bc4Qhh7wydY",
    },
    {
      id: "FGpLXQ5ye0Q",
      title: "[文林堂] 剪髮前vs剪髮後",
      thumbnail: "https://i.ytimg.com/vi/FGpLXQ5ye0Q/maxresdefault.jpg",
      url: "https://www.youtube.com/watch?v=FGpLXQ5ye0Q",
    },
    {
      id: "om78Vol2u0Y",
      title: "[文林堂] 足球 文華vs明華",
      thumbnail: "https://i.ytimg.com/vi/om78Vol2u0Y/maxresdefault.jpg",
      url: "https://www.youtube.com/watch?v=om78Vol2u0Y",
    },
    {
      id: "5eIzxo92Hpw",
      title: "[文林堂] 足球 文華vs五宿",
      thumbnail: "https://i.ytimg.com/vi/5eIzxo92Hpw/maxresdefault.jpg",
      url: "https://www.youtube.com/watch?v=5eIzxo92Hpw",
    },

    // ---------------- 歷代舍音盃細組唱 ----------------
    {
      id: "c1kjc4KeCTs",
      title: "文林堂舍音盃08細組唱",
      thumbnail: "https://i.ytimg.com/vi/c1kjc4KeCTs/hqdefault.jpg",
      url: "https://www.youtube.com/watch?v=c1kjc4KeCTs&list=PLLg-HYtZ7Ydc6iivgtAKngywCIrNoJ0nO",
    },
    {
      id: "mDzJ8ILmcEg",
      title: "文林堂舍音盃細組唱09",
      thumbnail: "https://i.ytimg.com/vi/mDzJ8ILmcEg/hqdefault.jpg",
      url: "https://www.youtube.com/watch?v=mDzJ8ILmcEg",
    },
    {
      id: "-_pITzjau_E",
      title: "文林堂 舍音盃 細組唱",
      thumbnail: "https://i.ytimg.com/vi/-_pITzjau_E/hqdefault.jpg",
      url: "https://www.youtube.com/watch?v=-_pITzjau_E",
    },
    {
      id: "MHIPtBZmO9k",
      title: "2014舍音盃 文林細組唱",
      thumbnail: "https://i.ytimg.com/vi/MHIPtBZmO9k/maxresdefault.jpg",
      url: "https://www.youtube.com/watch?v=MHIPtBZmO9k",
    },
    {
      id: "GOHsXqQG1mo",
      title: "2015舍音盃 文林堂 細組唱",
      thumbnail: "https://i.ytimg.com/vi/GOHsXqQG1mo/maxresdefault.jpg",
      url: "https://www.youtube.com/watch?v=GOHsXqQG1mo",
    },
    {
      id: "DXpDR8Bceq0",
      title: "2016年舍音文林細組唱",
      thumbnail: "https://i.ytimg.com/vi/DXpDR8Bceq0/maxresdefault.jpg",
      url: "https://www.youtube.com/watch?v=DXpDR8Bceq0",
    },
    {
      id: "WjIYv4qP42E",
      title: "文林堂2017-18 舍音盃 細組唱",
      thumbnail: "https://i.ytimg.com/vi/WjIYv4qP42E/maxresdefault.jpg",
      url: "https://www.youtube.com/watch?v=WjIYv4qP42E",
    },
    {
      id: "0LpVclkwSqE",
      title: "2018舍音文林細組唱",
      thumbnail: "https://i.ytimg.com/vi/0LpVclkwSqE/maxresdefault.jpg",
      url: "https://www.youtube.com/watch?v=0LpVclkwSqE",
    },
    {
      id: "GdxAafaV3MA",
      title: "2022舍音文林細組唱",
      thumbnail: "https://i.ytimg.com/vi/GdxAafaV3MA/maxresdefault.jpg",
      url: "https://www.youtube.com/watch?v=GdxAafaV3MA",
    },
  ];

  return (
    <div ref={pageRef} className="min-h-screen pt-40 px-6 pb-24 bg-dark">
      <div className="max-w-[1400px] mx-auto">
        <h1 className="fade-up text-5xl md:text-[7rem] lg:text-[10rem] font-display font-black tracking-tighter leading-[0.85] mb-8 uppercase">
          文林 <br />
          <span className="text-lime">影片。</span>
        </h1>
        <p className="fade-up text-xl md:text-2xl text-gray-400 font-light leading-relaxed mb-24">
          一齊睇下兄弟們嘅精彩時刻！無論係夾band、踢波定係平時無聊玩玩吓，全部都係青春嘅回憶。
        </p>

        {/* 手機版 1 個一排，電腦版 3 個一排 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {videos.map((video) => (
            <a
              key={video.id}
              href={video.url}
              target="_blank"
              rel="noreferrer"
              className="fade-up group block"
            >
              <div className="overflow-hidden rounded-2xl mb-4 border border-white/10 group-hover:border-lime transition-colors duration-300 relative">
                <img
                  src={video.thumbnail}
                  alt={video.title}
                  className="w-full h-auto aspect-video object-cover transform group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/40">
                  <PlaySquare size={48} className="text-lime" />
                </div>
              </div>
              <h3 className="text-xl font-display font-bold text-white group-hover:text-lime transition-colors duration-300 line-clamp-2">
                {video.title}
              </h3>
            </a>
          ))}
        </div>

        <div className="mt-16 fade-up flex justify-center">
          <a
            href="https://www.youtube.com/@wenlintangcuhk/videos"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-4 bg-lime text-black px-8 py-5 rounded-full font-bold tracking-widest uppercase hover:bg-white transition-colors duration-300 text-sm md:text-base"
          >
            去 YouTube 睇更多 <ArrowRight size={20} />
          </a>
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

        <main className="flex-grow">
          <PageTransitionLayout>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/hogarden" element={<HoGarden />} />
              <Route path="/association" element={<Association />} />
              <Route path="/videos" element={<Videos />} />
            </Routes>
          </PageTransitionLayout>
        </main>

        <Footer />
      </div>
    </Router>
  );
}
