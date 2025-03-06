import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    CircularProgress,
    Typography,
    Card,
    CardContent,
    Container,
    List,
    ListItem,
    Paper,
    FormControlLabel,
    Checkbox,
    IconButton,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import axios from "axios";
import "./Sign-In-Up.css";

const API_URL = process.env.REACT_APP_FILMFAVES_API || "http://localhost:4000";

export default function Users() {
    const [users, setUsers] = useState([]);
    const [roles, setRoles] = useState([]);
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

                console.log("Users Data", usersData);
                console.log("Roles Data", rolesData);

                if (Array.isArray(rolesData)) {
                    setRoles(rolesData); // Ensure roles are stored properly
                }

                setUsers(
                    Array.isArray(usersData)
                        ? usersData.map((user) => ({
                              ...user,
                              roles: Array.isArray(user.roles)
                                  ? user.roles
                                  : [],
                          }))
                        : []
                );
            } catch (error) {
                console.error("Error fetching data", error);
                setUsers([]);
                setRoles([]);
            }
            setLoading(false);
        };

        fetchData();
    }, [navigate]);

const roleIdMapping = {
    Admin: 1,
    User: 2,
    Guest: 3,
    "Super Admin": 4,
};

const handleRoleChange = async (userId, role, checked) => {
    console.log("Roles list at change time:", roles);
    console.log("Role to assign/unassign:", role);

    if (!roles || roles.length === 0) {
        console.error("Roles not loaded yet.");
        return;
    }

    if (!role) {
        console.error("Role is undefined or null.");
        return;
    }

    // Check if the role exists in the roles list (it's now a string array, so just check for role name directly)
    if (!roles.includes(role)) {
        console.error("Role not found in roles list.");
        return;
    }

    const token = localStorage.getItem("token");

    const roleId = roleIdMapping[role];
    if (!roleId) {
        console.error("Role ID not found for role:", role);
        return;
    }

    try {
        if (checked) {
            // Assign role
            console.log("Assigning role:", role);
            await axios.put(
                `${API_URL}/users/${userId}/assign-role`,
                { userId, roleId: roleId }, // Send userId and roleId
                { headers: { Authorization: `Bearer ${token}` } }
            );
        } else {
            // Unassign role
            console.log("Unassigning role:", role);
            await axios.put(
                `${API_URL}/users/${userId}/unassign-role`,
                { userId, roleId: roleId }, // Send userId and roleId
                { headers: { Authorization: `Bearer ${token}` } }
            );
        }

        // Update local state after role change
        setUsers((prevUsers) =>
            prevUsers.map((user) =>
                user.id === userId
                    ? {
                          ...user,
                          roles: checked
                              ? [...user.roles, role] // Add role name to list
                              : user.roles.filter((r) => r !== role), // Remove role name from list
                      }
                    : user
            )
        );
    } catch (error) {
        console.error(
            "Error updating role:",
            error.response?.data || error.message
        );
        setError(error.response?.data?.message || "Failed to update role.");
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
                    <Typography variant="h5" gutterBottom align="left">
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
                                                <>
                                                    <Typography variant="body1">
                                                        Select Roles:
                                                    </Typography>
                                                    {roles.length > 0 ? (
                                                        roles.map((role) => (
                                                            <FormControlLabel
                                                                key={role}
                                                                control={
                                                                    <Checkbox
                                                                        checked={user.roles.includes(
                                                                            role
                                                                        )}
                                                                        onChange={(
                                                                            e
                                                                        ) =>
                                                                            handleRoleChange(
                                                                                user.id,
                                                                                role,
                                                                                e
                                                                                    .target
                                                                                    .checked
                                                                            )
                                                                        }
                                                                        name={`role-${role}`}
                                                                        color="primary"
                                                                    />
                                                                }
                                                                label={role}
                                                            />
                                                        ))
                                                    ) : (
                                                        <Typography>
                                                            No roles available.
                                                        </Typography>
                                                    )}
                                                </>
                                            ) : (
                                                <Typography variant="body2">
                                                    Roles:{" "}
                                                    <strong>
                                                        {user.roles.length > 0
                                                            ? user.roles.join(
                                                                  ", "
                                                              )
                                                            : "No Roles Assigned"}
                                                    </strong>
                                                </Typography>
                                            )}
                                        </CardContent>
                                        <div style={{ textAlign: "right" }}>
                                            {editingUserId === user.id ? (
                                                <IconButton
                                                    color="primary"
                                                    onClick={() =>
                                                        setEditingUserId(null)
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
        </Container>
    );
}
