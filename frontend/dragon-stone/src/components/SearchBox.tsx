import React from "react";
import { TextField } from "@mui/material";

interface SearchBoxProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  hasUnsavedChanges: boolean;
}

const SearchBox: React.FC<SearchBoxProps> = ({ value, onChange, onSubmit, hasUnsavedChanges }) => {
  return (
    <TextField
      value={value}
      onChange={onChange}
      onKeyDown={onSubmit}
      placeholder="Search..."
      fullWidth
      variant="outlined"
      sx={{
        marginBottom: "16px",
        backgroundColor: hasUnsavedChanges ? "#fef3c7" : "#fff",
        "& .MuiOutlinedInput-root": {
          "&:hover fieldset": {
            borderColor: hasUnsavedChanges ? "#f59e0b" : "inherit",
          },
        },
      }}
    />
  );
};

export default SearchBox;
