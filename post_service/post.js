const { Client } = require("pg");

const clientConfig = {
  user: "manosriram",
  database: "backend_reddit",
};

const client = new Client(clientConfig);
client.connect();

exports.createPost = function createPost(call, cb) {
  const { title, description, author, subreddit_id } = call.request.post;

  client.query(
    "insert into posts(title, description, subreddit_id, author) values($1, $2, $3, $4) returning id",
    [title, description, subreddit_id, author],
    (err, res) => {
      if (err) {
        return cb(err, null);
      } else {
        const response = {
          id: res.rows[0].id,
        };
        return cb(null, response);
      }
    }
  );
};

exports.getPost = function getPost(call, cb) {
  const { id } = call.request;

  client.query(
    "select title, description, subreddit_id, author, likes from posts where id = $1",
    [id],
    (err, res) => {
      if (err) {
        return cb(err, null);
      } else {
        client.query(
          "select content from comments where post_id = $1",
          [id],
          (err2, res2) => {
            const comments = res2.rows.map((comment) => comment.content);
            if (err2) {
              return cb(err2, null);
            } else {
              const response = {
                post: {
                  title: res.rows[0].title,
                  id,
                  description: res.rows[0].description,
                  subreddit_id: res.rows[0].subreddit_id,
                  author: res.rows[0].author,
                  likes: res.rows[0].likes,
                },
                comments: comments,
              };
              console.log(response);
              return cb(null, response);
            }
          }
        );
      }
    }
  );
};

exports.updatePost = function updatePost(call, cb) {
  const { id, post, user_id } = call.request;
  const { title, description } = post;

  client.query("select author from posts where id = $1", [id], (err, res) => {
    if (err) {
      return cb(err, null);
    } else {
      let query, values;
      if (res.rows.length > 0 && res.rows[0].author == user_id) {
        if (title != "" && description != "") {
          query = "update posts set title = $1, description = $2 where id = $3";
          values = [title, description, id];
        } else if (title != "") {
          query = "update posts set title = $1 where id = $2";
          values = [title, id];
        } else if (description != "") {
          query = "update posts set description = $1 where id = $2";
          values = [description, id];
        }
      } else {
        return cb(new Error("user not authorized", null));
      }

      client.query(query, values, (err, res) => {
        if (err) {
          return cb(err, null);
        } else {
          return cb(null, { id });
        }
      });
    }
  });
};

exports.likePost = function likePost(call, cb) {
  const { id, user_id } = call.request;

  client.query(
    "update posts set likes = likes + 1 where id = $1",
    [id],
    (err, res) => {
      if (err) {
        return cb(err, null);
      } else {
        return cb(null, { id });
      }
    }
  );
};

exports.commentPost = function commentPost(call, cb) {
  const { id, user_id, comment } = call.request;

  client.query(
    "insert into comments(user_id, post_id, content) values($1, $2, $3) returning id",
    [user_id, id, comment],
    (err, res) => {
      if (err) {
        return cb(err, null);
      } else {
        return cb(null, { id: res.rows[0].id });
      }
    }
  );
};
