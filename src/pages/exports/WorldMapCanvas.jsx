import React from "react";
import worldMapReferenceUrl from "../../../world-map.jpg";

const MAP_DATA_URL = "/data/world-countries.geojson";
const MAP_ASPECT_RATIO = 5000 / 3334;
const PAPER_COLOR = "#fbf9f4";
const LAND_COLOR = "#a8b7c8";
const LAND_COLOR_DARK = "#a8b7c8";
const BORDER_COLOR = "#f8fbf5";
const ACCENT_COLOR = "#f3b5c5";
const INDIA_ROUTE_COLOR = "#a94b6b";
const BRAND_HOVER_COLORS = ["#b9d9ee", "#d9c2eb", "#f2c2b5", "#b7dfd6"];

const JOURNEY_DESTINATIONS = [
  { id: "USA", label: "USA", start: 0.07, end: 0.16, color: "#517da2", fill: "#b9d9ee", curve: 118, labelX: 0, labelY: -18 },
  { id: "GBR", label: "United Kingdom", start: 0.18, end: 0.27, color: "#76588d", fill: "#d9c2eb", curve: 62, labelX: -8, labelY: -17 },
  { id: "AUS", label: "Australia", start: 0.29, end: 0.38, color: "#a75f82", fill: "#edc4d8", curve: 72, labelX: 0, labelY: -18 },
  { id: "NZL", label: "New Zealand", start: 0.4, end: 0.49, color: "#4c887f", fill: "#b7dfd6", curve: 78, labelX: -10, labelY: -17 },
  { id: "ARE", label: "UAE", start: 0.51, end: 0.6, color: "#a57832", fill: "#f3d7a6", curve: -34, labelX: 7, labelY: -17 },
];

const JOURNEY_REGIONS = [
  {
    label: "Asia",
    start: 0.62,
    end: 0.75,
    color: "#6176a0",
    fill: "#c9d5f3",
    anchor: [117, -2.5],
    curve: 46,
    labelX: 20,
    labelY: 19,
    ids: ["IDN", "SGP", "MYS", "THA", "VNM", "JPN"],
  },
  {
    label: "Europe",
    start: 0.77,
    end: 0.9,
    color: "#a66858",
    fill: "#f2c2b5",
    anchor: [18, 47],
    curve: 62,
    labelX: 22,
    labelY: 20,
    ids: ["FRA", "DEU", "NLD", "BEL", "ITA", "ESP", "PRT"],
  },
];

const JOURNEY_CAMERA_STOPS = [
  { start: 0, id: "IND", zoom: 1.45 },
  { start: 0.07, id: "USA", zoom: 1.45, focusStrength: 0.6 },
  { start: 0.18, id: "GBR", zoom: 1.45 },
  { start: 0.29, id: "AUS", zoom: 1.45 },
  { start: 0.4, id: "NZL", zoom: 1.45 },
  { start: 0.51, id: "ARE", zoom: 1.45 },
  { start: 0.62, coordinate: [117, -2.5], zoom: 1.45 },
  { start: 0.77, coordinate: [18, 47], zoom: 1.45 },
  { start: 0.92, zoom: 1 },
];

let countryDataPromise;

function loadCountryData() {
  if (!countryDataPromise) {
    countryDataPromise = fetch(MAP_DATA_URL).then((response) => {
      if (!response.ok) {
        throw new Error(`Could not load world map data (${response.status})`);
      }

      return response.json();
    });
  }

  return countryDataPromise;
}

function clamp(value, minimum, maximum) {
  return Math.min(maximum, Math.max(minimum, value));
}

function easeInOutCubic(value) {
  return value < 0.5
    ? 4 * value * value * value
    : 1 - Math.pow(-2 * value + 2, 3) / 2;
}

function hexToRgb(color) {
  const match = /^#([\da-f]{2})([\da-f]{2})([\da-f]{2})$/i.exec(color);
  if (!match) return null;

  return match.slice(1).map((channel) => Number.parseInt(channel, 16));
}

function mixColor(from, to, progress) {
  const start = hexToRgb(from);
  const end = hexToRgb(to);
  if (!start || !end) return progress < 1 ? from : to;

  const channels = start.map((channel, index) =>
    Math.round(channel + (end[index] - channel) * progress),
  );

  return `rgb(${channels.join(", ")})`;
}

function createBrandedReference(referenceImage) {
  // Retain enough source detail for large/Retina displays. The old 2500px
  // intermediate was being enlarged again on high-density screens, which
  // softened coastlines and the fine country separators.
  const width = Math.min(4096, referenceImage.naturalWidth);
  const height = Math.round(
    width * (referenceImage.naturalHeight / referenceImage.naturalWidth),
  );
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext("2d", { willReadFrequently: true });
  context.drawImage(referenceImage, 0, 0, width, height);

  const imageData = context.getImageData(0, 0, width, height);
  const pixels = imageData.data;
  const landTop = hexToRgb(LAND_COLOR) || [70, 84, 106];
  const landBottom = hexToRgb(LAND_COLOR_DARK) || [52, 65, 87];

  for (let offset = 0; offset < pixels.length; offset += 4) {
    const red = pixels[offset];
    const green = pixels[offset + 1];
    const blue = pixels[offset + 2];
    const isNeutral = Math.abs(red - green) < 16 && Math.abs(red - blue) < 16;
    const isReferenceAccent = red > 220 && green < 200 && blue < 200;
    let coverage = 0;

    if (isNeutral && red < 246) {
      coverage = clamp((246 - red) / 92, 0, 1);
    } else if (isReferenceAccent) {
      coverage = clamp((255 - Math.min(green, blue)) / 92, 0, 1);
    }

    const row = Math.floor(offset / 4 / width);
    const verticalProgress = row / Math.max(1, height - 1);
    const target = landTop.map((channel, index) =>
      Math.round(channel + (landBottom[index] - channel) * verticalProgress),
    );

    // Make the JPG field and its white country separators transparent. This
    // keeps the exact raster coastline while allowing the premium hero
    // background to remain visible through every opening and erased country.
    pixels[offset] = target[0];
    pixels[offset + 1] = target[1];
    pixels[offset + 2] = target[2];
    pixels[offset + 3] = Math.round(255 * coverage);
  }

  context.putImageData(imageData, 0, 0);
  return canvas;
}

