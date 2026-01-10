// Vanilla JS Terminal Effect using WebGL
class FaultyTerminal {
  constructor(container, options = {}) {
    this.container = container;
    this.options = {
      scale: options.scale || 1.5,
      gridMul: options.gridMul || [2, 1],
      digitSize: options.digitSize || 1.2,
      timeScale: options.timeScale || 1,
      pause: options.pause || false,
      scanlineIntensity: options.scanlineIntensity || 1,
      glitchAmount: options.glitchAmount || 1,
      flickerAmount: options.flickerAmount || 1,
      noiseAmp: options.noiseAmp || 1,
      chromaticAberration: options.chromaticAberration || 0,
      dither: options.dither || 0,
      curvature: options.curvature || 0,
      tint: options.tint || '#DFB6B2',
      mouseReact: options.mouseReact !== false,
      mouseStrength: options.mouseStrength || 0.5,
      pageLoadAnimation: options.pageLoadAnimation !== false,
      brightness: options.brightness || 1
    };

    this.mouse = { x: 0.5, y: 0.5 };
    this.smoothMouse = { x: 0.5, y: 0.5 };
    this.frozenTime = 0;
    this.rafId = null;
    this.loadAnimationStart = 0;
    this.timeOffset = Math.random() * 100;

    this.init();
  }

  hexToRgb(hex) {
    let h = hex.replace('#', '').trim();
    if (h.length === 3) {
      h = h.split('').map(c => c + c).join('');
    }
    const num = parseInt(h, 16);
    return [
      ((num >> 16) & 255) / 255,
      ((num >> 8) & 255) / 255,
      (num & 255) / 255
    ];
  }

  init() {
    // Create canvas
    this.canvas = document.createElement('canvas');
    this.canvas.style.width = '100%';
    this.canvas.style.height = '100%';
    this.canvas.style.display = 'block';
    this.container.appendChild(this.canvas);

    // Get WebGL context
    this.gl = this.canvas.getContext('webgl') || this.canvas.getContext('experimental-webgl');
    if (!this.gl) {
      console.error('WebGL not supported');
      return;
    }

    this.gl.clearColor(0, 0, 0, 1);

    // Create shaders and program
    this.createShaderProgram();
    this.createGeometry();
    this.setupUniforms();

    // Event listeners
    if (this.options.mouseReact) {
      this.container.addEventListener('mousemove', this.handleMouseMove.bind(this));
    }

    // Resize observer
    this.resizeObserver = new ResizeObserver(() => this.resize());
    this.resizeObserver.observe(this.container);
    this.resize();

    // Start animation
    this.animate();
  }

