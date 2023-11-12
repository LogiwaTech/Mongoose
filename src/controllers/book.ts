import { Book } from "../models/book";
import { Publisher } from "../models/publisher";
import { Request, Response } from "express";

const saveBook = async (req: Request, res: Response) => {
  try {
    if (!req.body) {
      return res
        .status(400)
        .json({ error: "Request body is missing or empty" });
    }

    const book = new Book(req.body);
    await book.save();

    const publisher = await Publisher.findById({ _id: book.publisher });
    publisher?.publishedBooks.push(book.id);
    await publisher?.save();

    res.status(201).json({ data: book });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const findBook = async (req: Request, res: Response) => {
  try {
    if (!req.body.name || !req.body.author) {
      res.status(401).json({ error: "Name or Author cannot be empty!" });
    }

    const { name, author } = req.body;

    const result = await Book.find({ name, author }).sort({ price: 1 }).exec();

    res.status(201).json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const findAllBook = async (req: Request, res: Response) => {
  try {
    const result = await Book.find({ price: { $lt: 25 } })
      .sort({ price: 1 })
      .select({ name: 1, tags: 1, price: 1 })
      .exec();

    res.status(201).json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const updateBook = async (req: Request, res: Response) => {
  try {
    const book = await Book.findById(req.params.id);

    if (!book) res.status(401).json({ error: "book not found!" });
    else {
      const { price, tags } = req.body;
      book.price = price;
      book.tags = tags;
      const result = await book.save();

      res.status(201).json(result);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const deleteBook = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const book = await Book.findByIdAndDelete(id);

    res.status(201).json(book);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export { saveBook, findBook, updateBook, deleteBook, findAllBook };
