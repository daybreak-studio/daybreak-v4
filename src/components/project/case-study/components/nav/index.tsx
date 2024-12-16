import { EASINGS } from "@/components/animations/easings";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDownIcon, ChevronUpIcon, XIcon } from "lucide-react";
import { useRef, useEffect, useState, forwardRef } from "react";

interface NavProps {
  activeGroup: number;
  groups: Array<{
    heading?: string;
    caption?: string;
  }>;
  isExpanded: boolean;
  onToggleExpand: () => void;
  onNext: () => void;
  onPrev: () => void;
  canGoNext: boolean;
  canGoPrev: boolean;
}

const CaseStudyNav = forwardRef<HTMLDivElement, NavProps>(
  (
    {
      activeGroup,
      groups,
      isExpanded,
      onToggleExpand,
      onNext,
      onPrev,
      canGoNext,
      canGoPrev,
    },
    ref,
  ) => {
    const [prevIndex, setPrevIndex] = useState(activeGroup);
    const direction = activeGroup > prevIndex ? 1 : -1;
    const currentGroup = groups[activeGroup];

    useEffect(() => {
      setPrevIndex(activeGroup);
    }, [activeGroup]);

    const transition = {
      duration: 0.4,
      ease: EASINGS.easeOutQuart,
    };

    const originStyles = { transformOrigin: "bottom center" };

    return (
      <motion.div
        ref={ref}
        layout
        layoutId="nav-root"
        className="fixed bottom-0 left-0 right-0 z-50 px-3 pb-[calc(0.5rem_+_env(safe-area-inset-bottom))] md:bottom-4 md:px-4"
        style={originStyles}
        initial={{ opacity: 0, y: 20, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.9 }}
        transition={transition}
      >
        <motion.div
          layout
          layoutId="nav-container"
          className="mx-auto h-min w-min overflow-hidden bg-white/60 p-1 drop-shadow-2xl backdrop-blur-2xl"
          animate={{
            borderRadius: isExpanded ? 32 : 16,
          }}
          transition={transition}
          style={originStyles}
        >
          <motion.div
            layout
            layoutId="nav-background"
            className="relative overflow-hidden bg-white"
            animate={{
              borderRadius: isExpanded ? 28 : 12,
            }}
            transition={transition}
            style={originStyles}
          >
            <AnimatePresence mode="popLayout" initial={false}>
              {!isExpanded ? (
                <motion.button
                  layout
                  key="collapsed"
                  className="flex w-full items-center justify-between gap-2 px-4 py-2 focus:outline-none"
                  onClick={onToggleExpand}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={transition}
                >
                  <span className="opacity-50">{currentGroup.heading}</span>
                  <XIcon className="h-4 w-4 rotate-45 opacity-60" />
                </motion.button>
              ) : (
                <motion.div
                  layout
                  key="expanded"
                  className="relative w-screen max-w-[calc(100vw-2rem)] md:max-w-[400px]"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={transition}
                >
                  <div className="flex w-full flex-col gap-3 px-6 py-6">
                    <AnimatePresence mode="popLayout" custom={direction}>
                      <motion.div
                        key={`content-${activeGroup}`}
                        initial={{ opacity: 0, y: direction * 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: direction * -20 }}
                        transition={transition}
                      >
                        {currentGroup.heading && (
                          <div className="mb-2 flex w-full items-center justify-between text-lg">
                            <h4 className="opacity-70">
                              {currentGroup.heading}
                            </h4>
                          </div>
                        )}
                        {currentGroup.caption && (
                          <p className="text-sm opacity-50">
                            {currentGroup.caption}
                          </p>
                        )}
                      </motion.div>
                    </AnimatePresence>

                    <div className="flex gap-1">
                      <button
                        onClick={onPrev}
                        disabled={!canGoPrev}
                        className="rounded-full bg-white/80 p-2 transition-opacity hover:bg-white/90 disabled:opacity-30"
                      >
                        <ChevronUpIcon className="h-4 w-4" />
                      </button>
                      <button
                        onClick={onNext}
                        disabled={!canGoNext}
                        className="rounded-full bg-white/80 p-2 transition-opacity hover:bg-white/90 disabled:opacity-30"
                      >
                        <ChevronDownIcon className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  <button
                    onClick={onToggleExpand}
                    className={`absolute right-6 ${
                      currentGroup.heading ? "top-[1.75rem]" : "top-[2.25rem]"
                    }`}
                  >
                    <XIcon className="h-4 w-4 opacity-60" />
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      </motion.div>
    );
  },
);

CaseStudyNav.displayName = "CaseStudyNav";

export default CaseStudyNav;
