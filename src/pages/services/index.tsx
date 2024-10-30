import Navigation from "@/components/navigation";
import Image from "next/image";
import { client } from "@/sanity/lib/client";
import { GetStaticProps } from "next";
import type { Services } from "@/sanity/types";
import Stack from "./components/Stack";
import StackGroupVertical from "./components/StackGroupVertical";

export default function Services({ data }: { data: Services }) {
  console.log(data);

  return (
    <div>
      <div className="h-[100vh] bg-red-200"></div>
      <StackGroupVertical>
        {Object.entries(data.serviceCategories!).map((category, index) => {
          const categoryName = category[0];
          const tabs = category[1].tabs!;
          return (
            <Stack
              className="flex max-h-[98vh] max-w-[90vw]"
              index={index}
              key={index}
            >
              <div className="w-[30%]">
                {tabs[0].heading}
                {tabs[0].copy}
              </div>
              <Image
                className=""
                src={tabs[0].image?.asset?._ref!}
                alt={tabs[0].copy!}
                width={597}
                height={597}
              />
            </Stack>
          );
        })}
      </StackGroupVertical>
      {/* <div className="h-[100vh] bg-blue-200"></div> */}
    </div>
  );
}

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
