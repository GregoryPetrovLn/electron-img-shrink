const createCustomMenu = (appName, isMac, isDev, createAboutWindow) => [
  ...(isMac
    ? [
        {
          label: appName,
          submenu: [{ label: 'About', click: createAboutWindow }],
        },
      ]
    : []),
  { role: 'fileMenu' },
  ...(!isMac
    ? [
        {
          label: 'Help',
          submenu: [{ label: 'About', click: createAboutWindow }],
        },
      ]
    : []),
  ...(isDev
    ? [
        {
          label: 'Developer',
          submenu: [
            { role: 'reload' },
            { role: 'forcereload' },
            { type: 'separator' },
            { role: 'toggledevtools' },
          ],
        },
      ]
    : []),
];

module.exports = createCustomMenu;
