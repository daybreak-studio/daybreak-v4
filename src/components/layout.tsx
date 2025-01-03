import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/router";
import { useVisit } from "@/lib/contexts/visit";
import { useEffect, useRef } from "react";
import { EASINGS } from "./animations/easings";

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const { visitStatus, isLoading } = useVisit();
  const router = useRouter();
  const prevPathRef = useRef(router.asPath);

  // Check if current path is a base path (no second segment)
  const isBasePath = !router.asPath.split("/")[2];
  // Check if previous path was a subroute
  const wasSubRoute = prevPathRef.current.split("/")[2];

  // Get the first segment of the path
  const currentBaseSegment = router.asPath.split("/")[1];

  // Update previous path reference
  useEffect(() => {
    prevPathRef.current = router.asPath;
  }, [router.asPath]);

  if (isLoading) {
    return null;
  }

  // If not on a base path OR coming from a subroute, render without animation
  if (!isBasePath || wasSubRoute) {
    return <div className="pt-24">{children}</div>;
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        className="pt-24"
        key={currentBaseSegment}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{
          duration: visitStatus === "new" ? 1 : 0.5,
          delay: visitStatus === "new" ? 1.5 : 0,
          ease: EASINGS.easeOutQuart,
        }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
