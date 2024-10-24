import React, { useEffect } from "react";
import { animate, motion, stagger } from "framer-motion";
import { useRouter } from "next/router";
import Link from "next/link";
import Logo from "/public/logos/daybreak-icon.svg";
import Wordmark from "/public/logos/daybreak-wordmark.svg";
import { useVisit } from "@/contexts/VisitContext";

const tabs = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Services" },
  { href: "/work", label: "Work" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export default function Navigation() {
  const { visitStatus, isLoading, markVisitComplete } = useVisit();
  const router = useRouter();
  const activePath = router.asPath;

  useEffect(() => {
    if (visitStatus === "new") {
      runAnimationSequence();
      markVisitComplete();
    }
  }, [visitStatus, markVisitComplete]);

  const runAnimationSequence = async () => {
    await animate([
      [".container", { opacity: 1 }, { duration: 1, ease: [0.76, 0, 0.24, 1] }],
      [
        ".glyph",
        { rotate: 0 },
        { duration: 1, at: "<", ease: [0.76, 0, 0.24, 1] },
      ],
      [
        ".glyph_container",
        { x: "0%" },
        { duration: 1, at: "<", ease: [0.76, 0, 0.24, 1] },
      ],
      [
        ".wordmark",
        { x: 0, opacity: 1, marginTop: "1px" },
        { duration: 1, at: "<", ease: [0.76, 0, 0.24, 1] },
      ],
    ]);
    await animate([
      [
        ".logo_container",
        { width: "5rem" },
        { duration: 1, at: "0", ease: [0.76, 0, 0.24, 1] },
      ],
      [
        ".parent",
        { transform: "translateY(0)" },
        { duration: 1, ease: [0.76, 0, 0.24, 1], at: "<" },
      ],
    ]);
    await animate([
      [
        ".items",
        { width: "auto", opacity: 1 },
        { duration: 0.75, ease: [0.76, 0, 0.24, 1] },
      ],
      [
        ".container",
        { backgroundColor: "rgb(255,255,255,0.5)" },
        { duration: 0.5, ease: [0.76, 0, 0.24, 1], at: "<" },
      ],
      [
        ".items > *",
        { opacity: 1 },
        {
          duration: 0.25,
          at: "<",
          delay: stagger(0.1),
          ease: [0.76, 0, 0.24, 1],
        },
      ],
    ]);
    await animate(
      ".pill",
      { opacity: 1 },
      { duration: 1, ease: [0.76, 0, 0.24, 1] },
    );
    await animate(
      ".container",
      { "--shadow-opacity": 1 },
      { duration: 1, ease: [0.76, 0, 0.24, 1] },
    );
  };

  if (isLoading) {
    return null; // or a loading spinner
  }

  return (
    <motion.nav
      className="parent fixed z-50 mx-auto flex h-fit w-full items-center justify-center"
      initial={{
        transform: visitStatus === "new" ? "translateY(50vh)" : "translateY(0)",
      }}
    >
      <motion.div
        className="container relative mt-4 flex w-fit items-stretch justify-center rounded-2xl p-1"
        initial={{
          opacity: visitStatus === "new" ? 0 : 1,
          backgroundColor:
            visitStatus === "new"
              ? "rgb(255,255,255,0)"
              : "rgb(248,248,248,0.75)",
        }}
      >
        {tabs.map((tab) =>
          tab.href === "/" ? (
            <Link
              key={tab.href}
              href="/"
              className="relative flex items-stretch"
            >
              <motion.div
                className="logo_container align-center relative mx-4 flex rounded-xl"
                initial={{ width: visitStatus === "new" ? "16rem" : "5rem" }}
              >
                <motion.div
                  className="glyph_container z-10 flex items-center overflow-hidden"
                  initial={{
                    width: "25%",
                    x: visitStatus === "new" ? "200%" : "0%",
                  }}
                >
                  <motion.div
                    className="glyph h-full w-full origin-bottom pb-1"
                    initial={{ rotate: visitStatus === "new" ? 180 : 0 }}
                  >
                    <Logo className="h-full w-full fill-current text-zinc-500" />
                  </motion.div>
                </motion.div>
                <motion.div
                  className="wordmark_container z-10 flex items-center overflow-hidden pl-[6%]"
                  initial={{ width: "75%" }}
                >
                  <motion.div
                    className="wordmark h-full w-full"
                    initial={{
                      x: visitStatus === "new" ? "100%" : "0%",
                      opacity: visitStatus === "new" ? 0 : 1,
                    }}
                  >
                    <Wordmark className="h-full w-full fill-current text-zinc-500" />
                  </motion.div>
                </motion.div>
              </motion.div>
              {activePath === tab.href && (
                <Pill isFirstVisit={visitStatus === "new"} />
              )}
            </Link>
          ) : null,
        )}
        <motion.div
          className="items flex"
          initial={{
            opacity: visitStatus === "new" ? 0 : 1,
            width: visitStatus === "new" ? 0 : "auto",
          }}
        >
          {tabs.map((tab) =>
            tab.href !== "/" ? (
              <motion.h1
                key={tab.label}
                initial={{ opacity: visitStatus === "new" ? 0 : 1 }}
                className="relative px-4 py-3 text-xs text-zinc-500"
              >
                <Link href={tab.href} className="relative z-10">
                  {tab.label}
                </Link>
                {activePath === tab.href && (
                  <Pill isFirstVisit={visitStatus === "new"} />
                )}
              </motion.h1>
            ) : null,
          )}
        </motion.div>
      </motion.div>
    </motion.nav>
  );
}

const Pill = ({ isFirstVisit }: { isFirstVisit: boolean }) => {
  return (
    <motion.span
      layoutId="pill"
      className="pill absolute inset-0 z-0 bg-white"
      style={{ borderRadius: "12px" }}
      initial={{ opacity: isFirstVisit ? 0 : 1 }}
      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
    />
  );
};
