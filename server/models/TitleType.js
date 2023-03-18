const { Schema, model } = require("mongoose");

const shema = new Schema(
  {
    title: { type: String },
    type: { type: String },
  },
  { timestamps: { createdAt: "created_at" } }
);

module.exports = model("TitleType ", shema);
