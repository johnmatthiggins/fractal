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
  export const height = 2000;
  export const width = 2000;

  const transformByteToShade = (byte) => {
    const b = Math.floor(byte * (255 / 200)).toString(16).padStart('0', 2);
    return `#${b}${b}${b}`;
  };
  onMount(() => {
    const result = generate_mandelbrot(-2, 1.5, 1, -1.5, height, width);
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
  <canvas id="fractal-canvas" style="width: 1000px;height: 1000px;" height={height} width={width}></canvas>
</main>

<style>
</style>
