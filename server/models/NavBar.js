const { Schema, model } = require("mongoose");

const shema = new Schema(
  {
    title: { type: String },
    image: { type: String },
    route: { type: String },
  },
  { timestamps: { createdAt: "created_at" } }
);

module.exports = model("NavBar", shema);
