// import Parser from "rss-parser";
import slugify from "slugify";
import type { Post, RawPost } from "./Types";

export const nth = function (d: number) {
  if (d > 3 && d < 21) return "th";
  switch (d % 10) {
    case 1:
      return "st";
    case 2:
      return "nd";
    case 3:
      return "rd";
    default:
      return "th";
  }
};

export const formatedDate = function (date: number, epoch = false) {
  // multiply by 1000 if is Unix epoch format
  const dateObj = new Date(epoch ? date * 1000 : date);

  const postMonth = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ][dateObj.getMonth()];
  const postDate = dateObj.getDate();
  const postYear = dateObj.getFullYear();

  return `${postMonth} ${postDate}${nth(postDate)}, ${postYear}`;
};

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
    date: formatedDate(post.publish_date, true),
    thumb_url: post.thumbnail_url,
    tags: post.content_tags.toString(),
    audience: post.audience,
    content: bodyContent as string,
  };
};