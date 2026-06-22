precision mediump float;

#include 'simplex-2d-noise.glsl'

varying vec2 vUv;
uniform float uTime;

uniform float uScaleX;
uniform float uScaleY;
uniform int uDetail;
uniform float uRoughness;
uniform float uDensity;
uniform float uDistortion;
uniform float uEdgeSoftness;

float fbm(vec2 p) {
  float value = 0.0;
  float amplitude = 0.5;

  for (int i = 0; i < 8; i++) {
    if (i >= uDetail) {
      break;
    }

    value += snoise(p) * amplitude;
    p *= 2.0;
    amplitude *= uRoughness;
  }
  return value;
}

vec2 distort(vec2 uv) {
  float n = snoise(uv + vec2(uTime * 0.03, 0.0));
  return uv + vec2(n) * uDistortion;
}

void main() {
  vec2 uv = vUv;
  uv *= vec2(uScaleX, uScaleY);
  uv = distort(uv);

  float cloud = fbm(uv + vec2(uTime * 0.05, 0.0));
  cloud = smoothstep(uDensity, uDensity + uEdgeSoftness, cloud);

  gl_FragColor = vec4(vec3(1.0), cloud);
}