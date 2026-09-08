const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

const getBooks = () => {
  return new Promise((resolve) => {
    resolve(books);
  });
};


public_users.post("/register", (req,res) => {

  const {username, password} = req.body;

  if (!username || !password) {
    return res.status(400).json({ 
      message: "The username and password are required!" 
    });
  };

  const existingUser = users.find(user => user.username.toLowerCase() === username.toLowerCase());
  
  if(existingUser) {
    return res.status(409).json({message: "Username already exist!"})
  };

  const newUser = {
    id: users.length + 1,
    username: username,
    password: password
  };

  users.push(newUser);
  return res.status(201).json({message: "Your registered successfully! You can now log in."})
});

// Get the book list available in the shop
public_users.get('/', async function (req, res) {
  try {
    const booksData = await getBooks();
    return res.status(200).json(booksData);
  } catch (error) {
    return res.status(500).json({
      message: "Error retrieving  books"
    });
  }
});

const getBookByISBN = (isbn) => {
  return new Promise((resolve, reject) => {
    if (books[isbn]) {
      resolve(books[isbn]);
    } else {
      reject(new Error("Book not found"));
    }
  });
};

// Get book details based on ISBN
public_users.get('/isbn/:isbn', async function (req, res) {
  
  try {
    const isbn = req.params.isbn;
    const book = await getBookByISBN(isbn);

    return res.status(200).json(book);
  } catch (error) {
    return res.status(404).json({
      message: "Book not found"
    });
  }

 });

const getBookByAuthor = (author) => {
  return new Promise((resolve, reject) => {
    const searchAuthor = author.toLowerCase();
    const booksByAuthor = Object.values(books).filter(book => book.author.toLowerCase() === searchAuthor);

    if (booksByAuthor.length > 0) {
      resolve(booksByAuthor);
    } else {
      reject(new Error("No book found for the entered author"));
    }
  });
};
  
// Get book details based on author
public_users.get('/author/:author',async function (req, res) {
    try {
      const author = req.params.author;
      const bookByAuthor = await getBookByAuthor(author);

      return res.status(200).json(bookByAuthor);
    } catch (error) {
      return res.status(404).json({
        message: "No book found for this author"
      });
    }
});

const getBookByTitle = (title) => {
  return new Promise((resolve, reject) => {
    const searchTitle = title.toLowerCase();
    const booksByTitle = Object.values(books).filter(book => book.title.toLowerCase() === searchTitle);
    if (booksByTitle.length > 0) {
      resolve(booksByTitle);
    } else {
      reject(new Error("No book found for this title"));
    }

  });
};

// Get all books based on title
public_users.get('/title/:title', async function (req, res) {
  try {
    const title = req.params.title;
    const bookByTitle = await getBookByTitle(title);
    return res.status(200).json(bookByTitle);
  } catch (error) {
    return res.status(404).json({
      message: "No book found for this title"
    })
  }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const bookISBN = req.params.isbn;

  if (books[bookISBN]) {
    return res.status(200).json(books[bookISBN].reviews);
  } else {
    return res.status(404).json({message: "No book found!"})
  }

});

module.exports.general = public_users;
