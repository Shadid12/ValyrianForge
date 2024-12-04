import React, { useState } from "react";
import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  TextField,
  Button,
} from "@mui/material";
import { Folder, Add } from "@mui/icons-material";
import PeopleIcon from "@mui/icons-material/People";
import CollectionsList from "../components/CollectionsList";

export default function CollectionsPage() {
  const [systemOpen, setSystemOpen] = useState(false);

  // Sample collections data
  const collections = [
    { id: 1, name: "users", icon: <PeopleIcon /> },
    { id: 2, name: "messages", icon: <Folder /> },
    { id: 3, name: "pages", icon: <Folder /> },
    { id: 4, name: "posts", icon: <Folder /> },
    { id: 5, name: "messagesReport", icon: <Folder /> },
  ];

  const handleSystemToggle = () => {
    setSystemOpen(!systemOpen);
  };

  return (
    <Box
      sx={{
        width: "300px",
        backgroundColor: "#f9fafb",
        height: "100vh",
        padding: "16px",
        boxShadow: "0px 1px 3px rgba(0,0,0,0.1)",
      }}
    >
      {/* Search Bar */}
      <TextField
        placeholder="Search collections..."
        variant="outlined"
        size="small"
        fullWidth
        sx={{ marginBottom: "16px" }}
      />

      {/* Collections List */}
      <CollectionsList />
      <List>
        {collections.map((collection) => (
          <ListItem key={collection.id} disablePadding>
            <ListItemButton>
              <ListItemIcon>{collection.icon}</ListItemIcon>
              <ListItemText primary={collection.name} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      {/* New Collection Button */}
      <Box sx={{ position: "absolute", bottom: "16px", width: "calc(100% - 32px)" }}>
        <Button
          variant="outlined"
          startIcon={<Add />}
          sx={{
            textTransform: "none",
            borderColor: "#d1d5db",
            color: "#374151",
            "&:hover": {
              borderColor: "#9ca3af",
              backgroundColor: "#f3f4f6",
            },
          }}
        >
          New Collection
        </Button>
      </Box>
    </Box>
  );
}
