const { ipcRenderer } = require("electron");
const { $, convertDuration } = require("./helper.js");

let musicAudio = new Audio();
let allTracks;
let currentTrack;

$("add-music-button").addEventListener("click", () => {
  ipcRenderer.send("add-music-window");
});

const renderListHTML = (tracks) => {
  const tracksList = $("tracksList");
  const tracksListHTML = tracks.reduce((html, track) => {
    html += `<li class="row music-track list-group-item d-flex justify-content-between align-items-center">
      <div class="col-10">
        <i class="fas fa-music me-2 text-secondary"></i>
        <b>${track.fileName}</b>
      </div>
      <div class="col-2">
        <i class="fas fa-play me-3" data-id="${track.id}"></i>
        <i class="fas fa-trash-alt" data-id="${track.id}"></i>
      </div>
    </li>`;
    return html;
  }, "");
  const emptyTrackHTML =
    '<div class="alert alert-primary">还没有添加任何音乐</div>';
  tracksList.innerHTML = tracks.length
    ? `<ul class="list-group">${tracksListHTML}</ul>`
    : emptyTrackHTML;
};

/**
 *
 * @param {*} name 歌曲名称
 * @param {*} duration 歌曲长度
 */
const renderPlayerHTML = (name, duration) => {
  const player = $("player-status");
  const html = `<div class="col font-weight-bold">
                  正在播放：${name}
                </div>
                <div class="col">
                  <span id="current-seeker">00:00</span> / ${convertDuration(
                    duration
                  )}
                </div>`;
  player.innerHTML = html;
};
const updateProgressHTML = (currentTime, duration) => {
  // 计算 progress 是当前要解决的问题
  const progress = Math.floor((currentTime / duration) * 100);
  const bar = $("player-progress");
  bar.innerHTML = progress + "%";
  bar.style.width = progress + "%";
  const seeker = $("current-seeker");
  seeker.innerHTML = convertDuration(currentTime);
};
ipcRenderer.on("getTracks", (event, tracks) => {
  console.log("receive tracks", tracks);
  allTracks = tracks;
  renderListHTML(tracks);
});

// 添加 loadedmetadata 事件： loadedmetadata 以后，渲染播放器的状态。
musicAudio.addEventListener("loadedmetadata", () => {
  // 渲染播放器状态
  renderPlayerHTML(currentTrack.fileName, musicAudio.duration);
});

musicAudio.addEventListener("timeupdate", () => {
  // 更新播放器状态
  updateProgressHTML(musicAudio.currentTime, musicAudio.duration);
});

$("tracksList").addEventListener("click", (event) => {
  event.preventDefault();
  const { dataset, classList } = event.target;
  const id = dataset && dataset.id;
  if (id && classList.contains("fa-play")) {
    // 开始播放音乐
    if (currentTrack && currentTrack.id === id) {
      // 继续播放音乐
      musicAudio.play();
    } else {
      // 播放新的歌曲，注意还原之前的图标
      currentTrack = allTracks.find((track) => track.id === id);
      musicAudio.src = currentTrack.path;
      musicAudio.play();
      const resetIconElm = document.querySelector(".fa-pause");
      if (resetIconElm) {
        resetIconElm.classList.replace("fa-pause", "fa-play");
      }
    }
    classList.replace("fa-play", "fa-pause");
  } else if (id && classList.contains("fa-pause")) {
    // 处理暂停逻辑
    musicAudio.pause();
    classList.replace("fa-pause", "fa-play");
  } else if (id && classList.contains("fa-trash-alt")) {
    // 发送事件 删除这条音乐
    ipcRenderer.send("delete-track", id);
  }
});