function projectCoordinate([longitude, latitude], width, offsetX = 0, offsetY = 0) {
  // These measurements reproduce the exact Web Mercator crop in world-map.jpg.
  const mapWidth = width * 0.9122;
  const left = offsetX + width * 0.015;
  const top = offsetY + width * -0.001;
  const boundedLatitude = clamp(latitude, -85, 85);
  const radians = (boundedLatitude * Math.PI) / 180;
  const mercatorY = (1 - Math.log(Math.tan(Math.PI / 4 + radians / 2)) / Math.PI) / 2;

  return {
    x: left + ((longitude + 180) / 360) * mapWidth,
    y: top + mercatorY * mapWidth,
  };
}

function addRing(path, ring, width, offsetX, offsetY) {
  ring.forEach((coordinate, index) => {
    const point = projectCoordinate(coordinate, width, offsetX, offsetY);
    if (index === 0) path.moveTo(point.x, point.y);
    else path.lineTo(point.x, point.y);
  });
  path.closePath();
}

function addPolygon(path, polygon, width, offsetX, offsetY) {
  polygon.forEach((ring) => addRing(path, ring, width, offsetX, offsetY));
}

function polygonBounds(polygon) {
  const bounds = {
    minLongitude: Infinity,
    maxLongitude: -Infinity,
    minLatitude: Infinity,
    maxLatitude: -Infinity,
  };

  polygon.forEach((ring) => {
    ring.forEach(([longitude, latitude]) => {
      bounds.minLongitude = Math.min(bounds.minLongitude, longitude);
      bounds.maxLongitude = Math.max(bounds.maxLongitude, longitude);
      bounds.minLatitude = Math.min(bounds.minLatitude, latitude);
      bounds.maxLatitude = Math.max(bounds.maxLatitude, latitude);
    });
  });

  return bounds;
}

function isSulawesi(polygon) {
  const bounds = polygonBounds(polygon);
  return (
    bounds.minLongitude > 118 &&
    bounds.maxLongitude < 126 &&
    bounds.minLatitude > -7 &&
    bounds.maxLatitude < 3 &&
    bounds.maxLongitude - bounds.minLongitude > 3
  );
}

function buildMapFeatures(featureCollection, width, offsetX = 0, offsetY = 0) {
  const sulawesiPath = new Path2D();

  const countries = featureCollection.features.map((feature) => {
    const path = new Path2D();
    const polygons =
      feature.geometry.type === "Polygon"
        ? [feature.geometry.coordinates]
        : feature.geometry.coordinates;

    polygons.forEach((polygon) => {
      addPolygon(path, polygon, width, offsetX, offsetY);
      if (feature.properties.id === "IDN" && isSulawesi(polygon)) {
        addPolygon(sulawesiPath, polygon, width, offsetX, offsetY);
      }
    });

    return {
      id: feature.properties.id,
      name: feature.properties.name,
      continent: feature.properties.continent,
      subregion: feature.properties.subregion,
      hoverColor: countryHoverColor(feature.properties.id),
      path,
      center: projectCoordinate(feature.properties.label, width, offsetX, offsetY),
    };
  });

  return { countries, sulawesiPath };
}

function normalizeName(value) {
  return String(value || "").trim().toLocaleLowerCase();
}

function countryHoverColor(countryId) {
  const hash = String(countryId).split("").reduce(
    (total, character) => total + character.charCodeAt(0),
    0,
  );
  return BRAND_HOVER_COLORS[hash % BRAND_HOVER_COLORS.length];
}

function isMapLandPixel(pixels, pixelIndex) {
  const offset = pixelIndex * 4;
  const red = pixels[offset];
  const green = pixels[offset + 1];
  const blue = pixels[offset + 2];
  const neutralLand =
    red < 195 && Math.abs(red - green) < 16 && Math.abs(red - blue) < 16;
  const referenceAccent = red > 220 && green < 190 && blue < 190;
  return neutralLand || referenceAccent;
}

function findNearestLandPixel(pixels, width, height, seedX, seedY) {
  const originX = clamp(Math.round(seedX), 0, width - 1);
  const originY = clamp(Math.round(seedY), 0, height - 1);

  for (let radius = 0; radius <= 16; radius += 1) {
    for (let y = originY - radius; y <= originY + radius; y += 1) {
      for (let x = originX - radius; x <= originX + radius; x += 1) {
        if (x < 0 || x >= width || y < 0 || y >= height) continue;
        if (isMapLandPixel(pixels, y * width + x)) return y * width + x;
      }
    }
  }

  return -1;
}

