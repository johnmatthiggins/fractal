<script>
  import svelteLogo from './assets/svelte.svg'
  import viteLogo from '/vite.svg'
  import Counter from './lib/Counter.svelte'
  import {onMount} from 'svelte';

  // WE need an interface that looks like this:
  // - top left point (complex/cartesian)
  // - bottom right point (complex/cartesian)
  // - viewport height (pixels)
  // - viewport width (pixels)
  // The output will be a grid of boolean values.
  // Maybe encode it inside a byte array?

  export let generate_mandelbrot;
  onMount(() => {
    const result = generate_mandelbrot(0, 0, 0, 0, 0, 0);
    const element = document.querySelector('#fractal-canvas');
    const context = element.getContext('2d');
    context.fillStyle = 'rgb(200, 0, 0)';
    context.fillRect(10, 10, 50, 50);
  });
</script>

<main>
  <canvas id="fractal-canvas" height="1000" width="1000"></canvas>
</main>

<style>
</style>
