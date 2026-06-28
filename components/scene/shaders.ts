// Shared GLSL building blocks for the cinematic scene.

export const NOISE = /* glsl */ `
  // Simplex / value noise utilities (Ashima-style)
  vec3 mod289(vec3 x){ return x - floor(x * (1.0/289.0)) * 289.0; }
  vec4 mod289(vec4 x){ return x - floor(x * (1.0/289.0)) * 289.0; }
  vec4 permute(vec4 x){ return mod289(((x*34.0)+1.0)*x); }
  vec4 taylorInvSqrt(vec4 r){ return 1.79284291400159 - 0.85373472095314 * r; }

  float snoise(vec3 v){
    const vec2 C = vec2(1.0/6.0, 1.0/3.0);
    const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
    vec3 i  = floor(v + dot(v, C.yyy));
    vec3 x0 = v - i + dot(i, C.xxx);
    vec3 g = step(x0.yzx, x0.xyz);
    vec3 l = 1.0 - g;
    vec3 i1 = min(g.xyz, l.zxy);
    vec3 i2 = max(g.xyz, l.zxy);
    vec3 x1 = x0 - i1 + C.xxx;
    vec3 x2 = x0 - i2 + C.yyy;
    vec3 x3 = x0 - D.yyy;
    i = mod289(i);
    vec4 p = permute(permute(permute(
              i.z + vec4(0.0, i1.z, i2.z, 1.0))
            + i.y + vec4(0.0, i1.y, i2.y, 1.0))
            + i.x + vec4(0.0, i1.x, i2.x, 1.0));
    float n_ = 0.142857142857;
    vec3 ns = n_ * D.wyz - D.xzx;
    vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
    vec4 x_ = floor(j * ns.z);
    vec4 y_ = floor(j - 7.0 * x_);
    vec4 x = x_ *ns.x + ns.yyyy;
    vec4 y = y_ *ns.x + ns.yyyy;
    vec4 h = 1.0 - abs(x) - abs(y);
    vec4 b0 = vec4(x.xy, y.xy);
    vec4 b1 = vec4(x.zw, y.zw);
    vec4 s0 = floor(b0)*2.0 + 1.0;
    vec4 s1 = floor(b1)*2.0 + 1.0;
    vec4 sh = -step(h, vec4(0.0));
    vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
    vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;
    vec3 p0 = vec3(a0.xy, h.x);
    vec3 p1 = vec3(a0.zw, h.y);
    vec3 p2 = vec3(a1.xy, h.z);
    vec3 p3 = vec3(a1.zw, h.w);
    vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
    p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
    vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
    m = m * m;
    return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
  }

  // 2 oitavas (era 3) — metade-ish do custo por pixel; o fundo cinematográfico
  // quase não muda, mas alivia bastante o desktop.
  float fbm(vec3 p){
    float v = 0.0;
    float a = 0.5;
    for(int i = 0; i < 2; i++){
      v += a * snoise(p);
      p *= 2.02;
      a *= 0.5;
    }
    return v;
  }
`;

// ---- Sky / domain background (fullscreen) ----
export const SKY_VERT = /* glsl */ `
  varying vec2 vUv;
  void main(){
    vUv = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`;

export const SKY_FRAG = /* glsl */ `
  precision highp float;
  varying vec2 vUv;
  uniform float uTime;
  uniform float uMorph;     // 0 dark -> 1 light
  uniform vec2  uMouse;
  uniform vec2  uRes;

  ${NOISE}

  // dark akatsuki nebula
  vec3 akatsukiSky(vec2 uv){
    vec2 p = (uv - 0.5) * vec2(uRes.x/uRes.y, 1.0);
    float d = length(p - uMouse * 0.15);
    vec3 base = mix(vec3(0.02,0.0,0.0), vec3(0.015), smoothstep(0.0, 1.2, d));
    float smoke = fbm(vec3(p * 2.2 + vec2(0.0, uTime*0.04), uTime*0.05));
    smoke = smoothstep(-0.2, 1.0, smoke);
    vec3 red = vec3(0.42, 0.02, 0.02) * smoke;
    // bottom blood glow
    float glow = smoothstep(0.0, 0.7, 1.0 - uv.y) * 0.5;
    base += red * 0.6;
    base += vec3(0.35,0.02,0.02) * glow;
    // faint stars
    float stars = step(0.9985, fract(sin(dot(floor(uv*900.0), vec2(12.9898,78.233)))*43758.5453));
    base += stars * vec3(0.5,0.2,0.2);
    return base;
  }

  // light "domain expansion" energy field
  vec3 domainSky(vec2 uv){
    vec2 p = (uv - 0.5) * vec2(uRes.x/uRes.y, 1.0);
    p += uMouse * 0.1;
    float r = length(p);
    // radiating fractal rings
    float a = atan(p.y, p.x);
    float rings = sin(r*14.0 - uTime*1.2 + sin(a*6.0)*1.5);
    float field = fbm(vec3(p*3.0, uTime*0.15));
    vec3 white = vec3(0.96, 0.99, 1.0);
    vec3 cyan  = vec3(0.24, 0.94, 1.0);
    vec3 neon  = vec3(0.17, 0.48, 1.0);
    vec3 col = mix(white, cyan, smoothstep(-0.3, 0.6, field));
    col = mix(col, neon, smoothstep(0.0, 1.1, r) * 0.5);
    col += cyan * smoothstep(0.6, 1.0, rings) * 0.35;
    // bright core bloom (suave p/ não estourar com o olho na frente)
    col += white * smoothstep(0.5, 0.0, r) * 0.32;
    return col;
  }

  void main(){
    // só calcula o céu necessário (economia: não roda os dois fbm em repouso)
    vec3 col;
    if (uMorph < 0.002) {
      col = akatsukiSky(vUv);
    } else if (uMorph > 0.998) {
      col = domainSky(vUv);
    } else {
      col = mix(akatsukiSky(vUv), domainSky(vUv), smoothstep(0.0, 1.0, uMorph));
    }
    vec2 q = vUv - 0.5;
    col *= 1.0 - dot(q,q) * 0.6;
    gl_FragColor = vec4(col, 1.0);
  }
`;