function createRasterCountryMask(
  referenceImage,
  width,
  height,
  seed,
  color,
  offsetX = 0,
  offsetY = 0,
) {
  // Segment at half of the original JPG resolution. At hero resolution the
  // thin white borders can collapse during image scaling and join neighboring
  // countries; the higher-resolution source preserves those separators.
  const sourceWidth = Math.min(3200, referenceImage.naturalWidth);
  const sourceHeight = Math.round(referenceImage.naturalHeight / 2);
  const sourceCanvas = document.createElement("canvas");
  sourceCanvas.width = sourceWidth;
  sourceCanvas.height = sourceHeight;
  const sourceContext = sourceCanvas.getContext("2d", { willReadFrequently: true });
  sourceContext.drawImage(referenceImage, 0, 0, sourceWidth, sourceHeight);
  const sourcePixels = sourceContext.getImageData(0, 0, sourceWidth, sourceHeight).data;
  const startPixel = findNearestLandPixel(
    sourcePixels,
    sourceWidth,
    sourceHeight,
    ((seed.x - offsetX) / width) * sourceWidth,
    ((seed.y - offsetY) / height) * sourceHeight,
  );
  if (startPixel < 0) return null;

  const visited = new Uint8Array(sourceWidth * sourceHeight);
  const queue = new Uint32Array(sourceWidth * sourceHeight);
  const fill = hexToRgb(color) || [190, 0, 75];
  let queueStart = 0;
  let queueEnd = 0;
  let minimumX = sourceWidth;
  let maximumX = 0;
  let minimumY = sourceHeight;
  let maximumY = 0;
  queue[queueEnd] = startPixel;
  queueEnd += 1;
  visited[startPixel] = 1;

  while (queueStart < queueEnd) {
    const pixelIndex = queue[queueStart];
    queueStart += 1;
    const pixelX = pixelIndex % sourceWidth;
    const pixelY = Math.floor(pixelIndex / sourceWidth);
    minimumX = Math.min(minimumX, pixelX);
    maximumX = Math.max(maximumX, pixelX);
    minimumY = Math.min(minimumY, pixelY);
    maximumY = Math.max(maximumY, pixelY);

    const neighbors = [
      pixelIndex - sourceWidth,
      pixelIndex + sourceWidth,
      pixelIndex - 1,
      pixelIndex + 1,
    ];

    neighbors.forEach((neighbor, index) => {
      if (
        neighbor < 0 ||
        neighbor >= sourceWidth * sourceHeight ||
        visited[neighbor] ||
        (index === 2 && pixelX === 0) ||
        (index === 3 && pixelX === sourceWidth - 1) ||
        !isMapLandPixel(sourcePixels, neighbor)
      ) {
        return;
      }
      visited[neighbor] = 1;
      queue[queueEnd] = neighbor;
      queueEnd += 1;
    });
  }

  const cropWidth = maximumX - minimumX + 1;
  const cropHeight = maximumY - minimumY + 1;
  const maskCanvas = document.createElement("canvas");
  maskCanvas.width = cropWidth;
  maskCanvas.height = cropHeight;
  const maskContext = maskCanvas.getContext("2d");
  const maskPixels = maskContext.createImageData(cropWidth, cropHeight);

  for (let index = 0; index < queueEnd; index += 1) {
    const sourceIndex = queue[index];
    const pixelX = (sourceIndex % sourceWidth) - minimumX;
    const pixelY = Math.floor(sourceIndex / sourceWidth) - minimumY;
    const outputOffset = (pixelY * cropWidth + pixelX) * 4;
    maskPixels.data[outputOffset] = fill[0];
    maskPixels.data[outputOffset + 1] = fill[1];
    maskPixels.data[outputOffset + 2] = fill[2];
    maskPixels.data[outputOffset + 3] = 255;
  }
  maskContext.putImageData(maskPixels, 0, 0);

  return {
    canvas: maskCanvas,
    x: offsetX + (minimumX / sourceWidth) * width,
    y: offsetY + (minimumY / sourceHeight) * height,
    width: (cropWidth / sourceWidth) * width,
    height: (cropHeight / sourceHeight) * height,
  };
}

function baseVisual(fill = LAND_COLOR) {
  return {
    fill,
    opacity: 1,
    scale: 1,
    offsetX: 0,
    offsetY: 0,
  };
}

function normalizeEffect(effect = {}, fallbackFill = ACCENT_COLOR) {
  return {
    fill: effect.fill || fallbackFill,
    opacity: effect.opacity ?? 1,
    scale: effect.scale ?? 1.01,
    offsetX: effect.offsetX ?? 0,
    offsetY: effect.offsetY ?? -2,
  };
}

function interpolateVisual(from, to, progress) {
  return {
    fill: mixColor(from.fill, to.fill, progress),
    opacity: from.opacity + (to.opacity - from.opacity) * progress,
    scale: from.scale + (to.scale - from.scale) * progress,
    offsetX: from.offsetX + (to.offsetX - from.offsetX) * progress,
    offsetY: from.offsetY + (to.offsetY - from.offsetY) * progress,
  };
}

function resolveAnimationVisual(animation, time) {
  if (time < animation.start) {
    return { visual: animation.from, needsNextFrame: true, complete: false };
  }

  if (animation.loop) {
    const cycle = Math.max(400, animation.duration || 1400);
    const progress = ((time - animation.start) % cycle) / cycle;
    const wave = 0.5 - Math.cos(progress * Math.PI * 2) / 2;
    return {
      visual: interpolateVisual(animation.from, animation.to, wave),
      needsNextFrame: true,
      complete: false,
    };
  }

  const progress = clamp(
    animation.duration === 0 ? 1 : (time - animation.start) / animation.duration,
    0,
    1,
  );
  return {
    visual: interpolateVisual(animation.from, animation.to, easeInOutCubic(progress)),
    needsNextFrame: progress < 1,
    complete: progress === 1,
  };
}

function visualIsStatic(visual) {
  return (
    visual.fill === LAND_COLOR &&
    visual.opacity === 1 &&
    visual.scale === 1 &&
    visual.offsetX === 0 &&
    visual.offsetY === 0
  );
}

function visualMovesCountry(visual) {
  return visual.scale !== 1 || visual.offsetX !== 0 || visual.offsetY !== 0;
}

function drawCountry(context, country, visual, borderWidth) {
  context.save();
  context.globalAlpha = visual.opacity;
  if (visualMovesCountry(visual) && visual.shadow !== false) {
    context.shadowColor = "rgba(20, 34, 55, 0.14)";
    context.shadowBlur = 7;
    context.shadowOffsetX = 0;
    context.shadowOffsetY = 2.5;
  }
  context.translate(
    country.center.x + visual.offsetX,
    country.center.y + visual.offsetY,
  );
  context.scale(visual.scale, visual.scale);
  context.translate(-country.center.x, -country.center.y);
  context.fillStyle = visual.fill;
  context.fill(country.path, "evenodd");
  context.lineWidth = borderWidth / visual.scale;
  context.strokeStyle = BORDER_COLOR;
  context.lineJoin = "round";
  context.stroke(country.path);
  context.restore();
}

