import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    Button,
    CircularProgress,
    Typography,
    TextField,
    Card,
    CardContent,
    Container,
    List,
    ListItem,
    Paper,
    MenuItem,
    Select,
    FormControl,
    InputLabel,
    IconButton,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import axios from "axios";

const API_URL = process.env.REACT_APP_FILMFAVES_API || "http://localhost:4000";

export default function Users() {
    const [users, setUsers] = useState([]);
    const [roles, setRoles] = useState([]);
    const [newUser, setNewUser] = useState({
        username: "",
        email: "",
        password: "",
        roles: [],
    });
    const [editingUserId, setEditingUserId] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("token");

        if (!token) {
            navigate("/signin");
            return;
        }

        const fetchData = async () => {
            setLoading(true);
            try {
                const [usersResponse, rolesResponse] = await Promise.all([
                    fetch(`${API_URL}/users`, {
                        headers: { Authorization: `Bearer ${token}` },
                    }),
                    fetch(`${API_URL}/users/roles`, {
                        headers: { Authorization: `Bearer ${token}` },
                    }),
                ]);

                const usersData = await usersResponse.json();
                const rolesData = await rolesResponse.json();

                // Ensure rolesData is an array of role strings
                if (Array.isArray(rolesData)) {
                    setRoles(rolesData); // Set roles
                }

                setUsers(Array.isArray(usersData) ? usersData : []);
            } catch (error) {
                console.error("Error fetching data", error);
                setUsers([]);
                setRoles([]);
            }
            setLoading(false);
        };

        fetchData();
    }, [navigate]);

    const handleAddUser = async () => {
        const token = localStorage.getItem("token");

        try {
            const response = await axios.post(`${API_URL}/users`, newUser, {
                headers: { Authorization: `Bearer ${token}` },
            });

            setUsers((prevUsers) => [...prevUsers, response.data]);
            setNewUser({ username: "", email: "", password: "", roles: [] });
        } catch (error) {
            console.error("Error adding user", error);
            setError(error.message || "Failed to add user.");
        }
    };

    const handleRoleChange = (userId, newRoles) => {
        setUsers((prevUsers) =>
            prevUsers.map((user) =>
                user.id === userId ? { ...user, roles: newRoles } : user
            )
        );
    };

    const saveRoleUpdate = async (userId) => {
        const token = localStorage.getItem("token");
        const userToUpdate = users.find((user) => user.id === userId);

        try {
            await axios.put(
                `${API_URL}/users/${userId}`,
                { roles: userToUpdate.roles },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setEditingUserId(null); // Exit edit mode
        } catch (error) {
            console.error("Error updating role", error);
            setError("Failed to update role.");
        }
    };

    return (
        <Container maxWidth="md" style={{ marginTop: "20px" }}>
            <Typography variant="h4" gutterBottom align="center">
                Users & Roles Management
            </Typography>

            {error && <Typography color="error">{error}</Typography>}

            {loading ? (
                <CircularProgress
                    style={{ display: "block", margin: "20px auto" }}
                />
            ) : (
                <Paper
                    elevation={3}
                    style={{ padding: "20px", borderRadius: "10px" }}
                >
                    <Typography variant="h5" gutterBottom>
                        Users List
                    </Typography>
                    <List>
                        {users.length > 0 ? (
                            users.map((user) => (
                                <ListItem key={user.id} divider>
                                    <Card
                                        style={{
                                            width: "100%",
                                            backgroundColor: "#f5f5f5",
                                            padding: "10px",
                                        }}
                                    >
                                        <CardContent>
                                            <Typography variant="h6">
                                                {user.username}
                                            </Typography>
                                            <Typography color="textSecondary">
                                                {user.email}
                                            </Typography>

                                            {editingUserId === user.id ? (
                                                <FormControl fullWidth>
                                                    <InputLabel>
                                                        Role
                                                    </InputLabel>
                                                    <Select
                                                        multiple
                                                        value={user.roles || []}
                                                        onChange={(e) =>
                                                            handleRoleChange(
                                                                user.id,
                                                                e.target.value
                                                            )
                                                        }
                                                    >
                                                        {roles.length > 0 ? (
                                                            roles.map(
                                                                (role) => (
                                                                    <MenuItem
                                                                        key={
                                                                            role
                                                                        }
                                                                        value={
                                                                            role
                                                                        }
                                                                    >
                                                                        {role}
                                                                    </MenuItem>
                                                                )
                                                            )
                                                        ) : (
                                                            <MenuItem value="">
                                                                No Roles
                                                                Available
                                                            </MenuItem>
                                                        )}
                                                    </Select>
                                                </FormControl>
                                            ) : (
                                                <Typography variant="body2">
                                                    Role:{" "}
                                                    <strong>
                                                        {user.roles.join(
                                                            ", "
                                                        ) || "No Role Assigned"}
                                                    </strong>
                                                </Typography>
                                            )}
                                        </CardContent>
                                        <div
                                            style={{
                                                padding: "10px",
                                                textAlign: "right",
                                            }}
                                        >
                                            {editingUserId === user.id ? (
                                                <IconButton
                                                    color="primary"
                                                    onClick={() =>
                                                        saveRoleUpdate(user.id)
                                                    }
                                                >
                                                    <SaveIcon />
                                                </IconButton>
                                            ) : (
                                                <IconButton
                                                    color="secondary"
                                                    onClick={() =>
                                                        setEditingUserId(
                                                            user.id
                                                        )
                                                    }
                                                >
                                                    <EditIcon />
                                                </IconButton>
                                            )}
                                        </div>
                                    </Card>
                                </ListItem>
                            ))
                        ) : (
                            <Typography align="center">
                                No users found.
                            </Typography>
                        )}
                    </List>
                </Paper>
            )}

            <Typography variant="h5" style={{ marginTop: "30px" }}>
                Add a New User
            </Typography>

            <Paper
                elevation={3}
                style={{
                    padding: "20px",
                    marginTop: "15px",
                    borderRadius: "10px",
                }}
            >
                <TextField
                    fullWidth
                    label="Username"
                    variant="outlined"
                    value={newUser.username}
                    onChange={(e) =>
                        setNewUser({ ...newUser, username: e.target.value })
                    }
                    margin="normal"
                />
                <TextField
                    fullWidth
                    label="Email"
                    variant="outlined"
                    type="email"
                    value={newUser.email}
                    onChange={(e) =>
                        setNewUser({ ...newUser, email: e.target.value })
                    }
                    margin="normal"
                />
                <TextField
                    fullWidth
                    label="Password"
                    variant="outlined"
                    type="password"
                    value={newUser.password}
                    onChange={(e) =>
                        setNewUser({ ...newUser, password: e.target.value })
                    }
                    margin="normal"
                />

                <FormControl fullWidth margin="normal">
                    <InputLabel>Role</InputLabel>
                    <Select
                        multiple
                        value={newUser.roles}
                        onChange={(e) =>
                            setNewUser({
                                ...newUser,
                                roles: e.target.value,
                            })
                        }
                    >
                        {roles.length > 0 ? (
                            roles.map((role) => (
                                <MenuItem key={role} value={role}>
                                    {role}
                                </MenuItem>
                            ))
                        ) : (
                            <MenuItem value="">No Roles Available</MenuItem>
                        )}
                    </Select>
                </FormControl>

                <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    style={{ marginTop: "10px" }}
                    onClick={handleAddUser}
                >
                    Add User
                </Button>
            </Paper>
        </Container>
    );
}
