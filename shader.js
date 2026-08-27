(() => {
  const canvas = document.querySelector("#shader-canvas");
  const hero = document.querySelector(".intro");
  if (!canvas || !hero) return;

  const gl = canvas.getContext("webgl", {
    alpha: false,
    antialias: false,
    depth: false,
    powerPreference: "high-performance",
  });
  if (!gl) {
    canvas.hidden = true;
    return;
  }

  const vertexSource = `
    attribute vec2 a_position;
    void main() {
      gl_Position = vec4(a_position, 0.0, 1.0);
    }
  `;

  const fragmentSource = `
    precision highp float;

    uniform vec2 u_resolution;
    uniform vec2 u_pointer;
    uniform vec2 u_imageResolution;
    uniform vec2 u_velocity;
    uniform float u_time;
    uniform float u_energy;
    uniform sampler2D u_image;

    float hash(vec2 p) {
      p = fract(p * vec2(123.34, 456.21));
      p += dot(p, p + 45.32);
      return fract(p.x * p.y);
    }

    float noise(vec2 p) {
      vec2 i = floor(p);
      vec2 f = fract(p);
      f = f * f * (3.0 - 2.0 * f);
      return mix(
        mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x),
        mix(hash(i + vec2(0.0, 1.0)), hash(i + 1.0), f.x),
        f.y
      );
    }

    float surface(vec2 p) {
      float broad = noise(p * 3.4 + vec2(u_time * 0.008, 0.0));
      float grain = noise(p * 26.0);
      float fibers = noise(vec2(p.x * 44.0, p.y * 7.0));
      return broad * 0.58 + grain * 0.28 + fibers * 0.14;
    }

    void main() {
      vec2 uv = gl_FragCoord.xy / u_resolution.xy;
      vec2 aspect = vec2(u_resolution.x / u_resolution.y, 1.0);
      vec2 delta = (uv - u_pointer) * aspect;
      float distanceToPointer = length(delta);

      float halo = exp(-distanceToPointer * distanceToPointer * 34.0);
      float speed = min(length(u_velocity), 1.0);
      vec2 velocityDirection = u_velocity / max(length(u_velocity), 0.001);
      float wake = dot(normalize(delta + 0.001), velocityDirection);
      float ring = sin(distanceToPointer * (52.0 + speed * 12.0) - u_time * (2.0 + speed * 2.8));
      float directionalFalloff = exp(-distanceToPointer * mix(9.5, 5.2, max(0.0, -wake) * speed));
      float ripple = ring * directionalFalloff * u_energy;
      vec2 direction = delta / max(distanceToPointer, 0.002);
      vec2 warpedUv = uv + direction * ripple * (0.0045 + speed * 0.014);
      warpedUv -= velocityDirection * halo * speed * 0.012;

      float height = surface(warpedUv * aspect);
      float epsilon = 1.5 / min(u_resolution.x, u_resolution.y);
      float heightX = surface((warpedUv + vec2(epsilon, 0.0)) * aspect);
      float heightY = surface((warpedUv + vec2(0.0, epsilon)) * aspect);
      vec2 normal = vec2(height - heightX, height - heightY) * 17.0;
      normal += direction * ripple * 0.34;

      float screenAspect = u_resolution.x / u_resolution.y;
      float imageAspect = u_imageResolution.x / u_imageResolution.y;
      vec2 imageUv = warpedUv;
      if (screenAspect > imageAspect) {
        imageUv.y = (imageUv.y - 0.5) * (imageAspect / screenAspect) + 0.5;
      } else {
        imageUv.x = (imageUv.x - 0.5) * (screenAspect / imageAspect) + 0.5;
      }
      vec3 forest = texture2D(u_image, imageUv).rgb;
      vec3 coolLight = vec3(0.19, 0.30, 0.41);
      float sheen = max(0.0, dot(normalize(vec3(normal, 0.42)), normalize(vec3(-0.48, 0.55, 0.68))));
      forest *= vec3(0.72, 0.79, 0.88);
      forest *= 0.68;
      forest += coolLight * sheen * halo * u_energy * (0.14 + speed * 0.32);
      forest += vec3(0.12, 0.09, 0.035) * max(ripple, 0.0) * (0.12 + speed * 0.16);

      float vignette = smoothstep(1.05, 0.28, length((uv - 0.5) * vec2(0.82, 1.0)));
      forest *= 0.72 + vignette * 0.28;
      gl_FragColor = vec4(forest, 1.0);
    }
  `;

  const compileShader = (type, source) => {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      gl.deleteShader(shader);
      return null;
    }
    return shader;
  };

  const vertexShader = compileShader(gl.VERTEX_SHADER, vertexSource);
  const fragmentShader = compileShader(gl.FRAGMENT_SHADER, fragmentSource);
  if (!vertexShader || !fragmentShader) {
    canvas.hidden = true;
    return;
  }

  const program = gl.createProgram();
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    canvas.hidden = true;
    return;
  }

  const buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array([-1, -1, 3, -1, -1, 3]),
    gl.STATIC_DRAW,
  );

  gl.useProgram(program);
  const position = gl.getAttribLocation(program, "a_position");
  gl.enableVertexAttribArray(position);
  gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);

  const uniforms = {
    resolution: gl.getUniformLocation(program, "u_resolution"),
    pointer: gl.getUniformLocation(program, "u_pointer"),
    imageResolution: gl.getUniformLocation(program, "u_imageResolution"),
    velocity: gl.getUniformLocation(program, "u_velocity"),
    time: gl.getUniformLocation(program, "u_time"),
    energy: gl.getUniformLocation(program, "u_energy"),
    image: gl.getUniformLocation(program, "u_image"),
  };

  const target = { x: 0.5, y: 0.5 };
  const pointer = { x: 0.5, y: 0.5 };
  const targetVelocity = { x: 0, y: 0 };
  const velocity = { x: 0, y: 0 };
  let targetEnergy = 0;
  let energy = 0;
  let lastPointerTime = 0;
  let lastPointer = null;
  let frameId = 0;
  let visible = true;

  const resize = () => {
    const rect = hero.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    const width = Math.max(1, Math.round(rect.width * dpr));
    const height = Math.max(1, Math.round(rect.height * dpr));
    if (canvas.width !== width || canvas.height !== height) {
      canvas.width = width;
      canvas.height = height;
      gl.viewport(0, 0, width, height);
    }
  };

  const updatePointer = (event) => {
    const rect = hero.getBoundingClientRect();
    if (event.clientY < rect.top || event.clientY > rect.bottom) return;
    target.x = (event.clientX - rect.left) / rect.width;
    target.y = 1 - (event.clientY - rect.top) / rect.height;
    const now = performance.now();
    if (lastPointer) {
      const elapsed = Math.max(8, now - lastPointer.time) / 1000;
      targetVelocity.x = Math.max(-1, Math.min(1, (target.x - lastPointer.x) / elapsed / 3.4));
      targetVelocity.y = Math.max(-1, Math.min(1, (target.y - lastPointer.y) / elapsed / 3.4));
      targetEnergy = Math.min(1, 0.24 + Math.hypot(targetVelocity.x, targetVelocity.y) * 1.3);
    }
    lastPointer = { x: target.x, y: target.y, time: now };
    lastPointerTime = now;
  };

  const render = (now) => {
    frameId = 0;
    if (!visible) return;

    resize();
    pointer.x += (target.x - pointer.x) * 0.1;
    pointer.y += (target.y - pointer.y) * 0.1;
    velocity.x += (targetVelocity.x - velocity.x) * 0.18;
    velocity.y += (targetVelocity.y - velocity.y) * 0.18;
    if (now - lastPointerTime > 80) {
      targetVelocity.x *= 0.86;
      targetVelocity.y *= 0.86;
    }
    if (now - lastPointerTime > 220) targetEnergy = 0.08;
    energy += (targetEnergy - energy) * 0.055;

    gl.uniform2f(uniforms.resolution, canvas.width, canvas.height);
    gl.uniform2f(uniforms.pointer, pointer.x, pointer.y);
    gl.uniform2f(uniforms.velocity, velocity.x, velocity.y);
    gl.uniform1f(uniforms.time, now * 0.001);
    gl.uniform1f(uniforms.energy, energy);
    gl.drawArrays(gl.TRIANGLES, 0, 3);

    frameId = window.requestAnimationFrame(render);
  };

  const start = () => {
    if (!frameId && visible) frameId = window.requestAnimationFrame(render);
  };

  window.addEventListener("pointermove", updatePointer, { passive: true });
  window.addEventListener("resize", resize);
  document.addEventListener("visibilitychange", () => {
    visible = !document.hidden;
    if (visible) start();
  });

  const texture = gl.createTexture();
  gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([10, 15, 24, 255]));
  gl.uniform1i(uniforms.image, 0);

  const image = new Image();
  image.addEventListener("load", () => {
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
    gl.uniform2f(uniforms.imageResolution, image.naturalWidth, image.naturalHeight);
    resize();
    start();
  });
  image.addEventListener("error", () => {
    canvas.hidden = true;
  });
  image.src = "assets/swamp-hero.jpg";
})();
