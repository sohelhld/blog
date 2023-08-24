const express = require("express")
const { connection } = require("./db");
var cookieParser = require("cookie-parser");

var cors = require("cors");
const { userRouter } = require("./routes/user.routes");
const { auth } = require("./middleware/auth.middleware");
const { blogRouter } = require("./routes/blog.routes");

const app = express();
app.use(cors());
app.use(cookieParser());
app.use(express.json());

 app.use("/users", userRouter);
 app.use(auth)
 app.use("/api",blogRouter)
//  app.use("/doctors", doctorRouter);


app.listen(8000, async () => {
  try {
    await connection;
    console.log("connected to db");
  } catch (error) {
    console.log(error);
  }

  console.log(`server is runing at 8000`);
});
