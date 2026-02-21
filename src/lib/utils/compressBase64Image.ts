// 이미지 압축 함수입니다
export async function compressBase64Image(
  input: string | File,
  {
    maxBytes = 180 * 1024,   // 목표 바이트 (기본: 180KB) ← 서버 한도에 맞게 조정
    maxWidth = 1024,         // 시작 리사이즈 기준 상한
    minWidth = 256,          // 더 줄여도 되는 최소 너비
    startQuality = 0.72,     // 시작 품질
    minQuality = 0.4,        // 더 낮추지 않을 최소 품질
    scaleStep = 0.85,        // 크기 줄이는 비율 (15%씩 축소)
    qualityStep = 0.06,      // 품질 단계 감소 폭
    maxIterations = 14       // 안전장치
  } = {}
): Promise<File> {
  const dataUrl = typeof input === 'string' ? input : await fileToDataURL(input);
  const img = await loadImage(dataUrl);

  let width = Math.min(img.width, maxWidth);
  let height = Math.round(img.height * (width / img.width));
  let quality = startQuality;

  let bestBlob: Blob | null = null; // 지금까지 가장 작은 결과
  for (let i = 0; i < maxIterations; i++) {
    const blob = await renderJpeg(img, width, height, quality);

    // 가장 작은 결과 갱신
    if (!bestBlob || blob.size < bestBlob.size) bestBlob = blob;

    if (blob.size <= maxBytes) {
      const name =
        typeof input === 'string' ? 'image.jpg' : renameToJpeg(input.name);
      return new File([blob], name, { type: 'image/jpeg' });
    }

    // 줄이는 전략: 품질 여유가 있으면 우선 품질 감소, 아니면 해상도 축소
    if (quality - qualityStep >= minQuality) {
      quality = +(quality - qualityStep).toFixed(2);
    } else if (Math.round(width * scaleStep) >= minWidth) {
      width = Math.max(minWidth, Math.round(width * scaleStep));
      height = Math.round(height * scaleStep);
    } else {
      // 더 줄일 여지가 없으면 루프 종료
      break;
    }
  }

  // 목표치 미달이라도 최솟값 반환 (서버 한도가 너무 낮은 경우 대비)
  const fallback = bestBlob ?? (await renderJpeg(img, width, height, quality));
  const name =
    typeof input === 'string' ? 'image.jpg' : renameToJpeg((input as File).name);
  return new File([fallback], name, { type: 'image/jpeg' });
}

// ---------- helpers ----------
function fileToDataURL(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error('Failed to read file as data URL'));
    reader.readAsDataURL(file);
  });
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error('Image load error'));
    img.src = src;
  });
}

async function renderJpeg(
  img: HTMLImageElement,
  width: number,
  height: number,
  quality: number
): Promise<Blob> {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('CanvasRenderingContext2D unavailable');
  ctx.drawImage(img, 0, 0, width, height);
  const blob = await canvasToBlob(canvas, 'image/jpeg', quality);
  return blob;
}

function canvasToBlob(
  canvas: HTMLCanvasElement,
  type: string,
  quality?: number
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (!blob) return reject(new Error('Blob conversion failed'));
      resolve(blob);
    }, type, quality);
  });
}

function renameToJpeg(name: string) {
  const base = name.replace(/\.[^.]+$/, '');
  return `${base}.jpg`;
}