  createShaderProgram() {
    const vertexShader = `
      attribute vec2 position;
      attribute vec2 uv;
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = vec4(position, 0.0, 1.0);
      }
    `;

    const fragmentShader = `
      precision mediump float;
      varying vec2 vUv;
      uniform float iTime;
      uniform vec3 iResolution;
      uniform float uScale;
      uniform vec2 uGridMul;
      uniform float uDigitSize;
      uniform float uScanlineIntensity;
      uniform float uGlitchAmount;
      uniform float uFlickerAmount;
      uniform float uNoiseAmp;
      uniform float uChromaticAberration;
      uniform float uDither;
      uniform float uCurvature;
      uniform vec3 uTint;
      uniform vec2 uMouse;
      uniform float uMouseStrength;
      uniform float uUseMouse;
      uniform float uPageLoadProgress;
      uniform float uUsePageLoadAnimation;
      uniform float uBrightness;

      float time;

      float hash21(vec2 p){
        p = fract(p * 234.56);
        p += dot(p, p + 34.56);
        return fract(p.x * p.y);
      }

      float noise(vec2 p) {
        return sin(p.x * 10.0) * sin(p.y * (3.0 + sin(time * 0.090909))) + 0.2; 
      }

      mat2 rotate(float angle) {
        float c = cos(angle);
        float s = sin(angle);
        return mat2(c, -s, s, c);
      }

      float fbm(vec2 p) {
        p *= 1.1;
        float f = 0.0;
        float amp = 0.5 * uNoiseAmp;
        
        mat2 modify0 = rotate(time * 0.02);
        f += amp * noise(p);
        p = modify0 * p * 2.0;
        amp *= 0.454545;
        
        mat2 modify1 = rotate(time * 0.02);
        f += amp * noise(p);
        p = modify1 * p * 2.0;
        amp *= 0.454545;
        
        mat2 modify2 = rotate(time * 0.08);
        f += amp * noise(p);
        
        return f;
      }

      float pattern(vec2 p, out vec2 q, out vec2 r) {
        vec2 offset1 = vec2(1.0);
        vec2 offset0 = vec2(0.0);
        mat2 rot01 = rotate(0.1 * time);
        mat2 rot1 = rotate(0.1);
        
        q = vec2(fbm(p + offset1), fbm(rot01 * p + offset1));
        r = vec2(fbm(rot1 * q + offset0), fbm(q + offset0));
        return fbm(p + r);
      }

      float digit(vec2 p){
        vec2 grid = uGridMul * 15.0;
        vec2 s = floor(p * grid) / grid;
        p = p * grid;
        vec2 q, r;
        float intensity = pattern(s * 0.1, q, r) * 1.3 - 0.03;
        
        if(uUseMouse > 0.5){
          vec2 mouseWorld = uMouse * uScale;
          float distToMouse = distance(s, mouseWorld);
          float mouseInfluence = exp(-distToMouse * 8.0) * uMouseStrength * 10.0;
          intensity += mouseInfluence;
          
          float ripple = sin(distToMouse * 20.0 - iTime * 5.0) * 0.1 * mouseInfluence;
          intensity += ripple;
        }
        
        if(uUsePageLoadAnimation > 0.5){
          float cellRandom = fract(sin(dot(s, vec2(12.9898, 78.233))) * 43758.5453);
          float cellDelay = cellRandom * 0.8;
          float cellProgress = clamp((uPageLoadProgress - cellDelay) / 0.2, 0.0, 1.0);
          
          float fadeAlpha = smoothstep(0.0, 1.0, cellProgress);
          intensity *= fadeAlpha;
        }
        
        p = fract(p);
        p *= uDigitSize;
        
        float px5 = p.x * 5.0;
        float py5 = (1.0 - p.y) * 5.0;
        float x = fract(px5);
        float y = fract(py5);
        
        float i = floor(py5) - 2.0;
        float j = floor(px5) - 2.0;
        float n = i * i + j * j;
        float f = n * 0.0625;
        
        float isOn = step(0.1, intensity - f);
        float brightness = isOn * (0.2 + y * 0.8) * (0.75 + x * 0.25);
        
        return step(0.0, p.x) * step(p.x, 1.0) * step(0.0, p.y) * step(p.y, 1.0) * brightness;
      }

      float onOff(float a, float b, float c) {
        return step(c, sin(iTime + a * cos(iTime * b))) * uFlickerAmount;
      }

      float displace(vec2 look) {
        float y = look.y - mod(iTime * 0.25, 1.0);
        float window = 1.0 / (1.0 + 50.0 * y * y);
        return sin(look.y * 20.0 + iTime) * 0.0125 * onOff(4.0, 2.0, 0.8) * (1.0 + cos(iTime * 60.0)) * window;
      }

      vec3 getColor(vec2 p){
        float bar = step(mod(p.y + time * 20.0, 1.0), 0.2) * 0.4 + 1.0;
        bar *= uScanlineIntensity;
        
        float displacement = displace(p);
        p.x += displacement;

        if (uGlitchAmount != 1.0) {
          float extra = displacement * (uGlitchAmount - 1.0);
          p.x += extra;
        }

        float middle = digit(p);
        
        const float off = 0.002;
        float sum = digit(p + vec2(-off, -off)) + digit(p + vec2(0.0, -off)) + digit(p + vec2(off, -off)) +
                    digit(p + vec2(-off, 0.0)) + digit(p + vec2(0.0, 0.0)) + digit(p + vec2(off, 0.0)) +
                    digit(p + vec2(-off, off)) + digit(p + vec2(0.0, off)) + digit(p + vec2(off, off));
        
        vec3 baseColor = vec3(0.9) * middle + sum * 0.1 * vec3(1.0) * bar;
        return baseColor;
      }

      vec2 barrel(vec2 uv){
        vec2 c = uv * 2.0 - 1.0;
        float r2 = dot(c, c);
        c *= 1.0 + uCurvature * r2;
        return c * 0.5 + 0.5;
      }

      void main() {
        time = iTime * 0.333333;
        vec2 uv = vUv;

        if(uCurvature != 0.0){
          uv = barrel(uv);
        }
        
        vec2 p = uv * uScale;
        vec3 col = getColor(p);

        if(uChromaticAberration != 0.0){
          vec2 ca = vec2(uChromaticAberration) / iResolution.xy;
          col.r = getColor(p + ca).r;
          col.b = getColor(p - ca).b;
        }

        col *= uTint;
        col *= uBrightness;

        if(uDither > 0.0){
          float rnd = hash21(gl_FragCoord.xy);
          col += (rnd - 0.5) * (uDither * 0.003922);
        }

        gl_FragColor = vec4(col, 1.0);
      }
    `;

    const vs = this.compileShader(vertexShader, this.gl.VERTEX_SHADER);
    const fs = this.compileShader(fragmentShader, this.gl.FRAGMENT_SHADER);

    this.program = this.gl.createProgram();
    this.gl.attachShader(this.program, vs);
    this.gl.attachShader(this.program, fs);
    this.gl.linkProgram(this.program);

    if (!this.gl.getProgramParameter(this.program, this.gl.LINK_STATUS)) {
      console.error('Program link error:', this.gl.getProgramInfoLog(this.program));
    }

    this.gl.useProgram(this.program);
  }

