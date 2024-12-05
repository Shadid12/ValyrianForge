import React, { useState } from "react";
import { Add } from "@mui/icons-material";
import { Box, Button, TextField } from "@mui/material";
import CollectionsList from "../components/CollectionsList";
import AddCollectionDrawer from "../components/AddCollectionDrawer";
import { GetTableByNameResponse } from "../apis/types";
import CollectionsApi from "../apis/CollectionsApi";
import CollectionDetails from "../components/CollectionDetails";

const CollectionsPage: React.FC = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
  const [selectedCollection, setSelectedCollection] = useState<string | null>(null);
  const [collectionDetails, setCollectionDetails] = useState<GetTableByNameResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleOpenDrawer = () => {
    setIsDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
  };

  const handleSelectCollection = async (collectionName: string) => {
    setSelectedCollection(collectionName);
    setLoading(true);
    setError(null);

    try {
      const details = await CollectionsApi.getTableByName(collectionName);
      setCollectionDetails(details);
    } catch (err) {
      setError(`Failed to fetch collection details: ${(err as Error).message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ display: "flex", height: "100%" }}>
      {/* Sidebar */}
      <Box
        sx={{
          width: "300px",
          backgroundColor: "#f9fafb",
          height: "100%",
          padding: "16px",
          boxShadow: "0px 1px 3px rgba(0,0,0,0.1)",
          position: "relative",
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
        <CollectionsList onSelectCollection={handleSelectCollection} />

        {/* New Collection Button */}
        <Box
          sx={{
            position: "absolute",
            bottom: "16px",
            width: "calc(100% - 32px)",
          }}
        >
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
            onClick={handleOpenDrawer}
          >
            New Collection
          </Button>
        </Box>

        {/* Add Collection Drawer */}
        <AddCollectionDrawer open={isDrawerOpen} onClose={handleCloseDrawer} />
      </Box>

      {/* Selected Collection Details */}
      <Box
        sx={{
          flex: 1,
          overflowY: "auto",
        }}
      >
        {
          selectedCollection && <CollectionDetails
          loading={loading}
          error={error}
          collectionDetails={collectionDetails}
        />
        }

      </Box>
    </Box>
  );
};

export default CollectionsPage;
