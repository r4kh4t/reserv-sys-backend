const { generateInvitationCode, isValidEmail } = require("./utils");

const Pool = require("pg").Pool;
const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "mydatabase",
  password: "mysecretpassword",
  port: 5432,
});

const createRandomCode = (request, response) => {
  const inviteCode = generateInvitationCode(); // will return code in the format AAAA-BBBB-CCCC
  const { authorEmail, userEmail } = request.body;
  if (!isValidEmail(authorEmail) || !isValidEmail(userEmail)) {
    return response.status(400).json({
      error:
        "An error occurred while adding the invite code: authorEmail is invalid.",
    });
  }

  pool.query(
    "INSERT INTO T_CODES (INVITE_CODE, AUTHOR_EMAIL, USER_EMAIL) VALUES ($1, $2, $3)",
    [inviteCode, authorEmail, userEmail],
    (error, results) => {
      console.log("error", error);
      if (error) {
        return response
          .status(400)
          .json({ error: "An error occurred while adding the invite code." });
      }
      response.status(201).send({
        message: "Invite code was added successfully.",
        data: {
          inviteCode,
          authorEmail,
          userEmail,
        },
      });
    }
  );
};

const createSpecificCodes = (request, response) => {
  const { inviteCodes, authorEmail } = request.body; // inviteCodes should be an array
  if (!isValidEmail(authorEmail)) {
    return response.status(400).json({
      error:
        "An error occurred while adding the invite code: authorEmail is invalid.",
    });
  }
  if (request.body.userEmail && !isValidEmail(request.body.userEmail)) {
    return response.status(400).json({
      error:
        "An error occurred while adding the invite code: authorEmail is invalid.",
    });
  }
  const userEmail = request.body.userEmail || "";

  let insertQuery =
    "INSERT INTO T_CODES (INVITE_CODE, AUTHOR_EMAIL, USER_EMAIL) VALUES";
  const queryParams = [];

  for (let i = 0; i < inviteCodes.length; i++) {
    insertQuery += ` ($${i * 3 + 1}, $${i * 3 + 2}, $${i * 3 + 3})`;

    if (i < inviteCodes.length - 1) {
      insertQuery += ",";
    }
    queryParams.push(inviteCodes[i], authorEmail, userEmail);
  }

  pool.query(insertQuery, queryParams, (error, results) => {
    if (error) {
      console.log("error", error);
      return response
        .status(400)
        .json({ error: "An error occurred while adding the invite code." });
    }
    response.status(201).send({
      message: "Invite codes was added successfully.",
      data: {
        inviteCodes,
        authorEmail,
        userEmail,
      },
    });
  });
};

module.exports = {
  createRandomCode,
  createSpecificCodes,
};
