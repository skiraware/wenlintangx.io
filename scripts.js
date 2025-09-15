// scripts.js: Restored and adapted the original GSAP timeline for the hero video/title fade-in with pinning, scrubbing, and hold effect. Called in initGSAPEffects() after content load.
const showMenu = (toggleId, navId) => {
  const toggle = document.getElementById(toggleId),
    nav = document.getElementById(navId);

  toggle.addEventListener("click", () => {
    nav.classList.toggle("show-menu");
    toggle.classList.toggle("show-icon");
  });
};
showMenu("nav-toggle", "nav-menu");

// Seamless page transitions with GSAP fade
const links = document.querySelectorAll(".nav__link");
const content = document.getElementById("content");

function loadPage(pageUrl) {
  gsap.to(content, {
    opacity: 0,
    duration: 0.5,
    onComplete: () => {
      fetch(pageUrl)
        .then((response) => {
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          return response.text();
        })
        .then((data) => {
          content.innerHTML = data;
          gsap.fromTo(content, { opacity: 0 }, { opacity: 1, duration: 0.5 });
          // Re-init GSAP effects for the new content
          initGSAPEffects();
        })
        .catch((error) => {
          console.error("Error loading page:", error);
          content.innerHTML = "<p>Error loading content. Please try again.</p>";
          gsap.fromTo(content, { opacity: 0 }, { opacity: 1, duration: 0.5 });
        });
    },
  });
}

// Initialize GSAP effects (restored original hero video/title animation with pin/scrub/hold)
function initGSAPEffects() {
  const hero = document.getElementById("hero");
  if (hero) {
    gsap.registerPlugin(ScrollTrigger);

    const video = document.getElementById("background-video");
    const title = document.querySelector("#hero h1");

    // Set initial opacity to 0
    gsap.set(video, { opacity: 0 });
    gsap.set(title, { opacity: 0 });

    // Create a timeline with smoother transition and handling
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: "#hero",
        start: "top top",
        end: () => "+=" + (window.innerHeight + 100), // Add 100 extra pixels to the end to create a hold effect
        scrub: 1, // Smooth scrubbing
        pin: true,
        anticipatePin: 1,
        onLeave: () => {
          setTimeout(() => {
            ScrollTrigger.refresh(); // Refresh ScrollTrigger to allow scrolling after 1 second
          }, 2000); // Delay in milliseconds
        },
      },
    });

    // Add animations to the timeline
    tl.fromTo(video, { opacity: 0 }, { opacity: 1, duration: 1 }).fromTo(
      title,
      { opacity: 0 },
      { opacity: 1, duration: 1 }
    );

    // Ensure the timeline plays out completely before allowing to scroll further
    tl.addPause("+=1", () => {
      setTimeout(() => {
        tl.resume(); // Resume the timeline after 1 second
      }, 1000); // This delay controls how long to hold before allowing scroll
    });
  }
  // Add more GSAP effects here as needed for other sections
}

links.forEach((link) => {
  link.addEventListener("click", (e) => {
    e.preventDefault();
    const page = link.getAttribute("data-page");
    loadPage(page);
    // Close mobile menu
    document.getElementById("nav-menu").classList.remove("show-menu");
    document.getElementById("nav-toggle").classList.remove("show-icon");
  });
});

// Load initial home page
loadPage("home.html");
