// scripts.js: Fixed initial load flash - Hide footer on load, show after initial content fade-in. Reduced scrub to 0.5 (faster catch-up). Shortened end to "+=50vh" (quicker pin release). Added anticipatePin: 1 to prevent flash on fast scrolls. Animate nested elements only.
// Mobile menu toggle
const showMenu = (toggleId, navId) => {
  const toggle = document.getElementById(toggleId);
  const nav = document.getElementById(navId);

  if (toggle && nav) {
    toggle.addEventListener("click", () => {
      nav.classList.toggle("show-menu");
      toggle.classList.toggle("show-icon");
      console.log(
        `Menu toggled. Show-menu: ${nav.classList.contains("show-menu")}`
      ); // Debug
    });
  } else {
    console.error("Toggle or nav element not found:", { toggle, nav });
  }
};

// Initialize menu toggle
showMenu("nav-toggle", "nav-menu");

// Seamless page transitions with GSAP fade
const links = document.querySelectorAll(".nav__link");
links.forEach((link) => {
  console.log(`Adding click listener to ${link.getAttribute("data-page")}`); // Debug
  link.addEventListener("click", (e) => {
    e.preventDefault();
    const page = link.getAttribute("data-page");
    if (page) {
      console.log(`Loading page: ${page}`); // Debug
      loadPage(page);
      // Close mobile menu
      document.getElementById("nav-menu").classList.remove("show-menu");
      document.getElementById("nav-toggle").classList.remove("show-icon");
    }
  });
});
const content = document.getElementById("content");

function loadPage(pageUrl) {
  gsap.to(content, {
    opacity: 0,
    duration: 0.5,
    onComplete: () => {
      fetch(pageUrl + ".html")
        .then((response) => {
          if (!response.ok) throw new Error("Network response was not ok");
          return response.text();
        })
        .then((data) => {
          content.innerHTML = data;
          // Force reflow for CSS application
          content.offsetHeight; // Triggers layout recalc
          gsap.fromTo(
            content,
            { opacity: 0 },
            {
              opacity: 1,
              duration: 0.5,
              onComplete: () => {
                // Show footer only after initial load to prevent flash
                if (window.isInitialLoad) {
                  document.getElementById("footer").style.display = "block";
                  delete window.isInitialLoad;
                }
              },
            }
          );
          initGSAPEffects();
          initInteractions();
          initMobileVideo();
          if (typeof ScrollTrigger !== "undefined") ScrollTrigger.refresh(); // Refresh only if active
        })
        .catch((error) => {
          console.error("Error loading page:", error);
          content.innerHTML = "<p>Error loading content. Please try again.</p>";
          content.offsetHeight; // Reflow here too
          gsap.fromTo(content, { opacity: 0 }, { opacity: 1, duration: 0.5 });
          if (window.isInitialLoad) {
            document.getElementById("footer").style.display = "block";
            delete window.isInitialLoad;
          }
          if (typeof ScrollTrigger !== "undefined") ScrollTrigger.refresh();
        });
    },
  });
}

// Initialize interactions (accordion, etc.)
function initInteractions() {
  // Rules accordion
  const ruleItems = document.querySelectorAll(".rule-item");
  ruleItems.forEach((item) => {
    item.addEventListener("click", () => {
      const p = item.querySelector("p");
      if (p && p.style.display === "block") {
        gsap.to(p, {
          height: 0,
          opacity: 0,
          duration: 0.3,
          onComplete: () => (p.style.display = "none"),
        });
      } else if (p) {
        p.style.display = "block";
        gsap.fromTo(
          p,
          { height: 0, opacity: 0 },
          { height: "auto", opacity: 1, duration: 0.3 }
        );
      }
    });
  });

  // Booking form
  const bookingForm = document.querySelector(".booking-form");
  if (bookingForm) {
    bookingForm.addEventListener("submit", (e) => {
      e.preventDefault();
      console.log("Booking submitted:", new FormData(bookingForm));
      alert("預訂已提交！ / Booking submitted! (Placeholder)");
    });
  }
}

