const { AuthenticationError, UserInputError } = require("apollo-server-express");

const Post = require("../../models/Post");
const { verifyAuth } = require("../../utils");

module.exports = {
  Query: {
    async getPosts() {
      const posts = await Post.find().sort({ createdAt: -1 });

      if (posts) return posts;
      else throw new Error("No Posts Found");
    },

    async getPost(_, { postId }) {
      const post = await Post.findById(postId);

      if (post) return post;
      else throw new Error("Post Not Found");
    },
  },

  Mutation: {
    async createPost(_, { body }, context) {
      const user = verifyAuth(context);

      if (!body.trim()) throw new UserInputError("Empty Post");

      const newPost = new Post({
        body,
        user: user.id,
        username: user.username,
        createdAt: new Date().toISOString(),
      });

      const post = await newPost.save();

      return post;
    },

    async deletePost(_, { postId }, context) {
      const user = verifyAuth(context);

      try {
        const post = await Post.findById(postId);
        if (user.username === post.username) {
          await post.delete();
          return "Post Deleted Successfully";
        } else throw new AuthenticationError("Cannot Delete Post");
      } catch (err) {
        throw new Error(err);
      }
    },
  },
};
