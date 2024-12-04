import React, { useState } from "react";
import { List, ListItem, ListItemButton, ListItemIcon, ListItemText } from "@mui/material";
import { useGetCollections } from "../hooks/useGetCollections";
import { Folder } from "@mui/icons-material";

interface CollectionsListProps {
  onSelectCollection: (collectionName: string) => void;
}

export default function CollectionsList({ onSelectCollection }: CollectionsListProps) {
  const { data: collections, isLoading, isError } = useGetCollections();
  const [selectedCollection, setSelectedCollection] = useState<string | null>(null);

  const handleSelect = (collectionName: string) => {
    setSelectedCollection(collectionName);
    onSelectCollection(collectionName); // Notify the parent about the selection
  };

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Error fetching collections.</p>;

  return (
    <List>
      {collections &&
        collections.map((collection, index) => (
          <ListItem key={index} disablePadding>
            <ListItemButton
              selected={selectedCollection === collection.name} // Highlight if selected
              onClick={() => handleSelect(collection.name)}
              sx={{
                backgroundColor: selectedCollection === collection.name ? "#e0f7fa" : "transparent",
                "&:hover": {
                  backgroundColor: "#b2ebf2",
                },
              }}
            >
              <ListItemIcon>
                <Folder />
              </ListItemIcon>
              <ListItemText primary={collection.name} />
            </ListItemButton>
          </ListItem>
        ))}
    </List>
  );
}
