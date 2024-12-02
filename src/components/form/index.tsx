"use client";

import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { motion } from "framer-motion";
import * as Icons from "./icons";
import { Checkbox } from "../ui/checkbox";
import { cn } from "@/lib/utils";
import Image from "next/image";
import clsx from "clsx";

export interface DaybreakFormStep {
  id: string;
  card: React.ReactElement<DaybreakFormCardProps>;
  button?: boolean;
  valid: boolean;
}

interface DaybreakFormContextValue {
  currentIndex: number;
  total: number;
  goNext: () => void;
  goPrev: () => void;
  cards?: DaybreakFormStep[];
}

const DaybreakFormContext = createContext<DaybreakFormContextValue | undefined>(
  undefined,
);

export const useDaybreakForm = (): DaybreakFormContextValue => {
  const context = useContext(DaybreakFormContext);
  if (!context)
    throw new Error(
      "useDaybreakForm must be used within a DaybreakFormProvider",
    );
  return context;
};

export const DaybreakFormProvider: React.FC<{
  total: number;
  children: ReactNode;
}> = ({ total, children }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const goNext = () => setCurrentIndex((prev) => Math.min(prev + 1, total - 1));
  const goPrev = () => setCurrentIndex((prev) => Math.max(prev - 1, 0));

  return (
    <DaybreakFormContext.Provider
      value={{ currentIndex, total, goNext, goPrev, cards: [] }}
    >
      {children}
    </DaybreakFormContext.Provider>
  );
};

export interface DaybreakFormCardProps {
  title?: string;
  children?: React.ReactNode;
  index?: number;
  total?: number;
  className?: string;
}

export const DaybreakFormCard: React.FC<DaybreakFormCardProps> = ({
  title,
  children,
  index = 1,
  total = 1,
  ...props
}) => {
  const { goNext, goPrev, cards } = useDaybreakForm();

  const current = cards?.[index - 1];
  const valid = !current?.valid;

  return (
    <div
      className={clsx(
        "flex w-[518px] flex-col items-start gap-8 self-stretch rounded-[36px] bg-white/90 p-10 shadow-[0px_32px_100px_0px_color(display-p3_0_0_0_/_0.05)] shadow-[0px_32px_100px_0px_rgba(0,0,0,0.05)] backdrop-blur-lg",
        props.className,
      )}
    >
      <div className="flex flex-col items-start gap-[18px] self-stretch">
        <div className="flex items-center justify-between self-stretch">
          <button
            className="opacity-40"
            onClick={goPrev}
            disabled={index === 0}
            aria-label="Previous"
          >
            {<Icons.ChevronLeft />}
          </button>
          <span className="text-[14px] font-[550] leading-[24px] text-black opacity-40">
            {index} of {total}
          </span>
          <button
            className="opacity-40"
            onClick={goNext}
            disabled={valid}
            aria-label="Next"
          >
            {<Icons.ChevronRight />}
          </button>
        </div>
        <h2 className="text-[36px] font-[350] leading-[48px] text-black opacity-80">
          {title}
        </h2>
      </div>
      <div className="flex flex-col items-start gap-8 self-stretch">
        {children}
      </div>

      {current?.button && (
        <button
          className={cn(
            "flex items-center justify-center self-stretch rounded-2xl bg-black p-4 opacity-20 transition-all duration-200",
            !valid && "hover:opacity-100",
          )}
          onClick={goNext}
          disabled={valid}
          aria-label="Next"
        >
          <span className="text-[14px] font-[450] text-white">Next</span>
        </button>
      )}
    </div>
  );
};

export interface DaybreakFormProps {
  cards: DaybreakFormStep[];
}

