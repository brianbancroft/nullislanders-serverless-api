const client = require('../config/database')
const { convertArrayObjectKeysToCamelCase } = require('../helpers')

const allArticlesQuery = `
  WITH article_vote_tallies AS (
    SELECT
      article_id,
      SUM(value) AS votes
    FROM article_votes
    GROUP BY article_id
  )

  SELECT
    article.id AS id,
    article.url AS url,
    article.title AS title,
    COALESCE(votes.votes, 0) AS votes,
    article.user_id AS user_id,
    users.name AS name,
    article.user_id AS user_id,
    article.created_at AS created_at

  FROM articles AS article
  LEFT JOIN article_vote_tallies AS votes
    ON article.id = votes.article_id
  LEFT JOIN users
    ON article.user_id = users.id
  ;

`

exports.all = async () => {
  const { rows } = await client.query(allArticlesQuery).catch(e => {
    throw new Error(e)
  })

  return convertArrayObjectKeysToCamelCase(rows)
}

exports.page = async ({ limit, offset }) => {
  const query = {
    text: `
      WITH article_vote_tallies AS (
        SELECT
          article_id,
          SUM(value) AS votes
        FROM article_votes
        GROUP BY article_id
      )

      SELECT
        article.id AS id,
        article.url AS url,
        article.title AS title,
        COALESCE(votes.votes, 0) AS votes,
        article.user_id AS user_id,
        users.name AS name,
        article.user_id AS user_id,
        article.created_at AS created_at

      FROM articles AS article
      LEFT JOIN article_vote_tallies AS votes
        ON article.id = votes.article_id
      LEFT JOIN users
        ON article.user_id = users.id

        LIMIT $1
        OFFSET $2
      ;
    `,
    values: [limit, offset],
  }

  const { rows } = await client.query(query).catch(e => {
    throw new Error(e)
  })

  return convertArrayObjectKeysToCamelCase(rows)
}

exports.find = async ({ id }) => {
  const query = {
    text: `
      WITH article_vote_tallies AS (
        SELECT
          article_id,
          SUM(value) AS votes
        FROM article_votes
        WHERE article_id = $1
        GROUP BY article_id
      )

      SELECT
        article.id AS id,
        article.url AS url,
        article.title AS title,
        COALESCE(votes.votes, 0) AS votes,
        article.user_id AS user_id,
        users.name AS name,
        article.user_id AS user_id,
        article.created_at AS created_at

      FROM articles AS article
      LEFT JOIN article_vote_tallies AS votes
        ON article.id = votes.article_id
      JOIN users
        ON article.user_id = users.id


      WHERE article.id = $1
      ;
  `,
    values: [id],
  }

  const { rows } = await client.query(query).catch(e => {
    throw new Error(e)
  })

  return convertArrayObjectKeysToCamelCase(rows)[0]
}

exports.create = async ({ userId, url, title }) => {
  const query = {
    text: `
      INSERT INTO articles(
        url,
        title,
        user_id
      ) VALUES (
        $1,
        $2,
        $3
      ) RETURNING
        id,
        url,
        title,
        user_id,
        created_at
    `,
    values: [url, title, userId],
  }

  const { rows } = await client.query(query).catch(e => {
    throw new Error(e)
  })

  return convertArrayObjectKeysToCamelCase(rows)[0]
}

exports.vote = async ({ userId, articleId, value }) => {
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
              article_id = ${articleId}
          ) THEN
              UPDATE article_votes
                SET value = ${value}
                WHERE user_id = ${userId}
                AND article_id = ${articleId};
          ELSE
            INSERT INTO article_votes(user_id, article_id, value)
            VALUES (${userId}, ${articleId}, ${value});
          END IF;
        END
        $$
    `,
  }
  await client.query(query).catch(e => {
    console.log('Error with adding new vote ', e)
    throw new Error(e)
  })

  const { rows } = await client.query(allArticlesQuery).catch(e => {
    throw new Error(e)
  })

  return convertArrayObjectKeysToCamelCase(rows)
}
