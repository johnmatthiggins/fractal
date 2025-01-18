function getPartitions(
  // Must be a perfect square
  segmentCount: number,
  topLeft: Point,
  bottomRight: Point,
  viewportDim: ViewportDimensions,
  spaceDim: SpaceDimensions
): Array<Partition> {
  const size = Math.sqrt(segmentCount);

  const partitionSpaceWidth = spaceDim.width / size;
  const partitionSpaceHeight = spaceDim.height / size;

  const partitionViewportWidth = viewportDim.width / size;
  const partitionViewportHeight = viewportDim.height / size;

  const partitions: Array<Partition> = [];
  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
      // inside the space we will move from top left to bottom right
      // which means that x will grow in the positive direction and y will grow in the negative direction...
      // confusing right?
      // At the same time, our viewport coordinates will both grow in a positive direction.
      const partitionSpaceTopLeft: Point = {
        x: (partitionSpaceWidth * i) + topLeft.x,
        y: topLeft.y - (partitionSpaceHeight * j),
      };
      const partitionSpaceBottomRight: Point = {
        x: (partitionSpaceWidth * (i + 1)) + topLeft.x,
        y: topLeft.y - (partitionSpaceHeight * (j + 1)),
      };
      const spaceSegment = {
        topLeft: partitionSpaceTopLeft,
        bottomRight: partitionSpaceBottomRight,
      };

      const viewportSegment = {
        topLeft: partitionViewportTopLeft,
        bottomRight: partitionViewportBottomRight,
      };
      const partitionViewportTopLeft: Point = {
        x: partitionViewportWidth * i,
        y: partitionViewportHeight * j,
      };
      const partitionViewportBottomRight: Point = {
        x: partitionViewportWidth * (i + 1),
        y: partitionViewportHeight * (j + 1),
      }

      const newPartition = {
        spaceSegment,
        viewportSegment,
      };

      partitions.push(newPartition);
    }
  }
  return partitions;
}
