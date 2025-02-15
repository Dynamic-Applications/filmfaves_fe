import React from "react";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";

export default function AddMovie({
    newMovie,
    setNewMovie,
    addDialogOpen,
    closeAddDialog,
    handleAddMovie,
}) {
    return (
        <Dialog open={addDialogOpen} onClose={closeAddDialog}>
            <DialogTitle>Add New Movie</DialogTitle>
            <DialogContent>
                <TextField
                    margin="dense"
                    label="Title"
                    type="text"
                    fullWidth
                    value={newMovie.title}
                    onChange={(e) =>
                        setNewMovie({ ...newMovie, title: e.target.value })
                    }
                />
                <TextField
                    margin="dense"
                    label="Director"
                    type="text"
                    fullWidth
                    value={newMovie.director}
                    onChange={(e) =>
                        setNewMovie({ ...newMovie, director: e.target.value })
                    }
                />
                <TextField
                    margin="dense"
                    label="Genre"
                    type="text"
                    fullWidth
                    value={newMovie.genre}
                    onChange={(e) =>
                        setNewMovie({ ...newMovie, genre: e.target.value })
                    }
                />
                <TextField
                    margin="dense"
                    label="Description"
                    type="text"
                    fullWidth
                    multiline
                    value={newMovie.description}
                    onChange={(e) =>
                        setNewMovie({
                            ...newMovie,
                            description: e.target.value,
                        })
                    }
                />
                <TextField
                    margin="dense"
                    label="Rate"
                    type="number"
                    fullWidth
                    value={newMovie.rate}
                    onChange={(e) =>
                        setNewMovie({ ...newMovie, rate: e.target.value })
                    }
                />
                <TextField
                    margin="dense"
                    label="Image URL"
                    type="text"
                    fullWidth
                    value={newMovie.image}
                    onChange={(e) =>
                        setNewMovie({ ...newMovie, image: e.target.value })
                    }
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={closeAddDialog}>Cancel</Button>
                <Button onClick={handleAddMovie}>Add Movie</Button>
            </DialogActions>
        </Dialog>
    );
}
