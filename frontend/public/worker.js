const MAX_ITERATIONS = 250;

onmessage = (event) => {
  const {
    topLeft,
    bottomRight,
    viewportHeight,
    viewportWidth,
    viewportOffsetX,
    viewportOffsetY,
  } = event.data;
  const topLeftX = topLeft.x;
  const topLeftY = topLeft.y;
  const bottomRightX = bottomRight.x;
  const bottomRightY = bottomRight.y;
  const pixels = generateMandelbrot(
    topLeftX,
    topLeftY,
    bottomRightX,
    bottomRightY,
    viewportHeight,
    viewportWidth
  );
  self.postMessage({
    topLeftX,
    topLeftY,
    bottomRightX,
    bottomRightY,
    viewportHeight,
    viewportWidth,
    viewportOffsetX,
    viewportOffsetY,
    pixels,
  });
};

const PALETTE = [0, 16, 24, 32, 48, 64, 128, 255];

function generateMandelbrot(
  topLeftX,
  topLeftY,
  bottomRightX,
  bottomRightY,
  viewportHeight,
  viewportWidth
) {
  if (isNaN(viewportHeight) || isNaN(viewportWidth)) {
    return [];
  }
  const topLeft = { x: topLeftX, y: topLeftY };
  const bottomRight = { x: bottomRightX, y: bottomRightY };
  const screen = fillScreen(topLeft, bottomRight, viewportWidth, viewportHeight);
  return screen;
}

function fillScreen(topLeft, bottomRight, viewportWidth, viewportHeight) {
  const length = Math.floor(viewportHeight * viewportWidth);
  const buffer = Array(length).fill(0);

  const sectionWidth = Math.abs(topLeft.x - bottomRight.x);
  const sectionHeight = Math.abs(topLeft.y - bottomRight.y);

  let i = 0;
  while (i < length) {
    let x = i % viewportWidth;
    let y = i / viewportHeight;
    let adjustedX = (x / viewportWidth) * sectionWidth;
    let adjustedY = (y / viewportHeight) * sectionHeight;
    let newPixel = buildPixel(adjustedX, adjustedY);

    buffer[i] = newPixel;
    i += 1;
  }
  return buffer;
}

function buildPixel(x0, y0) {
  let x2 = 0;
  let y2 = 0;

  let iteration = 0;
  while (x2 * x2 + y2 * y2 <= 4.0 && iteration < MAX_ITERATIONS) {
    let xtmp = (x2 + y2) * (x2 - y2) + x0;
    y2 = 2.0 * x2 * y2 + y0;
    x2 = xtmp;

    iteration += 1;
  }

  return PALETTE[iteration % PALETTE.length];
}

