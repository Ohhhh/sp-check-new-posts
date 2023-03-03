import { PrismaClient } from "@prisma/client";
import { api } from './inc/api';

const prisma = new PrismaClient()

const dotenv = require("dotenv");
dotenv.config();

(async () => {
  const allPosts = await api.posts.getAllPosts(5);
  console.log("post in beehiiv: ", allPosts.length);

  allPosts?.map(async (post) => {
    await prisma.post.create({ data: post });
  });
})();

