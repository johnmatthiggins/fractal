interface Point {
  x: number,
  y: number,
}

interface ViewportDimensions {
  height: number,
  width: number,
}

interface SpaceDimensions {
  height: number,
  width: number,
}

interface SpaceSegment {
  topLeft: Point,
  bottomRight: Point,
}

interface ViewportSegment {
  topLeft: Point,
  bottomRight: Point,
}

interface Partition {
  spaceSegment: SpaceSegment,
  viewportSegment: ViewportSegment,
}
