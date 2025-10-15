const mongoose = require("mongoose");

const bookList = new mongoose.Schema({
    title: {
        type: String,
    },
    author: {
        type: String,
    },
    publishedYear: {
        type: String,
    },
    genre: {
        type: [String],
    },
    language: {
        type: String,
    },
    country: {
        type: String,
    },
    rating: {
        type: String,
    },
    summary: {
        type: String,
    },
    coverImageUrl: {
        type: String,
    },
});

const Book = mongoose.model("Book", bookList);

module.exports = Book;