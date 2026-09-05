"use client";

import { motion } from "motion/react";

import { Card } from "@/components/ui/card";

const EASE_OUT = [0.16, 1, 0.3, 1] as const;

type LetterProps = {
  salutation: string;
  paragraphs: readonly string[];
  closing: string;
  farewell: string;
  signature: string;
  animated: boolean;
};

export function Letter({
  salutation,
  paragraphs,
  closing,
  farewell,
  signature,
  animated,
}: LetterProps) {
  return (
    <section className="mx-auto w-full max-w-3xl px-6 py-20 lg:py-28">
      <motion.div
        initial={animated ? { opacity: 0, y: 30, rotate: -0.6 } : false}
        whileInView={{ opacity: 1, y: 0, rotate: -0.35 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.9, ease: EASE_OUT }}
      >
        <Card className="gap-0 rounded-sm border-hairline bg-white px-7 py-12 shadow-[0_1px_2px_rgba(59,42,23,0.05),0_28px_66px_-42px_rgba(59,42,23,0.45)] sm:px-14 sm:py-16">
          <p className="font-display text-2xl font-normal text-seed">
            {salutation}
          </p>

          <div className="mt-7 space-y-6 text-[1.0625rem] leading-[1.75] text-seed-soft">
            {paragraphs.map((paragraph) => (
              <p key={paragraph} className="max-w-[62ch]">
                {paragraph}
              </p>
            ))}
          </div>

          <p className="mt-9 max-w-[62ch] text-[1.0625rem] leading-[1.75] text-seed">
            {closing}
          </p>

          <p className="font-display mt-9 text-2xl font-normal text-seed">
            {farewell}
          </p>

          <p className="font-display mt-3 text-3xl font-normal text-seed italic">
            {signature}
          </p>
        </Card>
      </motion.div>
    </section>
  );
}
