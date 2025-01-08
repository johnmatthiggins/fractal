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

  // export let generate_mandelbrot;
  const transformByteToShade = (byte) => {
    return Math.floor(byte * (16777216 / 200));
  };
  onMount(() => {
    const result = generate_mandelbrot(-2, 0, 1, -0.75, 100, 100);
    const element = document.querySelector('#fractal-canvas');
    const context = element.getContext('2d');

    for (let i = 0; i < 100; i += 1) {
      for (let j = 0; j < 100; j += 1) {
        const colorValue = transformByteToShade(
          result[j + (i * 100)]
        );
        const colorHex = "#" + colorValue.toString(16).padStart('0', 6);
        context.fillStyle = colorHex;
        context.fillRect(i, j, 1, 1);
      }
    }
  });
</script>

<main>
  <canvas id="fractal-canvas" height="100" width="100"></canvas>
</main>

<style>
</style>
