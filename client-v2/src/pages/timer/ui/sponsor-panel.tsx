import { ImagePlus } from "lucide-react";

import { useImageSlider } from "../lib/use-image-upload";

import { Panel } from "./panel";
import { QrStrip } from "./qr-strip";

export function SponsorPanel({ dashboardUrl }: { dashboardUrl: string }) {
  const { inputRef, imageUrl, isFading, selectImages } = useImageSlider(8_000, 450);
  const openFilePicker = () => inputRef.current?.click();
  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      openFilePicker();
    }
  };
  return (
    <Panel title="스폰서">
      <div className="flex min-h-0 flex-1 flex-col">
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          tabIndex={-1}
          className="sr-only"
          onChange={(event) => selectImages(event.target.files)}
        />
        <div
          role="button"
          tabIndex={0}
          aria-label="이미지 업로드"
          onClick={openFilePicker}
          onKeyDown={handleKeyDown}
          className="group relative flex min-h-0 flex-1 cursor-pointer items-center justify-center overflow-hidden bg-muted/30"
        >
          <>
            {imageUrl ? (
              <img
                src={imageUrl}
                alt="스폰서 이미지"
                className={`size-full object-contain transition-opacity duration-500 ${isFading ? "opacity-0" : "opacity-100"}`}
              />
            ) : (
              <span className="text-[clamp(.65rem,1cqi,.85rem)] text-muted-foreground">
                스폰서 이미지를 업로드하세요
              </span>
            )}
          </>
          <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/45 text-[clamp(.65rem,1cqi,.85rem)] text-white opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
            <ImagePlus className="size-[clamp(.85rem,1.5cqi,1.25rem)]" aria-hidden="true" />
            이미지 업로드
          </div>
        </div>
        <QrStrip url={dashboardUrl} />
      </div>
    </Panel>
  );
}
