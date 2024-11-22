/**
 * ---------------------------------------------------------------------------------
 * This file has been generated by Sanity TypeGen.
 * Command: `sanity typegen generate`
 *
 * Any modifications made directly to this file will be overwritten the next time
 * the TypeScript definitions are generated. Please make changes to the Sanity
 * schema definitions and/or GROQ queries if you need to update these types.
 *
 * For more information on how to use Sanity TypeGen, visit the official documentation:
 * https://www.sanity.io/docs/sanity-typegen
 * ---------------------------------------------------------------------------------
 */

// Source: schema.json
export type SanityImagePaletteSwatch = {
  _type: "sanity.imagePaletteSwatch";
  background?: string;
  foreground?: string;
  population?: number;
  title?: string;
};

export type SanityImagePalette = {
  _type: "sanity.imagePalette";
  darkMuted?: SanityImagePaletteSwatch;
  lightVibrant?: SanityImagePaletteSwatch;
  darkVibrant?: SanityImagePaletteSwatch;
  vibrant?: SanityImagePaletteSwatch;
  dominant?: SanityImagePaletteSwatch;
  lightMuted?: SanityImagePaletteSwatch;
  muted?: SanityImagePaletteSwatch;
};

export type SanityImageDimensions = {
  _type: "sanity.imageDimensions";
  height?: number;
  width?: number;
  aspectRatio?: number;
};

export type Geopoint = {
  _type: "geopoint";
  lat?: number;
  lng?: number;
  alt?: number;
};

export type Team = {
  _id: string;
  _type: "team";
  _createdAt: string;
  _updatedAt: string;
  _rev: string;
  introduction?: string;
  teamMembers?: Array<{
    name?: string;
    role?: string;
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
    bio?: string;
    _key: string;
  }>;
};

