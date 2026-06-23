"use client";

import { useEffect, useRef } from "react";

export function WebGLBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext("webgl");
    if (!gl) return;

    const vsSource = `
      attribute vec2 position;
      varying vec2 vUv;
      void main() {
        vUv = position * 0.5 + 0.5;
        gl_Position = vec4(position, 0.0, 1.0);
      }
    `;

    const fsSource = `
      precision highp float;
      varying vec2 vUv;
      uniform vec2 uResolution;
      uniform float uTime;
      uniform vec2 uMouse;

      void main() {
        vec2 uv = gl_FragCoord.xy / uResolution.xy;
        vec2 aspectUv = uv;
        aspectUv.x *= uResolution.x / uResolution.y;

        vec2 mouseUv = uMouse / uResolution.xy;
        mouseUv.x *= uResolution.x / uResolution.y;

        float distToMouse = distance(aspectUv, mouseUv);
        
        float warpStrength = 0.08 * exp(-distToMouse * 2.0);
        vec2 warpOffset = vec2(0.0);
        if (distToMouse > 0.001) {
          warpOffset = normalize(aspectUv - mouseUv) * warpStrength * sin(distToMouse * 20.0 - uTime * 3.5);
        }

        vec2 gridUv = fract((aspectUv + warpOffset) * 20.0 - vec2(0.0, uTime * 0.06));
        float lineX = step(0.98, gridUv.x);
        float lineY = step(0.98, gridUv.y);
        float gridLines = lineX + lineY;

        vec3 color = vec3(0.01, 0.02, 0.05);

        vec3 gridColor = mix(vec3(0.15, 0.45, 0.85), vec3(0.15, 0.8, 0.7), sin(uTime * 0.2) * 0.5 + 0.5);
        
        float mouseGlow = exp(-distToMouse * 2.5) * 0.65;
        color += gridColor * gridLines * 0.35;
        color += gridColor * mouseGlow;

        vec2 particleUv = fract((aspectUv + warpOffset) * 35.0 + vec2(uTime * 0.02, -uTime * 0.04));
        float particles = step(0.992, particleUv.x) * step(0.992, particleUv.y);
        color += vec3(0.18, 0.83, 0.75) * particles * (sin(uTime * 2.0 + aspectUv.x * 100.0) * 0.5 + 0.5) * 0.6;

        gl_FragColor = vec4(color, 1.0);
      }
    `;

    const compileShader = (source: string, type: number) => {
      const shader = gl.createShader(type);
      if (!shader) return null;
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error("Shader compile error:", gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
      }
      return shader;
    };

    const vs = compileShader(vsSource, gl.VERTEX_SHADER);
    const fs = compileShader(fsSource, gl.FRAGMENT_SHADER);
    if (!vs || !fs) return;

    const program = gl.createProgram();
    if (!program) return;
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error("Program link error:", gl.getProgramInfoLog(program));
      return;
    }

    gl.useProgram(program);

    const vertices = new Float32Array([
      -1, -1,
       1, -1,
      -1,  1,
      -1,  1,
       1, -1,
       1,  1,
    ]);

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    const posAttr = gl.getAttribLocation(program, "position");
    gl.enableVertexAttribArray(posAttr);
    gl.vertexAttribPointer(posAttr, 2, gl.FLOAT, false, 0, 0);

    const resUniform = gl.getUniformLocation(program, "uResolution");
    const timeUniform = gl.getUniformLocation(program, "uTime");
    const mouseUniform = gl.getUniformLocation(program, "uMouse");

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);
    gl.viewport(0, 0, width, height);

    const mouse = { x: width / 2, y: height / 2 };
    const targetMouse = { x: width / 2, y: height / 2 };

    const handleMouseMove = (e: MouseEvent) => {
      targetMouse.x = e.clientX;
      targetMouse.y = height - e.clientY;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches[0]) {
        targetMouse.x = e.touches[0].clientX;
        targetMouse.y = height - e.touches[0].clientY;
      }
    };

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      gl.viewport(0, 0, width, height);
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("touchmove", handleTouchMove, { passive: true });
    window.addEventListener("resize", handleResize, { passive: true });

    let animationId: number;
    const startTime = performance.now();

    const render = () => {
      const elapsed = (performance.now() - startTime) * 0.001;

      mouse.x += (targetMouse.x - mouse.x) * 0.08;
      mouse.y += (targetMouse.y - mouse.y) * 0.08;

      gl.uniform2f(resUniform, width, height);
      gl.uniform1f(timeUniform, elapsed);
      gl.uniform2f(mouseUniform, mouse.x, mouse.y);

      gl.drawArrays(gl.TRIANGLES, 0, 6);
      animationId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("resize", handleResize);
      gl.deleteBuffer(buffer);
      gl.deleteProgram(program);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ mixBlendMode: "screen" }}
    />
  );
}
