const jsonWebToken = require("jsonwebtoken");
const {
  responseMessageSuccess,
  responseMessageError,
} = require("../utility/responseMessage");

const getStatusDataController = async (req, res) => {
  //   const {} = req.query;
  const access_token = req.headers.authorization;
  //   await req.db.query(
  //     "CREATE TABLE IF NOT EXISTS status (id INT NOT NULL AUTO_INCREMENT,user_id INT,profile_img VARCHAR(1024),email VARCHAR(40),name VARCHAR(80),createdAt VARCHAR(20),statusLink VARCHAR(1024),isDeleted INT(2), FOREIGN KEY (user_id) REFERENCES Users(user_id), PRIMARY KEY (id))"
  //   );
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
  //   req.db.query(
  //     `CREATE TABLE user_posts ( id INT(40) NOT NULL AUTO_INCREMENT, user_id INT(40) NOT NULL , post_title VARCHAR(1024), publish_time VARCHAR(40), published_by VARCHAR(120), liked_by VARCHAR(1024), post_type VARCHAR(40) , post_type_id INT(12), comments VARCHAR(2048) , posted_from VARCHAR(40),user_profile VARCHAR(1024), email VARCHAR(120),FOREIGN KEY (user_id) REFERENCES Users(user_id), PRIMARY KEY (id))`
  //   );
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

module.exports = {
  getStatusDataController,
  postStatusDataController,
  getUserPostDataController,
};
