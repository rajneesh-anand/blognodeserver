const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const upload = require("./routes/upload");
const publish = require("./routes/publish");
const post = require("./routes/post");
const product = require("./routes/product");
const awsupload = require("./routes/awsupload");
const service = require("./routes/service");
const course = require("./routes/course");
const chapter = require("./routes/chapter");
const testinomial = require("./routes/testinomial");
const blog = require("./routes/blog");
const payment = require("./routes/payment");
const enrollment = require("./routes/enrollment");
const auth = require("./routes/auth");
const student = require("./routes/student");
const user = require("./routes/user");

require("dotenv").config();

const app = express();

// Middlewares

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  cors({
    origin: "*",
  })
);

app.use((req, res, next) => {
  console.log(req.path, req.method);
  next();
});

app.use(cookieParser());

app.use("/api/upload", upload);
app.use("/api/publish", publish);
app.use("/api/post", post);
app.use("/api/product", product);
app.use("/api/awsupload", awsupload);
app.use("/api/service", service);
app.use("/api/course", course);
app.use("/api/chapter", chapter);
app.use("/api/testinomial", testinomial);
app.use("/api/blog", blog);
app.use("/api/payment", payment);
app.use("/api/enrollment", enrollment);
app.use("/api/auth", auth);
app.use("/api/student", student);
app.use("/api/user", user);

const port = process.env.PORT || 8080;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