export type Settings = {
  _id: string;
  _type: "settings";
  _createdAt: string;
  _updatedAt: string;
  _rev: string;
  title?: string;
  description?: string;
  openGraphImage?: {
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
};

export type Services = {
  _id: string;
  _type: "services";
  _createdAt: string;
  _updatedAt: string;
  _rev: string;
  quotes?: Array<{
    name?: string;
    title?: string;
    quote?: string;
    _key: string;
  }>;
  logos?: Array<{
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
    alt?: string;
    companyName?: string;
    url?: string;
    _key: string;
  }>;
  serviceCategories?: {
    brand?: {
      tabs?: Array<{
        heading?: string;
        title?: string;
        caption?: string;
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
      }>;
    };
    product?: {
      tabs?: Array<{
        heading?: string;
        title?: string;
        caption?: string;
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
      }>;
    };
    motion?: {
      tabs?: Array<{
        heading?: string;
        title?: string;
        caption?: string;
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
      }>;
    };
    development?: {
      tabs?: Array<{
        heading?: string;
        title?: string;
        caption?: string;
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
      }>;
    };
  };
};

export type CaseStudy = {
  _type: "caseStudy";
  category?: "brand" | "product" | "web" | "motion";
  heading?: string;
  media?: Array<{
    heading?: string;
    caption?: string;
    items?: Array<
      | {
          asset?: {
            _ref: string;
            _type: "reference";
            _weak?: boolean;
            [internalGroqTypeReferenceTo]?: "sanity.imageAsset";
          };
          hotspot?: SanityImageHotspot;
          crop?: SanityImageCrop;
          _type: "image";
          _key: string;
        }
      | {
          asset?: {
            _ref: string;
            _type: "reference";
            _weak?: boolean;
            [internalGroqTypeReferenceTo]?: "sanity.fileAsset";
          };
          _type: "file";
          _key: string;
        }
    >;
    _type: "mediaGroup";
    _key: string;
  }>;
  credits?: Array<{
    role?: string;
    names?: Array<string>;
    _key: string;
  }>;
};

export type Preview = {
  _type: "preview";
  category?: "brand" | "product" | "web" | "motion";
  heading?: string;
  caption?: string;
  media?: Array<
    | {
        asset?: {
          _ref: string;
          _type: "reference";
          _weak?: boolean;
          [internalGroqTypeReferenceTo]?: "sanity.imageAsset";
        };
        hotspot?: SanityImageHotspot;
        crop?: SanityImageCrop;
        _type: "image";
        _key: string;
      }
    | {
        asset?: {
          _ref: string;
          _type: "reference";
          _weak?: boolean;
          [internalGroqTypeReferenceTo]?: "sanity.fileAsset";
        };
        _type: "video";
        _key: string;
      }
  >;
  link?: string;
  date?: string;
};

export type Work = {
  _id: string;
  _type: "work";
  _createdAt: string;
  _updatedAt: string;
  _rev: string;
  name?: string;
  slug?: Slug;
  projects?: Array<
    | ({
        _key: string;
      } & Preview)
    | ({
        _key: string;
      } & CaseStudy)
  >;
};

export type Slug = {
  _type: "slug";
  current?: string;
  source?: string;
};

export type Home = {
  _id: string;
  _type: "home";
  _createdAt: string;
  _updatedAt: string;
  _rev: string;
  widgets?: Array<
    | {
        position?: {
          x?: number;
          y?: number;
        };
        size?: "1x1" | "2x2";
        tweet?: string;
        author?: string;
        link?: string;
        media?: Array<{
          asset?: {
            _ref: string;
            _type: "reference";
            _weak?: boolean;
            [internalGroqTypeReferenceTo]?: "sanity.imageAsset";
          };
          hotspot?: SanityImageHotspot;
          crop?: SanityImageCrop;
          _type: "image";
          _key: string;
        }>;
        _type: "twitterWidget";
        _key: string;
      }
    | {
        position?: {
          x?: number;
          y?: number;
        };
        size?: "2x2" | "3x3";
        media?: Array<
          | {
              asset?: {
                _ref: string;
                _type: "reference";
                _weak?: boolean;
                [internalGroqTypeReferenceTo]?: "sanity.imageAsset";
              };
              hotspot?: SanityImageHotspot;
              crop?: SanityImageCrop;
              _type: "image";
              _key: string;
            }
          | {
              asset?: {
                _ref: string;
                _type: "reference";
                _weak?: boolean;
                [internalGroqTypeReferenceTo]?: "sanity.fileAsset";
              };
              _type: "file";
              _key: string;
            }
        >;
        _type: "mediaWidget";
        _key: string;
      }
  >;
  missionStatement?: Array<{
    children?: Array<{
      marks?: Array<string>;
      text?: string;
      _type: "span";
      _key: string;
    }>;
    style?: "normal" | "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "blockquote";
    listItem?: "bullet" | "number";
    markDefs?: Array<{
      href?: string;
      _type: "link";
      _key: string;
    }>;
    level?: number;
    _type: "block";
    _key: string;
  }>;
  aboutUs?: Array<{
    children?: Array<{
      marks?: Array<string>;
      text?: string;
      _type: "span";
      _key: string;
    }>;
    style?: "normal" | "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "blockquote";
    listItem?: "bullet" | "number";
    markDefs?: Array<{
      href?: string;
      _type: "link";
      _key: string;
    }>;
    level?: number;
    _type: "block";
    _key: string;
  }>;
  newsfeed?: Array<{
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
    date?: string;
    title?: string;
    description?: string;
    link?: string;
    _type: "article";
    _key: string;
  }>;
};

export type SanityFileAsset = {
  _id: string;
  _type: "sanity.fileAsset";
  _createdAt: string;
  _updatedAt: string;
  _rev: string;
  originalFilename?: string;
  label?: string;
  title?: string;
  description?: string;
  altText?: string;
  sha1hash?: string;
  extension?: string;
  mimeType?: string;
  size?: number;
  assetId?: string;
  uploadId?: string;
  path?: string;
  url?: string;
  source?: SanityAssetSourceData;
};

export type SanityImageCrop = {
  _type: "sanity.imageCrop";
  top?: number;
  bottom?: number;
  left?: number;
  right?: number;
};

export type SanityImageHotspot = {
  _type: "sanity.imageHotspot";
  x?: number;
  y?: number;
  height?: number;
  width?: number;
};

export type SanityImageAsset = {
  _id: string;
  _type: "sanity.imageAsset";
  _createdAt: string;
  _updatedAt: string;
  _rev: string;
  originalFilename?: string;
  label?: string;
  title?: string;
  description?: string;
  altText?: string;
  sha1hash?: string;
  extension?: string;
  mimeType?: string;
  size?: number;
  assetId?: string;
  uploadId?: string;
  path?: string;
  url?: string;
  metadata?: SanityImageMetadata;
  source?: SanityAssetSourceData;
};

export type SanityAssetSourceData = {
  _type: "sanity.assetSourceData";
  name?: string;
  id?: string;
  url?: string;
};

export type SanityImageMetadata = {
  _type: "sanity.imageMetadata";
  location?: Geopoint;
  dimensions?: SanityImageDimensions;
  palette?: SanityImagePalette;
  lqip?: string;
  blurHash?: string;
  hasAlpha?: boolean;
  isOpaque?: boolean;
};

export type AllSanitySchemaTypes =
  | SanityImagePaletteSwatch
  | SanityImagePalette
  | SanityImageDimensions
  | Geopoint
  | Team
  | Settings
  | Services
  | CaseStudy
  | Preview
  | Work
  | Slug
  | Home
  | SanityFileAsset
  | SanityImageCrop
  | SanityImageHotspot
  | SanityImageAsset
  | SanityAssetSourceData
  | SanityImageMetadata;
export declare const internalGroqTypeReferenceTo: unique symbol;
// Source: ./src/sanity/lib/queries.ts
// Variable: HOME_QUERY
// Query: *[_type == "home"][0] {    missionStatement  }
export type HOME_QUERYResult = {
  missionStatement: Array<{
    children?: Array<{
      marks?: Array<string>;
      text?: string;
      _type: "span";
      _key: string;
    }>;
    style?: "blockquote" | "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "normal";
    listItem?: "bullet" | "number";
    markDefs?: Array<{
      href?: string;
      _type: "link";
      _key: string;
    }>;
    level?: number;
    _type: "block";
    _key: string;
  }> | null;
} | null;

// Query TypeMap
import "@sanity/client";
declare module "@sanity/client" {
  interface SanityQueries {
    '\n  *[_type == "home"][0] {\n    missionStatement\n  }\n': HOME_QUERYResult;
  }
}
