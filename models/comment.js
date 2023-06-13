const mongoose = require("mongoose")

const Schema = mongoose.Schema;
// To support threaded comment, ssupply parent commentId other than null 
const CommentSchema = new Schema({
  content: { type: String, required: true},
  date_created: { type: Date, required: true},
  post: { type: Schema.Types.ObjectId, ref: "Post", required: true},
  author_name: { type: String, required: true},
  parent: { type: Schema.Types.ObjectId},
  is_deleted: { type: Boolean, default: false}
})

module.exports = mongoose.model("Comment", CommentSchema)