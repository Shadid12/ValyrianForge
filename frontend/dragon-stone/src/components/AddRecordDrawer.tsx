import React, { useState, useEffect } from "react";
import { Drawer, Box, CircularProgress, Alert, Typography, Divider, Button } from "@mui/material";
import { Column } from "../apis/types";
import RecordForm from "./forms/RecordForm";
import JsonPreview from "./forms/JsonPreview";
import useCreateRecords from "../hooks/useCreateRecords";

interface AddRecordDrawerProps {
  open: boolean;
  onClose: () => void;
  columns: Column[];
  tableName: string; // Name of the table for record creation
}

const AddRecordDrawer: React.FC<AddRecordDrawerProps> = ({ open, onClose, columns, tableName }) => {
  const [formState, setFormState] = useState<{ [key: string]: string | boolean | File | null }>({});
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Reset error message when the drawer is closed
  useEffect(() => {
    if (!open) {
      setErrorMessage(null);
    }
  }, [open]);

  const { mutate: createRecord, isPending } = useCreateRecords({
    tableName,
    onSuccess: () => {
      setErrorMessage(null); // Clear error state
      onClose(); // Close the drawer
    },
    onError: (error: any) => {
      setErrorMessage(error.message || "Failed to create record.");
    },
  });

  const handleFormSubmit = (record: { [key: string]: string | boolean | File | null }) => {
    setErrorMessage(null);

    const formattedRecord: { [key: string]: string | number | boolean } = {};
    Object.keys(record).forEach((key) => {
      const value = record[key];
      if (value !== null) {
        formattedRecord[key] = value instanceof File ? value.name : value;
      }
    });

    createRecord(formattedRecord);
  };

  const handleFormChange = (updatedState: { [key: string]: string | boolean | File | null }) => {
    setFormState(updatedState);
  };

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      sx={{
        "& .MuiDrawer-paper": {
          width: "50vw",
          padding: 2,
          justifyContent: "space-between",
        },
      }}
    >
      <Box sx={{ padding: 2 }}>
        <Typography variant="h5" sx={{ marginBottom: 2 }}>
          {tableName}
        </Typography>
        <Divider />
        <Box sx={{ marginTop: 2 }}>
          {/* RecordForm */}
          <RecordForm
            onSubmit={handleFormSubmit}
            columns={columns}
            onChange={handleFormChange}
          />
        </Box>

        {isPending && (
          <Box sx={{ textAlign: "center", marginTop: 4 }}>
            <CircularProgress />
            <Typography variant="body2" color="textSecondary">
              Creating record...
            </Typography>
          </Box>
        )}

        {errorMessage && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {errorMessage}
          </Alert>
        )}

        <JsonPreview data={formState} />
      </Box>

      <Box
        sx={{
          borderTop: "1px solid #ddd",
          padding: 2,
          display: "flex",
          justifyContent: "flex-end",
          gap: 2,
          backgroundColor: "#fff", // Original color restored
        }}
      >
        <Button
          variant="outlined"
          onClick={onClose}
          sx={{
            fontSize: "1rem",
            padding: "10px 20px",
          }}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={() => handleFormSubmit(formState)}
          disabled={isPending}
          sx={{
            fontSize: "1rem",
            padding: "10px 20px",
          }}
        >
          {isPending ? "Submitting..." : "Submit"}
        </Button>
      </Box>
    </Drawer>
  );
};

export default AddRecordDrawer;
