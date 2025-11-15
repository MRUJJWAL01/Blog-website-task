const mongoose = require('mongoose');
const slugify = require('slugify');

const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      minlength: 5,
      maxlength: 120,
      trim: true,
    },
    slug: {
      type: String,
      unique: true,
      index: true,
    },
    imageURL: {
      type: [String],
      trim: true,
    },
    content: {
      type: String,
      required: true,
      minlength: 10,
    },
    username: {
      type: String,
      required: true, // author's username
    },
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true }
);

postSchema.pre('validate', async function (next) {
  if (this.isModified('title') || !this.slug) {
    const base = slugify(this.title || '', { lower: true, strict: true }).slice(0, 200) || 'post';
    let slug = base;
    const Post = mongoose.model('Post', postSchema);
    let i = 0;
    while (await Post.exists({ slug })) {
      i += 1;
      slug = `${base}-${i}`;
      if (i > 1000) break;
    }
    this.slug = slug;
  }
  next();
});

module.exports = mongoose.model('Post', postSchema);
