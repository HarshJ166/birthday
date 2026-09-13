"use client";

import Image from "next/image";
import { motion } from "motion/react";

import type { Photo } from "@/components/gallery-grid";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { EASE_OUT } from "@/lib/motion";

type PhotoLightboxProps = {
  photo: Photo | null;
  onClose: () => void;
};

/**
 * The photo, lifted off the wall rather than boxed in a white pop-up: a dark
 * scrim, the print itself, and nothing else. Radix owns focus and Escape;
 * Motion owns the lift.
 */
export function PhotoLightbox({ photo, onClose }: PhotoLightboxProps) {
  return (
    <Dialog open={photo !== null} onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        showCloseButton
        className="max-w-[min(92vw,54rem)] border-none bg-transparent p-0 shadow-none"
      >
        {photo ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 18 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.45, ease: EASE_OUT }}
          >
            <DialogTitle className="sr-only">{photo.caption}</DialogTitle>
            <DialogDescription className="sr-only">
              {photo.alt}
            </DialogDescription>
            <Image
              src={photo.src}
              width={photo.width}
              height={photo.height}
              alt={photo.alt}
              sizes="(min-width: 1024px) 54rem, 92vw"
              className="h-auto max-h-[76vh] w-full rounded-sm object-contain"
              priority
            />
            <p className="px-1 pt-3 text-small text-paper/80">
              {photo.caption}
            </p>
          </motion.div>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
