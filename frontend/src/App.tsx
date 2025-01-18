import { createSignal, createEffect } from "solid-js";
import getPartitions from "./partition";
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
    return window.innerHeight;
  };
  const width = () => {
    // return preferredWidth;
    return window.innerWidth;
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

  function getCanvas(): HTMLCanvasElement {
    const canvas: HTMLCanvasElement | null = document.getElementById('fractal-canvas') as HTMLCanvasElement | null;
    if (!canvas) {
      throw new Error("Canvas does not exist!");
    }
    return canvas;
  }

  createEffect(() => {
    const canvas = getCanvas();
    canvas.height = height();
    canvas.width = width();

    const partitions = getPartitions(
      4,
      { x: topLeftX(), y: topLeftY() },
      { x: bottomRightX(), y: bottomRightY() },
      { height: height(), width: width() },
    );

    const workers = [];

    partitions.forEach((message) => {
      const msg = {
        topLeft: message.spaceSegment.topLeft,
        bottomRight: message.spaceSegment.bottomRight,
        viewportTopLeft: message.viewportSegment.topLeft,
        viewportBottomRight: message.viewportSegment.bottomRight,
      };
      const nextWorker = new Worker("worker.js");
      workers.push(nextWorker);
      worker.onerror = (event) => {
        console.log('worker => ', event);
      };
      nextWorker.onmessage = (event) => {
        console.log('message received => ', event);
        const {
          viewportTopLeft,
          viewportBottomRight,
          pixels,
        } = event.data;
        const canvas = getCanvas();
        const context = canvas.getContext("2d");
        const viewportWidth = Math.abs(viewportTopLeft.x - viewportBottomRight.x);

        for (let i = 0; i < pixels.length; i++) {
          const x = viewportWidth * i;
          const y = i % viewportWidth;
          const byte = pixels[i];
          const colorValue: string = transformByteToShade(byte);
          context.fillStyle = colorValue;
          // context.fillStyle = "blue";
          context.fillRect(x, y, 1, 1);
        }
      };
      nextWorker.postMessage(msg);
    });
    // const message = {
    //   topLeft: { x: topLeftX(), y: topLeftY() },
    //   bottomRight: { x: bottomRightX(), y: bottomRightY() },
    //   viewportHeight: adjustedHeight,
    //   viewportWidth: adjustedWidth,
    //   viewportOffsetX: 0,
    //   viewportOffsetY: 0,
    // };
    //
    // if (!worker().onerror) {
    //   worker().onerror = (error) => {
    //     console.error(error);
    //   };
    // }
    // if (!worker().onmessage) {
    //   worker().onmessage = (event) => {
    //     const pixels: Array<number> = event.data.pixels;
    //     const canvas: HTMLCanvasElement = getCanvas();
    //     const adjustedHeight: number = height();
    //     const adjustedWidth: number = width();
    //     canvas.width = adjustedWidth;
    //     canvas.height = adjustedHeight;
    //
    //     const context: CanvasRenderingContext2D | null = canvas.getContext("2d");
    //     if (!context) {
    //       throw new Error("Canvas rendering context could not be created");
    //     }
    //     for (let i = 0; i < adjustedHeight; i++) {
    //       for (let j = 0; j < adjustedWidth; j++) {
    //         const byte = pixels[j + (i * width())];
    //         if (byte > 0) {
    //           const colorValue: string = transformByteToShade(byte);
    //           context.fillStyle = colorValue;
    //           context.fillRect(j, i, 1, 1);
    //         }
    //       }
    //     }
    //   };
    // }
    // worker().postMessage(message);
  });
  return (
    <div>
      <canvas id="fractal-canvas" class="w-full h-full"></canvas>
    </div>
  );
}

export default App;
