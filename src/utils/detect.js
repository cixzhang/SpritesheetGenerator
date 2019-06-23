
const _ = require('underscore');
const disjointSet = require('disjoint-set');
const SpritesheetFrame = require('../spritesheetFrame');

function getImageData(image) {
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');

  canvas.width = image.width;
  canvas.height = image.height;

  context.drawImage(
    image, 0, 0,
    image.width,
    image.height
  );

  return context.getImageData(0, 0, image.width, image.height);
}

function getPixelData(imageData) {
  const pixelData = [];
  const data = imageData.data;

  for (let i = 0; i < data.length; i += 4) {
    pixelData.push([data[i],data[i+1],data[i+2],data[i+3]]);
  }
  return pixelData;
}

function getComputeXY(imageData) {
  return (index) => {
    const x = index % imageData.width;
    const y = Math.floor(index / imageData.width);
    return {x, y};
  };
}

function getComputeIndex(imageData) {
  return (x, y) => {
    if (x < 0 || y < 0 || x >= imageData.width || y >= imageData.height) {
      return null;
    }
    return y * imageData.width + x;
  };
}

function isTransparent(pixelData) {
  return pixelData[3] === 0;
}

function getRange(pixels) {
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;

  pixels.forEach((pixel) => {
    const {x, y} = pixel;
    if (x < minX) minX = x;
    if (x > maxX) maxX = x;
    if (y < minY) minY = y;
    if (y > maxY) maxY = y;
  });

  return {
    x: [minX, maxX],
    y: [minY, maxY],
  };
}

function findPixelIslands(image) {
  const imageData = getImageData(image);
  const pixelData = getPixelData(imageData);
  const getXY = getComputeXY(imageData);
  const getIndex = getComputeIndex(imageData);

  const set = disjointSet();
  const pixels = pixelData.map((data, index) => ({
    data,
    ...getXY(index),
  }));

  pixels.forEach((pixel, index) => {
    /*
     * For each pixel, we add it to the disjoint set,
     * then we check if it's connected to any other pixel
     * by checking in the following directions:
     *
     * up-left, up, up-right, left
     */

    if (isTransparent(pixel.data)) {
      return;
    }

    set.add(pixel);

    const checkIndices = [
      getIndex(pixel.x - 1, pixel.y - 1), // up-left
      getIndex(pixel.x, pixel.y - 1), // up
      getIndex(pixel.x + 1, pixel.y - 1), // up-right
      getIndex(pixel.x - 1, pixel.y), // left
    ];

    checkIndices.forEach(index => {
      if (index != null && !isTransparent(pixels[index].data)) {
        set.union(pixel, pixels[index]);
      }
    });
  });

  return set.extract();
}

function detectFrames(image) {
  const islands = findPixelIslands(image);
  return islands.map(pixels => {
    const range = getRange(pixels);
    return new SpritesheetFrame({
      frame: {
        x: range.x[0],
        y: range.y[0],
        w: range.x[1] - range.x[0] + 1,
        h: range.y[1] - range.y[0] + 1,
      },
    });
  });
}

function detectNonOverlappingFrames(image, spritesheet) {
  const nFrames = detectFrames(image);
  return nFrames.filter((nFrame) => {
    const {x, y, w, h} = nFrame.frame;
    return _.all(spritesheet.frames, sFrame => !sFrame.isOverlap(x, y, w, h));
  });
}

module.exports = {
  detectFrames,
  detectNonOverlappingFrames,
};
