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
import { useNavigate } from "react-router-dom";

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
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("token");

        if (!token) {
            navigate("/signin");
            return;
        }

        axios
            .get(`${API_URL}/movies` || "http://localhost:4000/movies", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            .then((response) => {
                console.log("Movies fetched:", response.data);
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
                setError("Failed to load movies. Please try again later.");
            });
    }, [navigate]);

    const toggleDescription = (id) => {
        setDescriptionVisibility((prev) => ({
            ...prev,
            [id]: !prev[id],
        }));
    };

    const handleDelete = (id) => {
        const confirmDelete = window.confirm(
            "Are you sure you want to remove this movie? This action cannot be undone."
        );

        if (!confirmDelete) return;

        const token = localStorage.getItem("token");

        axios
            .delete(
                `${API_URL}/movies/${id}` ||
                    `http://localhost:4000/movies/${id}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            )
            .then(() => {
                setMovies(movies.filter((movie) => movie.movie_id !== id));
            })
            .catch((error) => console.error(error));
    };

    const handleUpdate = (id, updatedMovie) => {
        const token = localStorage.getItem("token");

        axios
            .put(
                `${API_URL}/movies/${id}` ||
                    `http://localhost:4000/movies/${id}`,
                updatedMovie,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            )
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
        const token = localStorage.getItem("token");

        axios
            .post(
                `${API_URL}/movies` || "http://localhost:4000/movies",
                newMovie,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            )
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

    if (error) {
        return <Typography color="error">{error}</Typography>;
    }

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
