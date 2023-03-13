import { api } from './inc/api';

const dotenv = require("dotenv");
dotenv.config();

(async () => {
  const postsPerQuery = 5;
  await api.posts.populateDB(postsPerQuery)
    .then(() => console.log("[✅] Populate done!"))
    .catch(err => console.log(err));
})();