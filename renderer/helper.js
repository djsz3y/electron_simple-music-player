exports.$ = (id) => {
  return document.getElementById(id);
};

/**
 * 转换持续时间
 * @param {number} time 秒
 * @returns 00:00 59:59
 */
exports.convertDuration = (time) => {
  // 计算分钟
  // ① 1.2 -> 1 ； 2.2 -> 2
  // ② 单数返回 '01'，多位数返回 '010'
  const minutes = "0" + Math.floor(time / 60);
  // 计算秒数 ① 单数返回 '01'，多位数返回 '010'
  const seconds = "0" + Math.floor(time - minutes * 60);
  // return minutes.substr(-2) + ":" + seconds.substr(-2);
  return minutes.slice(-2) + ":" + seconds.slice(-2); // 这里暂时不考虑 '0100' 时间很长的音乐
};
