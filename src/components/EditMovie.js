import React from "react";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";

export default function EditMovie({
    editingMovie,
    updatedDetails,
    handleEditChange,
    closeEditDialog,
    handleUpdate,
}) {
    if (!editingMovie) return null; // Do not render if no movie is being edited

    return (
        <Dialog open={Boolean(editingMovie)} onClose={closeEditDialog}>
            <DialogTitle>Edit Movie</DialogTitle>
            <DialogContent>
                <TextField
                    margin="dense"
                    label="Title"
                    type="text"
                    fullWidth
                    value={updatedDetails.title || ""}
                    onChange={(e) => handleEditChange("title", e.target.value)}
                />
                <TextField
                    margin="dense"
                    label="Director"
                    type="text"
                    fullWidth
                    value={updatedDetails.director || ""}
                    onChange={(e) =>
                        handleEditChange("director", e.target.value)
                    }
                />
                <TextField
                    margin="dense"
                    label="Genre"
                    type="text"
                    fullWidth
                    value={updatedDetails.genre || ""}
                    onChange={(e) => handleEditChange("genre", e.target.value)}
                />
                <TextField
                    margin="dense"
                    label="Description"
                    type="text"
                    fullWidth
                    multiline
                    value={updatedDetails.description || ""}
                    onChange={(e) =>
                        handleEditChange("description", e.target.value)
                    }
                />
                <TextField
                    margin="dense"
                    label="Rate"
                    type="number"
                    fullWidth
                    value={updatedDetails.rate || ""}
                    onChange={(e) => handleEditChange("rate", e.target.value)}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={closeEditDialog}>Cancel</Button>
                <Button
                    onClick={() =>
                        handleUpdate(editingMovie.movie_id, updatedDetails)
                    }
                >
                    Save
                </Button>
            </DialogActions>
        </Dialog>
    );
}
