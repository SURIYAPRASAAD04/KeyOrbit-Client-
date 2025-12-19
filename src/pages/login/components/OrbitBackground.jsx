import React, { useEffect, useRef } from 'react';

const OrbitBackground = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef?.current;
    if (!canvas) return;

    const ctx = canvas?.getContext('2d');
    let animationId;
    let particles = [];
    let time = 0;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const createParticles = () => {
      particles = [];
      const particleCount = Math.min(50, Math.floor(window.innerWidth / 30));
      
      for (let i = 0; i < particleCount; i++) {
        particles?.push({
          x: Math.random() * canvas?.width,
          y: Math.random() * canvas?.height,
          radius: Math.random() * 2 + 1,
          speed: Math.random() * 0.5 + 0.2,
          angle: Math.random() * Math.PI * 2,
          opacity: Math.random() * 0.5 + 0.2,
          orbitRadius: Math.random() * 100 + 50,
          orbitSpeed: (Math.random() - 0.5) * 0.02
        });
      }
    };

    const drawOrbitRings = () => {
      const centerX = canvas?.width / 2;
      const centerY = canvas?.height / 2;
      
      // Draw orbital rings
      for (let i = 1; i <= 3; i++) {
        const radius = i * 120;
        const opacity = 0.1 - (i * 0.02);
        
        ctx?.beginPath();
        ctx?.arc(centerX, centerY, radius, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(0, 86, 179, ${opacity})`;
        ctx.lineWidth = 1;
        ctx?.stroke();
      }
    };

    const drawParticles = () => {
      particles?.forEach(particle => {
        // Update particle position with orbital motion
        particle.angle += particle?.orbitSpeed;
        particle.x += Math.cos(particle?.angle) * particle?.speed;
        particle.y += Math.sin(particle?.angle) * particle?.speed;
        
        // Wrap around screen
        if (particle?.x > canvas?.width) particle.x = 0;
        if (particle?.x < 0) particle.x = canvas?.width;
        if (particle?.y > canvas?.height) particle.y = 0;
        if (particle?.y < 0) particle.y = canvas?.height;
        
        // Draw particle
        ctx?.beginPath();
        ctx?.arc(particle?.x, particle?.y, particle?.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(242, 140, 0, ${particle?.opacity})`;
        ctx?.fill();
        
        // Add glow effect
        ctx.shadowBlur = 10;
        ctx.shadowColor = 'rgba(242, 140, 0, 0.5)';
        ctx?.fill();
        ctx.shadowBlur = 0;
      });
    };

    const animate = () => {
      ctx?.clearRect(0, 0, canvas?.width, canvas?.height);
      
      time += 0.01;
      
      // Draw background gradient
      const gradient = ctx?.createRadialGradient(
        canvas?.width / 2, canvas?.height / 2, 0,
        canvas?.width / 2, canvas?.height / 2, Math.max(canvas?.width, canvas?.height) / 2
      );
      gradient?.addColorStop(0, 'rgba(11, 11, 82, 0.05)');
      gradient?.addColorStop(1, 'rgba(0, 86, 179, 0.1)');
      
      ctx.fillStyle = gradient;
      ctx?.fillRect(0, 0, canvas?.width, canvas?.height);
      
      drawOrbitRings();
      drawParticles();
      
      animationId = requestAnimationFrame(animate);
    };

    const handleResize = () => {
      resizeCanvas();
      createParticles();
    };

    // Initialize
    resizeCanvas();
    createParticles();
    animate();

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none z-0"
      style={{ background: 'linear-gradient(135deg, #FAFBFC 0%, #F9FAFB 100%)' }}
    />
  );
};

export default OrbitBackground;