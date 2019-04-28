const mongoose = require("mongoose");
// mongoose.connection.dropDatabase();
const Schema = mongoose.Schema;

let ArticleSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  // link: {
  //   type: String,
  //   required: true
  // },
  // teaser: {
  //   type: String,
  //   required: true
  // },
  image: {
    type: String
  },
  // saved: {
  //   type: Boolean,
  //   default: false
  // },
  createdAt: {
    type: Date,
    default: Date.now
  },
  // comment: [
  //   {
  //     type: Schema.Types.ObjectId,
  //     ref: "Comment"
  //   }
  // ]
});

let Article = mongoose.model("Article", ArticleSchema);

module.exports = Article;