function eraseCountryFromBase(context, country, progress, borderWidth) {
  if (progress <= 0) return;

  context.save();
  context.globalAlpha = clamp(progress, 0, 1);
  context.globalCompositeOperation = "destination-out";
  context.fillStyle = "#000";
  context.fill(country.path, "evenodd");
  context.lineWidth = Math.max(5.5, borderWidth * 8);
  context.lineJoin = "round";
  context.strokeStyle = "#000";
  context.stroke(country.path);
  context.translate(0, Math.max(1.5, borderWidth * 2));
  context.fill(country.path, "evenodd");
  context.stroke(country.path);
  context.restore();
}

function getJourneyProgress(progress, start, end) {
  return easeInOutCubic(clamp((progress - start) / Math.max(0.001, end - start), 0, 1));
}

function lerp(from, to, progress) {
  return from + (to - from) * progress;
}

function resolveCameraStop(map, stop) {
  const canvasCenter = {
    x: map.viewportWidth / 2,
    y: map.viewportHeight / 2,
  };
  if (!stop) return { target: canvasCenter, zoom: 1 };

  const country = stop.id
    ? map.countries.find((candidate) => candidate.id === stop.id)
    : null;
  const target = country?.center ||
    (stop.coordinate
      ? projectCoordinate(stop.coordinate, map.width, map.left, map.top)
      : canvasCenter);

  return {
    target,
    zoom: stop.zoom ?? 1,
    focusStrength: stop.focusStrength,
  };
}

function getJourneyCamera(map, progress) {
  let stopIndex = 0;
  for (let index = JOURNEY_CAMERA_STOPS.length - 1; index >= 0; index -= 1) {
    if (progress >= JOURNEY_CAMERA_STOPS[index].start) {
      stopIndex = index;
      break;
    }
  }

  const currentStop = JOURNEY_CAMERA_STOPS[stopIndex];
  const previousStop = JOURNEY_CAMERA_STOPS[Math.max(0, stopIndex - 1)];
  const current = resolveCameraStop(map, currentStop);
  const previous = resolveCameraStop(map, previousStop);
  const transitionProgress = stopIndex === 0
    ? 1
    : easeInOutCubic(
        clamp((progress - currentStop.start) / 0.045, 0, 1),
      );
  const target = {
    x: lerp(previous.target.x, current.target.x, transitionProgress),
    y: lerp(previous.target.y, current.target.y, transitionProgress),
  };
  const zoom = lerp(previous.zoom, current.zoom, transitionProgress);
  const canvasCenter = {
    x: map.viewportWidth / 2,
    y: map.viewportHeight / 2,
  };
  const defaultFocusStrength = (stop) =>
    lerp(0.11, 0.45, clamp((stop.zoom - 1) / 0.35, 0, 1));
  const focusStrength = lerp(
    previous.focusStrength ?? defaultFocusStrength(previous),
    current.focusStrength ?? defaultFocusStrength(current),
    transitionProgress,
  );

  return {
    center: canvasCenter,
    focus: {
      x: lerp(canvasCenter.x, target.x, focusStrength),
      y: lerp(canvasCenter.y, target.y, focusStrength),
    },
    scale: zoom,
  };
}

function applyCameraTransform(context, camera) {
  context.translate(camera.center.x, camera.center.y);
  context.scale(camera.scale, camera.scale);
  context.translate(-camera.focus.x, -camera.focus.y);
}

function cameraPointToScreen(point, camera) {
  return {
    x: camera.center.x + (point.x - camera.focus.x) * camera.scale,
    y: camera.center.y + (point.y - camera.focus.y) * camera.scale,
  };
}

function screenPointToCamera(point, camera) {
  return {
    x: camera.focus.x + (point.x - camera.center.x) / camera.scale,
    y: camera.focus.y + (point.y - camera.center.y) / camera.scale,
  };
}

function getQuadraticPoint(start, control, end, progress) {
  const inverse = 1 - progress;
  return {
    x:
      inverse * inverse * start.x +
      2 * inverse * progress * control.x +
      progress * progress * end.x,
    y:
      inverse * inverse * start.y +
      2 * inverse * progress * control.y +
      progress * progress * end.y,
  };
}

function getRouteControl(start, end, curve) {
  const deltaX = end.x - start.x;
  const deltaY = end.y - start.y;
  const distance = Math.max(1, Math.hypot(deltaX, deltaY));

  return {
    x: (start.x + end.x) / 2 + (-deltaY / distance) * curve,
    y: (start.y + end.y) / 2 + (deltaX / distance) * curve,
  };
}

function drawJourneyRoute(context, start, end, progress, curve, width, color) {
  if (progress <= 0) return;

  const control = getRouteControl(start, end, curve * (width / 1280));
  const steps = Math.max(2, Math.ceil(34 * progress));
  context.save();
  context.beginPath();
  context.moveTo(start.x, start.y);

  for (let index = 1; index <= steps; index += 1) {
    const point = getQuadraticPoint(start, control, end, (index / steps) * progress);
    context.lineTo(point.x, point.y);
  }

  context.globalAlpha = 0.38 + progress * 0.48;
  context.strokeStyle = color;
  context.lineWidth = Math.max(1, width * 0.00105);
  context.lineCap = "round";
  context.setLineDash([Math.max(3, width * 0.0035), Math.max(4, width * 0.005)]);
  context.stroke();
  context.setLineDash([]);

  const head = getQuadraticPoint(start, control, end, progress);
  context.globalAlpha = 0.9;
  context.fillStyle = color;
  context.beginPath();
  context.arc(head.x, head.y, Math.max(2.1, width * 0.0022), 0, Math.PI * 2);
  context.fill();
  context.restore();
}