// ---- Red moon ----
export const MOON_VERT = /* glsl */ `
  varying vec3 vNormal;
  varying vec3 vView;
  varying vec3 vPos;
  void main(){
    vNormal = normalize(normalMatrix * normal);
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    vView = normalize(-mv.xyz);
    vPos = position;
    gl_Position = projectionMatrix * mv;
  }
`;

export const MOON_FRAG = /* glsl */ `
  precision highp float;
  varying vec3 vNormal;
  varying vec3 vView;
  varying vec3 vPos;
  uniform float uTime;
  uniform float uPulse;
  uniform float uMorph;

  ${NOISE}

  void main(){
    // surface craters / swirl via fbm
    float n = fbm(vPos * 2.4 + vec3(0.0, 0.0, uTime*0.02));
    float swirl = fbm(vPos * 5.0 + n);
    // dark = lua vermelha; light = esfera pálida (esclera do olho do Gojo)
    vec3 darkSurf  = mix(vec3(0.45,0.02,0.02), vec3(0.95,0.18,0.12), smoothstep(-0.4,0.6,swirl));
    vec3 lightSurf = mix(vec3(0.55,0.82,1.0), vec3(0.96,0.99,1.0), smoothstep(-0.4,0.6,swirl));
    vec3 surface = mix(darkSurf, lightSurf, uMorph);

    // fresnel rim
    float fres = pow(1.0 - max(dot(vNormal, vView), 0.0), 2.5);
    vec3 rimColor = mix(vec3(1.0,0.25,0.2), vec3(0.4,0.85,1.0), uMorph);
    vec3 rim = rimColor * fres * (1.4 + uPulse*0.6);

    vec3 col = surface * (0.7 + uPulse*0.4) + rim;
    col += mix(vec3(0.6,0.05,0.05), vec3(0.2,0.6,1.0), uMorph) * fres;
    gl_FragColor = vec4(col, 1.0);
  }
`;

// ---- Orbiting particles ----
export const PARTICLE_VERT = /* glsl */ `
  attribute float aScale;
  attribute float aSeed;
  uniform float uTime;
  uniform float uMorph;
  uniform float uPixelRatio;
  varying float vSeed;
  void main(){
    vSeed = aSeed;
    vec3 p = position;
    float t = uTime * (0.15 + aSeed*0.25);
    // gentle orbital drift
    p.x += sin(t + aSeed*6.28) * 0.4;
    p.y += cos(t*0.8 + aSeed*3.14) * 0.4;
    p.z += sin(t*0.6 + aSeed) * 0.4;
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;
    float size = aScale * (40.0 + uMorph*25.0) * uPixelRatio;
    gl_PointSize = size / -mv.z;
  }
`;

export const PARTICLE_FRAG = /* glsl */ `
  precision highp float;
  uniform float uMorph;
  varying float vSeed;
  void main(){
    vec2 c = gl_PointCoord - 0.5;
    float d = length(c);
    if(d > 0.5) discard;
    float glow = smoothstep(0.5, 0.0, d);
    vec3 red  = vec3(1.0, 0.18, 0.12);
    vec3 cyan = vec3(0.3, 0.95, 1.0);
    vec3 col = mix(red, cyan, uMorph);
    gl_FragColor = vec4(col, glow * (0.5 + 0.5*sin(vSeed*10.0)));
  }
`;
