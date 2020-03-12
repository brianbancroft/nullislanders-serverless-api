const { Article, Comment, User } = require('../models')

const {
  ForbiddenError,
  UserInputError,
  ApolloError,
} = require('apollo-server-express')

exports.all = async () => await Article.all()
exports.find = async (root, { id }) => await Article.find({ id })

exports.feed = async (root, { limit, offset = 0 }) => {
  const numberPages = (await Article.count()) / limit
  const articles = await Article.page({ limit, offset })

  return {
    articles,
    numberPages,
    cursor: offset + limit,
  }
}

exports.create = async (root, { url, title }, { user }) => {
  if (!user) throw new ForbiddenError()
  const response = await Article.create({ url, title, userId: user.id }).catch(
    e => {
      console.log('Error => ', e)
      throw new ApolloError('Unexpected error in creating new article')
    },
  )

  return response
}

exports.vote = async (root, { articleId, value }, { user }) => {
  if (!user) throw new ForbiddenError()

  if (!(value === 1 || value === -1))
    throw new UserInputError('"value" must be 1 or -1')

  if (!Number.isInteger(articleId))
    throw new UserInputError('"articleId must be an integer')

  const articles = await Article.vote({
    articleId,
    value,
    userId: user.id,
  }).catch(e => {
    console.log('Error observerd in articeController#vote: ', e)
    throw new ApolloError('Unknown system error')
  })

  return articles
}

exports.comments = async ({ id: articleId }) =>
  await Comment.allForArticle({ articleId })

exports.user = async ({ userId: id }) => await User.find({ id })
// exports.delete = async (root, args, ctx, info) => {}
