const { ipcRenderer } = require("electron");
const { $ } = require("./helper.js");

$("add-music-button").addEventListener("click", () => {
  ipcRenderer.send("add-music-window");
});
