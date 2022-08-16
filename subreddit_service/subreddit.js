const { Client } = require("pg");

const clientConfig = {
  user: "manosriram",
  database: "backend_reddit",
};

const client = new Client(clientConfig);
client.connect();

exports.createSubreddit = function createSubreddit(call, cb) {
  const { name, description } = call.request.subreddit;
  console.log(name, description);

  client.query(
    "insert into subreddits(name, description) values($1, $2) returning id",
    [name, description],
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

exports.getSubreddit = function getSubreddit(call, cb) {
  const { id } = call.request;

  client.query(
    "select name, description from subreddits where id = $1",
    [id],
    (err, res) => {
      if (err) {
        return cb(err, null);
      } else {
        const response = {
          subreddit: {
            name: res.rows[0].title,
            description: res.rows[0].description,
            id: id,
          },
        };
        return cb(null, response);
      }
    }
  );
};
