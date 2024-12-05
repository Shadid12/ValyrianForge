import React, { useState, useEffect } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Card,
  Checkbox,
  FormControlLabel,
  Grid,
} from "@mui/material";

interface Column {
  name: string;
  type: string;
}

interface RecordFormProps {
  columns: Column[];
  onSubmit: (record: { [key: string]: string | boolean | File | null }) => void;
  onCancel: () => void;
  onChange?: (record: { [key: string]: string | boolean | File | null }) => void; // Optional onChange callback
}

const mapSqliteTypeToInputType = (type: string): string => {
  switch (type.toUpperCase()) {
    case "INTEGER":
      return "number";
    case "REAL":
      return "number";
    case "TEXT":
      return "text";
    case "BLOB":
      return "file";
    default:
      return "text";
  }
};

const RecordForm: React.FC<RecordFormProps> = ({ columns, onSubmit, onCancel, onChange }) => {
  const [formState, setFormState] = useState<{ [key: string]: string | boolean | File | null }>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, files, type, checked } = e.target;
    const updatedState = {
      ...formState,
      [name]: type === "file" ? (files ? files[0] : null) : type === "checkbox" ? checked : value,
    };
    setFormState(updatedState);
    if (onChange) {
      onChange(updatedState); // Pass updated state to the parent
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formState);
  };

  useEffect(() => {
    if (onChange) {
      onChange(formState);
    }
  }, [formState, onChange]);

  return (
    <Box sx={{
        padding: "16px",
        boxShadow: "0px 1px 3px rgba(0,0,0,0.1)"
    }} component="form" onSubmit={handleSubmit}>
        <Typography variant="h6" gutterBottom>
          New Users Record
        </Typography>
        <Grid container spacing={2}>
          {columns.map((column) => {
            if (column.type.toUpperCase() === "BOOLEAN") {
              return (
                <Grid item xs={12} key={column.name}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        name={column.name}
                        onChange={handleChange}
                        checked={Boolean(formState[column.name])}
                      />
                    }
                    label={column.name}
                  />
                </Grid>
              );
            }

            return (
              <Grid item xs={12} key={column.name}>
                <TextField
                  name={column.name}
                  label={column.name}
                  type={mapSqliteTypeToInputType(column.type)}
                  onChange={handleChange}
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                  placeholder={column.type.toUpperCase() === "BLOB" ? "Upload new file" : ""}
                />
              </Grid>
            );
          })}
        </Grid>
        <Box sx={{ display: "flex", justifyContent: "space-between", mt: 3 }}>
          <Button variant="outlined" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" variant="contained" color="primary">
            Create
          </Button>
        </Box>
    </Box>
  );
};

export default RecordForm;
