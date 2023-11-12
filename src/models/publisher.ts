import mongoose, { Schema } from "mongoose";

const publisherSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  location: String,
  publishedBooks: [
    {
      type: Schema.Types.ObjectId,
      ref: "Book",
    },
  ],
});

publisherSchema.virtual("booksPublished", {
  ref: "Book",
  localField: "_id",
  foreignField: "publisher",
});

publisherSchema.set("toObject", { virtuals: true });
publisherSchema.set("toJSON", { virtuals: true });

const Publisher = mongoose.model("Publisher", publisherSchema);
export { Publisher };
