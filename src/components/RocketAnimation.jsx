import React, { useEffect, useRef, useState, useCallback } from "react";
import "../assets/RocketAnimation.css";

const RocketCanvas = () => {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const [currentFrame, setCurrentFrame] = useState(1);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const totalFrames = 700;

  // Use refs for mutable data
  const imagesRef = useRef({});
  const loadedFramesRef = useRef(new Set());
  const frameCountRef = useRef(1);
  const animationIdRef = useRef(null);
  const hasStartedRef = useRef(false);
  const isPreloadingRef = useRef(false);
  const preloadPromiseRef = useRef(null);

  // Background image loader with no UI feedback
  const loadImage = useCallback((frameNumber) => {
    return new Promise((resolve, reject) => {
      // Skip if already loaded
      if (imagesRef.current[frameNumber]) {
        resolve(imagesRef.current[frameNumber]);
        return;
      }

      const img = new Image();
      
      // Optimize loading for background
      img.crossOrigin = "anonymous";
      img.decoding = "async";
      img.loading = "eager";
      
      img.onload = () => {
        imagesRef.current[frameNumber] = img;
        loadedFramesRef.current.add(frameNumber);
        resolve(img);
      };
      
      img.onerror = (error) => {
        console.debug(`Background load failed for frame ${frameNumber}`, error);
        // Create a small placeholder to prevent errors
        const placeholder = new Image();
        placeholder.width = 1;
        placeholder.height = 1;
        imagesRef.current[frameNumber] = placeholder;
        loadedFramesRef.current.add(frameNumber);
        resolve(placeholder);
      };
      
      img.src = `https://akm-img-a-in.tosshub.com/sites/interactive/immersive/ride-on-the-moon/assest/img/rocket/rocket1%20(${frameNumber}).jpg`;
    });
  }, []);

  // Intelligent background preloading with low priority
  const preloadAllFramesInBackground = useCallback(async () => {
    if (isPreloadingRef.current) return;
    isPreloadingRef.current = true;

    // Strategy: Load in small batches with delays to avoid blocking
    const batchSize = 15; // Smaller batches for smoother background loading
    const delayBetweenBatches = 100; // ms
    
    // Start with essential frames for immediate playback
    const essentialFrames = [
      1, 2, 3, 4, 5, 
      Math.floor(totalFrames * 0.1),
      Math.floor(totalFrames * 0.25),
      Math.floor(totalFrames * 0.5),
      Math.floor(totalFrames * 0.75),
      totalFrames
    ].filter(frame => frame >= 1 && frame <= totalFrames);

    // Load essential frames first (these will be needed first)
    try {
      await Promise.allSettled(essentialFrames.map(frame => loadImage(frame)));
    } catch (error) {
      console.debug("Essential frames load error:", error);
    }

    // Mark as loaded for immediate UI display
    setIsLoaded(true);

    // Continue loading remaining frames in background with low priority
    const allFrames = Array.from({ length: totalFrames }, (_, i) => i + 1);
    const remainingFrames = allFrames.filter(frame => 
      !loadedFramesRef.current.has(frame)
    );

    // Process remaining frames in background
    const backgroundLoader = async () => {
      for (let i = 0; i < remainingFrames.length; i += batchSize) {
        const batch = remainingFrames.slice(i, i + batchSize);
        
        // Use low priority requestIdleCallback if available
        if ('requestIdleCallback' in window) {
          await new Promise(resolve => {
            requestIdleCallback(async () => {
              await Promise.allSettled(batch.map(frame => loadImage(frame)));
              resolve();
            }, { timeout: 1000 });
          });
        } else {
          // Fallback to setTimeout for older browsers
          await new Promise(resolve => setTimeout(resolve, 10));
          await Promise.allSettled(batch.map(frame => loadImage(frame)));
        }
        
        // Small delay to prevent blocking main thread
        if (i < remainingFrames.length - batchSize) {
          await new Promise(resolve => setTimeout(resolve, delayBetweenBatches));
        }
      }
      console.debug("Background preloading complete");
    };

    // Start background loading without awaiting
    backgroundLoader().catch(error => {
      console.debug("Background loading error:", error);
    });

    return true;
  }, [loadImage, totalFrames]);

  // Start background preloading immediately on component mount
  useEffect(() => {
    // Store the promise to track preloading
    preloadPromiseRef.current = preloadAllFramesInBackground();
    
    return () => {
      // Cleanup if component unmounts
      isPreloadingRef.current = false;
    };
  }, [preloadAllFramesInBackground]);

  // Smart frame loader - loads frames around current position
  const preloadAroundCurrentFrame = useCallback((centerFrame) => {
    if (!isPreloadingRef.current) return;

    const preloadRange = 25; // Preload more frames around current position
    const startFrame = Math.max(1, centerFrame - preloadRange);
    const endFrame = Math.min(totalFrames, centerFrame + preloadRange);
    
    // Use requestIdleCallback for background loading
    const idlePreload = () => {
      for (let i = startFrame; i <= endFrame; i++) {
        if (!loadedFramesRef.current.has(i) && !imagesRef.current[i]) {
          // Load without awaiting
          loadImage(i).catch(() => {});
        }
      }
    };

    if ('requestIdleCallback' in window) {
      requestIdleCallback(idlePreload, { timeout: 500 });
    } else {
      // Fallback: Use setTimeout to yield to main thread
      setTimeout(idlePreload, 0);
    }
  }, [loadImage, totalFrames]);

  // Draw frame on canvas with smart fallback
  const drawFrame = useCallback(async (frameNum) => {
    const canvas = canvasRef.current;
    if (!canvas || !isActive) return;

    const ctx = canvas.getContext("2d");
    
    // Get the requested frame or nearest available
    let frameImg = imagesRef.current[frameNum];
    let actualFrame = frameNum;
    
    // If frame not loaded, find nearest loaded frame
    if (!frameImg) {
      for (let offset = 1; offset < 50; offset++) {
        const prevFrame = frameNum - offset;
        const nextFrame = frameNum + offset;
        
        if (prevFrame >= 1 && imagesRef.current[prevFrame]) {
          frameImg = imagesRef.current[prevFrame];
          actualFrame = prevFrame;
          break;
        }
        if (nextFrame <= totalFrames && imagesRef.current[nextFrame]) {
          frameImg = imagesRef.current[nextFrame];
          actualFrame = nextFrame;
          break;
        }
      }
    }

    if (frameImg) {
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Calculate dimensions to maintain aspect ratio
      const canvasAspect = canvas.width / canvas.height;
      const imgAspect = frameImg.width / frameImg.height;

      let drawWidth, drawHeight, offsetX, offsetY;

      if (imgAspect > canvasAspect) {
        // Image is wider than canvas
        drawHeight = canvas.height;
        drawWidth = frameImg.width * (canvas.height / frameImg.height);
        offsetX = -(drawWidth - canvas.width) / 2;
        offsetY = 0;
      } else {
        // Image is taller than canvas
        drawWidth = canvas.width;
        drawHeight = frameImg.height * (canvas.width / frameImg.width);
        offsetX = 0;
        offsetY = -(drawHeight - canvas.height) / 2;
      }

      // Draw image
      ctx.drawImage(frameImg, offsetX, offsetY, drawWidth, drawHeight);

      // Add overlay effect for better text readability
      ctx.fillStyle = "rgba(10, 10, 26, 0.4)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Preload frames around current position in background
      if (actualFrame !== frameNum) {
        // If we're showing a different frame, prioritize loading the correct one
        loadImage(frameNum).catch(() => {});
      }
      preloadAroundCurrentFrame(frameNum);
    } else {
      // No frames loaded yet, show solid background
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "#0a0a1a";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
  }, [isActive, totalFrames, loadImage, preloadAroundCurrentFrame]);

  // Check if component is in view
  const checkIfActive = useCallback(() => {
    if (!containerRef.current) return;

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
  }, [isActive, drawFrame]);

  // Handle scroll within active component
  const handleScroll = useCallback(() => {
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
    
    // Avoid division by zero
    const denominator = rect.height - windowHeight + visibleHeight;
    const scrollProgress = denominator > 0 ? 
      Math.max(0, Math.min(1, visibleTop / denominator)) : 0;

    // Calculate frame based on scroll progress
    const targetFrame = Math.min(
      totalFrames,
      Math.max(1, Math.floor(scrollProgress * totalFrames) + 1),
    );

    if (targetFrame !== frameCountRef.current) {
      frameCountRef.current = targetFrame;
      setCurrentFrame(targetFrame);
      
      // Use requestAnimationFrame for smooth drawing
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
      
      animationIdRef.current = requestAnimationFrame(() => {
        drawFrame(targetFrame);
      });
    }
  }, [isActive, totalFrames, drawFrame]);

  // Handle resize
  const handleResize = useCallback(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      if (isActive) {
        drawFrame(frameCountRef.current);
      }
    }
  }, [isActive, drawFrame]);

  // Setup event listeners
  useEffect(() => {
    const combinedScrollHandler = () => {
      checkIfActive();
      if (isActive) {
        handleScroll();
      }
    };

    // Throttle scroll events for performance
    let scrollTimeout;
    const throttledScrollHandler = () => {
      if (scrollTimeout) {
        cancelAnimationFrame(scrollTimeout);
      }
      scrollTimeout = requestAnimationFrame(combinedScrollHandler);
    };

    // Initial setup
    handleResize();

    // Add event listeners
    window.addEventListener("scroll", throttledScrollHandler, { passive: true });
    window.addEventListener("resize", handleResize);

    // Initial check
    checkIfActive();

    return () => {
      window.removeEventListener("scroll", throttledScrollHandler);
      window.removeEventListener("resize", handleResize);
      if (scrollTimeout) {
        cancelAnimationFrame(scrollTimeout);
      }
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
    };
  }, [checkIfActive, handleScroll, handleResize]);

  // UI Overlay Content - Always show content, animation loads in background
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
      style={{ height: "200vh" }}
    >
      <canvas
        ref={canvasRef}
        className="rocket-canvas"
        style={{ 
          display: isActive ? "block" : "none",
          opacity: 1
        }}
      />

      <div className="rocket-overlay">
        {/* Always show content, no loading screen */}
        <OverlayContent />
      </div>
    </div>
  );
};

export default RocketCanvas;