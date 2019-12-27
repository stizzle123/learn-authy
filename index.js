require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const PORT = process.env.PORT || 3001;

const routes = require("./routes");

mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useFindAndModify: false,
    useUnifiedTopology: true
  })
  .then(() => console.log(`[MongoDB] > Connected successfully`))
  .catch(err => console.error(`Failed to connect to MongoDB: ${err}`));

app.use(routes);

app.listen(PORT, err => {
  if (err) throw err;
  console.log(`> Server started on port ${PORT}`);
});
