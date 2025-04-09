import express from "express";
import Book from "../models/books.js";
import protectRoute from "../middlewares/auth.middleware.js";
import cloudinary from "../lib/cloudinary.js";

const router = express.Router();

router.post("/", protectRoute, async (req, res) => {
    const { title, caption, rating, image, } = req.body
    try {
        if (!title || !caption || !rating || !image) {
            return res.status(400).json({ message: "All fields are required" });
        }
        // console.log({ title, caption, rating, image, })
        const uploadedImage = await cloudinary.uploader.upload(image);

        const imgUrl = uploadedImage.secure_url;

        const book = await Book.create({
            title,
            caption,
            rating,
            image: imgUrl,
            user: req.user._id,
        });
        await book.save();
        return res.status(201).json({ book });

    } catch (error) {
        console.log("Error creating book", error);
        res.status(500).json({ message: "Server error", error });
    }

})

router.get("/", protectRoute, async (req, res) => {
    try {
        const page = req.query.page || 1;
        const limit = req.query.limit || 5;

        const skip = (page - 1) * limit;
        const books = await Book.find()
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .populate("user", "username image");
        const totalBooks = await Book.countDocuments();
        const totalPages = Math.ceil(totalBooks / limit);
        res.status(200).json({
            books,
            currentPage: page,
            totalPages,
            total: totalBooks
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server error" });
    }
})

router.delete("/:id", protectRoute, async (req, res) => {
    try {
        const book = await Book.findById(req.params.id);
        if (!book) {
            return res.status(404).json({ message: "Book not found" });
        }
        // check if user is the owner of the book
        if (book.user.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        // delete image from coudeinary 
        if (book.image && book.image.includes("cloudinary")) {
            try {
                const publicId = book.image.split("/").pop().split(".")[0];
                await cloudinary.uploader.destroy(publicId);
            } catch (error) {
                console.log("Error deleting image from cloudinary", error);
            }
        }
        await book.deleteOne();
        res.status(200).json({ message: "Book deleted successfully" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server error" });
    }
})

router.get('/user', protectRoute, async (req, res) => {
    try {
        const books = await Book.find({ user: req.user._id }).sort({ createdAt: -1 });
        res.status(200).json(books);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server error" });
    }
})

export default router