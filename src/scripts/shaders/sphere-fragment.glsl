precision mediump float;

#include 'simplex-3d-noise.glsl'

varying vec2 vUv;
varying vec3 vWorldPos;
varying vec3 vPosition;

uniform float uTime;
uniform float uScaleX;
uniform float uScaleY;
uniform int uDetail;
uniform float uRoughness;
uniform float uDensity;
uniform float uDistortion;
uniform float uEdgeSoftness;

float fbm(vec3 p) {
  float value = 0.0;
  float amplitude = 0.5;

  for (int i = 0; i < 6; i++) {
    if (i >= uDetail) {
      break;
    }

    value += snoise(p) * amplitude;
    p *= 2.0;
    amplitude *= uRoughness;
  }
  return value;
}

vec3 distort(vec3 p) {
  float n = snoise(p + vec3(uTime * 0.03, 0.0, 0.0));
  return p + vec3(n) * uDistortion;
}

void main() {
  vec3 pos = vPosition;
  pos += vec3(uTime * 0.01, 0.0, 0.0);
  pos.xz *= vec2(uScaleX, uScaleY);
  pos = distort(pos);

  vec3 skyTop = vec3(0.2, 0.6, 0.9);
  vec3 skyBottom = vec3(0.85, 0.93, 1.0);

  float cloud = fbm(pos);

  vec3 color = mix(skyBottom, skyTop, cloud);

  gl_FragColor = vec4(color, 1.0);
}