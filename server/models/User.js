const { Schema, model } = require("mongoose");

const shema = new Schema(
  {
    name: { type: String },
    secondName: { type: String },
    email: { type: String, required: true, unique: true },
    password: { type: String },
    floor: { type: String, enum: ["male", "female"] },
    favourites: [{ type: Schema.Types.ObjectId, ref: "Content" }],
  },
  { timestamps: true }
);

module.exports = model("User", shema);