function roundedRect(context, x, y, width, height, radius) {
  const safeRadius = Math.min(radius, width / 2, height / 2);
  context.beginPath();
  context.moveTo(x + safeRadius, y);
  context.arcTo(x + width, y, x + width, y + height, safeRadius);
  context.arcTo(x + width, y + height, x, y + height, safeRadius);
  context.arcTo(x, y + height, x, y, safeRadius);
  context.arcTo(x, y, x + width, y, safeRadius);
  context.closePath();
}

function drawJourneyLabel(context, point, label, progress, color, mapWidth, offsetX, offsetY) {
  if (progress <= 0.06) return;

  const fontSize = clamp(mapWidth * 0.009, 9.5, 11.75);
  const horizontalPadding = fontSize * 0.9;
  const height = fontSize * 2.15;
  context.save();
  context.globalAlpha = getJourneyProgress(progress, 0.06, 0.5);
  context.font = `700 ${fontSize}px "Plus Jakarta Sans", system-ui, sans-serif`;
  context.textAlign = "center";
  context.textBaseline = "middle";
  const width = context.measureText(label).width + horizontalPadding * 2;
  const centerX = point.x + offsetX * (mapWidth / 1280);
  const centerY = point.y + offsetY * (mapWidth / 1280);
  const left = centerX - width / 2;
  const top = centerY - height / 2;

  context.shadowColor = "rgba(20, 34, 55, 0.14)";
  context.shadowBlur = 14;
  context.shadowOffsetY = 4;
  context.fillStyle = "rgba(251, 249, 244, 0.96)";
  roundedRect(context, left, top, width, height, height / 2);
  context.fill();
  context.shadowColor = "transparent";
  context.lineWidth = 1;
  context.strokeStyle = color;
  context.stroke();
  context.fillStyle = "#202d41";
  context.fillText(label, centerX, centerY + 0.3);
  context.restore();
}

function drawJourneyEndpoint(context, point, progress, color, mapWidth) {
  if (progress <= 0) return;

  const radius = Math.max(2.6, mapWidth * 0.0027);
  context.save();
  context.globalAlpha = 0.2 * progress;
  context.fillStyle = color;
  context.beginPath();
  context.arc(point.x, point.y, radius * (2.1 + progress), 0, Math.PI * 2);
  context.fill();
  context.globalAlpha = 0.95 * progress;
  context.beginPath();
  context.arc(point.x, point.y, radius, 0, Math.PI * 2);
  context.fill();
  context.restore();
}

function drawExportJourney(context, map, progress, borderWidth) {
  const countriesById = new Map(map.countries.map((country) => [country.id, country]));
  const india = countriesById.get("IND");
  if (!india) return;

  const originProgress = getJourneyProgress(progress, 0, 0.045);
  const destinationStates = JOURNEY_DESTINATIONS.map((destination) => {
    const country = countriesById.get(destination.id);
    const routeProgress = getJourneyProgress(
      progress,
      destination.start,
      destination.end,
    );
    return { destination, country, routeProgress };
  }).filter(({ country }) => country);

  const regionStates = JOURNEY_REGIONS.map((region) => ({
    region,
    regionProgress: getJourneyProgress(progress, region.start, region.end),
    anchor: projectCoordinate(region.anchor, map.width, map.left, map.top),
  }));

  // Routes sit beneath every raised country and label, keeping the final
  // network legible without letting lines cut through the destination cards.
  destinationStates.forEach(({ destination, country, routeProgress }) => {
    drawJourneyRoute(
      context,
      india.center,
      country.center,
      routeProgress,
      destination.curve,
      map.width,
      destination.color,
    );
  });

  regionStates.forEach(({ region, regionProgress, anchor }) => {
    drawJourneyRoute(
      context,
      india.center,
      anchor,
      regionProgress,
      region.curve,
      map.width,
      region.color,
    );
  });

  destinationStates.forEach(({ destination, country, routeProgress }) => {

    if (routeProgress > 0.52) {
      const countryProgress = getJourneyProgress(routeProgress, 0.52, 1);
      eraseCountryFromBase(context, country, countryProgress, borderWidth);
      drawCountry(
        context,
        country,
        {
          ...baseVisual(destination.fill || destination.color),
          opacity: countryProgress,
          scale: 1 + countryProgress * 0.004,
          offsetY: -1.25 * countryProgress,
          shadow: false,
        },
        borderWidth,
      );
      drawJourneyEndpoint(
        context,
        country.center,
        countryProgress,
        destination.color,
        map.width,
      );
      drawJourneyLabel(
        context,
        country.center,
        destination.label,
        countryProgress,
        destination.color,
        map.width,
        destination.labelX,
        destination.labelY,
      );
    }
  });

  regionStates.forEach(({ region, regionProgress, anchor }) => {
    region.ids.forEach((id, index) => {
      const country = countriesById.get(id);
      if (!country) return;
      const staggerStart = 0.34 + index * 0.065;
      const countryProgress = getJourneyProgress(
        regionProgress,
        staggerStart,
        Math.min(1, staggerStart + 0.28),
      );
      if (countryProgress <= 0) return;

      eraseCountryFromBase(context, country, countryProgress, borderWidth);
      drawCountry(
        context,
        country,
        {
          ...baseVisual(region.fill || region.color),
          opacity: countryProgress * 0.92,
          scale: 1 + countryProgress * 0.0025,
          offsetY: -0.9 * countryProgress,
          shadow: false,
        },
        borderWidth,
      );
    });

    if (regionProgress > 0.52) {
      const labelProgress = getJourneyProgress(regionProgress, 0.52, 1);
      drawJourneyEndpoint(context, anchor, labelProgress, region.color, map.width);
      drawJourneyLabel(
        context,
        anchor,
        region.label,
        labelProgress,
        region.color,
        map.width,
        region.labelX,
        region.labelY,
      );
    }
  });

  eraseCountryFromBase(context, india, originProgress, borderWidth);
  drawCountry(
    context,
    india,
    {
      ...baseVisual(ACCENT_COLOR),
      opacity: 0.92,
      scale: 1 + originProgress * 0.003,
      offsetY: -1 * originProgress,
      shadow: false,
    },
    borderWidth,
  );
  drawJourneyEndpoint(context, india.center, 0.85, INDIA_ROUTE_COLOR, map.width);
  drawJourneyLabel(
    context,
    india.center,
    "India",
    0.9,
    INDIA_ROUTE_COLOR,
    map.width,
    0,
    -20,
  );
}

