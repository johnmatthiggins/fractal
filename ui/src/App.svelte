<script>
  import svelteLogo from './assets/svelte.svg'
  import viteLogo from '/vite.svg'
  import Counter from './lib/Counter.svelte'
  import { onMount } from 'svelte';
  import { generate_mandelbrot } from '../../mandelbrot/pkg/mandelbrot.js';

  // WE need an interface that looks like this:
  // - top left point (complex/cartesian)
  // - bottom right point (complex/cartesian)
  // - viewport height (pixels)
  // - viewport width (pixels)
  // The output will be a grid of boolean values.
  // Maybe encode it inside a byte array?
  export const height = 500;
  export const width = 500;

  const transformByteToShade = (byte) => {
    const b = Math.floor(byte * (255 / 200)).toString(16).padStart('0', 2);
    return `#${b}${b}${b}`;
  };

  const defaultTopLeftX = -2;
  const defaultTopLeftY = -3;
  const defaultBottomRightX = -1;
  const defaultBottomRightY = -4;

  let topLeftX = $state(defaultTopLeftX);
  let topLeftY = $state(defaultTopLeftY);
  let bottomRightX = $state(defaultBottomRightX);
  let bottomRightY = $state(defaultBottomRightY);

  let zoomRange = $state(1);

  const handleInputChange = (event) => {
    const newZoom = Number(event.target.value)
    zoomRange = newZoom;
    zoom(newZoom);
  };

  const zoom = (magnitude) => {
    topLeftX = defaultTopLeftX * magnitude;
    topLeftY = defaultTopLeftY * magnitude;
    bottomRightX = defaultBottomRightX * magnitude;
    bottomRightY = defaultBottomRightY * magnitude;
  };
  $effect(() => {
    const result = generate_mandelbrot(
      topLeftX,
      topLeftY,
      bottomRightX,
      bottomRightY,
      height,
      width
    );
    const element = document.querySelector('#fractal-canvas');
    const context = element.getContext('2d');

    for (let i = 0; i < height; i += 1) {
      for (let j = 0; j < width; j += 1) {
        const colorValue = transformByteToShade(
          result[j + (i * width)]
        );
        context.fillStyle = colorValue;
        context.fillRect(height - i, j, 1, 1);
      }
    }
  });
</script>

<main>
  <canvas id="fractal-canvas" style="width: 500px;height: 500px;" height={height} width={width}></canvas>
  <input type="range" onchange={handleInputChange} value={zoomRange} max={1} step={0.1} min={0.1}>
</main>

<style>
</style>
