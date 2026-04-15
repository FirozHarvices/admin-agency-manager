const MAX_DIMENSION = 1280;
const TARGET_RATIO = 0.1; // 10% of original = 90% reduction
const START_QUALITY = 0.8;
const MIN_QUALITY = 0.3;
const QUALITY_STEP = 0.1;

/**
 * Compress an image file to ~10% of its original size (90% reduction) by
 * downscaling to max 1280px and iteratively lowering JPEG quality until the
 * target size is hit. Non-images, GIFs, and files that can't be decoded are
 * returned unchanged.
 */
export async function compressImageIfPossible(file: File): Promise<File> {
  if (!file.type.startsWith('image/')) return file;
  // Canvas re-encoding flattens GIF animation — preserve original
  if (file.type === 'image/gif') return file;

  let bitmap: ImageBitmap;
  try {
    bitmap = await createImageBitmap(file);
  } catch {
    return file;
  }

  const { width, height } = bitmap;
  const scale = Math.min(1, MAX_DIMENSION / Math.max(width, height));
  const w = Math.round(width * scale);
  const h = Math.round(height * scale);

  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    bitmap.close();
    return file;
  }
  ctx.drawImage(bitmap, 0, 0, w, h);
  bitmap.close();

  const target = file.size * TARGET_RATIO;
  let bestBlob: Blob | null = null;
  let quality = START_QUALITY;

  while (quality >= MIN_QUALITY) {
    const blob: Blob | null = await new Promise((resolve) =>
      canvas.toBlob(resolve, 'image/jpeg', quality)
    );
    if (!blob) break;
    bestBlob = blob;
    if (blob.size <= target) break;
    quality = +(quality - QUALITY_STEP).toFixed(2);
  }

  // Safety: if compression produced a larger file, keep original
  if (!bestBlob || bestBlob.size >= file.size) return file;

  const newName = file.name.replace(/\.(png|jpe?g|webp|bmp)$/i, '') + '.jpg';
  return new File([bestBlob], newName, {
    type: 'image/jpeg',
    lastModified: Date.now(),
  });
}
