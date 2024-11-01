import Image from "next/image";
import { client } from "@/sanity/lib/client";
import { GetStaticProps } from "next";
import type {
  SanityImageHotspot,
  SanityImageCrop,
  internalGroqTypeReferenceTo,
  Services,
} from "@/sanity/types";
import Stack from "./components/Stack";
import StackGroupVertical from "./components/StackGroupVertical";
import { fileBuilder, urlFor } from "@/sanity/lib/builder";
import { useState } from "react";
import { LayoutGroup, LayoutGroupContext, motion } from "framer-motion";
import React from "react";
import StackGroupHorizontal from "./components/StackGroupHorizontal";

// Unified function to get media URL
const getMediaUrl = (mediaAsset: any) => {
  // Check if the asset is an image
  if (mediaAsset._ref.startsWith("image-")) {
    return urlFor(mediaAsset).url(); // Generate URL for image
  }
  // Check if the asset is a file (video or other)
  else if (mediaAsset._ref.startsWith("file-")) {
    return fileBuilder.file(mediaAsset).url(); // Generate URL for file
  }
  return null; // Return null if the asset type is not recognized
};

type ServiceCategoryTab = {
  heading?: string;
  copy?: string;
  image?: {
    asset?: {
      _ref: string;
      _type: "reference";
      _weak?: boolean;
      [internalGroqTypeReferenceTo]?: "sanity.imageAsset";
    };
    hotspot?: SanityImageHotspot;
    crop?: SanityImageCrop;
    _type: "image";
  };
  _type: "tab";
  _key: string;
};

export default function Services({ data }: { data: Services }) {
  console.log(data);

  return (
    <div>
      <div className="h-[100vh] bg-red-200"></div>
      <StackGroupVertical>
        {Object.entries(data.serviceCategories!).map((category, index) => {
          return (
            <ServiceCardContent
              index={index}
              key={index}
              categoryName={category[0]}
              tabs={category[1].tabs!}
            />
          );
        })}
      </StackGroupVertical>
      <div className="h-[100vh] bg-blue-200"></div>
      <StackGroupHorizontal>
        {Object.entries(data.serviceCategories!).map((category, index) => {
          return (
            <ServiceCardContent
              index={index}
              key={index}
              categoryName={category[0]}
              tabs={category[1].tabs!}
            />
          );
        })}
      </StackGroupHorizontal>
    </div>
  );
}

const ServiceCardContent = ({
  index,
  tabs,
  categoryName,
}: {
  index: number;
  tabs: ServiceCategoryTab[];
  categoryName: string;
}) => {
  const [currentTab, setCurrentTab] = useState(0);
  return (
    <Stack
      className="m-1 flex max-h-[90vh] max-w-[70vw] flex-col-reverse gap-4 sm:m-4 sm:grid sm:max-w-4xl sm:grid-cols-5 md:m-8"
      index={index}
      key={index}
    >
      <div className="col-span-2 flex flex-col gap-4 max-sm:px-8 max-sm:pb-8">
        <div className="flex flex-row gap-4 text-sm">
          <LayoutGroup>
            {tabs.map((tab, tabIndex) => {
              return (
                <div key={tabIndex}>
                  <motion.button
                    className="py-2"
                    animate={{
                      opacity: tabIndex === currentTab ? 1 : 0.5,
                    }}
                    onClick={() => setCurrentTab(tabIndex)}
                  >
                    {tab.heading}
                  </motion.button>
                  {tabIndex === currentTab && (
                    <motion.div
                      layout
                      layoutId={`tab-${index}`}
                      className="border-b-2 border-b-black"
                    />
                  )}
                </div>
              );
            })}
          </LayoutGroup>
        </div>
        <h2 className="mt-auto text-3xl opacity-80">
          {tabs[currentTab].heading}
        </h2>
        <p className="text-sm opacity-60">{tabs[currentTab].copy}</p>
      </div>
      <Image
        className="col-span-3 block aspect-square h-full w-full rounded-[26px] object-cover sm:rounded-2xl"
        src={getMediaUrl(tabs[currentTab].image?.asset!)!}
        alt={tabs[currentTab].copy!}
        width={597}
        height={597}
      />
    </Stack>
  );
};

// Fetch data from Sanity CMS
export const getStaticProps: GetStaticProps = async () => {
  const query = `*[_type == "services"][!(_id in path('drafts.**'))][0]`;
  const data = await client.fetch(query);

  return {
    props: {
      data,
    },
    revalidate: 60,
  };
};
