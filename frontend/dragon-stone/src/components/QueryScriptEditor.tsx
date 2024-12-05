import React, { useState } from "react";
import { Box, Button, TextField, Typography, IconButton } from "@mui/material";
import { ExpandMore, ExpandLess } from "@mui/icons-material";

interface QueryScriptEditorProps {
  onExecute: (script: string) => void;
}

const QueryScriptEditor: React.FC<QueryScriptEditorProps> = ({ onExecute }) => {
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [script, setScript] = useState("");

  const handleExecute = () => {
    onExecute(script);
  };

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <Box
      sx={{
        marginBottom: "16px",
        border: "1px solid #ddd",
        borderRadius: "4px",
        backgroundColor: "#fff",
        boxShadow: "0px 1px 3px rgba(0, 0, 0, 0.1)",
      }}
    >
      {/* Collapsible Header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "8px 16px",
          cursor: "pointer",
        }}
        onClick={toggleCollapse}
      >
        <Typography variant="h6" sx={{ fontWeight: 500 }}>
          Query
        </Typography>
        <IconButton size="small">
          {isCollapsed ? <ExpandMore /> : <ExpandLess />}
        </IconButton>
      </Box>

      {/* Collapsible Content */}
      {!isCollapsed && (
        <Box sx={{ padding: "16px" }}>
          <TextField
            value={script}
            onChange={(e) => setScript(e.target.value)}
            placeholder="Write your SQL query here..."
            multiline
            rows={5}
            fullWidth
            sx={{
              marginBottom: "16px",
              backgroundColor: "#f9fafb",
              borderRadius: "4px",
            }}
          />
          <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleExecute}
              sx={{
                textTransform: "none",
              }}
            >
              Execute
            </Button>
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default QueryScriptEditor;
