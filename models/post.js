const mongoose = require("mongoose")

const Schema = mongoose.Schema;

const PostSchema = new Schema({
  title: { type: String, default: ""},
  content: { type: String, default: ""},
  date_created: { type: Date, required: true},
  date_updated: { type: Date },
  is_published: { type: Boolean, default: false}
})

PostSchema.virtual("url").get(function() {
  return `/posts/${this._id}`
})

module.exports = mongoose.model("Post", PostSchema)