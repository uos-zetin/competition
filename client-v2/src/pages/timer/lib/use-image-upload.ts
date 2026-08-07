import { useEffect, useRef, useState } from "react";

function useImageUpload() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [imageUrls, setImageUrls] = useState<string[]>([]);

  useEffect(() => () => imageUrls.forEach((url) => URL.revokeObjectURL(url)), [imageUrls]);

  const selectImages = (files: FileList | null) => {
    if (!files) return;
    setImageUrls(
      Array.from(files)
        .filter((file) => file.type.startsWith("image/"))
        .map((file) => URL.createObjectURL(file))
    );
  };

  return { inputRef, imageUrls, selectImages };
}

export function useSingleImageUpload() {
  const { inputRef, imageUrls, selectImages } = useImageUpload();
  return { inputRef, imageUrl: imageUrls[0] ?? null, selectImage: selectImages };
}

export function useImageSlider(intervalMs: number, fadeDurationMs: number) {
  const { inputRef, imageUrls, selectImages } = useImageUpload();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFading, setIsFading] = useState(false);
  const selectSliderImages = (files: FileList | null) => {
    setCurrentIndex(0);
    setIsFading(false);
    selectImages(files);
  };

  useEffect(() => {
    if (imageUrls.length < 2) return;
    let timeout: number | undefined;
    const interval = window.setInterval(() => {
      setIsFading(true);
      timeout = window.setTimeout(() => {
        setCurrentIndex((index) => (index + 1) % imageUrls.length);
        setIsFading(false);
      }, fadeDurationMs);
    }, intervalMs);
    return () => {
      window.clearInterval(interval);
      if (timeout) window.clearTimeout(timeout);
    };
  }, [fadeDurationMs, imageUrls.length, intervalMs]);

  return { inputRef, imageUrl: imageUrls[currentIndex] ?? null, isFading, selectImages: selectSliderImages };
}
