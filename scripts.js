// scripts.js: Merged original logic with support for executing scripts in new pages
// Mobile menu toggle
const showMenu = (toggleId, navId) => {
  const toggle = document.getElementById(toggleId);
  const nav = document.getElementById(navId);

  if (toggle && nav) {
    toggle.addEventListener("click", () => {
      nav.classList.toggle("show-menu");
      toggle.classList.toggle("show-icon");
    });
  }
};

// Initialize menu toggle
showMenu("nav-toggle", "nav-menu");

// Seamless page transitions with GSAP fade
const links = document.querySelectorAll(".nav__link");
const content = document.getElementById("content");

// Helper to execute scripts found in fetched HTML (Crucial for Join Us page)
const executeScripts = (container) => {
  const scripts = container.querySelectorAll("script");
  scripts.forEach((oldScript) => {
    const newScript = document.createElement("script");
    Array.from(oldScript.attributes).forEach((attr) =>
      newScript.setAttribute(attr.name, attr.value),
    );
    newScript.appendChild(document.createTextNode(oldScript.innerHTML));
    oldScript.parentNode.replaceChild(newScript, oldScript);
  });
};

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

          // EXECUTE SCRIPTS (Added this to fix Join Us page logic)
          executeScripts(content);

          // Force reflow for CSS application
          content.offsetHeight;

          gsap.fromTo(
            content,
            { opacity: 0 },
            {
              opacity: 1,
              duration: 0.5,
              onComplete: () => {
                if (window.isInitialLoad) {
                  document.getElementById("footer").style.display = "block";
                  delete window.isInitialLoad;
                }
              },
            },
          );
          initGSAPEffects();
          initInteractions();
          initMobileVideo();
          if (typeof ScrollTrigger !== "undefined") ScrollTrigger.refresh();
        })
        .catch((error) => {
          console.error("Error loading page:", error);
          content.innerHTML = "<p>Error loading content. Please try again.</p>";
          gsap.to(content, { opacity: 1 });
        });
    },
  });
}

// Global click listener
links.forEach((link) => {
  link.addEventListener("click", (e) => {
    e.preventDefault();
    const page = link.getAttribute("data-page");
    if (page) {
      loadPage(page);
      document.getElementById("nav-menu").classList.remove("show-menu");
      document.getElementById("nav-toggle").classList.remove("show-icon");
    }
  });
});

// Initialize interactions (accordion, etc.)
function initInteractions() {
  const ruleItems = document.querySelectorAll(".rule-item");
  ruleItems.forEach((item) => {
    item.addEventListener("click", () => {
      const p = item.querySelector("p");
      if (p) {
        if (p.style.display === "block") {
          gsap.to(p, {
            height: 0,
            opacity: 0,
            duration: 0.3,
            onComplete: () => (p.style.display = "none"),
          });
        } else {
          p.style.display = "block";
          gsap.fromTo(
            p,
            { height: 0, opacity: 0 },
            { height: "auto", opacity: 1, duration: 0.3 },
          );
        }
      }
    });
  });

  const bookingForm = document.querySelector(".booking-form");
  if (bookingForm) {
    bookingForm.addEventListener("submit", (e) => {
      e.preventDefault();
      alert("Booking submitted! (Placeholder)");
    });
  }
}

// Mobile video autoplay handling
function initMobileVideo() {
  const videos = document.querySelectorAll("video");
  videos.forEach((video) => {
    if (
      /Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent)
    ) {
      video.addEventListener("touchstart", () => video.play(), { once: true });
    } else {
      video.play().catch(() => console.log("Autoplay prevented"));
    }
  });
}

// GSAP Effects - Includes Original Home Logic
function initGSAPEffects() {
  if (typeof gsap !== "undefined" && typeof ScrollTrigger !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);

    // 1. Original Home Page SVG Animation
    // This targets the .services headers for the horizontal/vertical scroll effect
    const servicesSection = document.querySelector(".services");
    if (servicesSection) {
      // Horizontal movement
      ScrollTrigger.create({
        trigger: ".services",
        start: "top bottom",
        end: "top top",
        scrub: 0.5,
        onUpdate: (self) => {
          const headers = document.querySelectorAll(".services-header");
          if (headers.length >= 3) {
            gsap.set(headers[0], { x: `${100 - self.progress * 100}%` });
            gsap.set(headers[1], { x: `${-100 + self.progress * 100}%` });
            gsap.set(headers[2], { x: `${100 - self.progress * 100}%` });
          }
        },
      });

      // Vertical movement & Scaling
      ScrollTrigger.create({
        trigger: ".services",
        start: "top top",
        end: `+=${window.innerHeight * 2}`,
        pin: true,
        scrub: 0.5,
        pinSpacing: false,
        anticipatePin: 1,
        onUpdate: (self) => {
          const headers = document.querySelectorAll(".services-header");
          if (headers.length >= 3) {
            if (self.progress <= 0.5) {
              const yProgress = self.progress / 0.5;
              gsap.set(headers[0], { y: `${yProgress * 100}%` });
              gsap.set(headers[2], { y: `${yProgress * -100}%` });
            } else {
              gsap.set(headers[0], { y: "100%" });
              gsap.set(headers[2], { y: "-100%" });

              const scaleProgress = (self.progress - 0.5) / 0.5;
              const minScale = 0.5;
              const scale = 1 - scaleProgress * (1 - minScale);

              headers.forEach((header) => gsap.set(header, { scale }));
            }
          }
        },
      });
    }

    // 2. Animate Text Elements (Home Page)
    gsap.utils.toArray(".animate-text").forEach((textElement) => {
      textElement.setAttribute("data-text", textElement.textContent.trim());
      ScrollTrigger.create({
        trigger: textElement,
        start: "top 90%",
        end: "bottom 90%",
        scrub: 0.5,
        onUpdate: (self) => {
          const clipValue = Math.max(0, 100 - self.progress * 100);
          textElement.style.setProperty("--clip-value", `${clipValue}%`);
        },
      });
    });

    // 3. Generic Fade In (For all pages including Join Us)
    gsap.utils
      .toArray(
        ".full-screen-section, .ju-intro-section, .ju-services-section, .ju-story-section",
      )
      .forEach((section) => {
        const selectors =
          ".ju-card, .animate-fade-up, .story-container, .team-card, .facility-card, .rule-item, .content-block, .map-wrapper";
        const elements = Array.from(section.querySelectorAll(selectors));
        if (elements.length > 0) {
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
                  duration: 0.6,
                  stagger: 0.15,
                  ease: "power2.out",
                },
              ),
          });
        }
      });

    // Refresh triggers
    let resizeTimeout;
    window.removeEventListener("resize", resizeHandler);
    function resizeHandler() {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => ScrollTrigger.refresh(), 250);
    }
    window.addEventListener("resize", resizeHandler);
  }
}

// Initial Load
document.addEventListener("DOMContentLoaded", () => {
  window.isInitialLoad = true;
  loadPage("home");

  // Header Scroll Effect
  let lastScrollTop = 0;
  window.addEventListener("scroll", () => {
    const header = document.querySelector(".header");
    const currentScrollTop = window.scrollY;
    header.classList.toggle("scrolled", currentScrollTop > 50);
    if (currentScrollTop > lastScrollTop && currentScrollTop > 50) {
      header.classList.add("header--hidden");
    } else {
      header.classList.remove("header--hidden");
    }
    lastScrollTop = Math.max(0, currentScrollTop);
  });
});
