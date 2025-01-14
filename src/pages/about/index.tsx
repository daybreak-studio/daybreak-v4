import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import useEmblaCarousel from "embla-carousel-react";
import type { EmblaCarouselType, EmblaEventType } from "embla-carousel";
import { ExpandIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { GetStaticProps } from "next";
import { client } from "@/sanity/lib/client";
import { ABOUT_QUERY } from "@/sanity/lib/queries";
import { About } from "@/sanity/types";
import { MediaItem } from "@/sanity/lib/media";
import { MediaRenderer } from "@/components/media-renderer";
import { EASINGS } from "@/components/animations/easings";

interface TeamMember {
  _key: string;
  name: string;
  role: string;
  bio: string;
  media: MediaItem[];
  qaPairs: {
    _key: string;
    question: string;
    answer: string;
  }[];
}

function PersonInfo({
  person,
  isExpanded,
  onToggle,
  isPreview,
}: {
  person: TeamMember;
  isExpanded: boolean;
  onToggle: () => void;
  isPreview: boolean;
}) {
  return (
    <motion.div
      layout
      layoutId="person-info-root"
      className="fixed bottom-0 left-0 right-0 z-50 px-3 pb-4 md:bottom-4 md:px-4"
      style={{ transformOrigin: "bottom center" }}
      initial={{ opacity: 0, y: 20, scale: 0.9 }}
      animate={{
        opacity: 1,
        y: 0,
        scale: isPreview ? 1.03 : 1,
      }}
      transition={{
        duration: 0.6,
        ease: EASINGS.easeOutQuart,
      }}
    >
      <motion.div
        layout
        layoutId="person-info-container"
        className={cn(
          "mx-auto h-min w-min overflow-hidden bg-white/40 p-1 drop-shadow-2xl backdrop-blur-md",
        )}
        animate={{
          borderRadius: isExpanded ? 32 : 16,
        }}
        transition={{
          duration: 0.6,
          ease: EASINGS.easeOutQuart,
        }}
        style={{ transformOrigin: "bottom center" }}
      >
        <motion.div
          layout
          layoutId="person-info-background"
          onClick={onToggle}
          className="relative flex w-screen max-w-[calc(100vw-2rem)] cursor-pointer flex-col items-center justify-between space-y-4 overflow-hidden bg-white/30 p-6 backdrop-blur-2xl md:max-w-[400px]"
          animate={{
            borderRadius: isExpanded ? 28 : 12,
          }}
          transition={{
            duration: 0.6,
            ease: EASINGS.easeOutQuart,
          }}
          style={{ transformOrigin: "bottom center" }}
        >
          <AnimatePresence mode="popLayout">
            {isExpanded ? (
              <motion.div
                layout="position"
                layoutId={person.name}
                className="flex flex-col text-center"
              >
                <motion.h2
                  key={person.name}
                  initial={{ filter: "blur(2px)" }}
                  animate={{ filter: "blur(0px)" }}
                  exit={{ filter: "blur(2px)" }}
                  layout="position"
                  className="whitespace-nowrap font-medium text-stone-500"
                >
                  {person.name}
                </motion.h2>
                <motion.h2
                  key={person.role}
                  initial={{ filter: "blur(2px)" }}
                  animate={{ filter: "blur(0px)" }}
                  exit={{ filter: "blur(2px)" }}
                  layout="position"
                  className="whitespace-nowrap text-stone-400"
                >
                  {person.role}
                </motion.h2>
              </motion.div>
            ) : (
              <motion.div
                layout
                layoutId={person.name}
                className="flex w-full items-center justify-between"
              >
                <div className="flex flex-col">
                  <motion.div
                    key={person.name}
                    initial={{ filter: "blur(2px)" }}
                    animate={{ filter: "blur(0px)" }}
                    exit={{ filter: "blur(2px)" }}
                    layout="position"
                    className="whitespace-nowrap text-stone-500"
                  >
                    {person.name}
                  </motion.div>
                  <motion.div
                    key={person.role}
                    initial={{ filter: "blur(2px)" }}
                    animate={{ filter: "blur(0px)" }}
                    exit={{ filter: "blur(2px)" }}
                    layout="position"
                    className="whitespace-nowrap text-stone-400"
                  >
                    {person.role}
                  </motion.div>
                </div>
                <motion.div
                  key={"state: " + isExpanded}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                >
                  <ExpandIcon className="h-4 w-4 text-stone-500" />
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence mode="popLayout">
            {isExpanded && (
              <motion.div
                key={person._key}
                initial={{ opacity: 0, filter: "blur(2px)" }}
                animate={{ opacity: 1, filter: "blur(0px)" }}
                exit={{ opacity: 0, filter: "blur(2px)" }}
                transition={{ duration: 0.2 }}
                className="flex w-full flex-col space-y-6"
                layout="position"
              >
                <p className="px-8 text-center text-stone-500">{person.bio}</p>
                <div className="flex items-start gap-1 self-stretch">
                  {person.qaPairs.map((qaPair, index) => (
                    <div
                      key={index}
                      className="flex aspect-square h-full w-full flex-col items-center justify-center rounded-2xl border-[1px] border-stone-200 bg-stone-400/5 p-4 text-center"
                    >
                      <div className="pb-1 text-sm text-stone-500">
                        {qaPair.question}
                      </div>
                      <div className="text-md text-stone-700">
                        {qaPair.answer}
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

export default function AboutPage({ aboutData }: { aboutData: About }) {
  console.log(aboutData);
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "center",
    containScroll: false,
    axis: "x",
    direction: "ltr",
    startIndex: 0,
    dragFree: false,
    inViewThreshold: 0.7,
  });

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isScrolling, setIsScrolling] = useState(false);
  const [previewIndex, setPreviewIndex] = useState<number | null>(null);

  const handleScroll = useCallback(
    (event: WheelEvent) => {
      if (!emblaApi || isScrolling) return;

      event.preventDefault();

      const isTrackpad =
        Math.abs(event.deltaX) !== 0 || Math.abs(event.deltaY) < 50;
      const deltaX = event.deltaX;
      const deltaY = event.deltaY;
      const delta = isTrackpad
        ? Math.max(Math.abs(deltaX), Math.abs(deltaY))
        : Math.abs(deltaY);

      // Lower thresholds for more responsiveness
      const threshold = isTrackpad ? 15 : 35;

      if (delta > threshold) {
        setIsScrolling(true);

        requestAnimationFrame(() => {
          const direction = isTrackpad
            ? Math.abs(deltaX) > Math.abs(deltaY)
              ? deltaX
              : deltaY
            : deltaY;

          const currentIndex = emblaApi.selectedScrollSnap();
          const targetIndex =
            direction > 0
              ? Math.min(currentIndex + 1, emblaApi.scrollSnapList().length - 1)
              : Math.max(currentIndex - 1, 0);

          emblaApi.scrollTo(targetIndex);

          setTimeout(
            () => {
              setIsScrolling(false);
            },
            isTrackpad ? 100 : 300,
          );
        });
      }
    },
    [emblaApi, isScrolling],
  );

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    if (emblaApi) {
      timeoutId = setTimeout(() => setIsLoaded(true), 100);

      const onSelect = () => {
        requestAnimationFrame(() => {
          setSelectedIndex(emblaApi.selectedScrollSnap());
        });
      };

      emblaApi.on("select", onSelect);

      // Add wheel event listener
      const rootNode = emblaApi.rootNode();
      rootNode.addEventListener("wheel", handleScroll, { passive: false });

      return () => {
        clearTimeout(timeoutId);
        rootNode.removeEventListener("wheel", handleScroll);
        emblaApi.off("select", onSelect);
      };
    }
  }, [emblaApi, handleScroll]);

  return (
    <motion.div className="fixed inset-0">
      {/* Full page gradient container */}
      <div className="main-gradient absolute inset-0">
        {/* Carousel container */}
        <div ref={emblaRef} className="h-full overflow-hidden">
          <motion.div
            className="flex h-full items-center mix-blend-multiply"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
          >
            {aboutData.team?.map((person, i) => {
              console.log("Person:", person);
              console.log("Person video:", person.media);
              return (
                <motion.div
                  key={person._key}
                  className="relative flex h-full w-full flex-[0_0_100%] items-center justify-center mix-blend-multiply md:flex-[0_0_25%]"
                  initial={{
                    scale: 0.8,
                    filter: "blur(12px)",
                    opacity: 0,
                  }}
                  animate={{
                    scale: selectedIndex === i ? 1 : 0.9,
                    filter: selectedIndex === i ? "blur(0px)" : "blur(8px)",
                    opacity: isLoaded ? (selectedIndex === i ? 1 : 0.65) : 0,
                  }}
                  transition={{
                    duration: 0.6,
                    ease: EASINGS.easeOutQuart,
                  }}
                >
                  {person.media?.[0] && (
                    <MediaRenderer
                      className="object-contain mix-blend-multiply"
                      media={person.media[0]}
                      autoPlay={true}
                    />
                  )}
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </div>

      {/* Navigation/Bio Card */}
      <PersonInfo
        person={aboutData.team?.[previewIndex ?? selectedIndex] as TeamMember}
        isExpanded={isExpanded}
        onToggle={() => setIsExpanded(!isExpanded)}
        isPreview={previewIndex !== null}
      />

      {/* Dots Navigation */}
      {!isExpanded && (
        <div className="absolute bottom-36 left-1/2 z-10 -translate-x-1/2 md:bottom-40">
          <div className="flex gap-2">
            {aboutData.team?.map((_, index) => (
              <motion.button
                key={index}
                onClick={() => {
                  setPreviewIndex(null);
                  emblaApi?.scrollTo(index);
                }}
                onHoverStart={() => setPreviewIndex(index)}
                onHoverEnd={() => setPreviewIndex(null)}
                className="h-2 w-2 rounded-full bg-stone-500"
                animate={{
                  scale: index === selectedIndex ? 1.5 : 1,
                  opacity: index === selectedIndex ? 1 : 0.5,
                }}
                whileHover={{
                  scale: 1.5,
                  opacity: 1,
                  transition: {
                    duration: 0.4,
                    ease: EASINGS.easeOutQuart,
                  },
                }}
                transition={{
                  duration: 0.4,
                  ease: EASINGS.easeOutQuart,
                }}
                whileTap={{
                  scale: 0.95,
                  transition: {
                    duration: 0.4,
                    ease: EASINGS.easeOutQuart,
                  },
                }}
              />
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const aboutData = await client.fetch(ABOUT_QUERY);

  return {
    props: {
      aboutData,
    },
    revalidate: 60,
  };
};
