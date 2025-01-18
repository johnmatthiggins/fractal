import { createSignal, createEffect } from "solid-js";
import { generate_mandelbrot } from '../../mandelbrot/pkg/mandelbrot.js';
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

  createEffect(() => {
    const pixels = generate_mandelbrot(
      topLeftX(),
      topLeftY(),
      bottomRightX(),
      bottomRightY(),
      height(),
      width()
    );

    const canvas = document.getElementById('fractal-canvas');
    canvas.width = width();
    canvas.height = height();

    const context = canvas.getContext("2d");

    for (let i = 0; i < height(); i++) {
      for (let j = 0; j < width(); j++) {
        const byte = pixels[j + (i * width())];
        if (byte > 0) {
          const colorValue = transformByteToShade(byte);
          context.fillStyle = colorValue;
          context.fillRect(j, i, 1, 1);
        }
      }
    }
  });
  return (
    <div>
      <canvas id="fractal-canvas"></canvas>
    </div>
  );
}

export default App;
