import React, { memo } from "react";
import { MediaRenderer } from "@/components/media-renderer";
import Reveal from "@/components/animations/reveal";
import type { Home } from "@/sanity/types";
import { HoverCard } from "@/components/animations/hover";
import { format } from "date-fns";
import Link from "next/link";
import { ExternalLink } from "lucide-react";

type ArticleType = NonNullable<Home["newsfeed"]>[number];

function extractBaseDomain(url: string): string {
  try {
    // Remove protocol (http, https, etc) and get domain
    const domain = url
      .replace(/^(?:https?:\/\/)?(?:www\.)?/i, "")
      // Get everything before the first slash or query params
      .split(/[/?#]/)[0]
      // Remove any trailing dots
      .replace(/\.+$/, "");

    return domain;
  } catch {
    return url;
  }
}

const Article = memo(({ article }: { article: ArticleType }) => {
  return (
    <Link href={article.link || ""} target="_blank">
      <Reveal key={article._key}>
        <HoverCard className="mb-4 flex break-inside-avoid flex-col p-1">
          {/* Media Container that respects natural aspect ratio */}
          <div>
            {article.media?.[0] && (
              <MediaRenderer
                fill={false}
                media={article.media[0]}
                className="frame-inner max-h-96"
                priority={false}
              />
            )}
          </div>

          <div className="p-4">
            <div className="flex space-x-2 pb-4">
              <h2 className="flex w-fit items-center gap-2 rounded-full bg-neutral-300/20 px-4 py-2 text-sm text-neutral-400">
                {format(new Date(article.date || ""), "MMMM d, yyyy")}
              </h2>
              <h2 className="flex w-fit items-center gap-2 rounded-full bg-neutral-300/20 px-4 py-2 text-sm text-neutral-400">
                {extractBaseDomain(article.link || "")}{" "}
                <ExternalLink size={16} />
              </h2>
            </div>

            <h1 className="pb-2 text-neutral-500">{article.title}</h1>
            <h2 className="text-neutral-400">{article.description}</h2>
          </div>
        </HoverCard>
      </Reveal>
    </Link>
  );
});

export default Article;

Article.displayName = "Article";
