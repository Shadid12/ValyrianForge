import React, { useState } from "react";
import { Box, Typography, Button } from "@mui/material";
import QueryScriptEditor from "./QueryScriptEditor";
import AddRecordDrawer from "./AddRecordDrawer";
import { DataTables } from "./DataTables.jsx";
import SearchBox from "./SearchBox";
import usePrompt from "../hooks/usePrompt";

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
  const [prompt, setPrompt] = useState("");
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [script, setScript] = useState(""); // Updated state for script

  const { mutate: executePrompt, isPending: isPromptLoading, error: promptError } = usePrompt({
    onSuccess: (response) => {
      setScript(response); // Capture and set the returned SQL value
      console.log("Prompt executed successfully:", response);
    },
    onError: (error) => {
      console.error("Error executing prompt:", error);
    },
  });

  const handleDrawerOpen = () => {
    setDrawerOpen(true);
  };

  const handleDrawerClose = () => {
    setDrawerOpen(false);
  };

  const handleExecuteQuery = () => {
    console.log("Executing query script:", script);
  };

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchText(value);
    if (value !== prompt) {
      setHasUnsavedChanges(true);
    } else {
      setHasUnsavedChanges(false);
    }
  };

  const handleSearchSubmit = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      if (collectionDetails) {
        executePrompt({ prompt: searchText, collectionDetails });
        setPrompt(searchText);
        setHasUnsavedChanges(false);
        setIsCollapsed(false);
      } else {
        console.error("Collection details are not available.");
      }
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
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
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
        <Button
          style={{ marginBottom: "16px" }}
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

      {/* Use the new SearchBox component */}
      <SearchBox
        value={searchText}
        onChange={handleSearchChange}
        onSubmit={handleSearchSubmit}
        hasUnsavedChanges={hasUnsavedChanges}
      />

      {isPromptLoading && <Typography>Loading prompt results...</Typography>}
      {promptError && <Typography color="error">{promptError.message}</Typography>}

      <QueryScriptEditor
        prompt={prompt}
        onExecute={handleExecuteQuery}
        isCollapsed={isCollapsed}
        toggleCollapse={toggleCollapse}
        script={script} // Pass the script state
        setScript={setScript}
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
        <DataTables collectionDetails={collectionDetails} />
      )}

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
