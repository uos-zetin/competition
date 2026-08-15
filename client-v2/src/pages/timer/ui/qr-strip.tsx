import { QRCodeCanvas } from "qrcode.react";

export function QrStrip({ url }: { url: string }) {
  return (
    <div className="flex min-h-0 shrink-0 items-center justify-center gap-[clamp(.4rem,.9cqi,.75rem)] border-t bg-muted/40 px-2 py-[clamp(.35rem,.8cqi,.7rem)]">
      <div className="aspect-square h-full max-h-full"><QRCodeCanvas value={url} size={200} level="M" bgColor="#ffffff" fgColor="#000000" style={{ width: "100%", height: "100%" }} /></div>
      <span className="text-[clamp(.5rem,.85cqi,.75rem)] text-muted-foreground">
        대회 대시보드
        <br />
        QR로 접속
      </span>
    </div>
  );
}
