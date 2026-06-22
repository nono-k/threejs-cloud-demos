varying vec2 vUv;
varying vec3 vWorldPos;
varying vec3 vPosition;

void main() {
  vUv = uv;
  vPosition = normalize(position);
  vec4 worldPos = modelMatrix * vec4(position, 1.0);
  vWorldPos = worldPos.xyz;

  gl_Position = projectionMatrix * viewMatrix * worldPos;
}