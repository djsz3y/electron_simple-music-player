const Store = require("electron-store");
const uuidv4 = require("uuid/v4");
const path = require("path");

class DataStore extends Store {
  constructor(settings) {
    super(settings);

    // 1.保存所有音乐文件的信息
    this.tracks = this.get("tracks") || [];
  }
  // 2.保存音乐文件的数据
  saveTracks() {
    this.set("tracks", this.tracks);
    return this;
  }
  // 3.获取音乐信息
  getTracks() {
    return this.get("tracks") || [];
  }
  /**
   * 4.功能：音乐信息/track信息添加到数据当中去
   * 步骤：
   *  1.先获得复杂的数据结构，
   *  2.通过 filter 去掉已经存在的获得一个新的数组，
   *  3.然后安插到 tracks 数组后面。
   * @param {*} tracks
   * @returns
   */
  addTracks(tracks) {
    // 5.除了path信息，还希望有其他信息
    // 6.obj 包括 id区分不同音乐 path pathname 去重-有相同文件不添加
    const tracksWithProps = tracks
      .map((track) => {
        return {
          id: uuidv4(), // 7.uuid 生成独一无二的 uuid
          path: track,
          fileName: path.basename(track), // 8.文件名，借助 nodejs 的 path 模块
        };
      })
      .filter((track) => {
        // 9.去重
        const currentTracksPath = this.getTracks().map((track) => track.path);
        return currentTracksPath.indexOf(track.path) < 0;
      });
    this.tracks = [...this.tracks, ...tracksWithProps]; // 10.原来的 tracks 和新的 tracks 就是新的曲库
    return this.saveTracks();
  }
}

// 11.最后导出
module.exports = DataStore;
