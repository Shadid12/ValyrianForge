import React, { useState } from "react";
import { Box, Typography, Button, TextField } from "@mui/material";
import QueryScriptEditor from "./QueryScriptEditor.js";
import AddRecordDrawer from "./AddRecordDrawer.js";
import { DataTables } from "./DataTables.jsx";

interface SelectedCollectionDetailsProps {
  loading: boolean;
  error: string | null;
  collectionDetails: { table_name: string; columns: any[] } | null;
}

const SelectedCollectionDetails: React.FC<SelectedCollectionDetailsProps> = ({
  loading,
  error,
  collectionDetails,
}) => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [prompt, setPrompt] = useState(""); // The prompt for QueryScriptEditor
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false); // To track unsaved changes
  const [isCollapsed, setIsCollapsed] = useState(true); // State for collapsing the editor
  const [script, setScript] = useState(""); // State for the query script

  const handleDrawerOpen = () => {
    setDrawerOpen(true);
  };

  const handleDrawerClose = () => {
    setDrawerOpen(false);
  };

  const handleExecuteQuery = () => {
    console.log("Executing query script:", script);
    // Add your query execution logic here
  };

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed); // Toggle the collapse state
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchText(value);
    if (value !== prompt) {
      setHasUnsavedChanges(true); // Indicate changes not yet applied
    } else {
      setHasUnsavedChanges(false); // Reset indicator if the text matches the prompt
    }
  };

  const handleSearchSubmit = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      setPrompt(searchText); // Update the prompt in QueryScriptEditor
      setHasUnsavedChanges(false); // Reset the unsaved changes indicator
      setIsCollapsed(false);
    }
  };

  return (
    <Box
      sx={{
        backgroundColor: "#f9fafb",
        height: "99.9%",
        padding: "32px 32px",
        margin: "0px 16px",
        boxShadow: "0px 1px 3px rgba(0,0,0,0.1)",
        position: "relative",
      }}
    >
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
            marginBottom: "16px",
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
          startIcon={<span style={{ fontSize: "1.25rem" }}>+</span>}
          onClick={handleDrawerOpen}
        >
          New record
        </Button>
      </Box>

      {/* Search Box */}
      <TextField
        value={searchText}
        onChange={handleSearchChange} // Track changes to the search text
        onKeyDown={handleSearchSubmit} // Handle Enter key to apply changes
        placeholder="Search..."
        fullWidth
        variant="outlined"
        sx={{
          marginBottom: "16px",
          backgroundColor: hasUnsavedChanges ? "#fef3c7" : "#fff", // Change color for unsaved changes
          "& .MuiOutlinedInput-root": {
            "&:hover fieldset": {
              borderColor: hasUnsavedChanges ? "#f59e0b" : "inherit", // Highlight border if unsaved
            },
          },
        }}
      />

      {/* Query Script Editor */}
      <QueryScriptEditor
        prompt={prompt}
        onExecute={handleExecuteQuery}
        isCollapsed={isCollapsed}
        toggleCollapse={toggleCollapse}
        script={script}
        setScript={setScript}
      />

      {/* Loading/Error/Content Section */}
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
