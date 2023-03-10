const express = require("express");
const mongoose = require("mongoose");
const config = require("config");
const chalk = require("chalk");
const routes = require("./routes");
const cors = require("cors");
const port = config.get("port") ?? 9090;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static("../client/azkars/public"));
app.use(cors());
app.use("/api", routes);

async function start() {
  try {
    await mongoose.connect(config.get("mongoURI"));
    console.log(chalk.blue("MongoDB connected"));
    app.listen(port, (res, req) => {
      console.log(chalk.green(`Server  has been started on port - ${port}`));
    });
  } catch (error) {
    console.log(chalk.red(error.message));
    process.exit(1);
  }
}

start();
