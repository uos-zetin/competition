import { ImagePlus } from "lucide-react";

import { progressService } from "@/features/progress";

import { useSingleImageUpload } from "../lib/use-image-upload";

export function TimerHeader() {
  const competition = progressService.use.competition();
  const { inputRef, imageUrl, selectImage } = useSingleImageUpload();
  const openFilePicker = () => inputRef.current?.click();
  const handleKeyDown = (event: React.KeyboardEvent<HTMLElement>) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      openFilePicker();
    }
  };
  return (
    <header
      role="button"
      tabIndex={0}
      onClick={openFilePicker}
      onKeyDown={handleKeyDown}
      className="group relative flex min-h-[clamp(3rem,9dvw,10rem)] cursor-pointer items-center justify-center overflow-hidden bg-primary px-6 py-[clamp(.5rem,1.3cqi,1rem)] text-center text-primary-foreground"
    >
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        tabIndex={-1}
        className="sr-only"
        onChange={(event) => selectImage(event.target.files)}
      />
      {imageUrl ? (
        <><img src={imageUrl} alt="" aria-hidden="true" className="absolute inset-0 size-full scale-110 object-cover blur-lg brightness-50" /><img src={imageUrl} alt="대회 배너" className="absolute inset-0 size-full object-contain" /></>
      ) : (
        <h1 className="text-[clamp(1.1rem,3.4cqi,3rem)] font-extrabold tracking-tight">{competition?.name ?? "—"}</h1>
      )}
      <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/45 text-[clamp(.65rem,1.2cqi,1rem)] text-white opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
        <ImagePlus className="size-[clamp(.9rem,1.5cqi,1.3rem)]" aria-hidden="true" />
        이미지 업로드
      </div>
    </header>
  );
}
