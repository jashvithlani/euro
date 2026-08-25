import React from "react";
import { useLocation } from "react-router-dom";
import { DEFAULT_DOCUMENT_TITLE, getSeoMetadata } from "../seo-metadata.js";

export default function SeoMetadata() {
  const { pathname } = useLocation();
  const metadata = getSeoMetadata(pathname);

  React.useLayoutEffect(() => {
    document.title = metadata?.title ?? DEFAULT_DOCUMENT_TITLE;

    const descriptionTags = [...document.head.querySelectorAll('meta[name="description"]')];
    const [descriptionTag, ...duplicateTags] = descriptionTags;
    duplicateTags.forEach((tag) => tag.remove());

    if (!metadata) {
      descriptionTag?.remove();
      return;
    }

    const nextDescriptionTag = descriptionTag ?? document.createElement("meta");
    nextDescriptionTag.setAttribute("name", "description");
    nextDescriptionTag.setAttribute("content", metadata.description);

    if (!descriptionTag) {
      document.head.append(nextDescriptionTag);
    }
  }, [metadata]);

  return null;
}
