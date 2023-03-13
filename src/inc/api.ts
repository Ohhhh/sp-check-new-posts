import { PrismaClient } from "@prisma/client";
import { Post, RawIndexResponse } from "./Types";
import { getFormatedPost } from "./utils";

const prisma = new PrismaClient()

const BEEHIIV_URL = process.env.BEEHIIV_URL;
const BEEHIIV_PUBLICATION_ID = process.env.BEEHIIV_PUBLICATION_ID;
const BEEHIIV_TOKEN = process.env.BEEHIIV_TOKEN;
const API_LIMIT = 100;

export const api = {
  posts: {
    fetchUrl: ({ limit = 1, page = 1, moreOptions = '' }: { limit?: number; page?: number; moreOptions?: string }) => {
      return `${BEEHIIV_URL}/publications/${BEEHIIV_PUBLICATION_ID}/posts?audience=all&platform=all&status=confirmed&limit=${limit}&page=${page}&${moreOptions}`;
    },
    fetchOptions: () => {
      return {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${BEEHIIV_TOKEN}`
        }
      }
    },
    getPostsInfo: async (): Promise<{ totalPosts: number, totalPages: number }> => {
      let totalPosts = 0;
      let totalPages = 0;
      try {
        const req = await fetch(api.posts.fetchUrl({}), api.posts.fetchOptions());
        const res: RawIndexResponse = await req.json();
        totalPosts = res.total_results;
        totalPages = Math.ceil(totalPosts / API_LIMIT);
      } catch (err) {
        console.error(err)
      }
      return { totalPosts, totalPages };
    },
    getPosts: async (limit: number, page: number): Promise<Post[] | undefined> => {
      try {
        const request = await fetch(
          api.posts.fetchUrl({ limit, page, moreOptions: "expand[]=free_web_content&expand[]=premium_web_content" }),
          api.posts.fetchOptions());
        const response: RawIndexResponse = await request.json();

        return Array.from(response.data).map((post) => {
          return getFormatedPost(post, true);
        });

      } catch (err) {
        console.log(err);
        return undefined;
      }
    },
    populateDB: async (postsPerQuery = 1): Promise<void> => {
      const postsInfo = await api.posts.getPostsInfo();
      const totalPages = Math.ceil(postsInfo.totalPosts / postsPerQuery);
      let queryPage = 1;

      // debug
      console.log({ totalPages });
      console.log({ postsPerQuery });

      while (queryPage <= totalPages) {
        console.info("pagina " + queryPage + " of " + totalPages);
        console.info("getting posts from Beehiiv API...")
        const posts = await api.posts.getPosts(postsPerQuery, queryPage);

        console.info("reading posts from API done!")
        posts?.map(async (post) => {
          console.info(`creating post "${post.title}" in DB`)
          await prisma.post.create({ data: post })
            .then(() => console.log(`post "${post.title}" created!`))
            .catch(err => console.error(err));
        });
        queryPage++;
      }
      // return posts.flat().reverse();
    },
    getLastPost: async (): Promise<Post> => {
      const postsInfo = await api.posts.getPostsInfo();
      let totalPosts = postsInfo.totalPosts;

      const lastPostRes = await fetch(api.posts.fetchUrl({
        limit: 1,
        page: totalPosts,
        moreOptions: "expand[]=free_web_content&expand[]=premium_web_content"
      }), api.posts.fetchOptions());

      if (!lastPostRes.ok) {
        console.error("error getting last post!");
      }

      const lastPostRaw: RawIndexResponse = await lastPostRes.json();
      const lastPost = lastPostRaw.data[0];
      return getFormatedPost(lastPost, true);
    },
  },
};