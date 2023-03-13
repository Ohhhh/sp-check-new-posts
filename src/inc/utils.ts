import type { Post, RawPost } from "./Types";

export const getFormatedPost = (post: RawPost, needContent: boolean = false): Post => {
  let bodyContent: string | undefined = "";

  if (needContent) {
    // cleaning up the post content
    const content = post.audience === "free" ? post.content?.free.web : post.content?.premium.web;

    // add twitter script
    const twitterScript: string = '<script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>';

    const indexBodyOpen = content?.indexOf("<div id='content-blocks'");
    const indexBodyClose = content?.indexOf("</body>");
    bodyContent = content?.slice(indexBodyOpen, indexBodyClose);
    bodyContent = bodyContent?.replace("max-width: 670px; ", "");
    bodyContent += twitterScript;
  }

  return {
    id: post.id,
    slug: post.slug,
    title: post.title,
    excerpt: post.subtitle,
    date: post.publish_date,
    thumb_url: post.thumbnail_url,
    tags: post.content_tags.toString(),
    audience: post.audience,
    content: bodyContent as string,
  };
};