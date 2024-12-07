import { AnimationConfig } from "@/components/animations/AnimationConfig";
import { motion, useScroll, useTransform } from "framer-motion";
import React, { forwardRef } from "react";
import { useWindowSize } from "usehooks-ts";
import { MediaRenderer } from "@/components/media-renderer";

interface Props {
  groupIndex: number;
  currentMediaGroup: number;
  mediaGroup: any;
  boundInfo: {
    anchorY: number;
    height: number;
  };
  shouldShirnk: boolean;
  onClick?: (e: React.MouseEvent) => void;
  slug?: string;
}

const MediaGroupLayout = forwardRef<HTMLDivElement, Props>(
  (
    {
      shouldShirnk,
      onClick,
      groupIndex,
      boundInfo,
      currentMediaGroup,
      mediaGroup,
      slug,
    },
    ref,
  ) => {
    const { scrollY } = useScroll();
    const { height: screenHeight } = useWindowSize();
    const transitionZone = screenHeight * 0.5;
    const boundHeight = boundInfo ? boundInfo.height : 0;
    const yPosition = boundInfo ? boundInfo.anchorY : 0;

    const scale = useTransform(
      scrollY,
      [
        yPosition - transitionZone,
        yPosition,
        yPosition + boundHeight,
        yPosition + boundHeight + transitionZone,
      ],
      [shouldShirnk ? 0.95 : 1, 1, 1, shouldShirnk ? 0.95 : 1],
    );

    return (
      <motion.div
        style={{
          scale,
          transition: "transform .3s cubic-bezier(0.16, 1, 0.3, 1)",
        }}
      >
        <motion.div
          ref={ref}
          key={groupIndex}
          animate={{
            scale: !shouldShirnk
              ? 1
              : currentMediaGroup !== groupIndex
                ? 0.7
                : 0.8,
            opacity: shouldShirnk && currentMediaGroup !== groupIndex ? 0.3 : 1,
          }}
          transition={{
            duration: 0.4,
            ease: AnimationConfig.EASE_OUT,
          }}
          onClick={onClick}
          // to prevent immediate propogation for caption card
          onMouseUp={(e) => e.stopPropagation()}
          className="grid cursor-pointer grid-cols-1 gap-4 md:grid-cols-2"
        >
          {mediaGroup &&
            mediaGroup.items &&
            mediaGroup.items.map((item: any, itemIndex: number) => {
              const isSingleItem = mediaGroup.items.length === 1;
              return (
                <div
                  key={`${groupIndex}-${itemIndex}`}
                  className={isSingleItem ? "md:col-span-2" : ""}
                >
                  <MediaRenderer media={item} autoPlay={true} />
                </div>
              );
            })}
        </motion.div>
      </motion.div>
    );
  },
);

MediaGroupLayout.displayName = "MediaGroupLayout";

export default MediaGroupLayout;