/**
 * Canvas world map with an imperative animation API.
 *
 * ref.current.animateCountry("IND", { fill, scale, offsetX, offsetY, duration, loop })
 * ref.current.animateContinent("Asia", options)
 * ref.current.reset(options)
 */
const WorldMapCanvas = React.forwardRef(function WorldMapCanvas(
  {
    className = "",
    highlightedCountries = [],
    highlightedContinents = [],
    highlightColor = ACCENT_COLOR,
    showReferenceAccent = true,
    journey = false,
    onCountryHover,
    onCountryClick,
  },
  forwardedRef,
) {
  const shellRef = React.useRef(null);
  const canvasRef = React.useRef(null);
  const tooltipRef = React.useRef(null);
  const referenceImageRef = React.useRef(null);
  const brandedReferenceRef = React.useRef(null);
  const mapRef = React.useRef(null);
  const countryMaskCacheRef = React.useRef(new Map());
  const effectsRef = React.useRef(new Map());
  const pendingActionsRef = React.useRef([]);
  const hoveredCountryRef = React.useRef(null);
  const hoverStartedAtRef = React.useRef(0);
  const journeyProgressRef = React.useRef(journey ? 0 : null);
  const cameraRef = React.useRef(null);
  const frameRef = React.useRef(0);
  const drawRef = React.useRef(() => {});
  const [loadError, setLoadError] = React.useState("");

  const highlightedCountrySet = React.useMemo(
    () => new Set(highlightedCountries.map(normalizeName)),
    [highlightedCountries],
  );
  const highlightedContinentSet = React.useMemo(
    () => new Set(highlightedContinents.map(normalizeName)),
    [highlightedContinents],
  );

  const requestDraw = React.useCallback(() => {
    if (!frameRef.current) {
      frameRef.current = window.requestAnimationFrame((time) => {
        frameRef.current = 0;
        drawRef.current(time);
      });
    }
  }, []);

  const resolveCountryIds = React.useCallback((target) => {
    const map = mapRef.current;
    if (!map) return [];

    const wanted = normalizeName(target);
    return map.countries
      .filter(
        (country) =>
          normalizeName(country.id) === wanted || normalizeName(country.name) === wanted,
      )
      .map((country) => country.id);
  }, []);

  const animateIds = React.useCallback(
    (ids, options = {}) => {
      const now = performance.now();
      const duration = Math.max(0, options.duration ?? 650);
      const effect = normalizeEffect(options, highlightColor);

      ids.forEach((id, index) => {
        const currentAnimation = effectsRef.current.get(id);
        const from = currentAnimation
          ? resolveAnimationVisual(currentAnimation, now).visual
          : baseVisual();
        effectsRef.current.set(id, {
          from,
          to: effect,
          start: now + (options.stagger ?? 0) * index,
          duration,
          loop: Boolean(options.loop),
        });
      });
      requestDraw();
    },
    [highlightColor, requestDraw],
  );

  React.useImperativeHandle(
    forwardedRef,
    () => ({
      animateCountry(target, options) {
        if (!mapRef.current) {
          pendingActionsRef.current.push({ type: "country", target, options });
          return;
        }
        animateIds(resolveCountryIds(target), options);
      },
      animateContinent(target, options) {
        if (!mapRef.current) {
          pendingActionsRef.current.push({ type: "continent", target, options });
          return;
        }
        const wanted = normalizeName(target);
        const ids = (mapRef.current?.countries || [])
          .filter((country) => normalizeName(country.continent) === wanted)
          .map((country) => country.id);
        animateIds(ids, options);
      },
      reset({ duration = 450 } = {}) {
        const now = performance.now();
        pendingActionsRef.current = [];
        effectsRef.current.forEach((entry, id) => {
          effectsRef.current.set(id, {
            from: resolveAnimationVisual(entry, now).visual,
            to: baseVisual(),
            start: now,
            duration,
            loop: false,
            removeWhenComplete: true,
          });
        });
        requestDraw();
      },
      getCountries() {
        return (mapRef.current?.countries || []).map(
          ({ id, name, continent, subregion }) => ({ id, name, continent, subregion }),
        );
      },
      setJourneyProgress(progress) {
        journeyProgressRef.current = clamp(progress, 0, 1);
        requestDraw();
      },
    }),
    [animateIds, requestDraw, resolveCountryIds],
  );

  React.useEffect(() => {
    const referenceImage = new Image();
    referenceImage.decoding = "async";
    referenceImage.onload = () => {
      referenceImageRef.current = referenceImage;
      brandedReferenceRef.current = createBrandedReference(referenceImage);
      requestDraw();
    };
    referenceImage.src = worldMapReferenceUrl;

    return () => {
      referenceImage.onload = null;
    };
  }, [requestDraw]);

  React.useEffect(() => {
    if (!document.fonts?.ready) return undefined;

    let active = true;
    document.fonts.ready.then(() => {
      if (active) requestDraw();
    });

    return () => {
      active = false;
    };
  }, [requestDraw]);

  React.useEffect(() => {
    const canvas = canvasRef.current;
    const shell = shellRef.current;
    if (!canvas || !shell) return undefined;

    let disposed = false;
    let sourceData;

    const resize = () => {
      if (disposed) return;

      // Use unscaled layout dimensions. The desktop shell uses CSS zoom, so
      // getBoundingClientRect() would otherwise apply the scale twice.
      const viewportWidth = Math.max(1, shell.clientWidth);
      const viewportHeight = Math.max(1, shell.clientHeight);
      const width = Math.min(viewportWidth, viewportHeight * MAP_ASPECT_RATIO);
      const height = width / MAP_ASPECT_RATIO;
      const left = (viewportWidth - width) / 2;
      const top = (viewportHeight - height) / 2;
      const visualScale = shell.clientWidth
        ? shell.getBoundingClientRect().width / shell.clientWidth
        : 1;
      const pixelRatio = Math.min(
        4,
        Math.max(1, (window.devicePixelRatio || 1) * Math.max(0.75, visualScale)),
      );

      canvas.width = Math.round(viewportWidth * pixelRatio);
      canvas.height = Math.round(viewportHeight * pixelRatio);
      canvas.style.width = `${viewportWidth}px`;
      canvas.style.height = `${viewportHeight}px`;
      countryMaskCacheRef.current.clear();
      try {
        mapRef.current = sourceData
          ? {
              ...buildMapFeatures(sourceData, width, left, top),
              width,
              height,
              left,
              top,
              viewportWidth,
              viewportHeight,
              pixelRatio,
              fallbackOnly: false,
            }
          : {
              countries: [],
              sulawesiPath: null,
              width,
              height,
              left,
              top,
              viewportWidth,
              viewportHeight,
              pixelRatio,
              fallbackOnly: true,
            };
      } catch (error) {
        console.error("The vector world map could not be prepared.", error);
        mapRef.current = {
          countries: [],
          sulawesiPath: null,
          width,
          height,
          left,
          top,
          viewportWidth,
          viewportHeight,
          pixelRatio,
          fallbackOnly: true,
        };
      }

      if (pendingActionsRef.current.length) {
        const pendingActions = pendingActionsRef.current.splice(0);
        pendingActions.forEach(({ type, target, options }) => {
          if (type === "country") {
            animateIds(resolveCountryIds(target), options);
            return;
          }

          const wanted = normalizeName(target);
          const ids = mapRef.current.countries
            .filter((country) => normalizeName(country.continent) === wanted)
            .map((country) => country.id);
          animateIds(ids, options);
        });
      }
      requestDraw();
    };

    loadCountryData()
      .then((data) => {
        if (disposed) return;
        sourceData = data;
        resize();
      })
      .catch((error) => {
        if (disposed) return;
        setLoadError(error.message);
      });

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(shell);
    resize();

    return () => {
      disposed = true;
      resizeObserver.disconnect();
      if (frameRef.current) {
        window.cancelAnimationFrame(frameRef.current);
        frameRef.current = 0;
      }
    };
  }, [animateIds, requestDraw, resolveCountryIds]);

  React.useEffect(() => {
    drawRef.current = (time = performance.now()) => {
      const canvas = canvasRef.current;
      const map = mapRef.current;
      if (!canvas || !map) return;

      const context = canvas.getContext("2d");
      context.setTransform(map.pixelRatio, 0, 0, map.pixelRatio, 0, 0);
      context.imageSmoothingEnabled = true;
      context.imageSmoothingQuality = "high";
      context.clearRect(0, 0, map.viewportWidth, map.viewportHeight);
      const paintReference = () => {
        const referenceImage = referenceImageRef.current;
        if (referenceImage) {
          context.drawImage(
            brandedReferenceRef.current || referenceImage,
            map.left,
            map.top,
            map.width,
            map.height,
          );
        }
      };

      if (map.fallbackOnly) {
        cameraRef.current = null;
        paintReference();
        return;
      }

      const camera = journey && journeyProgressRef.current !== null
        ? getJourneyCamera(map, journeyProgressRef.current)
        : {
            center: { x: map.viewportWidth / 2, y: map.viewportHeight / 2 },
            focus: { x: map.viewportWidth / 2, y: map.viewportHeight / 2 },
            scale: 1,
          };
      cameraRef.current = camera;
      context.save();
      applyCameraTransform(context, camera);

      // The supplied reference is the exact, dependable base layer. Vector
      // paths are retained above it solely for country-level interaction and
      // animation, so a geometry/API issue can never leave a blank hero.
      paintReference();

      const hoveredId = hoveredCountryRef.current?.id;
      const borderWidth = Math.max(0.55, map.width * 0.00058);
      let needsNextFrame = false;

      if (journey && journeyProgressRef.current !== null) {
        drawExportJourney(
          context,
          map,
          journeyProgressRef.current,
          borderWidth,
        );
      }

      const visuals = map.countries.map((country) => {
        const isHighlighted =
          highlightedCountrySet.has(normalizeName(country.id)) ||
          highlightedCountrySet.has(normalizeName(country.name)) ||
          highlightedContinentSet.has(normalizeName(country.continent));
        let visual = isHighlighted
          ? normalizeEffect({ fill: highlightColor, scale: 1, offsetY: 0 }, highlightColor)
          : baseVisual();
        const animation = effectsRef.current.get(country.id);

        if (animation) {
          const resolved = resolveAnimationVisual(animation, time);
          visual = resolved.visual;
          needsNextFrame ||= resolved.needsNextFrame;

          if (resolved.complete && animation.removeWhenComplete) {
            effectsRef.current.delete(country.id);
          }
        }

        return { country, visual };
      });

      visuals
        .filter(({ visual }) => !visualIsStatic(visual))
        .forEach(({ country, visual }) =>
          drawCountry(context, country, visual, borderWidth),
        );

      const hoveredCountry = hoveredId
        ? map.countries.find((country) => country.id === hoveredId)
        : null;
      const referenceImage = referenceImageRef.current;
      if (hoveredCountry && referenceImage) {
        let countryMask = countryMaskCacheRef.current.get(hoveredCountry.id);
        if (!countryMask) {
          countryMask = createRasterCountryMask(
            referenceImage,
            Math.round(map.width),
            Math.round(map.height),
            hoveredCountry.center,
            hoveredCountry.hoverColor,
            map.left,
            map.top,
          );
          if (countryMask) {
            countryMaskCacheRef.current.set(hoveredCountry.id, countryMask);
            if (countryMaskCacheRef.current.size > 12) {
              const oldestKey = countryMaskCacheRef.current.keys().next().value;
              countryMaskCacheRef.current.delete(oldestKey);
            }
          }
        }

        if (countryMask) {
          const hoverProgress = easeInOutCubic(
            clamp((time - hoverStartedAtRef.current) / 240, 0, 1),
          );
          const scale = 1 + 0.007 * hoverProgress;
          const offsetY = -2.25 * hoverProgress;
          context.save();
          context.globalAlpha = hoverProgress;
          context.shadowColor = "rgba(20, 34, 55, 0.14)";
          context.shadowBlur = 7;
          context.shadowOffsetY = 2.5;
          context.translate(hoveredCountry.center.x, hoveredCountry.center.y + offsetY);
          context.scale(scale, scale);
          context.translate(-hoveredCountry.center.x, -hoveredCountry.center.y);
          context.drawImage(
            countryMask.canvas,
            countryMask.x,
            countryMask.y,
            countryMask.width,
            countryMask.height,
          );
          context.restore();
          needsNextFrame ||= hoverProgress < 1;
        }
      }

      context.restore();

      if (hoveredCountry && tooltipRef.current && !tooltipRef.current.hidden) {
        const tooltipPoint = cameraPointToScreen(hoveredCountry.center, camera);
        tooltipRef.current.style.left = `${tooltipPoint.x}px`;
        tooltipRef.current.style.top = `${tooltipPoint.y - 12}px`;
      }

      if (needsNextFrame) requestDraw();
    };

    requestDraw();
  }, [
    highlightColor,
    highlightedContinentSet,
    highlightedCountrySet,
    journey,
    requestDraw,
    showReferenceAccent,
  ]);

  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;

    const setHoveredCountry = (country) => {
      if (hoveredCountryRef.current?.id !== country?.id) {
        hoveredCountryRef.current = country || null;
        hoverStartedAtRef.current = performance.now();
        onCountryHover?.(
          country
            ? {
                id: country.id,
                name: country.name,
                continent: country.continent,
                subregion: country.subregion,
              }
            : null,
        );
        requestDraw();
      }

      const tooltip = tooltipRef.current;
      if (!tooltip) return;
      if (!country) {
        tooltip.hidden = true;
        return;
      }

      tooltip.textContent = country.name;
      tooltip.hidden = false;
      const tooltipPoint = cameraRef.current
        ? cameraPointToScreen(country.center, cameraRef.current)
        : country.center;
      tooltip.style.left = `${tooltipPoint.x}px`;
      tooltip.style.top = `${tooltipPoint.y - 12}px`;
      tooltip.style.setProperty("--world-map-tooltip-color", country.hoverColor);
    };

    const findCountry = (event) => {
      const map = mapRef.current;
      if (!map) return null;

      const canvasBounds = canvas.getBoundingClientRect();
      const screenX =
        (event.clientX - canvasBounds.left) *
        (map.viewportWidth / canvasBounds.width);
      const screenY =
        (event.clientY - canvasBounds.top) *
        (map.viewportHeight / canvasBounds.height);
      const point = cameraRef.current
        ? screenPointToCamera({ x: screenX, y: screenY }, cameraRef.current)
        : { x: screenX, y: screenY };
      const context = canvas.getContext("2d");
      context.setTransform(1, 0, 0, 1, 0, 0);

      for (let index = map.countries.length - 1; index >= 0; index -= 1) {
        if (context.isPointInPath(map.countries[index].path, point.x, point.y, "evenodd")) {
          return { country: map.countries[index], point };
        }
      }
      return null;
    };

    const handlePointerMove = (event) => {
      const hit = findCountry(event);
      canvas.style.cursor = hit ? "pointer" : "default";
      setHoveredCountry(hit?.country || null);
    };
    const handlePointerLeave = () => setHoveredCountry(null);
    const handleClick = (event) => {
      const country = findCountry(event)?.country;
      if (!country) return;
      onCountryClick?.({
        id: country.id,
        name: country.name,
        continent: country.continent,
        subregion: country.subregion,
      });
    };

    canvas.addEventListener("pointermove", handlePointerMove);
    canvas.addEventListener("pointerleave", handlePointerLeave);
    canvas.addEventListener("click", handleClick);

    return () => {
      canvas.removeEventListener("pointermove", handlePointerMove);
      canvas.removeEventListener("pointerleave", handlePointerLeave);
      canvas.removeEventListener("click", handleClick);
    };
  }, [onCountryClick, onCountryHover, requestDraw]);

  return (
    <div
      ref={shellRef}
      className={`world-map-canvas-shell ${className}`.trim()}
      style={{
        backgroundColor: "transparent",
      }}
    >
      <canvas
        ref={canvasRef}
        className="world-map-canvas"
        aria-label="Interactive world map. Move the pointer over a country to highlight it."
        role="img"
      />
      <span ref={tooltipRef} className="world-map-tooltip" hidden />
      {loadError && (
        <p className="world-map-error" role="alert">
          {loadError}
        </p>
      )}
    </div>
  );
});

WorldMapCanvas.displayName = "WorldMapCanvas";

export { ACCENT_COLOR, BORDER_COLOR, LAND_COLOR, PAPER_COLOR };
export default WorldMapCanvas;
