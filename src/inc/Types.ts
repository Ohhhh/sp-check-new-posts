export interface RawIndexResponse {
  data: RawPost[];
  limit: number;
  page: number;
  total_results: number;
  total_pages: number;
}
export interface RawShowResponse {
  data: RawPost;
}
export interface RawPost {
  id: string;
  title: string;
  subtitle: string;
  authors: string[];
  created: number;
  status: string;
  publish_date: bigint;
  displayed_date: number;
  split_tested: boolean;
  subject_line: string;
  preview_text: string;
  slug: string;
  thumbnail_url: string;
  web_url: string;
  audience: string;
  platform: string;
  content_tags: string[];
  content?: {
    free: {
      web: string;
      email: string;
      rss: string;
    };
    premium: {
      web: string;
      email: string;
    }
  };
}
export interface Post {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  date: bigint;
  thumb_url: string;
  content: string;
  tags: string;
  audience: string;
  audioUrl?: string;
}