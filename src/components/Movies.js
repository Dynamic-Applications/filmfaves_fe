import "../App.css";
import { useEffect, useState } from "react";
import axios from "axios";
import Card from "@mui/material/Card";
import { CardContent, CardMedia } from "@mui/material";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import CardActions from "@mui/material/CardActions";
import Rating from "@mui/material/Rating";
import AddMovie from "./AddMovie";
import EditMovie from "./EditMovie";

const API_URL = process.env.REACT_APP_FILMFAVES_API;

export default function Movies() {
    const [movies, setMovies] = useState([]);
    const [editingMovie, setEditingMovie] = useState(null);
    const [updatedDetails, setUpdatedDetails] = useState({});
    const [descriptionVisibility, setDescriptionVisibility] = useState({});
    const [addDialogOpen, setAddDialogOpen] = useState(false);
    const [newMovie, setNewMovie] = useState({
        title: "",
        director: "",
        genre: "",
        description: "",
        rate: 0,
        image: "",
    });

    useEffect(() => {
        axios(`${API_URL}/movies`)
            .then((response) => {
                const movieData = Array.isArray(response.data)
                    ? response.data
                    : [];
                setMovies(movieData);

                const visibilityState = movieData.reduce((acc, movie) => {
                    acc[movie.movie_id] = false;
                    return acc;
                }, {});
                setDescriptionVisibility(visibilityState);
            })
            .catch((error) => {
                console.error("Error fetching movies:", error);
                setMovies([]);
            });
    }, []);

    const toggleDescription = (id) => {
        setDescriptionVisibility((prev) => ({
            ...prev,
            [id]: !prev[id],
        }));
    };

    const handleDelete = (id) => {
        axios
            .delete(`${API_URL}/movies/${id}`)
            .then(() => {
                setMovies(movies.filter((movie) => movie.movie_id !== id));
            })
            .catch((error) => console.error(error));
    };

    const handleUpdate = (id, updatedMovie) => {
        axios
            .put(`${API_URL}/movies/${id}`, updatedMovie)
            .then((response) => {
                setMovies(
                    movies.map((movie) =>
                        movie.movie_id === id ? response.data : movie
                    )
                );
                setEditingMovie(null);
            })
            .catch((error) => console.error(error));
    };

    const openEditDialog = (movie) => {
        setEditingMovie(movie);
        setUpdatedDetails(movie);
    };

    const handleEditChange = (field, value) => {
        setUpdatedDetails({ ...updatedDetails, [field]: value });
    };

    const closeEditDialog = () => {
        setEditingMovie(null);
    };

    const openAddDialog = () => {
        setAddDialogOpen(true);
    };

    const closeAddDialog = () => {
        setAddDialogOpen(false);
    };

    const handleAddMovie = () => {
        axios
            .post(`${API_URL}/movies`, newMovie)
            .then((response) => {
                setMovies([...movies, response.data]);
                setAddDialogOpen(false);
                setNewMovie({
                    title: "",
                    director: "",
                    genre: "",
                    description: "",
                    rate: 0,
                    image: "",
                });
            })
            .catch((error) => console.error(error));
    };

    return (
        <div className="center-container">
            <h1 className="Title">Movie List</h1>

            <div className="card card2">
                {movies.length > 0 ? (
                    movies.map((movie) => (
                        <div className="card" key={movie.movie_id}>
                            <Card sx={{ maxWidth: 300 }}>
                                <div>
                                    <div className="img">
                                        <CardMedia>
                                            <img
                                                src={
                                                    movie.image ||
                                                    "default-image-url"
                                                }
                                                alt={movie.title}
                                                style={{
                                                    width: "100%",
                                                    height: "auto",
                                                }}
                                            />
                                        </CardMedia>
                                    </div>
                                    <CardContent>
                                        <Typography
                                            gutterBottom
                                            variant="h5"
                                            component="div"
                                        >
                                            {movie.title}
                                        </Typography>
                                        <Typography
                                            variant="caption"
                                            display="block"
                                            gutterBottom
                                        >
                                            Genre: <em>{movie.genre}</em>
                                        </Typography>
                                        <Typography
                                            variant="caption"
                                            display="block"
                                            gutterBottom
                                        >
                                            Director: <em>{movie.director}</em>
                                        </Typography>
                                        <Rating
                                            name="half-rating"
                                            defaultValue={movie.rate}
                                            precision={0.5}
                                            readOnly
                                        />
                                        {descriptionVisibility[
                                            movie.movie_id
                                        ] && (
                                            <Typography
                                                variant="body2"
                                                color="text.secondary"
                                                gutterBottom
                                            >
                                                {movie.description}
                                            </Typography>
                                        )}
                                        <CardActions>
                                            <Button
                                                size="small"
                                                onClick={() =>
                                                    toggleDescription(
                                                        movie.movie_id
                                                    )
                                                }
                                            >
                                                {descriptionVisibility[
                                                    movie.movie_id
                                                ]
                                                    ? "Hide Details"
                                                    : "Details"}
                                            </Button>
                                            <Button
                                                size="small"
                                                onClick={() =>
                                                    openEditDialog(movie)
                                                }
                                            >
                                                Edit
                                            </Button>
                                            <Button
                                                size="small"
                                                onClick={() =>
                                                    handleDelete(movie.movie_id)
                                                }
                                            >
                                                Remove
                                            </Button>
                                        </CardActions>
                                    </CardContent>
                                </div>
                            </Card>
                        </div>
                    ))
                ) : (
                    <Typography variant="body1">
                        No movies available.
                    </Typography>
                )}
            </div>

            <EditMovie
                editingMovie={editingMovie}
                updatedDetails={updatedDetails}
                handleEditChange={handleEditChange}
                closeEditDialog={closeEditDialog}
                handleUpdate={handleUpdate}
            />

            <Button variant="contained" color="primary" onClick={openAddDialog}>
                Add New Movie
            </Button>

            <AddMovie
                newMovie={newMovie}
                setNewMovie={setNewMovie}
                addDialogOpen={addDialogOpen}
                closeAddDialog={closeAddDialog}
                handleAddMovie={handleAddMovie}
            />
        </div>
    );
}
