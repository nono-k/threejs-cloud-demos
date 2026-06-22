precision mediump float;

varying vec2 vUv;

void main() {
  vec2 uv = vUv;

  vec3 skyTop = vec3(0.2, 0.6, 0.9);
  vec3 skyBottom = vec3(0.85, 0.93, 1.0);

  vec3 color = mix(skyBottom, skyTop, uv.y);
  gl_FragColor = vec4(color, 1.0);
}