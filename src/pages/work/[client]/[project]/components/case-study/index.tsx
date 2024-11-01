import React, {
  MutableRefObject,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { GetStaticProps } from "next";
import { client } from "@/sanity/lib/client";
import CaseStudyNav from "./components/nav";
import { useMotionValueEvent, useScroll } from "framer-motion";
import { useResizeObserver, useWindowSize } from "usehooks-ts";
import MediaGroupLayout from "./components/layout";
import { CaseStudy as CaseStudyType } from "@/sanity/types";

// Update the Info component
export default function CaseStudy({ caseStudy }: { caseStudy: CaseStudyType }) {
  const [currentMediaGroup, setCurrentMediaGroup] = useState<number>(0);
  const [isViewingInfo, setIsViewingInfo] = useState(false);
  const mediaGroupRefs = useRef([]) as MutableRefObject<HTMLDivElement[]>;

  const inforArr = useMemo(() => {
    return caseStudy.media?.map((mediaGroup) => {
      return {
        heading: mediaGroup.heading,
        caption: mediaGroup.caption,
      };
    });
  }, [caseStudy]);

  const containerRef = useRef() as MutableRefObject<HTMLDivElement>;
  const containerSize = useResizeObserver({ ref: containerRef });
  const { height: windowHeight, width: windowWidth } = useWindowSize();
  const screenOffset = 0.5 * windowHeight + 0.13 * windowWidth;

  const mediaGroupYPositions = useMemo(
    () =>
      mediaGroupRefs.current.map((elm) => {
        const bound = elm.getBoundingClientRect();
        return {
          anchorY: bound.y + bound.height / 2 + window.scrollY - screenOffset,
          height: bound.height || 0,
        };
      }),
    // mediaGroupBounds reacts to viewport size change
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [containerSize.height, screenOffset],
  );

  const { scrollY } = useScroll();

  const docRef = useRef() as MutableRefObject<HTMLElement>;
  useEffect(() => {
    docRef.current = document.body;
  }, []);
  const pageSize = useResizeObserver({ ref: docRef });

  useMotionValueEvent(scrollY, "change", (latest) => {
    if (latest === 0) {
      setCurrentMediaGroup(0);
      setIsViewingInfo(false);
      return;
    }
    if (
      pageSize.height !== undefined &&
      latest >= pageSize.height - windowHeight - 200
    ) {
      setIsViewingInfo(false);
      return;
    }

    // find out what is the current viewing group
    let targetSection = 0;
    for (let i = 0; i < mediaGroupYPositions.length; i++) {
      if (mediaGroupYPositions[i].anchorY < latest) {
        targetSection = i;
      } else {
        break;
      }
    }

    setCurrentMediaGroup((prev) => {
      if (prev === targetSection) {
        return prev;
      }
      return targetSection;
    });
  });

  const findNextGroupWithCaption = useCallback(
    (
      startIndex: number,
      direction: 1 | -1,
      shouldSkipEmpty: boolean = false,
    ) => {
      if (!caseStudy.media) return null;
      let index = startIndex + direction;

      while (index >= 0 && index < caseStudy.media.length) {
        const mediaItem = caseStudy.media[index];

        if (mediaItem.heading && mediaItem.caption) {
          return index;
        }

        if (shouldSkipEmpty) {
          index += direction;
        } else {
          return index;
        }
      }

      return null;
    },
    [caseStudy],
  );

  const navigateToMediaGroup = useCallback(
    (groupIndex: number) => {
      const mediaGroupMeasurement = mediaGroupYPositions[groupIndex];
      if (!mediaGroupMeasurement) return;
      const halfHeight = mediaGroupMeasurement.height / 2;
      const target = mediaGroupMeasurement.anchorY + 110 + halfHeight * 0.3;
      window.scrollTo({ top: target, behavior: "smooth" });
    },
    [mediaGroupYPositions],
  );

  const handleNextMediaGroup = useCallback(() => {
    const nextGroup = findNextGroupWithCaption(
      currentMediaGroup,
      1,
      isViewingInfo,
    );
    if (nextGroup === null) return;
    navigateToMediaGroup(nextGroup);
  }, [
    currentMediaGroup,
    findNextGroupWithCaption,
    isViewingInfo,
    navigateToMediaGroup,
  ]);

  const handlePrevMediaGroup = useCallback(() => {
    const nextGroup = findNextGroupWithCaption(
      currentMediaGroup,
      -1,
      isViewingInfo,
    );
    if (nextGroup === null) return;
    navigateToMediaGroup(nextGroup);
  }, [
    currentMediaGroup,
    findNextGroupWithCaption,
    isViewingInfo,
    navigateToMediaGroup,
  ]);

  return (
    <div className="px-4 py-8 pt-48" ref={containerRef}>
      <CaseStudyNav
        currentInfoIndex={currentMediaGroup}
        highlightInfoArr={inforArr}
        onNextMediaGroup={handleNextMediaGroup}
        onPrevMediaGroup={handlePrevMediaGroup}
        canPrevMediaGroup={currentMediaGroup !== 0}
        canNextMediaGroup={
          caseStudy.media
            ? currentMediaGroup !== caseStudy.media.length - 1
            : false
        }
        onExpand={() => setIsViewingInfo(true)}
        onCollapse={() => setIsViewingInfo(false)}
        isExpanded={isViewingInfo}
      />
      <h1 className="mb-8 py-24 text-center text-4xl">{caseStudy.heading}</h1>
      <div className="flex flex-col gap-4">
        {caseStudy.media?.map((mediaGroup, groupIndex) => {
          return (
            <MediaGroupLayout
              key={groupIndex}
              ref={(ref) => {
                mediaGroupRefs.current[groupIndex] = ref as HTMLDivElement;
              }}
              groupIndex={groupIndex}
              currentMediaGroup={currentMediaGroup}
              mediaGroup={mediaGroup}
              boundInfo={mediaGroupYPositions[groupIndex]}
              shouldShirnk={isViewingInfo}
              onClick={(e) => {
                if (isViewingInfo && groupIndex === currentMediaGroup) {
                  setIsViewingInfo(false);
                  return;
                }
                e.stopPropagation();
                e.preventDefault();
                setIsViewingInfo(true);
                navigateToMediaGroup(groupIndex);
              }}
            />
          );
        })}
        <div className="mx-auto mb-96 mt-44 grid w-full max-w-96 grid-cols-2 gap-y-6 text-sm">
          {caseStudy.credits?.map((team, index) => {
            return (
              <React.Fragment key={index}>
                <div className="flex flex-row">
                  {team.role}
                  <div className="mx-4 h-0 flex-grow translate-y-2 border-b border-gray-900 opacity-10" />
                </div>
                <div className="opacity-50">
                  {team.names?.map((name, index) => (
                    <div key={index}>{name}</div>
                  ))}
                </div>
              </React.Fragment>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// Fetch data from Sanity CMS
export const getStaticProps: GetStaticProps = async () => {
  const query = `*[_type == "work"][!(_id in path('drafts.**'))][1] {
    "caseStudy": projects[_type == 'caseStudy'][0] {
      ...,
      media[] {
        _type,
        _key,
        heading,
        caption,
        items[] {
          _type,
          _key,
          asset-> {
            url
          }
        }
      }
    }
}`;

  const data = await client.fetch(query);
  console.log(data.caseStudy);

  return {
    props: {
      caseStudy: data.caseStudy || null,
    },
    revalidate: 60,
  };
};