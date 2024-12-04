import React, { useState } from "react";
import {
  Drawer,
  TextField,
  Button,
  Typography,
  Divider,
  Box,
  Select,
  MenuItem,
  IconButton,
} from "@mui/material";
import { Add, Delete } from "@mui/icons-material";
import { Payload } from "../apis/types";
import { useCreateCollection } from "../hooks/useCreateCollection";

// SQLite column types
const sqliteColumnTypes = [
  "INTEGER",
  "TEXT",
  "BLOB",
  "REAL",
  "NUMERIC",
];

interface AddCollectionDrawerProps {
  open: boolean;
  onClose: () => void;
}

const AddCollectionDrawer: React.FC<AddCollectionDrawerProps> = ({ open, onClose }) => {
  const [collectionName, setCollectionName] = useState<string>("");
  const [columns, setColumns] = useState<{ name: string; type: string }[]>([
    { name: "", type: "TEXT" },
  ]);
  const [nameError, setNameError] = useState<string | null>(null);

  const { mutate: createCollection, isPending, isError, error } =
    useCreateCollection();

  const validateCollectionName = (name: string): boolean => {
    const regex = /^[a-zA-Z_][a-zA-Z0-9_]*$/; // Valid SQLite name pattern
    if (!regex.test(name)) {
      setNameError(
        "Invalid name. Must start with a letter or underscore, and contain only letters, numbers, or underscores."
      );
      return false;
    }
    setNameError(null);
    return true;
  };

  const handleAddColumn = () => {
    setColumns([...columns, { name: "", type: "TEXT" }]);
  };

  const handleRemoveColumn = (index: number) => {
    setColumns(columns.filter((_, i) => i !== index));
  };

  const handleColumnChange = (index: number, key: "name" | "type", value: string) => {
    const updatedColumns = [...columns];
    updatedColumns[index][key] = value;
    setColumns(updatedColumns);
  };

  const handleSaveCollection = () => {
    if (!validateCollectionName(collectionName)) {
      return;
    }

    const formattedColumns = columns.reduce((acc, column) => {
      if (column.name && column.type) {
        acc[column.name] = column.type;
      }
      return acc;
    }, {} as Record<string, string>);

    const payload: Payload = {
      table_name: collectionName,
      relationships: {}, // Adjust as needed for your backend
      columns: formattedColumns,
    };

    createCollection(payload);

    if(!isError){
      onClose();
      setCollectionName('');
      setColumns([]);
    }
  };

  const isSaveDisabled =
    !collectionName.trim() ||
    nameError !== null ||
    columns.length === 0 ||
    isPending;

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      sx={{
        "& .MuiDrawer-paper": {
          width: "300px",
          padding: "16px",
        },
      }}
    >
      <Typography variant="h6" gutterBottom>
        Add New Collection
      </Typography>

      {/* Collection Name Input */}
      <TextField
        label="Collection Name"
        variant="outlined"
        fullWidth
        value={collectionName}
        onChange={(e) => setCollectionName(e.target.value)}
        onBlur={() => validateCollectionName(collectionName)}
        error={Boolean(nameError)}
        helperText={nameError}
        sx={{ marginBottom: "16px" }}
      />

      {/* Columns Section */}
      <Typography variant="h6" gutterBottom>
        Columns
      </Typography>

      {columns.map((column, index) => (
        <Box
          key={index}
          display="flex"
          alignItems="center"
          gap="8px"
          sx={{ marginBottom: "8px" }}
        >
          {/* Column Name Input */}
          <TextField
            label="Column Name"
            variant="outlined"
            value={column.name}
            onChange={(e) => handleColumnChange(index, "name", e.target.value)}
            fullWidth
          />

          {/* Column Type Dropdown */}
          <Select
            value={column.type}
            onChange={(e) => handleColumnChange(index, "type", e.target.value)}
            sx={{ width: "120px" }}
          >
            {sqliteColumnTypes.map((type) => (
              <MenuItem key={type} value={type}>
                {type}
              </MenuItem>
            ))}
          </Select>

          {/* Remove Column Button */}
          <IconButton
            onClick={() => handleRemoveColumn(index)}
            color="error"
            size="small"
          >
            <Delete />
          </IconButton>
        </Box>
      ))}

      {/* Add Column Button */}
      <Button
        startIcon={<Add />}
        variant="outlined"
        fullWidth
        onClick={handleAddColumn}
        sx={{ marginBottom: "16px" }}
      >
        Add Column
      </Button>

      <Divider sx={{ margin: "16px 0" }} />

      {/* Save Collection Button */}
      <Button
        variant="contained"
        color="primary"
        fullWidth
        onClick={handleSaveCollection}
        disabled={isSaveDisabled}
      >
        {isPending ? "Saving..." : "Save Collection"}
      </Button>

      {isError && (
        <Typography color="error" sx={{ marginTop: "16px" }}>
          Error: {error?.message}
        </Typography>
      )}
    </Drawer>
  );
};

export default AddCollectionDrawer;
