import React, { useEffect, useRef, useState } from "react";
import "../assets/RocketAnimation.css";

const RocketCanvas = () => {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const [currentFrame, setCurrentFrame] = useState(1);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isActive, setIsActive] = useState(false); // New state to track if component is active
  const totalFrames = 700;

  // Use refs for mutable data
  const imagesRef = useRef({});
  const frameCountRef = useRef(1);
  const animationIdRef = useRef(null);
  const hasStartedRef = useRef(false);

  // Load and cache images
  const loadFrame = async (frameNumber) => {
    return new Promise((resolve, reject) => {
      // Check if already cached
      if (imagesRef.current[frameNumber]) {
        resolve(imagesRef.current[frameNumber]);
        return;
      }

      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => {
        imagesRef.current[frameNumber] = img;
        resolve(img);
      };
      img.onerror = reject;
      img.src = `https://akm-img-a-in.tosshub.com/sites/interactive/immersive/ride-on-the-moon/assest/img/rocket/rocket1%20(${frameNumber}).jpg`;
    });
  };

  // Preload first few frames
  useEffect(() => {
    const preloadInitialFrames = async () => {
      const framesToPreload = [1, 250, 500]; // Just load start, middle, and end
      await Promise.all(framesToPreload.map((frame) => loadFrame(frame)));
      setIsLoaded(true);
    };

    preloadInitialFrames();
  }, []);

  // Draw frame on canvas
  const drawFrame = async (frameNum) => {
    const canvas = canvasRef.current;
    if (!canvas || !isActive) return;

    const ctx = canvas.getContext("2d");
    const img = await loadFrame(frameNum);

    if (img) {
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Calculate dimensions to maintain aspect ratio
      const canvasAspect = canvas.width / canvas.height;
      const imgAspect = img.width / img.height;

      let drawWidth, drawHeight, offsetX, offsetY;

      if (imgAspect > canvasAspect) {
        // Image is wider than canvas
        drawHeight = canvas.height;
        drawWidth = img.width * (canvas.height / img.height);
        offsetX = -(drawWidth - canvas.width) / 2;
        offsetY = 0;
      } else {
        // Image is taller than canvas
        drawWidth = canvas.width;
        drawHeight = img.height * (canvas.width / img.width);
        offsetX = 0;
        offsetY = -(drawHeight - canvas.height) / 2;
      }

      // Draw image
      ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);

      // Add overlay effect for better text readability
      ctx.fillStyle = "rgba(10, 10, 26, 0.4)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
  };

  // Check if component is in view
  const checkIfActive = () => {
    if (!containerRef.current || !isLoaded) return;

    const container = containerRef.current;
    const rect = container.getBoundingClientRect();
    const windowHeight = window.innerHeight;

    // Component is active when it's in the viewport
    const isInView =
      rect.top < windowHeight * 0.8 && rect.bottom > windowHeight * 0.2;

    if (isInView && !isActive) {
      setIsActive(true);
      if (!hasStartedRef.current) {
        hasStartedRef.current = true;
        drawFrame(1);
      }
    } else if (!isInView && isActive) {
      setIsActive(false);
    }
  };

  // Handle scroll within active component
  const handleScroll = () => {
    if (!isActive || !containerRef.current) return;

    const container = containerRef.current;
    const rect = container.getBoundingClientRect();
    const windowHeight = window.innerHeight;

    // Calculate how much of the component is visible
    const visibleTop = Math.max(0, -rect.top);
    const visibleHeight = Math.min(
      rect.height,
      windowHeight - rect.top,
      windowHeight,
    );
    const scrollProgress =
      visibleTop / (rect.height - windowHeight + visibleHeight);

    // Calculate frame based on scroll progress
    const targetFrame = Math.min(
      totalFrames,
      Math.max(1, Math.floor(scrollProgress * totalFrames) + 1),
    );

    if (targetFrame !== frameCountRef.current) {
      frameCountRef.current = targetFrame;
      setCurrentFrame(targetFrame);
      drawFrame(targetFrame);
    }
  };

  // Handle resize
  const handleResize = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      if (isActive) {
        drawFrame(frameCountRef.current);
      }
    }
  };

  // Setup event listeners
  useEffect(() => {
    if (!isLoaded) return;

    const combinedScrollHandler = () => {
      checkIfActive();
      if (isActive) {
        handleScroll();
      }
    };

    // Initial setup
    handleResize();

    // Add event listeners
    window.addEventListener("scroll", combinedScrollHandler, { passive: true });
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("scroll", combinedScrollHandler);
      window.removeEventListener("resize", handleResize);
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
    };
  }, [isLoaded, isActive]);

  // UI Overlay Content - Only show when active
  const OverlayContent = () => (
    <div className="rocket-overlay-content">
      <div className="scrolling-content">
        <div className="scrolling-section">
          <p>
            Developed by the European Space Agency the service module is the
            powerhouse that fuels and propels the spacecraft. It will provide
            propulsion, thermal control, and electrical power generated by solar
            arrays. It will provide life support for astronauts aboard the
            spacecraft.
          </p>
        </div>
      </div>
      <div className="scrolling-content">
        <div className="scrolling-section">
          <p>
            The Orion Stage Adapter connects Orion to the rocket. This is where
            Nasa plans to keep CubeSats as secondary payloads on Artemis I that
            will be deployed for science missions.
          </p>
        </div>
      </div>
      <div className="scrolling-content">
        <div className="scrolling-section">
          <p>
            45 ft tall and 16.7-foot in diameter, the Interim Cryogenic
            Propulsion Stage is single-engine liquid hydrogen and liquid
            oxygen-based system that provides in-space propulsion after the
            solid rocket boosters and core stage put SLS into an Earth orbit.
          </p>
        </div>
      </div>
      <div className="scrolling-content">
        <div className="scrolling-section">
          <p>
            The SLS has two solid rocket boosters that will burn up
            approximately six tons of solid propellant each second to help lift
            the enormous rocket off the launch pad and send it soaring to space.
            The total lifetime of these two boosters will be two minutes.
          </p>
        </div>
      </div>
      <div className="scrolling-content">
        <div className="scrolling-section">
          <p>
            The Launch Vehicle Stage Adapter covers the RL10 engine during
            launch and connects the Interim Cryogenic Propulsion Stage to the
            core stage.
          </p>
        </div>
      </div>
      <div className="scrolling-content">
        <div className="scrolling-section">
          <p>
            Once the first stage is jettisoned, the single liquid hydrogen and
            liquid oxygen-fed RL10B-2 engine will serve as the main propulsion
            that will send the Orion spacecraft to the Moon.
          </p>
        </div>
      </div>
      <div className="scrolling-content">
        <div className="scrolling-section">
          <p>
            The RS-25 engine will use the liquid hydrogen stored in this tank
            consuming 5,37,000 gallons of liquid hydrogen cooled to -252 degrees
            Celsius. The liquid hydrogen tank measures more than 130 feet tall
            and comprises almost two-thirds of the core stage.
          </p>
        </div>
      </div>
      <div className="scrolling-content">
        <div className="scrolling-section">
          <p>
            Dubbed as the backbone of SLS, the core stage includes two
            propellant tanks, flight computers, and four RS-25 rocket engines.
            Nearly 212 feet in height, the SLS core stage feeds the engines
            about 1,500 gallons of propellant each second for eight minutes for
            the spacecraft to reach orbit.
          </p>
        </div>
      </div>
      <div className="scrolling-content">
        <div className="scrolling-section">
          <p>
            Just above the hydrogen tank, engineers have integrated a liquid
            oxygen tank that will hold 1,96,000 gallons of propellant cooled to
            -182 degrees Celsius.
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <div
      className="rocket-animation-container"
      ref={containerRef}
      style={{ height: "200vh" }} // Make it taller for longer scroll animation
    >
      <canvas
        ref={canvasRef}
        className="rocket-canvas"
        style={{ display: isActive ? "block" : "none" }} // Hide canvas when not active
      />

      <div className="rocket-overlay">
        {isLoaded ? (
          <OverlayContent />
        ) : (
          <div className="loading-overlay">
            <div className="loading-spinner"></div>
            <p>Loading rocket animation...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RocketCanvas;
