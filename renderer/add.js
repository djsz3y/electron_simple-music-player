const { ipcRenderer } = require("electron");
const { $ } = require("./helper.js");

$("select-music").addEventListener("click", () => {
  ipcRenderer.send("open-music-file");
});
