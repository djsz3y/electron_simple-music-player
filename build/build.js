const { exec } = require("child_process");
const rimraf = require("rimraf");

// 删除 dist 目录
rimraf.sync("dist");
console.log("dist directory deleted");

// 运行 electron-builder
exec("electron-builder", (error, stdout, stderr) => {
  if (error) {
    console.error(`exec error: ${error}`);
    return;
  }
  console.log(`electron-builder stdout: ${stdout}`);
  console.error(`electron-builder stderr: ${stderr}`);
  console.log("Build process completed");
});
