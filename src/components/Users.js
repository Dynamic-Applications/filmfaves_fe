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
    Button,
} from "@mui/material";
import axios from "axios";
import "./Sign-In-Up.css";

const API_URL = process.env.REACT_APP_FILMFAVES_API || "http://localhost:4000";

export default function Users() {
    const [users, setUsers] = useState([]);
    const [roles, setRoles] = useState([]);
    const [visibleRoles, setVisibleRoles] = useState({});
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

                if (Array.isArray(rolesData)) {
                    setRoles(rolesData);
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
                await axios.put(
                    `${API_URL}/users/${userId}/assign-role`,
                    { userId, roleId },
                    { headers: { Authorization: `Bearer ${token}` } }
                );
            } else {
                await axios.put(
                    `${API_URL}/users/${userId}/unassign-role`,
                    { userId, roleId },
                    { headers: { Authorization: `Bearer ${token}` } }
                );
            }

            setUsers((prevUsers) =>
                prevUsers.map((user) =>
                    user.id === userId
                        ? {
                              ...user,
                              roles: checked
                                  ? [...user.roles, role]
                                  : user.roles.filter((r) => r !== role),
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

    const toggleRolesVisibility = (userId) => {
        setVisibleRoles((prev) => ({
            ...prev,
            [userId]: !prev[userId],
        }));
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
                                            <Typography
                                                // color="primary"
                                                color="textSecondary"
                                            >
                                                Email:{" "}
                                                <Typography
                                                    component="span"
                                                    color="primary"
                                                >
                                                    {user.email}
                                                </Typography>
                                            </Typography>
                                            <Typography color="textSecondary">
                                                Date Created:{" "}
                                                {new Date(
                                                    user.created_at
                                                ).toLocaleString("en-US", {
                                                    year: "numeric",
                                                    month: "long",
                                                    day: "numeric",
                                                    hour: "2-digit",
                                                    minute: "2-digit",
                                                    // second: "2-digit",
                                                    hour12: true,
                                                })}
                                            </Typography>

                                            {visibleRoles[user.id] ? (
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
                                            <Button
                                                variant="contained"
                                                color="primary"
                                                onClick={() =>
                                                    toggleRolesVisibility(
                                                        user.id
                                                    )
                                                }
                                            >
                                                {visibleRoles[user.id]
                                                    ? "Hide Roles"
                                                    : "Show Roles"}
                                            </Button>
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
