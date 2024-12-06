import React from "react";
import { Box, TextField, Grid, Checkbox, FormControlLabel } from "@mui/material";

interface Column {
  name: string;
  type: string;
}

interface RecordFormProps {
  columns: Column[];
  onSubmit?: (record: { [key: string]: string | boolean | File | null }) => void; // No buttons here, so `onSubmit` is optional
  onChange?: (record: { [key: string]: string | boolean | File | null }) => void;
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

const RecordForm: React.FC<RecordFormProps> = ({ columns, onChange }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, files, type, checked } = e.target;
    const updatedState = {
      [name]: type === "file" ? (files ? files[0] : null) : type === "checkbox" ? checked : value,
    };
    if (onChange) {
      onChange(updatedState);
    }
  };

  return (
    <Box
    sx={{           
        backgroundColor: "#f9fafb",
          height: "100%",
          padding: "16px",
          boxShadow: "0px 1px 3px rgba(0,0,0,0.1)", }}> {/* Added padding */}
      <Grid container spacing={3}>
        {columns.map((column) => {
          if (column.type.toUpperCase() === "BOOLEAN") {
            return (
              <Grid item xs={12} key={column.name}>
                <FormControlLabel
                  control={<Checkbox name={column.name} onChange={handleChange} />}
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
                placeholder={column.type.toUpperCase() === "BLOB" ? "Upload a file" : ""}
              />
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
};

export default RecordForm;
