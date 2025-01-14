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

  const preferredHeight = 1000;
  const preferredWidth = 1440;

  const height = $derived(() => preferredHeight);
  const width = $derived(() => {
    return preferredWidth;
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
    const canvas = document.getElementById('fractal-canvas');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    document.querySelector('.spinner').style.display = 'block';
    const start = +new Date();
    const result = generate_mandelbrot(
      topLeftX * zoomRange,
      topLeftY * zoomRange,
      bottomRightX * zoomRange,
      bottomRightY * zoomRange,
      height(),
      width()
    );
    console.log(result);
    const end = +new Date();
    console.log('TIME:', end - start);
    const element = document.querySelector('#fractal-canvas');
    const context = element.getContext('2d');

    context.reset();

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
    document.querySelector('.spinner').style.display = 'none';
  });
</script>

<main style="padding:0;margin:0;height:100%;width:100%;background-color:black;">
  <canvas id="fractal-canvas" style={`width:100%;height:100%;`}></canvas>
  <div
    style:width="2rem"
    style:max="2rem"
    style:position="fixed"
    style:display="flex"
    style:left="2vw"
    style:bottom="2vh">
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="spinner">
      <path d="M20.0001 12C20.0001 13.3811 19.6425 14.7386 18.9623 15.9405C18.282 17.1424 17.3022 18.1477 16.1182 18.8587C14.9341 19.5696 13.5862 19.9619 12.2056 19.9974C10.825 20.0328 9.45873 19.7103 8.23975 19.0612" stroke="#ff0000" stroke-width="3.55556" stroke-linecap="round"/>
  </div>
  <input type="range" min="0.1" max="1" step="0.1" onchange={(event) => {
    zoomRange = Number(event.target.value);
  }} />
</main>

<style>
.spinner {
  animation: 1s linear infinite spin;
}

@-moz-keyframes spin {
    from { -moz-transform: rotate(0deg); }
    to { -moz-transform: rotate(360deg); }
}
@-webkit-keyframes spin {
    from { -webkit-transform: rotate(0deg); }
    to { -webkit-transform: rotate(360deg); }
}
@keyframes spin {
    from {transform:rotate(0deg);}
    to {transform:rotate(360deg);}
}
</style>
