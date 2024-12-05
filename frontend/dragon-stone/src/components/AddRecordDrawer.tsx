import React, { useState } from "react";
import { Drawer, Box } from "@mui/material";
import { Column } from "../apis/types";
import RecordForm from "./forms/RecordForm";
import JsonPreview from "./forms/JsonPreview";

interface AddRecordDrawerProps {
  open: boolean;
  onClose: () => void;
  columns: Column[];
}

const AddRecordDrawer: React.FC<AddRecordDrawerProps> = ({ open, onClose, columns }) => {
  const [formState, setFormState] = useState<{ [key: string]: string | boolean | File | null }>({});

  const handleFormSubmit = (record: { [key: string]: string | boolean | File | null }) => {
    console.log("New record submitted:", record);
    onClose(); // Close the drawer after submission
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
        },
      }}
    >
      <Box>
        {/* RecordForm */}
        <RecordForm
          onSubmit={handleFormSubmit}
          onCancel={onClose}
          columns={columns}
          onChange={handleFormChange} // Pass updated form state to the drawer
        />

        {/* JSON Preview */}
        <JsonPreview data={formState} />
      </Box>
    </Drawer>
  );
};

export default AddRecordDrawer;
