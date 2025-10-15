const express = require("express");
const app = express();
require("dotenv").config();
const cors = require("cors");
const port = 3000;
const { initializeDatabase } = require("./db/db.connect");
const Book = require("./models/book.model");

app.use(cors());
app.use(express.json());

initializeDatabase();

async function createBook(newBook){
    try{
        const book = new Book(newBook);
        const savedBook = await book.save();
        return savedBook;
    } catch(error) {
        throw error;
    }
};

app.post("/books", async(req, res) => {
    try{
        const book = await createBook(req.body);
        res.status(201).json({message: "Book added successfully", book: book});
    }catch(error){
        res.status(500).json({message: "Couln't save in database"});
    }
});

async function readBookByName(bookTitle){
    try{
        const book = await Book.findOne({title: bookTitle});
        return book;
    } catch (error) {
        throw error;
    }
};

async function findByGenre(gost){
    try{
        const name = await Book.find({genre: gost});
        return name;
    }catch(error){
        throw error;
    }
};

app.get("/api/books", async(req, res) => {
    try{
        const book = await findByGenre(req.query.genre);
        if(book){
            res.status(200).json({message: "Fetch successfully", book: book});
        }else{
            res.status(404).json({error: "Not Found"});
        }
    }catch(error){
        res.status(500).json({message: "Failed"});
    }
});

app.post("/books/:title", async(req, res) => {
    try{
        const book = await readBookByName(req.params.title);
        res.status(200).json({message: "Fetch detail successfully", book: book});
    }catch(error){
        res.status(500).json({message: "Failed to get."})
    }
});

async function getAllBook(){
    try{
        const allBook = await Book.find();
        return allBook;
    } catch(error) {
        throw error;
    }
}

app.get("/books", async(req, res) => {
    try{
        const book = await getAllBook(req.body);
        if(book.length != 0){
            res.status(200).json({message: "Data fetch successfully", book: book});
        }else{
            res.status(404).json({error: "Got Error"});
        }
    }catch(error){
        res.status(500).json({message: "Not found data"});
    }
});

async function getByAuthorName(authorName){
    try{
        const byAuthor = await Book.find({author: authorName});
        return byAuthor;
    }catch(error){
        throw error;
    }
}

app.post("/books/author/:author", async(req, res) => {
    try{
        const book = await getByAuthorName(req.params.author);
        if(book.length != 0){
            res.status(200).json({message: "Book details fetch successfully", book: book});
        } else {
            res.status(404).json({error: "Not found the author"});
        }
    }catch(error){
        res.status(500).json({message: "Failed to get"});
    }
});

async function findByPublishedYear(year){
    try{
        const book = await Book.find({publishedYear: year});
        return book;
    }catch(error){
        throw error;
    }
};

app.get("/api/books/years", async(req, res) => {
    try{
        const book = await findByPublishedYear(req.query.year);
        if(book){
            res.status(200).json({message: "Fetch successfully", book: book});
        }else{
            res.status(404).json({error: "Not found the year"});
        }
    }catch{
        res.status(500).json({message: "Failed"});
    }
});

async function updateBook(bookId, dataToUpdate){
    try{
        const updateBook = await Book.findByIdAndUpdate(bookId, dataToUpdate, {new: true});
        return updateBook;
    }catch(error){
        console.log("Getting error to update");
    }
}

app.post("/books/api/boo/:bookId", async(req, res) => {
    try{
        const bookId = req.params.bookId;
        const dataToUpdate = req.body;
        const book = await updateBook(bookId, dataToUpdate);
        if(book){
            res.status(200).json({message: "updated successfully", book: book});
        }else{
            res.status(404).json({error: "Book does not exist"});
        }
    }catch(error){
        res.status(500).json({message: "Failed to fetch"});
    }
});

async function bookUpdate(movieTitle, updateData){
    try{
        const update = await Book.findOneAndUpdate({title: movieTitle}, updateData, {new: true});
        return update;

    }catch(error){
        console.log("Getting error", error);
    }
}

app.post("/api/books/title/id/:title", async(req, res) => {
    try{
        const title = req.params.title;
        const updateData = req.body;
        const book = await bookUpdate(title, updateData);
        if(book){
            res.status(200).json({message: "Title updated successfully", book: book});
        } else {
            res.status(404).json({error: "Book does not exist"});
        }
    }catch(error){
        res.status(500).json({message: "Failed to run"});
    }
});

async function deleteRestaurantById(bookId){
    try{
        const deletedBook = await Book.findByIdAndDelete(bookId);
        console.log(deletedBook);
    }catch(error){
        console.log("Deleted this error", error);
    }
}

// deleteRestaurantById("68d3d9d9ade7e7ac109b8e5f");

async function deleteRestaurantByName(bookName){
    try{
        const data = await Book.findOneAndDelete({title: bookName});
        console.log(data);
    }catch(error){
        console.log("Errror caught", error);
    }
}

// deleteRestaurantByName("The Da Vinci Code");

async function deleteBookById(bookId){
    try{
        const data = Book.findByIdAndDelete(bookId);
        return data;
    }catch(error){
        console.log("Error cought", error);
    }
}

app.delete("/book/:bookId", async(req, res) => {
    try{
        const book = await deleteBookById(req.params.bookId);
        if(book){
            res.status(200).json({message: "Deleted Successfully", book: book});
        }else{
            res.status(404).json({error: "Book not found"});
        }
    }catch(error){
        res.status(500).json({message: "Failed to get"});
    }
});

app.listen(port, ()=> {
    console.log("Server is listening to the port", port);
});

cons