import "dotenv/config";
import express from "express";
import mongoose from "mongoose";
const app = express();
app.use(express.json());
const port = process.env.PORT;
const MONGO_URI = process.env.MONGO_URI;
const DB_Name = process.env.DB_Name;
mongoose
    .connect(MONGO_URI, { dbName: DB_Name })
    .then(() => {
        console.log("Connected to MongoDB");
    })
    .catch((err) => {
        console.log("Problem connecting to MongoDB:", err);
    });
const movie_Schema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    director: String,
    category: {
        type: String,
        required: true
    },
    year: {
        type: Number,
        required: true
    }
});
const Movie = mongoose.model("Movie", movie_Schema);
app.post("/api/v1/movies", (req, res) => {
    const new_Movie = req.body;
    Movie.create(new_Movie)
        .then((result) => {
            res.status(201).json({
                message: "Movie created successfully",
                data: result
            });
        })
        .catch((err) => {
            res.status(500).json({
                message: "Movie creation failed",
                error: err.message
            });
        });
});
app.get("/api/v1/movies", (req, res) => {
    const { category } = req.query;
    const query = category ? { category } : {};
    Movie.find(query)
        .then((result) => {
            res.status(200).json({
                message: "Movies retrieved successfully",
                data: result
            });
        })
        .catch((err) => {
            res.status(500).json({
                message: "Movie retrieval failed",
                error: err.message
            });
        });
});
app.get("/api/v1/movies/:id", (req, res) => {
    const { id } = req.params;
    Movie.findOne({ _id: id })
        .then((result) => {
            if (!result) {
                return res.status(404).json({
                    message: "Movie not found"
                });
            }
            res.status(200).json({
                message: "Movie retrieved successfully",
                data: result
            });
        })
        .catch((err) => {
            res.status(500).json({
                message: "Movie retrieval failed",
                error: err.message
            });
        });
});
app.put("/api/v1/movies/:id", (req, res) => {
    const { id } = req.params;
    const updated_Movie = req.body;
    Movie.findOneAndUpdate(
        { _id: id },
        updated_Movie,
        {
            new: true,
            runValidators: true
        }
    )
        .then((result) => {
            if (!result) {
                return res.status(404).json({
                    message: "Movie not found"
                });
            }
            res.status(200).json({
                message: "Movie updated successfully",
                data: result
            });
        })
        .catch((err) => {
            res.status(500).json({
                message: "Movie update failed",
                error: err.message
            });
        });
});
app.delete("/api/v1/movies/:id", (req, res) => {
    const { id } = req.params;
    Movie.findOneAndDelete({ _id: id })
        .then((result) => {
            if (!result) {
                return res.status(404).json({
                    message: "Movie not found"
                });
            }
            res.status(200).json({
                message: "Movie deleted successfully",
                data: result
            });
        })
        .catch((err) => {
            res.status(500).json({
                message: "Movie deletion failed",
                error: err.message
            });
        });
});
 app.listen(port, () => {
            console.log(`Server running on port ${port}`);
        });