export const DaybreakForm: React.FC<DaybreakFormProps> = ({ cards }) => {
  const [screenHeight, setScreenHeight] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);

  const goNext = () =>
    setCurrentIndex((prev) => Math.min(prev + 1, cards.length - 1));
  const goPrev = () => setCurrentIndex((prev) => Math.max(prev - 1, 0));

  const contextValue = {
    currentIndex,
    total: cards.length,
    goNext,
    goPrev,
    cards,
  };

  useEffect(() => {
    const updateHeight = () => setScreenHeight(window.innerHeight);
    updateHeight();

    window.addEventListener("resize", updateHeight);
    return () => window.removeEventListener("resize", updateHeight);
  }, []);

  const getScale = (index: number) => {
    if (index === currentIndex) return 1;
    if (index < currentIndex) return 0.75;
    return 1.25;
  };

  const getRotation = (index: number) => {
    if (index === currentIndex) return 0;
    if (index < currentIndex) return 5;
    return 5;
  };

  const getY = (index: number) => {
    if (index === currentIndex) return 0;
    if (index < currentIndex) return -128;
    return screenHeight;
  };

  const getOpacity = (index: number) => {
    if (index < currentIndex - 1 || index > currentIndex + 1) return 0;
    return 1;
  };

  return (
    <div className="space-y-8">
      <DaybreakFormContext.Provider value={contextValue}>
        <div className="fixed inset-0 flex items-center justify-center overflow-hidden">
          {cards.map((card, index) => (
            <motion.div
              key={card.id}
              initial={{
                rotate: getRotation(index),
                scale: getScale(index),
                y: getY(index),
                opacity: 0,
              }}
              animate={{
                rotate: getRotation(index),
                opacity: getOpacity(index),
                scale: getScale(index),
                y: getY(index),
              }}
              exit={{
                opacity: 0,
              }}
              transition={{
                type: "spring",
                stiffness: 150,
                damping: 19,
                mass: 1.2,
              }}
              style={{
                originX: 0.5,
                originY: 0,
              }}
              className="absolute"
            >
              {React.isValidElement(card.card) &&
                React.cloneElement(card.card, {
                  index: index + 1,
                  total: cards.length,
                })}
            </motion.div>
          ))}
        </div>
      </DaybreakFormContext.Provider>
    </div>
  );
};

interface DaybreakFormInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export const DaybreakFormInput: React.FC<DaybreakFormInputProps> = ({
  label,
  ...props
}) => {
  return (
    <div className="flex flex-col items-start gap-1 self-stretch">
      {label && (
        <span className="flex items-center justify-between self-stretch px-2 py-0">
          {label}
        </span>
      )}
      <input
        className={clsx(
          "inline-block min-h-[60px] justify-start gap-2.5 self-stretch rounded-2xl bg-[rgba(0,0,0,0.03)] py-2.5 pl-5 pr-2.5",
          props.type === "textarea" && "h-[200px] resize-none",
        )}
        placeholder="Placeholder"
        {...props}
      />
    </div>
  );
};

interface DaybreakFormTextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
}

export const DaybreakFormTextarea: React.FC<DaybreakFormTextareaProps> = ({
  label,
  ...props
}) => {
  return (
    <div className="flex flex-col items-start gap-1 self-stretch">
      {label && (
        <span className="flex items-center justify-between self-stretch px-2 py-0">
          {label}
        </span>
      )}
      <textarea
        className="inline-block h-[200px] min-h-[60px] resize-none justify-start gap-2.5 self-stretch rounded-2xl bg-[rgba(0,0,0,0.03)] py-5 pl-5 pr-2.5"
        placeholder="Placeholder"
        {...props}
      />
    </div>
  );
};

export const DaybreakImageCheckbox: React.FC<{
  label: string;
  src: string;
}> = ({ label = "Web design", src = "web-design.png" }) => {
  const [checked, setChecked] = useState(false);

  return (
    <div
      className="relative flex h-[200px] flex-[1_0_0] flex-col items-start gap-2.5 self-stretch rounded-2xl bg-[color(display-p3_1_1_1_/_0.20)] bg-[rgba(255,255,255,0.20)] px-5 py-4"
      onClick={() => setChecked((prev) => !prev)}
    >
      <div className="flex w-full items-center justify-between">
        <label className="flex items-center gap-3">{label}</label>
        <Checkbox checked={checked} />
      </div>
      <div className="relative flex h-full w-full items-center justify-center overflow-hidden rounded-[14px]">
        <Image
          src={"/images/" + src}
          fill
          unoptimized
          className="object-cover"
          alt={label}
        />
      </div>
    </div>
  );
};

export const DaybreakFormButton: React.FC<
  React.ButtonHTMLAttributes<HTMLButtonElement>
> = (props) => {
  const { goNext } = useDaybreakForm();

  return (
    <button
      className={cn(
        "flex items-center justify-center self-stretch rounded-2xl bg-black p-4 opacity-100 transition-all duration-200",
        "hover:opacity-80",
      )}
      onClick={(event) => {
        console.log("Step 1");
        if (props.disabled) {
          return;
        }

        console.log("Step 2");
        if (props.onClick) {
          props.onClick(event);
        }

        console.log("Step 3");
        goNext();
      }}
      {...props}
    >
      <span className="text-[14px] font-[450] text-white">
        {props.children}
      </span>
    </button>
  );
};
