# Mongoose

Mongoose is a [MongoDB](https://www.mongodb.org/) object modeling tool designed to work in an asynchronous environment.

## Documentation

[mongoosejs.com](http://mongoosejs.com/)


## Installation
For Project
```sh
$ npm install 
```
Then install [node.js](http://nodejs.org/) and [mongodb](https://www.mongodb.org/downloads).

```sh
$ npm install mongoose
```

## Importing

```javascript
// Using Node.js `require()`
const mongoose = require('mongoose');

// Using ES6 imports
import mongoose from 'mongoose';
```

## Overview

### Connecting to MongoDB

First, we need to define a connection. If your app uses only one database, you should use `mongoose.connect`. If you need to create additional connections, use `mongoose.createConnection`.

Both `connect` and `createConnection` take a `mongodb://` URI, .

```js
var mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1:27017/myapp');

```
or the parameters `host, database, port, options`
```js
var mongoose = require('mongoose');

mongoose.connect('mongodb://username:password@host:port/database?options...');
```

Once connected, the `open` event is fired on the `Connection` instance. If you're using `mongoose.connect`, the `Connection` is `mongoose.connection`. Otherwise, `mongoose.createConnection` return value is a `Connection`.


**Important!** Mongoose buffers all the commands until it's connected to the database. This means that you don't have to wait until it connects to MongoDB in order to define models, run queries, etc.

### Defining a Model

Models are defined through the `Schema` interface.

```js
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
```

Aside from defining the structure of your documents and the types of data you're storing, a Schema handles the definition of:

* [Validators](http://mongoosejs.com/docs/validation.html) (async and sync)
* [Defaults](http://mongoosejs.com/docs/api.html#schematype_SchemaType-default)
* [Indexes](http://mongoosejs.com/docs/guide.html#indexes)
* [Middleware](http://mongoosejs.com/docs/middleware.html)
* [Methods](http://mongoosejs.com/docs/guide.html#methods) definition
* [Statics](http://mongoosejs.com/docs/guide.html#statics) definition



The following example shows some of these features:

```js
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


// middleware
bookSchema.pre("save", function (next) {
  if (/[\u0080-\uffff]/.test(this.name)) {
    this.name = this.name.replace(/[^\x00-\x7F]+/g, "");
  }
  next();
});
```

Take a look at the example in `models/book.ts` for an end-to-end example of a typical setup.

### Accessing a Model

Once we define a model through `mongoose.model("Book", bookSchema);`, we can access it through the same function

```js
const Book = mongoose.model("Book", bookSchema);
```

The first argument is the _singular_ name of the collection your model is for. **Mongoose automatically looks for the _plural_ version of your model name.** For example, if you use

```js
const Publisher = mongoose.model("Publisher", publisherSchema);
```

Then Mongoose will create the model for your __publishers__ collection, not your __publisher__ collection.

 we can find documents from the same collection

```js
const result = await Publisher.find({ name='test' }).sort({ name: 1 }).exec();
```

You can also `findOne`, `findById`, `update`, etc. For more details check out [the docs](http://mongoosejs.com/docs/queries.html).

**Important!** If you opened a separate connection using `mongoose.createConnection()` but attempt to access the model through `mongoose.model('ModelName')` it will not work as expected since it is not hooked up to an active db connection. In this case access your model through the connection you created:

```js
const conn = mongoose.createConnection(process.env.MONGODB_URI);
    MyModel = conn.model('ModelName', schema),
    m = new MyModel;
m.save(); // works
```

vs

```js
const conn = mongoose.createConnection(process.env.MONGODB_URI);
    MyModel = mongoose.model('ModelName', schema),
    m = new MyModel;
m.save(); // does not work b/c the default connection object was never connected
```

### CRUD

For saving

```js
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
```
For Updating:
```js
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
```
For removing:

```js
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
```


### Middleware

See the [docs](http://mongoosejs.com/docs/middleware.html) page.

#### Intercepting and mutating method arguments

You can intercept method arguments via middleware.

For example, you can define a pre-save middleware function to handle Unicode characters in the name before storing it in the database:

```js
bookSchema.pre("save", function (next) {
  if (/[\u0080-\uffff]/.test(this.name)) {

    this.name = this.name.replace(/[^\x00-\x7F]+/g, "");
  }
  next();
});
```




