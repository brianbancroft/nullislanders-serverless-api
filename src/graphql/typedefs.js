const { gql } = require('apollo-server-express')

const typeDefs = gql`
  type User {
    name: String
    email: String
    karma: Int
    createdAt: String
  }

  type Article {
    id: ID
    url: String
    title: String
    createdAt: String
    votes: Int
    name: String
    userId: Int

    comments: [Comment]
    user: User
  }

  type ArticleFeed {
    cursor: Int!
    numberPages: Int!
    articles: [Article]!
  }

  type Comment {
    id: ID
    text: String
    userId: Int
    votes: Int
    createdAt: String
    articleId: ID

    article: Article
    user: User
    comments: [Comment]
  }

  type Query {
    # BASE Hello Worlding
    hello: String

    article(id: ID!): Article
    articles: [Article]
    articleFeed(limit: Int!, offset: Int): ArticleFeed
    user(id: ID!): User
    users: [User]
    comment(id: ID!): Comment
    comments: [Comment]
  }

  type Mutation {
    register(email: String!, name: String!, password: String!): User
    authenticate(email: String!, password: String!): User
    createArticle(url: String!, title: String!): Article
    createComment(comment: String!): Comment
    voteOnArticle(articleId: ID!, value: Int!): [Article]
    voteOnComment(commentId: ID!, value: Int!): String
    # deleteArticle(id: ID!): String
    # deleteComment(id: ID!): String
  }
`

module.exports = typeDefs
