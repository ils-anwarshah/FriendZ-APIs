const moment = require("moment");
const { responseMessageSuccess } = require("../utility/responseMessage");

const sendMessagesController = async (req, res) => {
  const { receiver_id, file, message, attachment } = req.body;
  await req.db.query(
    "CREATE TABLE IF NOT EXISTS user_messages (id INT AUTO_INCREMENT PRIMARY KEY,sender_id INT NOT NULL,receiver_id INT NOT NULL,time VARCHAR(40),file TEXT,message TEXT,attachment TEXT,roomId VARCHAR(127),is_read INT DEFAULT 0,FOREIGN KEY (sender_id) REFERENCES Users(user_id),FOREIGN KEY (receiver_id) REFERENCES Users(user_id))"
  );
  const userIds = [req.tokenData.user_id, receiver_id];
  const sortedRoomArray = userIds.sort((a, b) => a - b);
  const [id1, id2] = sortedRoomArray;
  const sortedRoomID = `${id1}${id2}`;
  const currentTime = moment().utc().toDate();
  req.db
    .query(
      "INSERT INTO user_messages (sender_id,receiver_id,file,message,attachment, roomId,time) VALUES (?,?,?,?,?,?,?)",
      [
        req.tokenData.user_id,
        receiver_id,
        file,
        message,
        attachment,
        sortedRoomID,
        currentTime,
      ]
    )
    .then((result) => {
      res.status(200).json(responseMessageSuccess({}, 200, "Message Sent"));
    })
    .catch((err) => {
      res.status(400).json({ err });
    });
};

const fetchMessagesController = async (req, res) => {
  const { roomId } = req.params;
  req.db
    .query("SELECT * FROM user_messages WHERE roomId = ?", [roomId])
    .then((result) => {
      res.status(200).json(responseMessageSuccess(result[0], 200, "success"));
    })
    .catch((err) => {
      res.status(400).json({ err });
    });
};
const createUserConnection = async (req, res) => {
  const { receiver_id } = req.body;
  await req.db.query(
    "CREATE TABLE IF NOT EXISTS connetion_room_ids (id INT AUTO_INCREMENT PRIMARY KEY,sender_id INT NOT NULL,receiver_id INT NOT NULL,time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,roomId VARCHAR(127),FOREIGN KEY (sender_id) REFERENCES Users(user_id),FOREIGN KEY (receiver_id) REFERENCES Users(user_id))"
  );
  const userIds = [req.tokenData.user_id, receiver_id];
  const sortedRoomArray = userIds.sort((a, b) => a - b);
  const [id1, id2] = sortedRoomArray;
  const sortedRoomID = `${id1}${id2}`;

  req.db
    .query("SELECT * FROM connetion_room_ids WHERE roomID=?", [sortedRoomID])
    .then((result) => {
      if (result[0].length > 0) {
        console.log(result[0]);
        res
          .status(200)
          .json(
            responseMessageSuccess(
              { roomId: result[0][0]?.roomId },
              200,
              "Connection Created"
            )
          );
      } else {
        req.db
          .query(
            "INSERT INTO connetion_room_ids (sender_id,receiver_id, roomId) VALUES (?,?,?)",
            [req.tokenData.user_id, receiver_id, sortedRoomID]
          )
          .then((result) => {
            res
              .status(200)
              .json(
                responseMessageSuccess(
                  { roomId: sortedRoomID },
                  200,
                  "Connection Created"
                )
              );
          })
          .catch((err) => {
            res.status(400).json({ err });
          });
      }
    })
    .catch((err) => {
      res.status(400).json({ err });
    });
};

const fetchRecentMessageUserList = async (req, res) => {
  req.db
    .query(
      "SELECT u.user_id, u.fname,u.lname , m.message AS last_message, m.time AS last_message_time, m.is_read FROM Users u JOIN user_messages m ON (u.user_id = m.sender_id OR u.user_id = m.receiver_id)JOIN (SELECT CASE WHEN sender_id = ? THEN receiver_id ELSE sender_id END AS user_id , MAX(time) AS max_created_at FROM user_messages WHERE sender_id = ? OR receiver_id = ? GROUP BY user_id ) latest ON ((u.user_id = latest.user_id) AND (m.time = latest.max_created_at) AND (m.sender_id = ? OR m.receiver_id = ? )) WHERE u.user_id != ? ORDER BY m.time DESC  ",
      [
        req.tokenData.user_id,
        req.tokenData.user_id,
        req.tokenData.user_id,
        req.tokenData.user_id,
        req.tokenData.user_id,
        req.tokenData.user_id,
      ]
    )
    .then((result) => {
      res.status(200).json(responseMessageSuccess(result[0], 200, "success"));
    })
    .catch((err) => {
      res.status(400).json({ err });
    });
};

const updateMessageStatusController = async (req, res) => {
  const { roomId, receiverId } = req.params;
  req.db
    .query(
      "UPDATE user_messages SET is_read = 1 WHERE roomId = ? AND receiver_id=?",
      [roomId, receiverId]
    )
    .then((result) => {
      res.status(200).json(responseMessageSuccess({}, 200, "success"));
    })
    .catch((err) => {
      res.status(400).json({ err });
    });
};

module.exports = {
  sendMessagesController,
  fetchMessagesController,
  createUserConnection,
  fetchRecentMessageUserList,
  updateMessageStatusController,
};
