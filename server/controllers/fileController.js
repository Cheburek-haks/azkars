const fs = require("fs");

class FileController {
  async uploadFiles(req, res) {
    try {
      const image = req.files["image"];
      image.mv("./public/img/" + image.name);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "Upload files" });
    }
  }
}
module.exports = new FileController();
