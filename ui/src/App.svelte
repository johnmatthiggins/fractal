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

  const screenHeight = () => {
    return window.innerHeight;
  };
  const screenWidth = () => {
    return window.innerWidth;
  };

  const size = $derived(() => {
    return Math.min(screenWidth(), screenHeight()) * 3;
  });

  const transformByteToShade = (byte) => {
    if (byte === 0) {
      return '#000000';
    }
    const b = Math.floor(byte * (255 / 150)).toString(16).padStart('0', 2);
    return `#${b}${b}${b}`;
  };

  const defaultTopLeftX = -2;
  const defaultTopLeftY = 1;
  const defaultBottomRightX = 1;
  const defaultBottomRightY = -1;

  let topLeftX = $state(defaultTopLeftX);
  let topLeftY = $state(defaultTopLeftY);
  let bottomRightX = $state(defaultBottomRightX);
  let bottomRightY = $state(defaultBottomRightY);

  let zoomRange = $state(1);

  const zoom = (magnitude) => {
    topLeftX = defaultTopLeftX * magnitude;
    topLeftY = defaultTopLeftY * magnitude;
    bottomRightX = defaultBottomRightX * magnitude;
    bottomRightY = defaultBottomRightY * magnitude;
  };

  const height = $derived(() => screenHeight());
  const width = $derived(() => {
    return screenWidth();
    // const ratio =
    //   Math.abs(defaultBottomRightX - defaultTopLeftX) /
    //   Math.abs(defaultBottomRightY - defaultTopLeftY);
    // return Math.ceil(ratio * size());
  });

  let insideCanvas = $state(false);
  const handleMouseEnter = () => {
    insideCanvas = true;
    console.log('left canvas');
  };
  const handleMouseMove = (event) => {
    // console.log(event);
  };
  const handleMouseLeave = (event) => {
    insideCanvas = false;
    console.log('entered canvas');
  };
  let canvasElement = $state(null);
  $effect(() => {
    canvasElement = document.getElementById('fractal-canvas');
    canvasElement.addEventListener("mouseenter", handleMouseEnter);
    canvasElement.addEventListener("mouseleave", handleMouseLeave);
    canvasElement.addEventListener("mousemove", handleMouseMove);
  });

  const canvasPosition = () => {
    const {x, y} = canvasElement.getBoundingClientRect();
    return {x, y}
  };
  $effect(() => {
    const start = +new Date();
    const result = generate_mandelbrot(
      topLeftX,
      topLeftY,
      bottomRightX,
      bottomRightY,
      height(),
      width()
    );
    const end = +new Date();
    console.log('TIME:', end - start);
    const element = document.querySelector('#fractal-canvas');
    const context = element.getContext('2d');

    context.fillStyle = transformByteToShade(0);
    context.fillRect(0, 0, height(), width());

    for (let i = 0; i < height(); i += 1) {
      for (let j = 0; j < width(); j += 1) {
        const byte = result[j + (i * width())];
        if (byte > 0) {
          const colorValue = transformByteToShade(
            result[j + (i * width())]
          );
          context.fillStyle = colorValue;
          context.fillRect(height() - i, j, 1, 1);
        }
      }
    }
  });
</script>

<main style="padding:0;margin:0;">
  <canvas
    id="fractal-canvas"
    style={`width:${width()}px;height:${height()}px;`}
    height={size()}
    width={size()}></canvas>
  <!-- <div -->
  <!--   style:position="fixed" -->
  <!--   style:left="-50vw" -->
  <!--   style:top="-50vh" -->
  <!--   style:width="100px" -->
  <!--   style:height="100px" -->
  <!--   style:border-width="1rem" -->
  <!--   style:border-style="solid" -->
  <!--   style:border-color="orange"></div> -->
</main>

<style>
</style>
