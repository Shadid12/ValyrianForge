import React, { useState } from "react";
import { Box, Typography, Button } from "@mui/material";
import QueryScriptEditor from "./QueryScriptEditor";
import AddRecordDrawer from "./AddRecordDrawer";
import { DataTables } from "./DataTables";
import SearchBox from "./SearchBox";
import { useGetRecords } from "../hooks/useGetRecords";
import { usePrompt } from "../hooks/usePrompt";

interface SelectedCollectionDetailsProps {
  collectionDetails: { table_name: string; columns: any[] } | null;
}

const SelectedCollectionDetails: React.FC<SelectedCollectionDetailsProps> = ({
  collectionDetails,
}) => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [prompt, setPrompt] = useState("");
  const [promptText, setPromptText] = useState("");

  const [isCollapsed, setIsCollapsed] = useState(true);
  const [isQuery, setIsQuery] = useState(false);

  // Fetch initial records
  const {
    data: records,
    isLoading: isRecordsLoading,
    error: recordsError,
  } = useGetRecords(collectionDetails?.table_name || "");

  // Prompt hook to execute the query
  const {
    mutate: executePrompt,
    isPending: isPromptLoading,
    error: promptError,
  } = usePrompt({
    onSuccess: (response) => {
      setPrompt(response); // Capture and set the returned SQL value
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
    setIsQuery(true);
    // executePrompt({ prompt, collectionDetails });
  };

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchText(value);
  };

  const handleSearchSubmit = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      if (collectionDetails) {
        executePrompt({ prompt: searchText, collectionDetails });
        setPrompt(searchText);
        setIsCollapsed(false);
        setPromptText(searchText);
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

      <SearchBox
        value={searchText}
        onChange={handleSearchChange}
        onSubmit={handleSearchSubmit}
        hasUnsavedChanges={prompt !== searchText}
      />

      {isPromptLoading && <Typography>Loading prompt results...</Typography>}
      {promptError && <Typography color="error">Error executing prompt: {promptError.message}</Typography>}

      <QueryScriptEditor
        prompt={promptText}
        onExecute={handleExecuteQuery}
        isCollapsed={isCollapsed}
        toggleCollapse={toggleCollapse}
        script={prompt}
        setScript={setPrompt}
      />

      <DataTables
        collectionDetails={collectionDetails}
        isQuery={isQuery}
        prompt={prompt}
        data={records}
        isLoading={isRecordsLoading}
        error={recordsError}
      />

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
