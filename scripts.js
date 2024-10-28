//--------------------------------------------START-------------------------------------------------------//
//Menu Function
const showMenu = (toggleId, navId) => {
    const toggle = document.getElementById(toggleId),
          nav = document.getElementById(navId);
 
    toggle.addEventListener('click', () => {
        nav.classList.toggle('show-menu');
        toggle.classList.toggle('show-icon');
    });
}
showMenu('nav-toggle','nav-menu');
const toggleTasksBtn = document.getElementById('toggleTasksBtn');
const tasksBar = document.getElementById('tasksBar');

toggleTasksBtn.addEventListener('click', () => {
    if (tasksBar.style.display === 'none') {
        tasksBar.style.display = 'block';
        toggleTasksBtn.textContent = 'HIDE';
    } else {
        tasksBar.style.display = 'none';
        toggleTasksBtn.textContent = 'SHOW';
    }
});
//SHOW HIDE Function
document.addEventListener("DOMContentLoaded", function() {
    const dropdownToggle = document.getElementById('dropdownToggle');
    const dropdownText = dropdownToggle.firstChild;  // Assuming the text node is the first child
    const dropdownMenu = dropdownToggle.nextElementSibling; // Assuming the dropdown menu is the next sibling
    const dropdownArrow = dropdownToggle.querySelector('.dropdown__arrow'); // Ensure you have this class on your arrow icon

    dropdownToggle.addEventListener('click', () => {
        dropdownText.nodeValue = dropdownText.nodeValue.trim() === 'SHOW' ? 'HIDE ' : 'SHOW ';
        dropdownMenu.classList.toggle('dropdown__menu--visible'); // Toggle visibility of the dropdown menu
        dropdownArrow.classList.toggle('dropdown__arrow--rotated');
    });
});
//AlignBtn
const alignBtn = document.getElementById('alignBtn');
const containers = document.querySelectorAll('main .container, main .content');
const heroTitle = document.querySelector('#hero h1');

let alignState = 0;
const alignments = ['left', 'center', 'right'];

alignBtn.addEventListener('click', () => {
    alignState = (alignState + 1) % 3; // Cycle through 0, 1, 2

    // Update containers and content
    containers.forEach(container => {
        container.style.textAlign = alignments[alignState];
    });

    // Special handling for the hero title to adjust for specific alignments
    switch (alignments[alignState]) {
        case 'left':
            heroTitle.style.left = '10%'; // Position from the left
            heroTitle.style.right = 'auto'; // Clear any right positioning
            heroTitle.style.transform = 'translateX(0%)';
            break;
        case 'center':
            heroTitle.style.left = '50%'; // Position from the left
            heroTitle.style.right = 'auto'; // Clear any right positioning
            heroTitle.style.transform = 'translateX(-50%)'; // Move back 50% of its own width
            break;
        case 'right':
            heroTitle.style.left = 'auto'; // Clear any left positioning
            heroTitle.style.right = '10%'; // Position from the right
            heroTitle.style.transform = 'translateX(0%)';
            break;
    }
});
//Spotlight Btn is below
//ToastBtn
const toastBtn = document.getElementById('toastBtn');
const liveToast = document.getElementById('liveToast');
const toastBody = document.getElementById('toastBody');

toastBtn.addEventListener('click', () => {
    toastBody.textContent = new Date().toLocaleString();
    const toast = new bootstrap.Toast(liveToast);
    toast.show();
});
//type function
var typed = new Typed('#typed', {
    stringsElement: '#typed-strings',
    typeSpeed: 20,
    backSpeed: 10,
    loop: true,
    backDelay: 1000
});
// shadow
window.addEventListener('scroll', function() {
    const header = document.querySelector('.header');
    if (window.scrollY > 50) { // Adjust 50 to the threshold you want
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});
//video
gsap.registerPlugin(ScrollTrigger);

document.addEventListener('DOMContentLoaded', function() {
    const video = document.getElementById('background-video');
    const title = document.querySelector('#hero h1');

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
            }
        }
    });

    // Add animations to the timeline
    tl.fromTo(video, { opacity: 0 }, { opacity: 1, duration: 1 })
      .fromTo(title, { opacity: 0 }, { opacity: 1, duration: 1 });

    // Ensure the timeline plays out completely before allowing to scroll further
    tl.addPause('+=1', () => {
        setTimeout(() => {
            tl.resume(); // Resume the timeline after 1 second
        }, 1000); // This delay controls how long to hold before allowing scroll
    });
});

