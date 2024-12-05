import React from "react";
import { Drawer, Box, Typography } from "@mui/material";

interface AddRecordDrawerProps {
  open: boolean;
  onClose: () => void;
}

const AddRecordDrawer: React.FC<AddRecordDrawerProps> = ({ open, onClose }) => {
  return (
    <Drawer anchor="right" open={open} onClose={onClose}>
      <Box sx={{ width: 550, padding: 2 }}>
        <Typography variant="h6" gutterBottom>
          Add New Record
        </Typography>
        {/* Add your form or content here */}
      </Box>
    </Drawer>
  );
};

export default AddRecordDrawer;
