import { app, BrowserWindow } from 'electron';
import path from 'path';
import { fileURLToPath } from 'url';

// Fix for __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let mainWindow;

const isDev = process.env.NODE_ENV === 'development'; // Check if running in development mode
const devServerURL = 'http://localhost:5174'; // React app development server URL

app.on('ready', () => {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'), // Ensure preload.js exists
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  // Load the appropriate content based on the environment
  if (isDev) {
    mainWindow.loadURL(devServerURL); // Load the React development server
  } else {
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html')); // Load the built React app
  }
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
