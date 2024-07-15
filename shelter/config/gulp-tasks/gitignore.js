import fs from 'fs';
export const gitignore = () => {
  if (!fs.existsSync('.gitignore')) {
    fs.writeFile('./.gitignore', '', cb);
    fs.appendFile('./.gitignore', 'package-lock.json\r\n', cb);
    fs.appendFile('./.gitignore', 'node_modules/\r\n', cb);
    fs.appendFile('./.gitignore', '.gitignore\r\n', cb);
    fs.appendFile('./.gitignore', 'dist/\r\n', cb);
    fs.appendFile('./.gitignore', 'source/\r\n', cb);
    fs.appendFile('./.gitignore', 'version.json\r\n', cb);
    fs.appendFile('./.gitignore', app.buildFolder + '\r\n', cb);
  }
  return app.gulp.src(`${app.path.srcFolder}`);
}
function cb() { }