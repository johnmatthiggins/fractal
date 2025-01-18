import { createSignal, createEffect } from "solid-js";
import './App.css'

function transformByteToShade(byte: number): string {
  if (byte === 0) {
    return '#000000';
  }
  const b = Math.floor(byte * (255 / 150)).toString(16).padStart('0', 2);
  return `#${b}${b}${b}`;
}

function App() {
  const defaultTopLeftX = -2;
  const defaultTopLeftY = 1;
  const defaultBottomRightX = 1;
  const defaultBottomRightY = -1;

  const height = () => {
    return window.innerHeight * 2;
  };
  const width = () => {
    // return preferredWidth;
    return window.innerWidth * 2;
    // const ratio =
    //   Math.abs(defaultBottomRightX - defaultTopLeftX) /
    //   Math.abs(defaultBottomRightY - defaultTopLeftY);
    // return Math.ceil(ratio * size());
  };

  const [topLeftX, setTopLeftX] = createSignal(defaultTopLeftX);
  const [topLeftY, setTopLeftY] = createSignal(defaultTopLeftY);
  const [bottomRightX, setBottomRightX] = createSignal(defaultBottomRightX);
  const [bottomRightY, setBottomRightY] = createSignal(defaultBottomRightY);

  const [worker, setWorker] = createSignal(new Worker("worker.js"));

  createEffect(() => {
    const adjustedHeight = height() * 2;
    const adjustedWidth = width() * 2;
    const message = {
      topLeft: { x: topLeftX(), y: topLeftY() },
      bottomRight: { x: bottomRightX(), y: bottomRightY() },
      viewportHeight: adjustedHeight,
      viewportWidth: adjustedWidth,
      viewportOffsetX: 0,
      viewportOffsetY: 0,
    };

    if (!worker().onerror) {
      worker().onerror = (error) => {
        console.error(error);
      };
    }
    if (!worker().onmessage) {
      worker().onmessage = (event) => {
        console.log(event);
        const pixels = event.data.pixels;
        const canvas = document.getElementById('fractal-canvas');
        const adjustedHeight = height() * 2;
        const adjustedWidth = width() * 2;
        canvas.width = adjustedWidth;
        canvas.height = adjustedHeight;

        const context = canvas.getContext("2d");

        for (let i = 0; i < adjustedHeight; i++) {
          for (let j = 0; j < adjustedWidth; j++) {
            const byte = pixels[j + (i * width() * 2)];
            if (byte > 0) {
              const colorValue = transformByteToShade(byte);
              context.fillStyle = colorValue;
              context.fillRect(j, i, 1, 1);
            }
          }
        }
      };
    }
    worker().postMessage(message);
  });
  return (
    <div>
      <canvas id="fractal-canvas" class="w-full h-full"></canvas>
    </div>
  );
}

export default App;
