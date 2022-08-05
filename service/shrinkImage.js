const shrinkImage = async ({ imgPath, quality, dest }) => {
  try {
    const pngQuality = quality / 100;
    await imagemin([slash(imgPath.toString())], {
      destination: dest,
      plugins: [
        imageminMozjpeg({ quality }),
        imageminPngquant({
          quality: [pngQuality, pngQuality],
        }),
      ],
    });
    shell.openPath(dest);
    log.info(dest);
    mainWindow.webContents.send('image:done');
  } catch (err) {
    log.error(err);
  }
};
module.exports = shrinkImage;
