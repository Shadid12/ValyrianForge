import React, { useState } from "react";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import MicIcon from "@mui/icons-material/Mic";

declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

const SearchFieldWithMic: React.FC = () => {
  const [text, setText] = useState("");

  const startRecognition = () => {
    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onresult = (event: any) => {
      const result = event.results[0][0].transcript;
      setText(result);
    };

    recognition.onerror = (event: any) => {
      console.error("Speech recognition error", event);
    };

    recognition.start();
  };

  return (
    <TextField
      placeholder="Use natural language to aggregate your collection"
      variant="outlined"
      fullWidth
      value={text}
      onChange={(e) => setText(e.target.value)}
      sx={{
        marginBottom: "16px",
        fontSize: "1.25rem",
      }}
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            <IconButton edge="end" onClick={startRecognition}>
              <MicIcon />
            </IconButton>
          </InputAdornment>
        ),
      }}
    />
  );
};

export default SearchFieldWithMic;
