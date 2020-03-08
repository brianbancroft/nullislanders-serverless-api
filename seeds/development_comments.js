const { company } = require('faker')
const { pipe } = require('ramda')

const randomPostId = () => ({ postId: Math.floor(Math.random() * 100) })
const randomUserId = ({ postId }) => ({
  postId,
  userId: Math.floor(Math.random() * 100),
})

const generateCommentCommentContent = ({ postId, userId }) => ({
  text: company.catchPhrase(),
  comment_id: postId,
  user_id: userId,
})

const generatePostCommentContent = ({ postId, userId }) => ({
  text: company.catchPhrase(),
  post_id: postId,
  user_id: userId,
})

const generateCommentComment = pipe(
  randomPostId,
  randomUserId,
  generateCommentCommentContent,
)

const generatePostComment = pipe(
  randomPostId,
  randomUserId,
  generatePostCommentContent,
)

exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('comments')
    .del()
    .then(function() {
      // Inserts seed entries
      return knex('comments').insert([
        { text: 'this is a comment', article_id: 1, user_id: 2 },
        {
          text: 'This is a nested comment',
          comment_id: 1,
          user_id: 2,
        },
      ])
    })
}
