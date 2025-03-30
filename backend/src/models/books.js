import mongoose from "mongoose";

const booksSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        unique: true,
    },
    caption: {
        type: String,
        required: true,
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    image: {
        type: String,
        default: "",
    },
}, {
    timestamps: true,
});


const Book = mongoose.model("Book", booksSchema);

export default Book;