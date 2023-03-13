import { PrismaClient } from "@prisma/client";
import { api } from "./inc/api";

const prisma = new PrismaClient();

(async () => {
  // get last pulicated post
  const lastPublicatedPost = await api.posts.getLastPost();
  // get last post ID
  const { id, title } = lastPublicatedPost;

  console.log("Last post in Beehiiv: ");
  console.log("id: ", id);
  console.log("title: ", title);


  // search the database if the post exists
  const postInDB = await prisma.post.findMany({ where: { id } });

  // if no exist
  if (postInDB === undefined || postInDB.length === 0) {
    console.log("Updating DB...");
    // ...add it to the database
    const createPost = await prisma.post.create({
      data: lastPublicatedPost
    })
    console.log("new post created!")
    console.log(createPost);
  } else {
    console.log("No need to update.");
    console.log("Post in DB")
    console.log("id: ", postInDB[0].id);
  }

})();
