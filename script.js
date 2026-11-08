// PORTFOLIO WEBSITE - JAVASCRIPT
// Author: Miguel Terence Jarin

// 1. SELECT HTML ELEMENTS

// Get all website sections
const sections = [...document.querySelectorAll("main section")];

// Get all timeline navigation links
const clips = [...document.querySelectorAll(".clip")];

// Get timeline elements
const playhead = document.getElementById("playhead");
const timecode = document.getElementById("tc");

// Get Skills section
const skillsSection = document.getElementById("skills");

// 2. TIMELINE SETTINGS

// Video timeline settings
const FPS = 24;
const TOTAL_SECONDS = 90;

// Prevent multiple animation updates while scrolling
let ticking = false;

// 3. UPDATE TIMELINE NAVIGATION

function updateTimeline() {

    // Stop if required HTML elements are missing
    if (!sections.length || !playhead || !timecode) {
        return;
    }

    // Get maximum scrollable page height
    const maxScroll =
        document.documentElement.scrollHeight - window.innerHeight;

    // Get current scroll position
    const currentScroll = window.scrollY;

    // Identify the currently visible section
    let currentIndex = 0;

    sections.forEach((section, index) => {

        if (section.offsetTop <= currentScroll + 2) {
            currentIndex = index;
        }

    });

    // Get current section boundaries
    const currentSection = sections[currentIndex];

    const sectionStart = currentSection.offsetTop;

    const sectionEnd =
        currentIndex < sections.length - 1
            ? sections[currentIndex + 1].offsetTop
            : maxScroll;

    // Calculate scrolling progress inside the section
    const sectionHeight = sectionEnd - sectionStart;

    const progress = sectionHeight > 0
        ? Math.min(
            1,
            Math.max(
                0,
                (currentScroll - sectionStart) / sectionHeight
            )
        )
        : 1;

    // Calculate timeline position
    const position =
        (currentIndex + progress) / sections.length;

    // Move Timeline Playhead

    playhead.style.setProperty("--p", position);

    // Highlight Active Navigation

    clips.forEach((clip, index) => {

        clip.setAttribute(
            "aria-current",
            index === currentIndex ? "true" : "false"
        );

    });

    // Update Video Timecode

    const totalFrames = Math.round(
        position * TOTAL_SECONDS * FPS
    );

    const frames = totalFrames % FPS;

    const seconds = Math.floor(totalFrames / FPS) % 60;

    const minutes = Math.floor(
        totalFrames / FPS / 60
    );

    // Format timecode as MM:SS:FF
    timecode.textContent = [
        minutes,
        seconds,
        frames
    ]
        .map(number => String(number).padStart(2, "0"))
        .join(":");

    // Allow the next scroll update
    ticking = false;

}

// 4. SCROLL EVENT

// Update timeline while scrolling
window.addEventListener("scroll", () => {

    if (!ticking) {

        ticking = true;

        requestAnimationFrame(updateTimeline);

    }

}, { passive: true });

// Update timeline when browser window is resized
window.addEventListener("resize", updateTimeline);

// 5. SECTION THEME OBSERVER

function initializeThemeObserver() {

    // Check if browser supports IntersectionObserver
    if (!("IntersectionObserver" in window)) {
        return;
    }

    // Observe each section
    const themeObserver = new IntersectionObserver(
        (entries) => {

            entries.forEach(entry => {

                // Change page theme when section is visible
                if (entry.isIntersecting) {

                    document.body.dataset.theme =
                        entry.target.dataset.theme;

                }

            });

        },
        {
            threshold: 0.5
        }
    );

    // Start observing all sections
    sections.forEach(section => {
        themeObserver.observe(section);
    });

}

// 6. SKILL BAR ANIMATION

function initializeSkillAnimation() {

    // Check if Skills section exists
    if (!skillsSection) {
        return;
    }

    // Check browser support
    if (!("IntersectionObserver" in window)) {
        skillsSection.classList.add("seen");
        return;
    }

    // Observe Skills section
    const skillObserver = new IntersectionObserver(
        (entries, observer) => {

            entries.forEach(entry => {

                // Start animation when Skills section is visible
                if (entry.isIntersecting) {

                    skillsSection.classList.add("seen");

                    // Stop observing after animation starts
                    observer.disconnect();

                }

            });

        },
        {
            threshold: 0.35
        }
    );

    skillObserver.observe(skillsSection);

}

// 7. INITIALIZE WEBSITE FEATURES

// Initial timeline update
updateTimeline();

// Initialize background theme changes
initializeThemeObserver();

// Initialize skill bar animation
initializeSkillAnimation();
