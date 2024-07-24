const { app, BrowserWindow, ipcMain, dialog } = require("electron");
// const path = require("node:path");

// import Store from "electron-store";
(async () => {
  const { default: Store } = await import("electron-store");
  // const Store = require('electron-store')

  const store = new Store();
  console.log(app.getPath("userData")); // C:\Users\shiji\AppData\Roaming\simple-music-player
  store.set("unicorn", "🦄");
  console.log(store.get("unicorn"));
  //=> '🦄'

  // Use dot-notation to access nested properties
  store.set("foo.bar", true);
  console.log(store.get("foo"));
  // => {bar: true}

  store.delete("unicorn");
  console.log(store.get("unicorn"));
  // => undefined
})();

class AppWindow extends BrowserWindow {
  constructor(config, fileLocation) {
    const basicConfig = {
      width: 800,
      height: 600,
      webPreferences: {
        // // 为了访问渲染器中的Node.js的某些功能，我们在 BrowserWindow 的构造函数上附加了一个预加载脚本。
        //   preload: path.join(__dirname, "preload.js"),
        nodeIntegration: true,
        contextIsolation: false,
      },
      show: false,
    };
    // const finalConfig = Object.assign(basicConfig, config);
    const finalConfig = { ...basicConfig, ...config };
    super(finalConfig);

    // 加载 index.html
    this.loadFile(fileLocation);

    // 优雅地显示窗口
    this.once("ready-to-show", () => {
      this.show();
    });
  }
}

const createWindow = () => {};

app.on("ready", () => {
  // createWindow();

  // Create the browser window.
  const mainWindow = new AppWindow({}, "./renderer/index.html");

  // 打开开发工具
  // mainWindow.webContents.openDevTools()

  ipcMain.on("add-music-window", () => {
    const addWindow = new AppWindow(
      {
        width: 500,
        height: 400,
        parent: mainWindow,
      },
      "./renderer/add.html"
    );
  });
  ipcMain.on("open-music-file", (event) => {
    dialog
      .showOpenDialog({
        filters: [{ name: "Music", extensions: ["mp3"] }],
        properties: ["openFile", "multiSelections"],
      })
      .then((files) => {
        if (files && files.filePaths) {
          // 没有 event.sender.send 方法！
          // event.sender.send("selected-file", files.filePaths);
          event.reply("selected-file", files.filePaths);
        }
      });
  });
});

// // 这段程序将会在 Electron 结束初始化
// // 和创建浏览器窗口的时候调用
// // 部分 API 在 ready 事件触发后才能使用。
// app.whenReady().then(() => {
//   // 打开您的窗口，Electron 中，只有在 app 模块的 ready 事件被激发后才能创建浏览器窗口
//   createWindow();

//   // 如果没有窗口打开则打开一个窗口 (macOS)
//   app.on("activate", () => {
//     // 在 macOS 系统内, 如果没有已开启的应用窗口
//     // 点击托盘图标时通常会重新创建一个新窗口
//     if (BrowserWindow.getAllWindows().length === 0) createWindow();
//   });
// });

// // 除了 macOS 外，当所有窗口都被关闭的时候退出程序。 因此, 通常
// // 对应用程序和它们的菜单栏来说应该时刻保持激活状态,
// // 直到用户使用 Cmd + Q 明确退出
// app.on("window-all-closed", () => {
//   // 关闭所有窗口时退出应用 (Windows & Linux)
//   if (process.platform !== "darwin") app.quit();
// });

// // 在当前文件中你可以引入所有的主进程代码
// // 也可以拆分成几个文件，然后用 require 导入。
