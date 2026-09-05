"use client";

import Image from "next/image";

import type { Photo } from "@/components/gallery-grid";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";

type PhotoLightboxProps = {
  photo: Photo | null;
  onClose: () => void;
};

export function PhotoLightbox({ photo, onClose }: PhotoLightboxProps) {
  return (
    <Dialog open={photo !== null} onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        showCloseButton
        className="max-w-[min(92vw,54rem)] border-hairline bg-white p-3 sm:p-4"
      >
        {photo ? (
          <>
            <DialogTitle className="sr-only">{photo.caption}</DialogTitle>
            <DialogDescription className="sr-only">{photo.alt}</DialogDescription>
            <Image
              src={photo.src}
              width={photo.width}
              height={photo.height}
              alt={photo.alt}
              sizes="(min-width: 1024px) 54rem, 92vw"
              className="h-auto max-h-[76vh] w-full object-contain"
              priority
            />
            <p className="px-1 pt-3 pb-1 text-[0.9375rem] text-seed-soft">
              {photo.caption}
            </p>
          </>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
