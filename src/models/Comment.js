const client = require('../config/database')
const { convertArrayObjectKeysToCamelCase } = require('../helpers')

const allArticleCommentsQuery = articleId => ({
  text: `
      SELECT * FROM comments
      WHERE article_id = $1

      ;
    `,
  values: [articleId],
})

exports.allForArticle = async ({ articleId }) => {
  const query = allArticleCommentsQuery(articleId)

  const { rows } = await client.query(query).catch(e => {
    throw new Error(e)
  })

  return convertArrayObjectKeysToCamelCase(rows)
}

exports.find = async ({ id }) => {
  const query = {
    text: `
      SELECT * FROM comments
      WHERE id = $1;
    `,
    values: [id],
  }

  const { rows } = await client.query(query).catch(e => {
    throw new Error(e)
  })

  return convertArrayObjectKeysToCamelCase(rows)[0]
}

exports.create = async ({
  userId,
  text,
  articleId = null,
  commentId = null,
}) => {
  if (!(articleId || commentId))
    throw new Error('Must include either articleId or commentId')
  const query = {
    text: `
      INSERT INTO comments(
        text,
        user_id,
        article_id,
        comment_id
      ) VALUES (
        $1,
        $2,
        $3,
        $4
      ) RETURNING
        id,
        text,
        article_id,
        comment_id,
        user_id,
        created_at
    `,
    values: [text, userId, articleId, commentId],
  }

  const { rows } = await client.query(query).catch(e => {
    throw new Error(e)
  })

  return convertArrayObjectKeysToCamelCase(rows)[0]
}

exports.vote = async ({ userId, commentId, value }) => {
  // TODO: Direct string interpolation is bad. We probably want to fix this.
  const query = {
    text: `
      do $$
        BEGIN
          IF EXISTS (
            SELECT * FROM article_votes
            WHERE
              user_id = ${userId}
            AND
              comment_id = ${commentId}
          ) THEN
              UPDATE article_votes
                SET value = ${value}
                WHERE user_id = ${userId}
                AND comment_id = ${commentId};
          ELSE
            INSERT INTO article_votes(user_id, comment_id, value)
            VALUES (${userId}, ${commentId}, ${value});
          END IF;
        END
        $$
    `,
  }
  await client.query(query).catch(e => {
    console.log('Error with adding new vote ', e)
    throw new Error(e)
  })

  return true
}
