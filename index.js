const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const db = require("./queries");
const PORT = 3000;

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

const authMiddleware = (req, res, next) => {
  const headerApiKey = req.headers["x-auth-proxy-api-key"];
  if (headerApiKey !== "ANIMOCA-BRANDS") {
    return res.status(401).json({ error: "Unauthorized" });
  }
  next();
};

const apiRouter = express.Router();

apiRouter.get("/", (request, response) => {
  response.json({ info: "Node.js, Express, and Postgres API" });
});
apiRouter.post("/random-code", authMiddleware, db.createRandomCode);
apiRouter.post("/specific-codes", authMiddleware, db.createSpecificCodes);
app.use("/api", apiRouter);

app.listen(PORT, () => console.log(`App running on port ${PORT}.`));
