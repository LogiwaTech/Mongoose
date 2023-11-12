import mongoose from "mongoose";

const bookSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  author: {
    type: String,
    required: true,
    unique: true,
  },
  publishedYear: Number,
  tags: [String],
  date: {
    type: Date,
    default: Date.now,
  },
  onSale: Boolean,
  price: Number,
  publisher: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Publisher",
  },
});

bookSchema.pre("save", function (next) {
  if (/[\u0080-\uffff]/.test(this.name)) {
    this.name = this.name.replace(/[^\x00-\x7F]+/g, "");
  }
  next();
});

const Book = mongoose.model("Book", bookSchema);
export { Book };
