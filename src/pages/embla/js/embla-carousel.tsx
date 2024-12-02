import React, { useCallback, useEffect, useRef } from "react";
import {
  EmblaCarouselType,
  EmblaEventType,
  EmblaOptionsType,
} from "embla-carousel";
import useEmblaCarousel from "embla-carousel-react";
import {
  NextButton,
  PrevButton,
  usePrevNextButtons,
} from "./embla-carousel-arrow-buttons";
import { DotButton, useDotButton } from "./embla-carousel-dot-button";

const TWEEN_SCALE_FACTOR_BASE = 0.2;
const TWEEN_OPACITY_FACTOR_BASE = 0.0;
const TWEEN_BLUR_FACTOR_BASE = 8;

const numberWithinRange = (number: number, min: number, max: number): number =>
  Math.min(Math.max(number, min), max);

interface Person {
  id: string;
  position: string;
  name: string;
  bio: string;
  video: string;
  trait: string;
  birthdate: string;
}

type PropType = {
  people: Person[];
  options?: EmblaOptionsType;
};

const EmblaCarousel: React.FC<PropType> = (props) => {
  const { people, options } = props;
  const [emblaRef, emblaApi] = useEmblaCarousel(options);
  const scaleTweenFactor = useRef(0);
  const opacityTweenFactor = useRef(0);
  const blurTweenFactor = useRef(0);
  const tweenNodes = useRef<HTMLElement[]>([]);

  const { selectedIndex, scrollSnaps, onDotButtonClick } =
    useDotButton(emblaApi);

  const {
    prevBtnDisabled,
    nextBtnDisabled,
    onPrevButtonClick,
    onNextButtonClick,
  } = usePrevNextButtons(emblaApi);

  const setTweenNodes = useCallback((emblaApi: EmblaCarouselType): void => {
    tweenNodes.current = emblaApi.slideNodes().map((slideNode) => {
      return slideNode.querySelector(".embla__slide__number") as HTMLElement;
    });
  }, []);

  const setScaleTweenFactor = useCallback((emblaApi: EmblaCarouselType) => {
    scaleTweenFactor.current =
      TWEEN_SCALE_FACTOR_BASE * emblaApi.scrollSnapList().length;
  }, []);

  const setOpacityTweenFactor = useCallback((emblaApi: EmblaCarouselType) => {
    opacityTweenFactor.current =
      TWEEN_OPACITY_FACTOR_BASE * emblaApi.scrollSnapList().length;
  }, []);

  const setBlurTweenFactor = useCallback((emblaApi: EmblaCarouselType) => {
    blurTweenFactor.current =
      TWEEN_BLUR_FACTOR_BASE * emblaApi.scrollSnapList().length;
  }, []);

  const tweenScale = useCallback(
    (emblaApi: EmblaCarouselType, eventName?: EmblaEventType) => {
      const engine = emblaApi.internalEngine();
      const scrollProgress = emblaApi.scrollProgress();
      const slidesInView = emblaApi.slidesInView();
      const isScrollEvent = eventName === "scroll";

      emblaApi.scrollSnapList().forEach((scrollSnap, snapIndex) => {
        let diffToTarget = scrollSnap - scrollProgress;
        const slidesInSnap = engine.slideRegistry[snapIndex];

        slidesInSnap.forEach((slideIndex) => {
          if (isScrollEvent && !slidesInView.includes(slideIndex)) return;

          if (engine.options.loop) {
            engine.slideLooper.loopPoints.forEach((loopItem) => {
              const target = loopItem.target();

              if (slideIndex === loopItem.index && target !== 0) {
                const sign = Math.sign(target);

                if (sign === -1) {
                  diffToTarget = scrollSnap - (1 + scrollProgress);
                }
                if (sign === 1) {
                  diffToTarget = scrollSnap + (1 - scrollProgress);
                }
              }
            });
          }

          const tweenValue =
            1 - Math.abs(diffToTarget * scaleTweenFactor.current);
          const scale = numberWithinRange(tweenValue, 0, 1).toString();
          const tweenNode = tweenNodes.current[slideIndex];
          tweenNode.style.transform = `scale(${scale})`;
        });
      });
    },
    [],
  );

  const tweenOpacity = useCallback(
    (emblaApi: EmblaCarouselType, eventName?: EmblaEventType) => {
      const engine = emblaApi.internalEngine();
      const scrollProgress = emblaApi.scrollProgress();
      const slidesInView = emblaApi.slidesInView();
      const isScrollEvent = eventName === "scroll";

      emblaApi.scrollSnapList().forEach((scrollSnap, snapIndex) => {
        let diffToTarget = scrollSnap - scrollProgress;
        const slidesInSnap = engine.slideRegistry[snapIndex];

        slidesInSnap.forEach((slideIndex) => {
          if (isScrollEvent && !slidesInView.includes(slideIndex)) return;

          if (engine.options.loop) {
            engine.slideLooper.loopPoints.forEach((loopItem) => {
              const target = loopItem.target();

              if (slideIndex === loopItem.index && target !== 0) {
                const sign = Math.sign(target);

                if (sign === -1) {
                  diffToTarget = scrollSnap - (1 + scrollProgress);
                }
                if (sign === 1) {
                  diffToTarget = scrollSnap + (1 - scrollProgress);
                }
              }
            });
          }

          const tweenValue =
            1 - Math.abs(diffToTarget * opacityTweenFactor.current);
          const opacity = numberWithinRange(tweenValue, 0, 1).toString();
          emblaApi.slideNodes()[slideIndex].style.opacity = opacity;
        });
      });
    },
    [],
  );

  const tweenBlur = useCallback(
    (emblaApi: EmblaCarouselType, eventName?: EmblaEventType) => {
      const engine = emblaApi.internalEngine();
      const scrollProgress = emblaApi.scrollProgress();
      const slidesInView = emblaApi.slidesInView();
      const isScrollEvent = eventName === "scroll";

      emblaApi.scrollSnapList().forEach((scrollSnap, snapIndex) => {
        let diffToTarget = scrollSnap - scrollProgress;
        const slidesInSnap = engine.slideRegistry[snapIndex];

        slidesInSnap.forEach((slideIndex) => {
          if (isScrollEvent && !slidesInView.includes(slideIndex)) return;

          if (engine.options.loop) {
            engine.slideLooper.loopPoints.forEach((loopItem) => {
              const target = loopItem.target();

              if (slideIndex === loopItem.index && target !== 0) {
                const sign = Math.sign(target);

                if (sign === -1) {
                  diffToTarget = scrollSnap - (1 + scrollProgress);
                }
                if (sign === 1) {
                  diffToTarget = scrollSnap + (1 - scrollProgress);
                }
              }
            });
          }

          const tweenValue = Math.abs(diffToTarget * blurTweenFactor.current);
          const blur = numberWithinRange(tweenValue, 0, 24).toString();
          emblaApi.slideNodes()[slideIndex].style.filter = `blur(${blur}px)`;
        });
      });
    },
    [],
  );

  useEffect(() => {
    if (!emblaApi) return;

    setTweenNodes(emblaApi);
    setScaleTweenFactor(emblaApi);
    setOpacityTweenFactor(emblaApi);
    setBlurTweenFactor(emblaApi);
    tweenScale(emblaApi);
    tweenOpacity(emblaApi);
    tweenBlur(emblaApi);

    emblaApi
      .on("reInit", setTweenNodes)

      .on("reInit", setScaleTweenFactor)
      .on("reInit", setOpacityTweenFactor)
      .on("reInit", setBlurTweenFactor)

      .on("reInit", tweenScale)
      .on("reInit", tweenOpacity)
      .on("reInit", tweenBlur)

      .on("slideFocus", tweenScale)
      .on("slideFocus", tweenOpacity)
      .on("slideFocus", tweenBlur)

      .on("scroll", tweenScale)
      .on("scroll", tweenOpacity)
      .on("scroll", tweenBlur);
  }, [
    emblaApi,
    tweenScale,
    tweenOpacity,
    setTweenNodes,
    setScaleTweenFactor,
    setOpacityTweenFactor,
    setBlurTweenFactor,
    tweenBlur,
  ]);

  return (
    <div className="embla">
      <div className="embla__viewport" ref={emblaRef}>
        <div className="embla__container">
          {people.map((person) => (
            <div className="embla__slide" key={person.id}>
              <div className="embla__slide__number">
                <video
                  autoPlay
                  muted
                  loop
                  className="h-full w-fit mix-blend-multiply"
                >
                  <source src={person.video} type="video/mp4" />
                </video>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 
        <div className="embla__controls">
          <div className="embla__buttons">
            <PrevButton onClick={onPrevButtonClick} disabled={prevBtnDisabled} />
            <NextButton onClick={onNextButtonClick} disabled={nextBtnDisabled} />
          </div>

          <div className="embla__dots">
            {scrollSnaps.map((_, index) => (
              <DotButton
                key={index}
                onClick={() => onDotButtonClick(index)}
                className={"embla__dot".concat(
                  index === selectedIndex ? "embla__dot--selected" : "",
                )}
              />
            ))}
          </div>
        </div> 
      */}
    </div>
  );
};

export default EmblaCarousel;
