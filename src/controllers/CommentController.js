const {
  ForbiddenError,
  // UserInputError,
  ApolloError,
} = require('apollo-server-express')

const { Comment, User, Article } = require('../models')

exports.allForArticle = async ({ id: articleId }) =>
  await Comment.allForArticle({ articleId })

exports.find = async (root, { id }) => await Comment.find({ id })

exports.create = async (root, { text, articleId, commentId }, { user }) => {
  if (!user) throw new ForbiddenError()
  const response = await Comment.create({
    articleId,
    commentId,
    text,
    userId: user.id,
  }).catch(e => {
    console.log('Error => ', e)
    throw new ApolloError('Unexpected error in creating new article')
  })

  return response
}

exports.vote = async (root, { userId, commentId, value }, { user }) => {
  if (!user) throw new ForbiddenError()

  await Comment.vote({ userId, commentId, value }).catch(e => {
    console.log('Error in comment vote ', e)
    throw new ApolloError('Internal Server Error in Vote')
  })

  return 'success'
}
exports.user = async ({ userId: id }) => await User.find({ id })

exports.article = async ({ articleId: id }) => await Article.find({ id })

// exports.delete = async (root, args, ctx, info) => {}
