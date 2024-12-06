import React, { useState } from "react";
import { TextField } from "@mui/material";

interface SearchFieldWithMicProps {
  handleSearch: (value: string) => void;
  text: string;
  setText: React.Dispatch<React.SetStateAction<string>>;
}

const SearchFieldWithMic: React.FC<SearchFieldWithMicProps> = ({ handleSearch, text, setText }) => {
  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      handleSearch(text); // Pass the current search text
    }
  };

  return (
    <TextField
      value={text}
      onChange={(e) => setText(e.target.value)}
      onKeyDown={handleKeyDown}
      placeholder="Search..."
      fullWidth
      variant="outlined"
      sx={{
        marginBottom: "16px",
        backgroundColor: "#fff",
      }}
    />
  );
};

export default SearchFieldWithMic;
