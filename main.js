const {
  app,
  BrowserWindow,
  Menu,
  globalShortcut,
  ipcMain,
  shell,
} = require('electron');
const shrinkImage = require('./service/shrinkImage');
const createCustomMenu = require('./service/createCustomMenu');
const path = require('path');
const os = require('os');
const imagemin = require('imagemin');
const imageminMozjpeg = require('imagemin-mozjpeg');
const imageminPngquant = require('imagemin-pngquant');
const slash = require('slash');
const log = require('electron-log');
//Set env
process.env.NODE_ENV = 'production';
const isDev = process.env.NODE_ENV === 'development';
const isMac = process.platform === 'darwin';
let mainWindow;
let aboutWindow;

function createMainWindow() {
  mainWindow = new BrowserWindow({
    title: 'ImageShrink',
    width: isDev ? 1000 : 500,
    height: 600,
    backgroundColor: 'white',
    icon: `${__dirname}/assets/icons/Icon_256x256.png`,
    resizable: isDev,
    webPreferences: {
      devTools: isDev,
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true,
      nodeIntegrationInWorker: true,
    },
  });
  mainWindow.loadURL(`file://${__dirname}/app/index.html`);
  isDev && mainWindow.webContents.openDevTools();
}

function createAboutWindow() {
  aboutWindow = new BrowserWindow({
    title: 'About ImageShrink',
    width: 1000,
    height: 500,
    backgroundColor: 'white',
    icon: `${__dirname}/assets/icons/Icon_256x256.png`,
    webPreferences: {
      devTools: isDev,
    },
  });
  aboutWindow.loadURL(`file://${__dirname}/app/about.html`);
}

app.on('ready', () => {
  createMainWindow();
  const mainMenu = Menu.buildFromTemplate(
    createCustomMenu(app.name, isMac, isDev, createAboutWindow)
  );
  Menu.setApplicationMenu(mainMenu);

  // globalShortcut.register('CmdOrCtrl+R', () => mainWindow.reload());
  mainWindow.on('closed', () => (mainWindow = null));
});

ipcMain.on('image:minimize', (e, options) => {
  options.dest = path.join(os.homedir().toString(), 'imageshrink');
  shrinkImage(options);
});

app.on('window-all-closed', () => {
  if (!isMac) app.quit();
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createMainWindow();
});

app.allowRenderProcessReuse = true;
