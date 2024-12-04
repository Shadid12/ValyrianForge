import React from "react";
import { Box, Typography, Button, TextField } from "@mui/material";

interface SelectedCollectionDetailsProps {
  loading: boolean;
  error: string | null;
  collectionDetails: { table_name: string; columns: { name: string; type: string }[] } | null;
}

const SelectedCollectionDetails: React.FC<SelectedCollectionDetailsProps> = ({
  loading,
  error,
  collectionDetails,
}) => {
  return (
    <Box sx={{ padding: "16px" }}>
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "16px",
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
          variant="contained"
          sx={{
            textTransform: "none",
            backgroundColor: "#111827",
            color: "#ffffff",
            "&:hover": {
              backgroundColor: "#1f2937",
            },
          }}
          startIcon={<span style={{ fontSize: "1.25rem" }}>+</span>}
        >
          New record
        </Button>
      </Box>

      {/* Search Box */}
      <TextField
        placeholder="Use natural language to aggregate your collection"
        variant="outlined"
        fullWidth
        sx={{
          marginBottom: "16px",
          fontSize: "1.25rem",
        }}
      />

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
      ) : (
        <Box>
          <Typography variant="h6" gutterBottom>
            {collectionDetails.table_name}
          </Typography>
          <Typography variant="subtitle1">Columns:</Typography>
          <ul>
            {collectionDetails.columns.map((column) => (
              <li key={column.name}>
                {column.name} ({column.type})
              </li>
            ))}
          </ul>
        </Box>
      )}
    </Box>
  );
};

export default SelectedCollectionDetails;
