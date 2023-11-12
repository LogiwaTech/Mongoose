import { Publisher } from "../models/publisher";
import { Request, Response } from "express";

const savePublisher = async (req: Request, res: Response) => {
  try {
    if (!req.body) {
      return res
        .status(400)
        .json({ error: "Request body is missing or empty" });
    }

    const publisher = new Publisher(req.body);
    const result = await publisher.save();
    res.status(201).json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const listPublisher = async (req: Request, res: Response) => {
  try {
    console.log(req.body.name);

    const result = await Publisher.find().populate({
      path: "booksPublished",
      select: "name publishYear author",
    });

    res.status(201).json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export { savePublisher, listPublisher };
