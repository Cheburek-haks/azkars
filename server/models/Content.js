const { Schema, model } = require("mongoose");

const shema = new Schema({
    id: { type: Number },
    title: { type: String },
    arabicLanguage: { type: String },
    meaning: { type: String },
    rusLanguage: { type: String },
    mp3: { type: String },
});

module.exports = model("Content", shema);
