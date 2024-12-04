import { BrowserRouter as Router, Routes, Route, NavLink } from "react-router-dom";
import { Box, CssBaseline, Drawer, List, ListItem, ListItemButton, ListItemIcon } from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import CollectionsIcon from "@mui/icons-material/Collections";
import SettingsIcon from "@mui/icons-material/Settings";
import CollectionsPage from "./pages/CollectionsPage";

const primaryDrawerWidth = 80; // Adjusted width to fit icons and provide enough clickable area

function Home() {
  return <h1 style={{ color: "blue" }}>Welcome to Home!</h1>;
}


function Settings() {
  return <h1 style={{ color: "red" }}>Settings Page</h1>;
}

function App() {
  return (
    <Router>
      <Box sx={{ display: "flex" }}>
        <CssBaseline />

        {/* Primary Sidebar */}
        <Drawer
          variant="permanent"
          sx={{
            width: primaryDrawerWidth,
            flexShrink: 0,
            [`& .MuiDrawer-paper`]: {
              width: primaryDrawerWidth,
              boxSizing: "border-box",
              bgcolor: "black", // Set the background to black
              color: "white", // Text and icon color
            },
          }}
        >
          <List sx={{ display: "flex", flexDirection: "column", alignItems: "center", padding: 0 }}>
            {/* Navigation with Icons */}
            <ListItem disablePadding sx={{ justifyContent: "center" }}>
              <ListItemButton
                component={NavLink}
                to="/"
                style={({ isActive }) =>
                  isActive
                    ? { backgroundColor: "#424242", borderRadius: "8px", width: "60px" }
                    : { borderRadius: "8px", width: "60px" }
                }
                sx={{ justifyContent: "center", padding: 1 }}
              >
                <ListItemIcon sx={{ color: "white", minWidth: "auto" }}>
                  <HomeIcon />
                </ListItemIcon>
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding sx={{ justifyContent: "center" }}>
              <ListItemButton
                component={NavLink}
                to="/collections"
                style={({ isActive }) =>
                  isActive
                    ? { backgroundColor: "#424242", borderRadius: "8px", width: "60px" }
                    : { borderRadius: "8px", width: "60px" }
                }
                sx={{ justifyContent: "center", padding: 1 }}
              >
                <ListItemIcon sx={{ color: "white", minWidth: "auto" }}>
                  <CollectionsIcon />
                </ListItemIcon>
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding sx={{ justifyContent: "center" }}>
              <ListItemButton
                component={NavLink}
                to="/settings"
                style={({ isActive }) =>
                  isActive
                    ? { backgroundColor: "#424242", borderRadius: "8px", width: "60px" }
                    : { borderRadius: "8px", width: "60px" }
                }
                sx={{ justifyContent: "center", padding: 1 }}
              >
                <ListItemIcon sx={{ color: "white", minWidth: "auto" }}>
                  <SettingsIcon />
                </ListItemIcon>
              </ListItemButton>
            </ListItem>
          </List>
        </Drawer>

        {/* Main Content */}
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: 3,
            bgcolor: "#f9f9f9",
            minHeight: "100vh",
          }}
        >
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/collections" element={<CollectionsPage />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </Box>
      </Box>
    </Router>
  );
}

export default App;