// TimerMessage.js
document.addEventListener('DOMContentLoaded', function() {
    // First, let's ensure timer.js loads normally by manually calling its onload handler
    window.onload = function() {
        new StayTimer('stayTimer');
    };

    const messageElement = document.getElementById('timerMessage');
    let lastMessageCategory = '';
    const startTime = Date.now();

    function updateMessage() {
        const elapsedSeconds = Math.floor((Date.now() - startTime) / 1000);
        
        let messageCategory = '';
        let message = '';

        if (elapsedSeconds < 20) {
            messageCategory = 'short';
            message = "Hey! You're destroying my effort building this website! At least take some time to read it! 😠";
        } else if (elapsedSeconds < 60) {
            messageCategory = 'short';
            message = "Too fast! Are you even reading? 🤨";
        } else if (elapsedSeconds <= 180) {
            messageCategory = 'medium';
            message = "Perfect timing! Feel free to leave a comment about your thoughts! 😊";
        } else {
            messageCategory = 'long';
            message = "Maybe it's time to touch some grass? 🌿";
        }

        // Only update if message category has changed
        if (lastMessageCategory !== messageCategory && messageElement) {
            messageElement.className = 'timer-message message-' + messageCategory;
            messageElement.textContent = message;
            lastMessageCategory = messageCategory;
        }

        requestAnimationFrame(updateMessage);
    }

    updateMessage();
});
// The Spotlight Message Bar
const spotlights = ["WenLinTang is an excellent Organization!!!(Initial Spotlight Message)"];
const spotlightMessageDiv = document.getElementById('spotlight-message');
const nextBtn = document.getElementById('nextSpotlight');
const prevBtn = document.getElementById('prevSpotlight');
let currentSpotlightIndex = 0;
document.getElementById('spotlightBtn').addEventListener('click', () => {
    const newSpotlight = prompt('Enter a new spotlight:');
    if (newSpotlight) {
        spotlights.push(newSpotlight);
        currentSpotlightIndex = spotlights.length - 1; // Update index to the new message
        updateSpotlightDisplay();
    }
});
nextBtn.addEventListener('click', () => {
    if (spotlights.length > 0) {
        currentSpotlightIndex = (currentSpotlightIndex + 1) % spotlights.length;
        updateSpotlightDisplay();
    }
});
prevBtn.addEventListener('click', () => {
    if (spotlights.length > 0) {
        currentSpotlightIndex = (currentSpotlightIndex - 1 + spotlights.length) % spotlights.length;
        updateSpotlightDisplay();
    }
});
adjustFontSize();
function updateSpotlightDisplay() {
    if (spotlights.length > 0) {
        const spotlightMessageDiv = document.getElementById('spotlight-message');
        spotlightMessageDiv.style.opacity = 0;
        setTimeout(() => {
            spotlightMessageDiv.textContent = spotlights[currentSpotlightIndex];
            spotlightMessageDiv.style.opacity = 1;
            adjustFontSize(); // Adjust the font size dynamically
        }, 300);
    }
}
//adjust fontsize spotlight
function adjustFontSize() {
    const messageDiv = document.getElementById('spotlight-message');
    let maxLength = 60; // Define the max length for the base font size
    let textLength = messageDiv.textContent.length;
    let baseFontSize = 10; // Set the base font size for short texts

    // Calculate font size: decrease font size as text length increases
    let fontSize = Math.max(12, baseFontSize - Math.floor((textLength - maxLength) / 5));

    // Apply the calculated font size to the element
    messageDiv.style.fontSize = `${fontSize}px`;

    // Ensure the entire text fits in the container
    while (messageDiv.scrollWidth > messageDiv.offsetWidth && fontSize > 10) {
        fontSize--;
        messageDiv.style.fontSize = `${fontSize}px`;
    }
}

//--------------------------------------------END-------------------------------------------------------//