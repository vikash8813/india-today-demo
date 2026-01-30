import React, { useEffect, useRef, useState } from "react";
import "../assets/MoonScrollAnimation.css";

const MoonScrollAnimation = () => {
  const containerRef = useRef(null);
  const moonRef = useRef(null);
  const initialContentRef = useRef(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [moonImageLoaded, setMoonImageLoaded] = useState(false);

  // Handle scroll animation
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop =
        window.pageYOffset || document.documentElement.scrollTop;
      const windowHeight = window.innerHeight;

      // Get the moon component container
      const moonContainer = document.querySelector(".moon-component-container");
      if (!moonContainer) return;

      const containerTop = moonContainer.offsetTop;
      const containerHeight = moonContainer.offsetHeight;
      const containerBottom = containerTop + containerHeight;

      // Calculate progress only within the moon component container
      let progress = 0;
      if (scrollTop > containerTop) {
        progress = Math.min(
          (scrollTop - containerTop) / (containerHeight * 0.8),
          1,
        );
      }

      setScrollProgress(progress);

      // Apply zoom effect to moon - ONLY within moon component
      if (moonRef.current) {
        // Always show moon when we're inside the moon component
        if (scrollTop >= containerTop && scrollTop <= containerBottom) {
          moonRef.current.style.visibility = "visible";
          moonRef.current.style.opacity = "1";

          // More gradual zoom: 1x to 4x over entire container scroll
          const scale = 1 + progress * 3; // 1x to 4x

          // Gradual upward movement
          const translateY = -30 * progress;

          moonRef.current.style.transform = `translate(-50%, -50%) scale(${scale}) translateY(${translateY}px)`;

          // Gradual brightness increase
          const brightness = 100 + progress * 60;
          moonRef.current.style.filter = `brightness(${brightness}%)`;

          // Gradual glow increase
          const glowSize = 80 + progress * 120;
          const glowOpacity = 0.4 + progress * 0.3;
          moonRef.current.style.boxShadow = `
  0 0 ${glowSize}px rgba(255, 255, 255, ${glowOpacity}),
  0 0 ${glowSize * 1.5}px rgba(255, 255, 255, ${glowOpacity * 0.7})
`;

          // Fade out effect when reaching bottom (last 20% of container)
          if (progress > 0.8) {
            const fadeProgress = (progress - 0.8) / 0.2; // 0 to 1 in last 20%
            const fadeOpacity = 1 - fadeProgress;
            moonRef.current.style.opacity = fadeOpacity.toString();
          }
        } else {
          // Hide moon when outside moon component
          moonRef.current.style.visibility = "hidden";
          moonRef.current.style.opacity = "0";
        }
      }

      // Handle initial content fade out
      if (initialContentRef.current) {
        // Start fading after 50vh, completely gone by 150vh
        const fadeStart = containerTop + windowHeight * 0.5;
        const fadeEnd = containerTop + windowHeight * 1.5;
        let contentOpacity = 1;

        if (scrollTop > fadeStart) {
          const fadeProgress = (scrollTop - fadeStart) / (fadeEnd - fadeStart);
          contentOpacity = Math.max(0, 1 - fadeProgress);
        }

        initialContentRef.current.style.opacity = contentOpacity;

        // Enable pointer events only when visible
        if (contentOpacity > 0.1) {
          initialContentRef.current.style.pointerEvents = "auto";
        } else {
          initialContentRef.current.style.pointerEvents = "none";
        }
      }

      // Handle scrolling content fade in - FOR ALL SECTIONS
      const contentSectionsList =
        document.querySelectorAll(".scrolling-content");
      const triggerOffset = windowHeight * 0.7;

      contentSectionsList.forEach((section) => {
        // Only animate sections within moon component
        if (section.closest(".moon-component-container")) {
          const rect = section.getBoundingClientRect();
          const sectionTop = rect.top;
          const sectionHeight = rect.height;

          // Calculate visibility based on position in viewport
          let opacity = 0;
          let translateY = 50;

          if (sectionTop < windowHeight - triggerOffset) {
            // Section is entering viewport
            const visibleRatio = Math.min(
              1,
              (windowHeight - sectionTop - triggerOffset) /
                (sectionHeight * 0.5),
            );
            opacity = visibleRatio;
            translateY = 50 * (1 - visibleRatio);
          }

          if (opacity > 0) {
            section.style.opacity = opacity;
            section.style.transform = `translateY(${translateY}px)`;
            section.style.pointerEvents = "auto";
          }

          // Add visible class for CSS transitions
          if (opacity > 0.5) {
            section.classList.add("visible");
          } else {
            section.classList.remove("visible");
          }
        }
      });
    };

    // Initialize moon when component mounts
    if (moonRef.current) {
      moonRef.current.style.visibility = "visible";
      moonRef.current.style.opacity = "1";
    }

    window.addEventListener("scroll", handleScroll, { passive: true });

    // Set up image loading - only for loading state, not for actual image display
    const moonImage = new Image();
    moonImage.src =
      "https://akm-img-a-in.tosshub.com/sites/interactive/immersive/ride-on-the-moon/assest/img/moon.jpg";

    moonImage.onload = () => {
      setMoonImageLoaded(true);
      setIsLoading(false);
      // Trigger initial scroll calculation after image is loaded
      setTimeout(() => {
        handleScroll();
        // Force a reflow to ensure smooth animation start
        if (moonRef.current) {
          moonRef.current.style.transition =
            "transform 0.1s ease-out, opacity 0.5s ease, filter 0.3s ease, box-shadow 0.3s ease";
        }
      }, 50);
    };

    moonImage.onerror = () => {
      console.error("Failed to load moon image");
      setIsLoading(false);
      handleScroll();
    };

    // Initial scroll calculation
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleScrollClick = () => {
    const moonContainer = document.querySelector(".moon-component-container");
    if (moonContainer) {
      const containerTop = moonContainer.offsetTop;
      window.scrollTo({
        top: containerTop + window.innerHeight * 0.8,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="moon-component-container">
      <div className="moon-scroll-container" ref={containerRef}>
        {isLoading && (
          <div className="loading-overlay">
            <div className="spinner"></div>
            <p>Loading moon image...</p>
          </div>
        )}

        <header className="fixed-header">
          <div className="header-logo">
            <span className="header-logo-top">INDIA</span>
            <span className="header-logo-bottom">TODAY</span>
          </div>
          <div className="header-info">
            <span className="header-interactive">INTERACTIVE</span>
            <span className="header-date">JUNE 2023</span>
          </div>
        </header>

        {/* Moon Background - Single div with CSS background */}
        <div
          className="moon-background"
          ref={moonRef}
          style={{
            opacity: moonImageLoaded ? 1 : 0,
            transition: "opacity 0.5s ease",
          }}
        />

        <div className="initial-content" ref={initialContentRef}>
          <div className="main-heading">
            <h2 className="heading-line-1">RIDE TO THE</h2>
            <h2 className="heading-line-2">MOON</h2>
            <p className="subheading">WITH THE WORLD'S MOST POWERFUL ROCKET</p>
          </div>

          <div className="story-credits">
            <div className="credit">
              <span className="credit-label">Story By</span>
              <span className="credit-name">Sibu Tripathi</span>
            </div>
            <div className="credit">
              <span className="credit-label">Creative Director</span>
              <span className="credit-name">Rahul Gupta</span>
            </div>
          </div>

          <div className="scroll-indicator">
            <button className="scroll-button" onClick={handleScrollClick}>
              <span className="scroll-text">SCROLL</span>
              <div className="scroll-arrow">↓</div>
            </button>
          </div>

          <div className="website-url">
            <span>https://www.indiatoday.in</span>
          </div>
        </div>

        <div className="content-container">
          {/* All content sections that will scroll over the moon */}
          <div className="scrolling-content">
            <div className="scrolling-section">
              <p>
                It was the summer of 1969 when the airless and quiet world of
                our next-door cosmic neighbour was suddenly disturbed with the
                slow descent of a spacecraft from above. The spacecraft had come
                from Earth. Inside, were two men, Neil Armstrong and Buzz
                Aldrin, who got down from the craft and touched the surface to
                carve their names in eternity.
              </p>
            </div>
          </div>

          <div className="scrolling-content">
            <div className="scrolling-section">
              <p>They were on the Moon.</p>
            </div>
          </div>

          {/* <div className="scrolling-content">
            <div className="scrolling-section">
              <p>
                Nearly 53 years after that historic event, humans are ready to
                return to the heavens.
              </p>
            </div>
          </div> */}

          <div className="scrolling-content">
            <div className="scrolling-section">
              <p>
                A couple of years from now, a new generation of astronauts will
                board the Space Launch System (SLS) and set course for the lunar
                world, this time for a longer presence and with an aim to push
                forward to Mars.
              </p>
            </div>
          </div>
          <div className="scrolling-content">
            <div className="scrolling-section">
              <p>
                A couple of years from now, a new generation of astronauts will
                board the Space Launch System (SLS) and set course for the lunar
                world, this time for a longer presence and with an aim to push
                forward to Mars.
              </p>
            </div>
          </div>

          <div className="scrolling-content">
            <div className="scrolling-section">
              <p>
                Before the SLS, the world's most powerful rocket, ferries humans
                back to the Moon, the space vehicle will have a dummy run - an
                un-crewed launch scheduled for later this month.
              </p>
            </div>
          </div>

          <div className="scrolling-content">
            <div className="scrolling-section">
              <p>
                We take you through this behemoth rocket that is the result of
                human ingenuity, the spirit of never giving up, and the desire
                to explore the unknown.
              </p>
            </div>
          </div>

          <div className="scrolling-content">
            <div className="scrolling-section">
              <h3>India Today Interactive</h3>
              <p>Special Space Edition • June 2023</p>
              <p>
                For more updates, visit{" "}
                <a
                  href="https://www.indiatoday.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: "#ffcc00", textDecoration: "none" }}
                >
                  www.indiatoday.in/space
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MoonScrollAnimation;
