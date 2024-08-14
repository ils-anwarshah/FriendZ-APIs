const jsonWebToken = require("jsonwebtoken");
const {
  responseMessageSuccess,
  responseMessageError,
} = require("../utility/responseMessage");
const moment = require("moment");

const getStatusDataController = async (req, res) => {
  //   const {} = req.query;
  const access_token = req.headers.authorization;
  req.db
    .query(
      "SELECT GROUP_CONCAT(statusLink) statusLink,id,user_id,email,profile_img,name,createdAt FROM status WHERE isDeleted <> 1 GROUP BY user_id ORDER BY id DESC "
    )
    .then(async (result) => {
      res.status(200).json(responseMessageSuccess(result[0], 200, "success"));
    })
    .catch((err) => {
      res.json({ err });
    });
};
const postStatusDataController = async (req, res) => {
  const { statusLink, datetime } = req.body;
  const access_token = req.headers.authorization;
  const tokenData = jsonWebToken.decode(access_token);
  await req.db.query(
    "CREATE TABLE IF NOT EXISTS status (id INT NOT NULL AUTO_INCREMENT,user_id INT,profile_img VARCHAR(1024),email VARCHAR(40),name VARCHAR(80),createdAt VARCHAR(20),statusLink VARCHAR(1024),isDeleted INT(2), FOREIGN KEY (user_id) REFERENCES Users(user_id), PRIMARY KEY (id))"
  );
  req.db
    .query(
      "INSERT INTO status( user_id, profile_img, email, name, createdAt, statusLink, isDeleted) VALUES(?,?,?,?,?,?,?)",
      [
        tokenData.user_id,
        "",
        tokenData.email,
        tokenData.name,
        datetime,
        statusLink,
        0,
      ]
    )
    .then((result) => {
      res.status(200).json({ msg: "Status Added Successfully" });
    })
    .catch((err) => {
      res.json({ err });
    });
};
const getUserPostDataController = async (req, res) => {
  const { limit, page } = req.query;
  const access_token = req.headers.authorization;
  const tokenData = jsonWebToken.decode(access_token);
  req.db
    .query("SELECT * FROM user_posts ORDER BY id DESC LIMIT ?", [
      parseInt(limit),
    ])
    .then((result) => {
      res.status(200).json(responseMessageSuccess(result[0], 200, "success"));
    })
    .catch((err) => {
      res.json({ err });
    });
};
const createUserPostController = async (req, res) => {
  const { post_title, publish_time, post_type, posted_from, user_profile } =
    req.body;
  const access_token = req.headers.authorization;
  const tokenData = jsonWebToken.decode(access_token);
  console.log(tokenData);
  req.db.query(
    `CREATE TABLE IF NOT EXISTS user_posts ( id INT(40) NOT NULL AUTO_INCREMENT, user_id INT(40) NOT NULL , post_title VARCHAR(1024), publish_time VARCHAR(40), published_by VARCHAR(120), liked_by VARCHAR(1024), post_type VARCHAR(40), comments VARCHAR(2048) , posted_from VARCHAR(40),user_profile TEXT, email VARCHAR(120),FOREIGN KEY (user_id) REFERENCES Users(user_id), PRIMARY KEY (id))`
  );
  req.db
    .query(
      "INSERT INTO user_posts (user_id, post_title, publish_time, published_by, post_type, posted_from, user_profile, email) VALUES (?,?,?,?,?,?,?,?)",
      [
        tokenData?.user_id,
        post_title,
        moment().utc().format("YYYY-MM-DD HH:mm:ss"),
        tokenData?.name,
        post_type,
        posted_from,
        user_profile,
        tokenData?.email,
      ]
    )
    .then((result) => {
      res
        .status(200)
        .json(responseMessageSuccess({}, 200, "Post Added Successfully!"));
    })
    .catch((err) => {
      res.json({ err });
    });
};
const getUserTypes = async (req, res) => {
  req.db.query(
    `CREATE TABLE IF NOT EXISTS user_types ( id INT(40) NOT NULL AUTO_INCREMENT, title VARCHAR(40), image VARCHAR(1024), PRIMARY KEY (id))`
  );
  req.db
    .query("SELECT * FROM user_types ORDER BY id DESC")
    .then((result) => {
      res.status(200).json(responseMessageSuccess(result[0], 200, "Success"));
    })
    .catch((err) => {
      res.json({ err });
    });
};
const likePostController = async (req, res) => {
  const { reaction, post_id, post_owner_id } = req.body;
  req.db.query(
    `CREATE TABLE IF NOT EXISTS user_post_reaction (id INT AUTO_INCREMENT PRIMARY KEY,post_id INT NOT NULL,user_id INT NOT NULL, post_owner_id INT NOT NULL, reaction TINYINT NOT NULL,created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,UNIQUE KEY unique_post_user (post_id, user_id),FOREIGN KEY (post_id) REFERENCES user_posts(id),FOREIGN KEY (user_id) REFERENCES Users(user_id))`
  );
  req.db
    .query(
      "INSERT INTO user_post_reaction(post_id,user_id,reaction,post_owner_id) VALUES (?,?,?,?) ON DUPLICATE KEY UPDATE reaction = ?",
      [post_id, req.tokenData.user_id, reaction, post_owner_id, reaction]
    )
    .then((result) => {
      res
        .status(200)
        .json(responseMessageSuccess({}, 200, "Like Added Successfully"));
    })
    .catch((err) => {
      res.status(400).json({ err });
    });
};
const getLikeAndConnectionCountConroller = async (req, res) => {
  // const { reaction, post_id } = req.query;
  try {
    const like_counts = await req.db.query(
      "SELECT COUNT(reaction) as like_count FROM user_post_reaction WHERE user_id = ? AND reaction = 1",
      [req.tokenData.user_id]
    );
    const connection_counts = await req.db.query(
      "SELECT COUNT(follower_id) as connection_count FROM user_connections WHERE follower_id = ?",
      [req.tokenData.user_id]
    );
    res.status(200).json(
      responseMessageSuccess(
        {
          ...like_counts[0][0],
          ...connection_counts[0][0],
        },
        200,
        "success"
      )
    );
  } catch (err) {
    res.status(500).json({ err });
  }
};
const makeConnectionController = async (req, res) => {
  // const { following_id } = req.query;
  const following_id = parseInt(req.params.userId);
  req.db.query(
    "CREATE TABLE IF NOT EXISTS user_connections (id INT AUTO_INCREMENT PRIMARY KEY,follower_id INT NOT NULL,following_id INT NOT NULL,created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,status VARCHAR(20),FOREIGN KEY (follower_id) REFERENCES Users(user_id),FOREIGN KEY (following_id) REFERENCES Users(user_id),UNIQUE KEY unique_connection (follower_id, following_id))"
  );
  if (req.tokenData.user_id === following_id) {
    return res.status(400).json({ error: "Cannot follow yourself" });
  }
  req.db
    .query(
      "INSERT INTO user_connections(follower_id,following_id) VALUES(?,?)",
      [req.tokenData.user_id, following_id]
    )
    .then((result) => {
      res
        .status(200)
        .json(responseMessageSuccess({}, 200, "User followed successfully "));
    })
    .catch((err) => {
      res.status(400).json({ err });
    });
};
const getUserConnectionsController = async (req, res) => {
  // const { following_id } = req.query;
  // const following_id = parseInt(req.params.userId);
  req.db
    .query(
      "SELECT * FROM Users WHERE user_id IN (SELECT following_id FROM user_connections WHERE follower_id = ?)",
      [req.tokenData.user_id]
    )
    .then((result) => {
      res.status(200).json(responseMessageSuccess(result[0], 200, "success"));
    })
    .catch((err) => {
      res.status(400).json({ err });
    });
};
const deleteUserConnectionController = async (req, res) => {
  const following_id = parseInt(req.params.userId);
  req.db
    .query(
      "DELETE FROM user_connections WHERE follower_id=? AND following_id = ? ",
      [req.tokenData.user_id, following_id]
    )
    .then((result) => {
      res
        .status(200)
        .json(responseMessageSuccess({}, 200, "Unfollowed Successfully"));
    })
    .catch((err) => {
      res.status(400).json({ err });
    });
};
const getMatchedUsersListController = async (req, res) => {
  const { gender } = req.body;
  // console.log(req.tokenData);
  req.db
    .query("SELECT * FROM Users WHERE gender= ?", [gender])
    .then((result) => {
      res.status(200).json(responseMessageSuccess(result[0], 200, "success"));
    })
    .catch((err) => {
      res.status(400).json({ err });
    });
};
const getNewUsersListController = async (req, res) => {
  // const { gender } = req.body;
  console.log(req.tokenData);
  req.db
    .query(
      "SELECT * FROM Users WHERE user_id != ? ORDER BY user_id DESC LIMIT 10",
      [req.tokenData.user_id]
    )
    .then((result) => {
      res.status(200).json(responseMessageSuccess(result[0], 200, "success"));
    })
    .catch((err) => {
      res.status(400).json({ err });
    });
};
const getUserDetailsFromUserIdController = async (req, res) => {
  const user_id = req.params.user_id;
  // console.log(req.tokenData);
  const checkIsFollwing = await req.db.query(
    "SELECT * FROM user_connections WHERE follower_id = ? AND following_id=?",
    [req.tokenData.user_id, parseInt(user_id)]
  );
  req.db
    .query("SELECT * FROM Users WHERE user_id = ?", [user_id])
    .then((result) => {
      if (result[0].length > 0) {
        res.status(200).json(
          responseMessageSuccess(
            {
              ...result[0][0],
              isFollwing: checkIsFollwing[0].length ? true : false,
            },
            200,
            "success"
          )
        );
      } else {
        res.status(400).json({ err: "user not found!" });
      }
    })
    .catch((err) => {
      res.status(400).json({ err });
    });
};
const getUserLikesAndListController = async (req, res) => {
  // const user_id = req.params.user_id;
  // console.log(req.tokenData);
  req.db
    .query(
      "SELECT COUNT(user_post_reaction.id) AS like_count,Users.profile_img,Users.fname, Users.lname , user_post_reaction.user_id FROM user_post_reaction JOIN Users ON Users.user_id = user_post_reaction.user_id WHERE post_owner_id = ? GROUP BY user_id ORDER BY like_count DESC",
      [req.tokenData.user_id]
    )
    .then((result) => {
      res.status(200).json(responseMessageSuccess(result[0], 200, "success"));
    })
    .catch((err) => {
      res.status(400).json({ err });
    });
};

module.exports = {
  getStatusDataController,
  postStatusDataController,
  getUserPostDataController,
  createUserPostController,
  getUserTypes,
  likePostController,
  getLikeAndConnectionCountConroller,
  makeConnectionController,
  getUserConnectionsController,
  deleteUserConnectionController,
  getMatchedUsersListController,
  getNewUsersListController,
  getUserDetailsFromUserIdController,
  getUserLikesAndListController,
};
