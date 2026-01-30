import { useEffect, useRef } from "react";

const TOTAL_FRAMES = 500;

const BASE_URL =
  "https://akm-img-a-in.tosshub.com/sites/interactive/immersive/ride-on-the-moon/assest/img/rocket/";

const getImageUrl = (index) => {
  const fileName = `rocket1 (${index}).jpg`;
  return BASE_URL + encodeURIComponent(fileName);
};

export default function RocketCanvas() {
  const canvasRef = useRef(null);
  const imagesRef = useRef([]);
  const ctxRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    ctxRef.current = ctx;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // 🔹 Preload images
    for (let i = 1; i <= TOTAL_FRAMES; i++) {
      const img = new Image();
      img.src = getImageUrl(i);
      imagesRef.current.push(img);
    }

    // Draw first frame when loaded
    imagesRef.current[0].onload = () => {
      drawFrame(0);
    };

    const drawFrame = (index) => {
      const img = imagesRef.current[index];
      if (!img || !img.complete) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const scale = Math.max(
        canvas.width / img.width,
        canvas.height / img.height
      );

      const x = (canvas.width - img.width * scale) / 2;
      const y = (canvas.height - img.height * scale) / 2;

      ctx.drawImage(
        img,
        0,
        0,
        img.width,
        img.height,
        x,
        y,
        img.width * scale,
        img.height * scale
      );
    };

    const onScroll = () => {
      const scrollTop = window.scrollY;
      const maxScroll =
        document.documentElement.scrollHeight - window.innerHeight;

      const frameIndex = Math.min(
        TOTAL_FRAMES - 1,
        Math.floor((scrollTop / maxScroll) * TOTAL_FRAMES)
      );

      drawFrame(frameIndex);
    };

    window.addEventListener("scroll", onScroll);

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "sticky",
        top: 0,
        width: "100%",
        height: "100vh",
      }}
    />
  );
}
