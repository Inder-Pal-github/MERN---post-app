const express = require("express");
const app = express();

const cors = require("cors");
const { authRouter } = require("./routes/auth");
const { connection } = require("./config/db");
const { userRouter } = require("./routes/user");
const { authenticate } = require("./middlewares/authenticate");
require("dotenv").config();
const PORT = process.env.PORT || 8080;

// Middlewares
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:3000",
  })
);
// Routes
app.get("/", (req, res) => {
  res.status(200).send({ message: "Instagram Clone", success: true });
});

app.use("/auth", authRouter);
app.use(authenticate);
app.use("/profile", userRouter);

app.listen(PORT, async () => {
  try {
    await connection;
    console.log(`Running on http://localhost:${PORT} connected to DB`);
  } catch (error) {
    console.log("Something went wrong connecting the server");
  }
});
