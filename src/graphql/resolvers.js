/*
  Resolvers act as an index to various controllers
*/

const {
  ArticleController,
  UserController,
  CommentController,
} = require('../controllers')
const resolvers = {
  Article: {
    comments: ArticleController.comments,
    user: ArticleController.user,
  },

  Comment: {
    article: CommentController.article,
    user: CommentController.user,
  },

  Query: {
    articles: ArticleController.all,
    articleFeed: ArticleController.feed,
    article: ArticleController.find,

    user: UserController.find,
    // users: UserController.all,
    comment: CommentController.find,
  },

  Mutation: {
    register: UserController.register,
    authenticate: UserController.authenticate,
    createArticle: ArticleController.create,
    voteOnArticle: ArticleController.vote,
    // deleteArticle: ArticleController.delete,
    createComment: CommentController.create,
    voteOnComment: CommentController.vote,
    // deleteComment: CommentController.delete,
  },
}

module.exports = resolvers
