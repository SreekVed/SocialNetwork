const { UserInputError, AuthenticationError } = require("apollo-server");
const Post = require("../../models/Post");
const { verifyAuth } = require("../../utils");

module.exports = {
  Mutation: {
    async createComment(_, { postId, body }, context) {
      const { username } = verifyAuth(context);

      if (!body.trim()) throw new UserInputError("Empty Comment");

      const post = await Post.findById(postId);

      if (!post) throw new UserInputError("Post not found");

      post.comments.unshift({
        username,
        body,
        createdAt: new Date().toISOString(),
      });

      await post.save();

      return post;
    },

    async deleteComment(_, { postId, commentId }, context) {
      const { username } = verifyAuth(context);

      const post = await Post.findById(postId);

      if (!post) throw new UserInputError("Post not found");

      const commentIndex = post.comments.findIndex((c) => c.id === commentId);

      if (post.comments[commentIndex].username !== username)
        throw new AuthenticationError("Cannot Delete Comment");

      post.comments.splice(commentIndex, 1);

      await post.save();

      return post;
    },

    async likePost(_, { postId }, context) {
      const { username } = verifyAuth(context);

      const post = await Post.findById(postId);

      if (!post) throw new UserInputError("Post not found");

      const likeIndex = post.likes.findIndex((l) => l.username === username);

      if (likeIndex === -1)
        post.likes.push({
          username,
          createdAt: new Date().toISOString(),
        });
      else post.likes.splice(likeIndex, 1);

      await post.save();

      return post;
    },
  },
};
