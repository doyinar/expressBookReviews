const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{
  let exist = users.filter(user => {
    return user.username === username;
  });

  if (exist.length > 0) {
    return true;
  } else {
    return false;
  }
};



const authenticatedUser = (username, password) => {
  let validUsers = users.filter(user => {
    return user.username === username && user.password === password;
  });
  
  if (validUsers.length > 0) {
    return true;
  } else {
    return false;
  }
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    return res.status(404).json({message: "Error logging in"});
  }

  if (authenticatedUser(username, password)) {
    let accessToken = jwt.sign(
      {data: password}, "secretKey", {expiresIn: 60 * 60}
    );

    req.session.authorization = {
      accessToken, username
    }
    return res.status(200).send("User successfully logged in");
  } else {
    return res.status(208).json({message: "Invalid user credentials. Check username and password"});
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const review = req.query.review;
  const username = req.session.authorization.username;
  
  if (!books[isbn]) {
  return res.status(404).json({
    message: "Book not found"
  });
  }
  books[isbn].reviews[username] = review;

  return res.status(200).json({message: "Review added successfully"});
});

// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const username = req.session.authorization.username;

  console.log("ISBN:", isbn);
  console.log("Username:", username);
  console.log("Book:", books[isbn]);
  console.log("Reviews:", books[isbn]?.reviews);
  console.log("User review:", books[isbn]?.reviews?.[username]);

  if (books[isbn] && books[isbn].reviews[username]) {
    delete books[isbn].reviews[username];
    
    return res.status(200).json({message: "Review deleted successfully"});
  }

  return res.status(404).json({message: "Review not found"});
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
