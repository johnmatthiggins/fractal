<script>
  import svelteLogo from './assets/svelte.svg'
  import viteLogo from '/vite.svg'
  import Counter from './lib/Counter.svelte'
  import { onMount } from 'svelte';
  import { generate_mandelbrot } from '../../mandelbrot/pkg/mandelbrot.js';

  function screenHeight() {
    return window.innerHeight * 3;
  }
  function screenWidth() {
    return window.innerWidth * 3;
  }

  const size = $derived(() => {
    return Math.min(screenWidth(), screenHeight()) * 3;
  });

  function transformByteToShade(byte) {
    if (byte === 0) {
      return '#000000';
    }
    const b = Math.floor(byte * (255 / 150)).toString(16).padStart('0', 2);
    return `#${b}${b}${b}`;
  }

  const defaultTopLeftX = -2;
  const defaultTopLeftY = 1;
  const defaultBottomRightX = 1;
  const defaultBottomRightY = -1;

  let topLeftX = $state(defaultTopLeftX);
  let topLeftY = $state(defaultTopLeftY);
  let bottomRightX = $state(defaultBottomRightX);
  let bottomRightY = $state(defaultBottomRightY);

  let zoomRange = $state(1);

  function zoom(magnitude) {
    topLeftX = defaultTopLeftX * magnitude;
    topLeftY = defaultTopLeftY * magnitude;
    bottomRightX = defaultBottomRightX * magnitude;
    bottomRightY = defaultBottomRightY * magnitude;
  }

  const preferredHeight = 1000 * 2;
  const preferredWidth = 1440 * 2;

  const height = $derived(() => {
    return window.innerHeight * 2;
  });
  const width = $derived(() => {
    // return preferredWidth;
    return window.innerWidth * 2;
    // const ratio =
    //   Math.abs(defaultBottomRightX - defaultTopLeftX) /
    //   Math.abs(defaultBottomRightY - defaultTopLeftY);
    // return Math.ceil(ratio * size());
  });

  let insideCanvas = $state(false);
  function handleMouseEnter() {
    insideCanvas = true;
  }
  function handleMouseMove(event) {
    // console.log(event);
  }
  function handleMouseLeave(event) {
    insideCanvas = false;
  }

  // chunk count must be a power of 2
  function splitChunks(
    chunkCount,
    topLeft,
    bottomRight,
    viewportHeight,
    viewportWidth
  ) {
    const size = Math.log2(chunkCount);
    const squareViewportHeight = viewportHeight / size;
    const squareViewportWidth = viewportWidth / size;
    const squareSectionWidth = Math.abs(topLeft.x - bottomRight.x) / size;
    const squareSectionHeight = Math.abs(topLeft.y - bottomRight.y) / size;

    const squares = [];

    for (let i = 0; i < size; i += 1) {
      for (let j = 0; j < size; j += 1) {
        const xOffset = i * squareSectionHeight;
        const yOffset = j * squareSectionWidth;
        const squareTopLeft = {
          x: xOffset,
          y: yOffset,
        };
        const squareBottomRight = {
          x: squareTopLeft.x + squareSectionHeight,
          y: squareTopLeft.y + squareSectionWidth,
        };
        const newSquare = {
          topLeft: squareTopLeft,
          bottomRight: squareBottomRight,
          viewportHeight: squareViewportHeight,
          viewportWidth: squareViewportWidth,
          viewportOffsetX: squareViewportWidth * i,
          viewportOffsetY: squareViewportHeight * j,
        };
        squares.push(newSquare)
      }
    }

    return squares;
  }
  let canvasElement = $state(null);
  $effect(() => {
    if (height() && width()) {
      const workers = Array(4).fill(0).map(() => new Worker("worker.js"));
      workers.forEach((worker) => {
        worker.onerror = (event) => {
          console.error('worker error:', event);
        }
      });
      workers.forEach((worker) => {
        worker.onmessage = (event) => {
          console.log(event.data);
          if (event.data.topLeftX) {
            const { pixels } = event.data;
            const element = document.querySelector('#fractal-canvas');
            const context = element.getContext('2d');

            const iStart = event.data.viewportOffsetX;
            const iEnd = event.data.viewportOffsetX + event.data.viewportWidth;

            const jEnd = event.data.viewportOffsetY;
            const jStart = event.data.viewportOffsetY + event.data.viewportHeight;

            for (let i = 0; i < event.data.viewportHeight; i += 1) {
              for (let j = 0; j < event.data.viewportWidth; j += 1) {
                const byte = pixels[j + (i * width())];
                if (byte > 0) {
                  const colorValue = transformByteToShade(byte);
                  context.fillStyle = colorValue;
                  context.fillRect(j + event.data.viewportOffsetX, i + event.data.viewportOffsetY, 1, 1);
                }
              }
            }
          }
        };
      });
      const canvas = document.getElementById('fractal-canvas');
      canvas.width = width();
      canvas.height = height();
      const message = {
        viewportHeight: height(),
        viewportWidth: width(),
      };
      const CHUNK_COUNT = 4;
      const messages = splitChunks(
        CHUNK_COUNT,
        { x: topLeftX, y: topLeftY },
        { x: bottomRightX, y: bottomRightY },
        height(),
        width()
      );
      for (let i = 0; i < messages.length; i += 1) {
        workers[i].postMessage(messages[i]);
      }
    }
  });

  function canvasPosition() {
    const {x, y} = canvasElement.getBoundingClientRect();
    return {x, y}
  }
  // $effect(() => {
  //   const canvas = document.getElementById('fractal-canvas');
  //   canvas.width = width();
  //   canvas.height = height();
  //   if (width() && height()) {
  //     const start = +new Date();
  //     const result = generate_mandelbrot(
  //       topLeftX * zoomRange,
  //       topLeftY * zoomRange,
  //       bottomRightX * zoomRange,
  //       bottomRightY * zoomRange,
  //       height(),
  //       width()
  //     );
  //     const end = +new Date();
  //     console.log('TIME:', end - start);
  //     const element = document.querySelector('#fractal-canvas');
  //     const context = element.getContext('2d');
  //
  //     context.reset();
  //
  //     for (let i = 0; i < height(); i += 1) {
  //       for (let j = 0; j < width(); j += 1) {
  //         const byte = result[j + (i * width())];
  //         if (byte > 0) {
  //           const colorValue = transformByteToShade(byte);
  //           context.fillStyle = colorValue;
  //           context.fillRect(j, i, 1, 1);
  //         }
  //       }
  //     }
  //   }
  // });
</script>

<main style="padding:0;margin:0;height:100%;width:100%;background-color:black;">
  <canvas id="fractal-canvas" style={`width:100%;height:100%;padding:0;margin:0;`}></canvas>
  <div
    style:width="100vw"
    style:height="100vh"
    style:position="fixed"
    style:display="flex"
    style:justify-content="center"
    style:align-items="center"
    style:z-index="500"
  >
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="spinner">
      <path d="M20.0001 12C20.0001 13.3811 19.6425 14.7386 18.9623 15.9405C18.282 17.1424 17.3022 18.1477 16.1182 18.8587C14.9341 19.5696 13.5862 19.9619 12.2056 19.9974C10.825 20.0328 9.45873 19.7103 8.23975 19.0612" stroke="#ff0000" stroke-width="3.55556" stroke-linecap="round"/>
  </div>
  <input style="position:fixed;bottom:1rem;left:1rem;" type="range" min="0.1" max="1" step="0.1" value={zoomRange} onchange={(event) => {
    zoomRange = Number(event.target.value);
  }} />
</main>

<style>
.spinner {
  z-index: 500;
  width: 2rem;
  height: 2rem;
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