// Mobile video autoplay handling
function initMobileVideo() {
  const video =
    document.getElementById("background-video") ||
    document.getElementById("hogarden-background-video"); // Handle both
  if (
    video &&
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    )
  ) {
    video.addEventListener("touchstart", () => video.play(), { once: true });
  } else if (video) {
    video.play().catch(() => console.log("Video autoplay prevented"));
  }
}

// Enhanced GSAP effects: Hero + Scroll-triggered animations for sections
function initGSAPEffects() {
  if (typeof gsap !== "undefined" && gsap.utils.checkPrefix("transform")) {
    gsap.registerPlugin(ScrollTrigger);

    // Hero animation (with checks – tuned for smoother, faster scroll)
    const hero = document.getElementById("hero");
    if (hero) {
      const video =
        document.getElementById("background-video") ||
        document.getElementById("hogarden-background-video");
      const title = hero.querySelector("h1");
      const subtitle = hero.querySelector(".hero-subtitle");

      try {
        gsap.set([video, title, subtitle].filter(Boolean), { opacity: 0 }); // Filter out undefined
      } catch (e) {
        console.warn("GSAP hero setup skipped:", e.message);
      }

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: "#hero",
          start: "top top",
          end: "+=50vh", // Shorter duration for quicker unpin – adjust as needed (e.g., +=30vh for even faster)
          scrub: 0.5, // Reduced for snappier response (0.5s catch-up; try 0.3 or true for instant)
          pin: true,
          anticipatePin: 1, // Prevents flash on fast scrolls
          pinSpacing: true, // Ensures space for content below
          ease: "none", // Linear scrub for natural feel
        },
      });

      if (video) tl.to(video, { opacity: 1, duration: 0.8 }); // Slightly shorter duration
      if (title) tl.to(title, { opacity: 1, duration: 0.8 }, "-=0.4");
      if (subtitle) tl.to(subtitle, { opacity: 1, duration: 0.8 }, "-=0.4");
    }

    // Fade-in animations for sections and cards (handle empty selectors)
    gsap.utils.toArray(".full-screen-section").forEach((section) => {
      const selectors =
        ".section-title, .team-card, .facility-card, .rule-item, .content-block";
      const elements = Array.from(section.querySelectorAll(selectors)); // Convert to Array
      if (elements.length > 0) {
        // Skip if empty
        ScrollTrigger.create({
          trigger: section,
          start: "top 80%",
          onEnter: () =>
            gsap.fromTo(
              elements,
              { opacity: 0, y: 50 },
              {
                opacity: 1,
                y: 0,
                duration: 0.6, // Slightly faster fade-in
                stagger: 0.15, // Tighter stagger
                ease: "power2.out",
              }
            ),
        });
      }
    });

    // Optional: Full-screen snap for sections (comment out if too "sticky")
    // ScrollTrigger.normalizeScroll(true);
    ScrollTrigger.config({ ignoreMobileResize: true });

    // Refresh on resize
    let resizeTimeout;
    window.removeEventListener("resize", resizeHandler); // Prevent duplicates
    function resizeHandler() {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => ScrollTrigger.refresh(), 250);
    }
    window.addEventListener("resize", resizeHandler);
  }
}

// Event listeners
links.forEach((link) => {
  link.addEventListener("click", (e) => {
    e.preventDefault();
    const page = link.getAttribute("data-page");
    if (page) {
      loadPage(page);
    }
  });
});

// Load initial home page on DOM load
document.addEventListener("DOMContentLoaded", () => {
  window.isInitialLoad = true; // Flag for initial load to handle footer visibility
  loadPage("home");
  // Header scroll effect
  window.addEventListener("scroll", () => {
    document
      .querySelector(".header")
      .classList.toggle("scrolled", window.scrollY > 50);
  });
});
