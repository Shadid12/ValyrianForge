import React from "react";
import { Box, Button, TextField, Typography, IconButton, Collapse } from "@mui/material";
import { ExpandMore, ExpandLess, QueryBuilder } from "@mui/icons-material";

interface QueryScriptEditorProps {
  onExecute: () => void;
  isCollapsed: boolean;
  toggleCollapse: () => void;
  script: string;
  setScript: React.Dispatch<React.SetStateAction<string>>;
  prompt: string;
}

const QueryScriptEditor: React.FC<QueryScriptEditorProps> = ({
  onExecute,
  isCollapsed,
  toggleCollapse,
  script,
  setScript,
  prompt,
}) => {
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
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <QueryBuilder sx={{ marginRight: "8px", color: "#6b7280" }} />
          <Typography variant="h6" sx={{ fontWeight: 500 }}>
            Query
          </Typography>
        </Box>
        <IconButton size="small">
          {isCollapsed ? <ExpandMore /> : <ExpandLess />}
        </IconButton>
      </Box>

      {/* Collapsible Content */}
      <Collapse in={!isCollapsed} timeout="auto">
        <Box sx={{ padding: "16px", transition: "all 300ms ease-in-out" }}>
          {/* Code Display Area */}
          <Box
            component="textarea"
            readOnly
            value={"✗ "+prompt} // Static prompt text
            sx={{
              width: "100%",
              padding: "16px 0px 0px 16px",
              backgroundColor: "#f5f7fa",
              color: "#374151",
              fontFamily: "monospace",
              border: "1px solid #e5e7eb",
              borderRadius: "4px",
              marginBottom: "16px",
              resize: "none", // Prevent resizing
              overflow: "hidden",
            }}
          />

          {/* Query Input Area */}
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

          {/* Execute Button */}
          <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
            <Button
              variant="contained"
              color="primary"
              onClick={onExecute}
              sx={{
                textTransform: "none",
              }}
            >
              Execute
            </Button>
          </Box>
        </Box>
      </Collapse>
    </Box>
  );
};

export default QueryScriptEditor;
