const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here

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
public_users.get('/',function (req, res) {
  //Write your code here (done)
  return res.send(JSON.stringify(books));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here (done)
    const isbn = req.params.isbn;
    if (books[isbn]) {
        return res.status(200).json(books[isbn]);
    } else {
        return res.status(404).json({message: "Book not found"});
    }
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here (done)
    const searchAuthor = req.params.author.toLowerCase();
    const booksKeys = Object.values(books);

    const booksByAuthor = booksKeys.filter(book => book.author.toLowerCase() === searchAuthor);
    if (booksByAuthor.length > 0) {
        return res.status(200).json(booksByAuthor);
    } else {
        return res.status(404).json({message: "No book found for this author"});
    }
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here (done)
  const searchTitle = req.params.title.toLowerCase();
  const titles = Object.values(books);

  const booksByTitle = titles.filter(book => book.title.toLowerCase() === searchTitle);

  if (booksByTitle.length > 0) {
    return res.status(200).json(booksByTitle);
  } else {
    return res.status(404).json({message: "No book found for this title"});
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