  compileShader(source, type) {
    const shader = this.gl.createShader(type);
    this.gl.shaderSource(shader, source);
    this.gl.compileShader(shader);

    if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
      console.error('Shader compile error:', this.gl.getShaderInfoLog(shader));
      this.gl.deleteShader(shader);
      return null;
    }

    return shader;
  }

  createGeometry() {
    const vertices = new Float32Array([
      -1, -1, 0, 0,
      3, -1, 2, 0,
      -1, 3, 0, 2
    ]);

    const buffer = this.gl.createBuffer();
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, buffer);
    this.gl.bufferData(this.gl.ARRAY_BUFFER, vertices, this.gl.STATIC_DRAW);

    const posLoc = this.gl.getAttribLocation(this.program, 'position');
    const uvLoc = this.gl.getAttribLocation(this.program, 'uv');

    this.gl.enableVertexAttribArray(posLoc);
    this.gl.vertexAttribPointer(posLoc, 2, this.gl.FLOAT, false, 16, 0);

    this.gl.enableVertexAttribArray(uvLoc);
    this.gl.vertexAttribPointer(uvLoc, 2, this.gl.FLOAT, false, 16, 8);
  }

  setupUniforms() {
    this.uniforms = {
      iTime: this.gl.getUniformLocation(this.program, 'iTime'),
      iResolution: this.gl.getUniformLocation(this.program, 'iResolution'),
      uScale: this.gl.getUniformLocation(this.program, 'uScale'),
      uGridMul: this.gl.getUniformLocation(this.program, 'uGridMul'),
      uDigitSize: this.gl.getUniformLocation(this.program, 'uDigitSize'),
      uScanlineIntensity: this.gl.getUniformLocation(this.program, 'uScanlineIntensity'),
      uGlitchAmount: this.gl.getUniformLocation(this.program, 'uGlitchAmount'),
      uFlickerAmount: this.gl.getUniformLocation(this.program, 'uFlickerAmount'),
      uNoiseAmp: this.gl.getUniformLocation(this.program, 'uNoiseAmp'),
      uChromaticAberration: this.gl.getUniformLocation(this.program, 'uChromaticAberration'),
      uDither: this.gl.getUniformLocation(this.program, 'uDither'),
      uCurvature: this.gl.getUniformLocation(this.program, 'uCurvature'),
      uTint: this.gl.getUniformLocation(this.program, 'uTint'),
      uMouse: this.gl.getUniformLocation(this.program, 'uMouse'),
      uMouseStrength: this.gl.getUniformLocation(this.program, 'uMouseStrength'),
      uUseMouse: this.gl.getUniformLocation(this.program, 'uUseMouse'),
      uPageLoadProgress: this.gl.getUniformLocation(this.program, 'uPageLoadProgress'),
      uUsePageLoadAnimation: this.gl.getUniformLocation(this.program, 'uUsePageLoadAnimation'),
      uBrightness: this.gl.getUniformLocation(this.program, 'uBrightness')
    };

    const tintRgb = this.hexToRgb(this.options.tint);
    this.gl.uniform1f(this.uniforms.uScale, this.options.scale);
    this.gl.uniform2f(this.uniforms.uGridMul, this.options.gridMul[0], this.options.gridMul[1]);
    this.gl.uniform1f(this.uniforms.uDigitSize, this.options.digitSize);
    this.gl.uniform1f(this.uniforms.uScanlineIntensity, this.options.scanlineIntensity);
    this.gl.uniform1f(this.uniforms.uGlitchAmount, this.options.glitchAmount);
    this.gl.uniform1f(this.uniforms.uFlickerAmount, this.options.flickerAmount);
    this.gl.uniform1f(this.uniforms.uNoiseAmp, this.options.noiseAmp);
    this.gl.uniform1f(this.uniforms.uChromaticAberration, this.options.chromaticAberration);
    this.gl.uniform1f(this.uniforms.uDither, this.options.dither);
    this.gl.uniform1f(this.uniforms.uCurvature, this.options.curvature);
    this.gl.uniform3f(this.uniforms.uTint, tintRgb[0], tintRgb[1], tintRgb[2]);
    this.gl.uniform1f(this.uniforms.uMouseStrength, this.options.mouseStrength);
    this.gl.uniform1f(this.uniforms.uUseMouse, this.options.mouseReact ? 1 : 0);
    this.gl.uniform1f(this.uniforms.uUsePageLoadAnimation, this.options.pageLoadAnimation ? 1 : 0);
    this.gl.uniform1f(this.uniforms.uBrightness, this.options.brightness);
  }

  handleMouseMove(e) {
    const rect = this.container.getBoundingClientRect();
    this.mouse.x = (e.clientX - rect.left) / rect.width;
    this.mouse.y = 1 - (e.clientY - rect.top) / rect.height;
  }

  resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const width = this.container.offsetWidth;
    const height = this.container.offsetHeight;

    this.canvas.width = width * dpr;
    this.canvas.height = height * dpr;
    this.canvas.style.width = width + 'px';
    this.canvas.style.height = height + 'px';

    this.gl.viewport(0, 0, this.canvas.width, this.canvas.height);
    this.gl.uniform3f(
      this.uniforms.iResolution,
      this.canvas.width,
      this.canvas.height,
      this.canvas.width / this.canvas.height
    );
  }

  animate(timestamp = 0) {
    this.rafId = requestAnimationFrame((t) => this.animate(t));

    if (this.options.pageLoadAnimation && this.loadAnimationStart === 0) {
      this.loadAnimationStart = timestamp;
    }

    if (!this.options.pause) {
      const elapsed = (timestamp * 0.001 + this.timeOffset) * this.options.timeScale;
      this.gl.uniform1f(this.uniforms.iTime, elapsed);
      this.frozenTime = elapsed;
    } else {
      this.gl.uniform1f(this.uniforms.iTime, this.frozenTime);
    }

    if (this.options.pageLoadAnimation && this.loadAnimationStart > 0) {
      const animationDuration = 2000;
      const animationElapsed = timestamp - this.loadAnimationStart;
      const progress = Math.min(animationElapsed / animationDuration, 1);
      this.gl.uniform1f(this.uniforms.uPageLoadProgress, progress);
    }

    if (this.options.mouseReact) {
      const dampingFactor = 0.08;
      this.smoothMouse.x += (this.mouse.x - this.smoothMouse.x) * dampingFactor;
      this.smoothMouse.y += (this.mouse.y - this.smoothMouse.y) * dampingFactor;
      this.gl.uniform2f(this.uniforms.uMouse, this.smoothMouse.x, this.smoothMouse.y);
    }

    this.gl.clear(this.gl.COLOR_BUFFER_BIT);
    this.gl.drawArrays(this.gl.TRIANGLES, 0, 3);
  }

  destroy() {
    if (this.rafId) {
      cancelAnimationFrame(this.rafId);
    }
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
    }
    if (this.canvas && this.canvas.parentElement) {
      this.canvas.parentElement.removeChild(this.canvas);
    }
    if (this.gl) {
      const ext = this.gl.getExtension('WEBGL_lose_context');
      if (ext) ext.loseContext();
    }
  }
}
