import React from "react";
import { Box } from "@mui/material";

interface JsonPreviewProps {
  data: { [key: string]: string | boolean | File | null };
}

const JsonPreview: React.FC<JsonPreviewProps> = ({ data }) => {
  const formatData = () => {
    const formatted = { ...data };

    // Replace File objects with their names for readability
    Object.keys(formatted).forEach((key) => {
      if (formatted[key] instanceof File) {
        formatted[key] = (formatted[key] as File).name || "Uploaded file";
      }
    });

    return formatted;
  };

  return (
    <Box
      component="pre"
      sx={{
        backgroundColor: "#f5f5f5",
        borderRadius: "4px",
        padding: "16px",
        overflow: "auto",
        maxHeight: "200px",
        whiteSpace: "pre-wrap",
      }}
    >
      {JSON.stringify(formatData(), null, 2)}
    </Box>
  );
};

export default JsonPreview;
