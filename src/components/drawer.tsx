import { ReactNode, useRef, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronUp } from "lucide-react";
import clsx from "clsx";
import Lenis from "lenis";
import { useViewport } from "@/lib/hooks/use-viewport";

interface DrawerProps {
  children: ReactNode;
  className?: string;
  windowHeight: number;
}

const DrawerButton = ({
  isOpen,
  isHovered,
  onClick,
}: {
  isOpen: boolean;
  isHovered: boolean;
  onClick: () => void;
}) => {
  const { breakpoint } = useViewport();
  const isMobile = breakpoint === "sm";

  return (
    <div className={clsx("absolute flex w-full justify-center p-4 md:p-8")}>
      <div
        onClick={onClick}
        className={clsx(
          "relative z-30 flex cursor-pointer items-center justify-center p-8",
          isMobile && !isOpen ? "bottom-20" : "bottom-6",
        )}
      >
        <motion.button
          className={clsx(
            "flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-sm shadow-stone-300 transition-all duration-300 hover:scale-110 md:shadow-md",
            isOpen ? "sticky" : "absolute",
          )}
          initial={{ opacity: 0 }}
          animate={{
            opacity: isOpen || isHovered || isMobile ? 1 : 0,
          }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <motion.div
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronUp className="h-4 w-4 text-stone-400" />
          </motion.div>
        </motion.button>
      </div>
    </div>
  );
};

const Drawer: React.FC<DrawerProps> = ({
  children,
  windowHeight,
  className,
}) => {
  const contentRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const PEEK_HEIGHT = windowHeight * 0.06;
  const HOVER_PEEK_AMOUNT = 200;
  const lenisRef = useRef<Lenis | null>(null);
  const [contentOpacity, setContentOpacity] = useState(1);

  useEffect(() => {
    if (!contentRef.current) return;

    lenisRef.current = new Lenis({
      wrapper: contentRef.current,
      autoRaf: true,
      smoothWheel: true,
      syncTouch: true,
    });

    // Cleanup
    return () => {
      if (lenisRef.current) {
        lenisRef.current.destroy();
      }
    };
  }, [contentRef]);

  const toggleDrawer = () => {
    if (isOpen && lenisRef.current && contentRef.current) {
      setContentOpacity(0);

      lenisRef.current.scrollTo(0, {
        duration: 0.3,
        easing: (t) => 1 - Math.cos((t * Math.PI) / 2),
        lerp: 0.1,
        onComplete: () => {
          setContentOpacity(1);
        },
      });
    }

    setIsOpen(!isOpen);
    setIsHovered(false);
  };

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  const closedY = windowHeight - PEEK_HEIGHT;

  return (
    <motion.div
      id="drawer"
      className={clsx(
        "fixed inset-x-0 bottom-0 z-50 rounded-2xl bg-white/90 shadow backdrop-blur-2xl",
        className,
      )}
      style={{ height: windowHeight }}
      initial="closed"
      animate={isOpen ? "open" : "closed"}
      onHoverStart={() => !isOpen && setIsHovered(true)}
      onHoverEnd={() => !isOpen && setIsHovered(false)}
      variants={{
        open: {
          y: 0,
          borderRadius: 0,
        },
        closed: {
          y: isHovered ? closedY - HOVER_PEEK_AMOUNT : closedY,
          borderRadius: 24,
        },
      }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 30,
      }}
    >
      <AnimatePresence>
        <DrawerButton
          isOpen={isOpen}
          isHovered={isHovered}
          onClick={toggleDrawer}
        />
      </AnimatePresence>

      <motion.div
        ref={contentRef}
        className={clsx(
          "hide-scrollbar pb-safe-bottom h-full overscroll-contain",
          isOpen ? "overflow-y-auto" : "overflow-hidden",
        )}
        animate={{
          opacity: isOpen ? 1 : contentOpacity,
        }}
        transition={{ duration: 0.05 }}
      >
        <motion.div
          onClick={toggleDrawer}
          className="absolute top-0 z-20 flex w-full cursor-pointer justify-center p-36"
          animate={isHovered && !isOpen ? { y: -4 } : { y: 0 }}
          transition={{ duration: 0.2 }}
        />
        {children}
      </motion.div>
    </motion.div>
  );
};

export default Drawer;
