import React, { useState } from "react";
import { Box, Typography, Button } from "@mui/material";
import SearchFieldWithMic from "./SearchFieldWithMic";
import { DataTables } from "./DataTables.jsx";
import AddRecordDrawer from "./AddRecordDrawer";
import { GetTableByNameResponse } from "../apis/types.js";

interface SelectedCollectionDetailsProps {
  loading: boolean;
  error: string | null;
  collectionDetails: GetTableByNameResponse | null;
}

const SelectedCollectionDetails: React.FC<SelectedCollectionDetailsProps> = ({
  loading,
  error,
  collectionDetails,
}) => {
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleDrawerOpen = () => {
    setDrawerOpen(true);
  };

  const handleDrawerClose = () => {
    setDrawerOpen(false);
  };

  return (
    <Box sx={{ 
      backgroundColor: "#f9fafb",
      height: "99.9%",
      padding: "32px 32px",
      margin: "0px 16px",
      boxShadow: "0px 1px 3px rgba(0,0,0,0.1)",
      position: "relative",
     }}>
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        {/* Title Section */}
        <Typography variant="subtitle1" sx={{ display: "flex", alignItems: "center" }}>
          <Typography
            component="span"
            sx={{ color: "#6b7280", marginRight: "4px", fontWeight: 500 }}
          >
            Collections /
          </Typography>
          <Typography component="span" sx={{ fontWeight: 700 }}>
            {collectionDetails?.table_name || "Select a collection"}
          </Typography>
        </Typography>

        {/* Button Section */}
        <Button
          style={{
            marginBottom: "16px"
          }}
          variant="contained"
          sx={{
            textTransform: "none",
            backgroundColor: "#111827",
            color: "#ffffff",
            "&:hover": {
              backgroundColor: "#1f2937",
            },
          }}
          startIcon={<span style={{ fontSize: "1.25rem"}}>+</span>}
          onClick={handleDrawerOpen}
        >
          New record
        </Button>
      </Box>

      {/* Search Box */}
      <SearchFieldWithMic />

      {loading ? (
        <Box sx={{ textAlign: "center", padding: "16px" }}>
          <Typography>Loading...</Typography>
        </Box>
      ) : error ? (
        <Box sx={{ textAlign: "center", padding: "16px" }}>
          <Typography color="error">{error}</Typography>
        </Box>
      ) : !collectionDetails ? (
        <Box sx={{ textAlign: "center", padding: "16px" }}>
          <Typography>Select a collection to see its details.</Typography>
        </Box>
      ) : <DataTables />}

      {/* AddRecordDrawer */}
      {collectionDetails && (
        <AddRecordDrawer 
        tableName={collectionDetails.table_name}
          open={drawerOpen} 
          onClose={handleDrawerClose} 
          columns={collectionDetails.columns}
        />
      )}
    </Box>
  );
};

export default SelectedCollectionDetails;
