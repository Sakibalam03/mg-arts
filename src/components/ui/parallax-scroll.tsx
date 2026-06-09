"use client";
import { useScroll, useTransform, motion } from "framer-motion";
import { useRef } from "react";
import { cn } from "@/lib/utils";

export function ParallaxScroll({
  images,
  className,
  title,
  subtitle,
}: {
  images: string[];
  className?: string;
  title?: string;
  subtitle?: string;
}) {
  const gridRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    container: gridRef,
    offset: ["start start", "end start"],
  });

  const translateFirst = useTransform(scrollYProgress, [0, 1], [0, -200]);
  const translateSecond = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const translateThird = useTransform(scrollYProgress, [0, 1], [0, -200]);

  const third = Math.ceil(images.length / 3);
  const firstPart = images.slice(0, third);
  const secondPart = images.slice(third, 2 * third);
  const thirdPart = images.slice(2 * third);

  return (
    <div
      ref={gridRef}
      className={cn("min-h-[100dvh] items-start overflow-y-auto w-full", className)}
    >
      {(title || subtitle) && (
        <div className="px-10 pt-16 pb-4 max-w-5xl mx-auto">
          {title && (
            <h2 className="font-sans font-bold text-[clamp(1.625rem,3.5vw,2.25rem)] leading-[1.1] tracking-[-0.02em] text-foreground mb-2">
              {title}
            </h2>
          )}
          {subtitle && (
            <p className="text-muted-foreground text-[15px]">{subtitle}</p>
          )}
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 items-start max-w-5xl mx-auto gap-10 py-20 px-10">
        <div className="grid gap-10">
          {firstPart.map((el, idx) => (
            <motion.div style={{ y: translateFirst }} key={"grid-1-" + idx}>
              <img
                src={el}
                className="h-80 w-full object-cover object-left-top rounded-lg !m-0 !p-0"
                height="400"
                width="400"
                alt="Interior design project"
              />
            </motion.div>
          ))}
        </div>
        <div className="grid gap-10">
          {secondPart.map((el, idx) => (
            <motion.div style={{ y: translateSecond }} key={"grid-2-" + idx}>
              <img
                src={el}
                className="h-80 w-full object-cover object-left-top rounded-lg !m-0 !p-0"
                height="400"
                width="400"
                alt="Interior design project"
              />
            </motion.div>
          ))}
        </div>
        <div className="grid gap-10">
          {thirdPart.map((el, idx) => (
            <motion.div style={{ y: translateThird }} key={"grid-3-" + idx}>
              <img
                src={el}
                className="h-80 w-full object-cover object-left-top rounded-lg !m-0 !p-0"
                height="400"
                width="400"
                alt="Interior design project"
              />
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
