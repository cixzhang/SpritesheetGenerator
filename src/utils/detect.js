
const _ = require('underscore');
const disjointSet = require('disjoint-set');
const SpritesheetFrame = require('../spritesheetFrame');

const getRect = require('./getRect');


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

function getPixelData(imageData, rect = null) {
  const pixelData = [];
  const data = imageData.data;
  const getXY = getComputeXY({x: 0, y: 0, w: imageData.width, h: imageData.height});

  for (let i = 0; i < data.length; i += 4) {
    if (!rect || containsCoordinates(rect, getXY(i / 4))) {
      pixelData.push([data[i],data[i+1],data[i+2],data[i+3]]);
    }
  }
  return pixelData;
}

function getComputeXY(rect) {
  return (index) => {
    const x = index % rect.w;
    const y = Math.floor(index / rect.w);
    return {x: rect.x + x, y: rect.y + y};
  };
}

function getComputeIndex(rect) {
  return (x, y) => {
    if (x < rect.x || y < rect.y || x >= rect.x + rect.w || y >= rect.y + rect.h) {
      return null;
    }
    return (y - rect.y) * rect.w + (x - rect.x);
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

function containsCoordinates(rect, xy) {
  return xy.x >= rect.x &&
    xy.y >= rect.y &&
    xy.x < (rect.x + rect.w) &&
    xy.y < (rect.y + rect.h);
}

function getValidRect(imageData, rect) {
  return getRect({
    x: Math.min(Math.max(rect.x, 0), imageData.width),
    y: Math.min(Math.max(rect.y, 0), imageData.height),
    x2: Math.min(Math.max(rect.x + rect.w, 0), imageData.width),
    y2: Math.min(Math.max(rect.y + rect.h, 0), imageData.height),
  });
}

function findPixelIslands(image, rect = null) {
  const imageData = getImageData(image);
  rect = rect ?
    getValidRect(imageData, rect)
    : { x: 0, y: 0, w: imageData.width, h: imageData.height };

  const pixelData = getPixelData(imageData, rect);
  const getXY = getComputeXY(rect);
  const getIndex = getComputeIndex(rect);

  const set = disjointSet();

  const pixels = pixelData.map((data, index) => ({
    data,
    ...getXY(index),
  }));

  pixels.forEach((pixel) => {
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

function detectFrames(image, rect = null) {
  const islands = findPixelIslands(image, rect);
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

function detectNonOverlappingFrames(image, spritesheet, rect = null) {
  const nFrames = detectFrames(image, rect);
  return nFrames.filter((nFrame) => {
    const {x, y, w, h} = nFrame.frame;
    return _.all(spritesheet.frames, sFrame => !sFrame.isOverlap(x, y, w, h));
  });
}

function detectNonIdenticalFrames(image, spritesheet, rect = null) {
  const nFrames = detectFrames(image, rect);
  return nFrames.filter((nFrame) => {
    const { x, y, w, h } = nFrame.frame;
    return _.all(spritesheet.frames, sFrame => !sFrame.isIdentical(x, y, w, h));
  });
}

module.exports = {
  detectFrames,
  detectNonOverlappingFrames,
  detectNonIdenticalFrames,
};
