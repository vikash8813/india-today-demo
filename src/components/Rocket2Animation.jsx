import React, { useEffect, useRef, useState, useCallback } from "react";
import "../assets/RocketAnimation.css";

const RocketCanvas2 = () => {
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

  // Background image loader
  const loadImage = useCallback((frameNumber) => {
    return new Promise((resolve, reject) => {
      // Check if already cached
      if (imagesRef.current[frameNumber]) {
        resolve(imagesRef.current[frameNumber]);
        return;
      }

      const img = new Image();
      img.crossOrigin = "anonymous";
      img.decoding = "async";
      img.loading = "eager";
      
      img.onload = () => {
        imagesRef.current[frameNumber] = img;
        loadedFramesRef.current.add(frameNumber);
        resolve(img);
      };
      
      img.onerror = () => {
        // Create minimal placeholder to prevent errors
        const placeholder = new Image();
        placeholder.width = 1;
        placeholder.height = 1;
        imagesRef.current[frameNumber] = placeholder;
        loadedFramesRef.current.add(frameNumber);
        resolve(placeholder);
      };
      
      img.src = `https://akm-img-a-in.tosshub.com/sites/interactive/immersive/ride-on-the-moon/assest/img/rocket2-desktop/rocket1%20(${frameNumber}).jpg`;
    });
  }, []);

  // Background preloading without UI feedback
  const preloadAllFramesInBackground = useCallback(async () => {
    if (isPreloadingRef.current) return;
    isPreloadingRef.current = true;

    // Load essential frames first for immediate playback
    const essentialFrames = [
      1, 2, 3, 4, 5, 10, 15, 20, 25,
      Math.floor(totalFrames * 0.1),
      Math.floor(totalFrames * 0.25),
      Math.floor(totalFrames * 0.5),
      Math.floor(totalFrames * 0.75),
      totalFrames
    ].filter(frame => frame >= 1 && frame <= totalFrames);

    // Load essential frames
    try {
      await Promise.allSettled(essentialFrames.map(frame => loadImage(frame)));
    } catch (error) {
      console.debug("Essential frames load error:", error);
    }

    // Mark as loaded immediately (don't wait for all frames)
    setIsLoaded(true);

    // Continue loading remaining frames in background
    const backgroundLoader = async () => {
      const allFrames = Array.from({ length: totalFrames }, (_, i) => i + 1);
      const remainingFrames = allFrames.filter(frame => 
        !loadedFramesRef.current.has(frame)
      );

      const batchSize = 15;
      const delayBetweenBatches = 50;

      for (let i = 0; i < remainingFrames.length; i += batchSize) {
        if (!isPreloadingRef.current) break;
        
        const batch = remainingFrames.slice(i, i + batchSize);
        
        // Use idle time if available
        if ('requestIdleCallback' in window) {
          await new Promise(resolve => {
            requestIdleCallback(async () => {
              await Promise.allSettled(batch.map(frame => loadImage(frame)));
              resolve();
            }, { timeout: 1000 });
          });
        } else {
          // Fallback
          await Promise.allSettled(batch.map(frame => loadImage(frame)));
          await new Promise(resolve => setTimeout(resolve, delayBetweenBatches));
        }
      }
    };

    // Start background loading without awaiting
    backgroundLoader().catch(error => {
      console.debug("Background loading error:", error);
    });

    return true;
  }, [loadImage, totalFrames]);

  // Start background preloading immediately
  useEffect(() => {
    preloadAllFramesInBackground();
    
    return () => {
      isPreloadingRef.current = false;
    };
  }, [preloadAllFramesInBackground]);

  // Preload frames around current position
  const preloadAroundCurrentFrame = useCallback((centerFrame) => {
    const preloadRange = 30;
    const startFrame = Math.max(1, centerFrame - preloadRange);
    const endFrame = Math.min(totalFrames, centerFrame + preloadRange);
    
    // Use idle callback for background loading
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
      setTimeout(idlePreload, 0);
    }
  }, [loadImage, totalFrames]);

  // Draw frame on canvas
  const drawFrame = useCallback(async (frameNum) => {
    const canvas = canvasRef.current;
    if (!canvas || !isActive) return;

    const ctx = canvas.getContext("2d");
    
    // Get the requested frame or nearest available
    let frameImg = imagesRef.current[frameNum];
    let actualFrame = frameNum;
    
    // If frame not loaded, find nearest loaded frame
    if (!frameImg) {
      for (let offset = 1; offset < 30; offset++) {
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
      preloadAroundCurrentFrame(frameNum);
    }
  }, [isActive, totalFrames, preloadAroundCurrentFrame]);

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

  return (
    <div
      className="rocket-animation-container rocket2-container"
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
        {/* Always render content, no loading UI */}
        
      </div>
    </div>
  );
};

export default RocketCanvas2;