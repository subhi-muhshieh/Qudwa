// app/utils/imageUtils.js

/**
 * Creates an image element from a URL
 */
export const createImage = (url) =>
  new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener('load', () => resolve(image));
    image.addEventListener('error', (error) => reject(error));
    image.setAttribute('crossOrigin', 'anonymous');
    image.src = url;
  });

/**
 * Converts degrees to radians
 */
export const getRadianAngle = (degreeValue) => {
  return (degreeValue * Math.PI) / 180;
};

/**
 * Returns the new bounding area of a rotated rectangle
 */
export const rotateSize = (width, height, rotation) => {
  const rotRad = getRadianAngle(rotation);
  return {
    width: Math.abs(Math.cos(rotRad) * width) + Math.abs(Math.sin(rotRad) * height),
    height: Math.abs(Math.sin(rotRad) * width) + Math.abs(Math.cos(rotRad) * height),
  };
};

/**
 * Gets the cropped and processed image as a circular JPEG
 */
export async function getCroppedImg(
  imageSrc,
  pixelCrop,
  rotation = 0,
  flipHorizontal = false,
  flipVertical = false
) {
  const image = await createImage(imageSrc);
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  if (!ctx) return null;

  const rotRad = getRadianAngle(rotation);

  const { width: bBoxWidth, height: bBoxHeight } = rotateSize(
    image.width,
    image.height,
    rotation
  );

  canvas.width = bBoxWidth;
  canvas.height = bBoxHeight;

  ctx.translate(bBoxWidth / 2, bBoxHeight / 2);
  ctx.rotate(rotRad);
  ctx.scale(flipHorizontal ? -1 : 1, flipVertical ? -1 : 1);
  ctx.translate(-image.width / 2, -image.height / 2);

  ctx.drawImage(image, 0, 0);

  const croppedCanvas = document.createElement('canvas');
  const croppedCtx = croppedCanvas.getContext('2d');

  if (!croppedCtx) return null;

  const size = Math.min(pixelCrop.width, pixelCrop.height);
  croppedCanvas.width = size;
  croppedCanvas.height = size;

  croppedCtx.drawImage(
    canvas,
    pixelCrop.x + (pixelCrop.width - size) / 2,
    pixelCrop.y + (pixelCrop.height - size) / 2,
    size,
    size,
    0,
    0,
    size,
    size
  );

  const finalCanvas = document.createElement('canvas');
  const finalCtx = finalCanvas.getContext('2d');
  
  if (!finalCtx) return null;

  const outputSize = Math.min(size, 512);
  finalCanvas.width = outputSize;
  finalCanvas.height = outputSize;

  finalCtx.beginPath();
  finalCtx.arc(outputSize / 2, outputSize / 2, outputSize / 2, 0, Math.PI * 2);
  finalCtx.closePath();
  finalCtx.clip();

  finalCtx.drawImage(croppedCanvas, 0, 0, size, size, 0, 0, outputSize, outputSize);

  return new Promise((resolve) => {
    finalCanvas.toBlob(
      (blob) => {
        resolve(blob);
      },
      'image/jpeg',
      0.92
    );
  });
}

/**
 * Compresses an image to be under maxSizeInMB
 */
export async function compressImage(file, maxSizeInMB = 2) {
  const maxSizeInBytes = maxSizeInMB * 1024 * 1024;

  if (file.size <= maxSizeInBytes) {
    return file;
  }

  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let { width, height } = img;

        const maxDimension = 1024;
        if (width > maxDimension || height > maxDimension) {
          if (width > height) {
            height = (height / width) * maxDimension;
            width = maxDimension;
          } else {
            width = (width / height) * maxDimension;
            height = maxDimension;
          }
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        const tryCompress = (quality) => {
          canvas.toBlob(
            (blob) => {
              if (blob.size <= maxSizeInBytes || quality <= 0.1) {
                const compressedFile = new File([blob], file.name.replace(/\.[^/.]+$/, '.jpg'), {
                  type: 'image/jpeg',
                  lastModified: Date.now(),
                });
                resolve(compressedFile);
              } else {
                tryCompress(quality - 0.1);
              }
            },
            'image/jpeg',
            quality
          );
        };

        tryCompress(0.9);
      };
    };
  });
}

/**
 * Converts blob to file
 */
export function blobToFile(blob, fileName) {
  return new File([blob], fileName.replace(/\.[^/.]+$/, '.jpg'), {
    type: 'image/jpeg',
    lastModified: Date.now(),
  });
}