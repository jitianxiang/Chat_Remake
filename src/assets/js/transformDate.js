export const transformDate = (timestamp, flag) => {
  //参数time的形式为1970/1/1 上午8:00:11，此函数用于将其转化为 年 月 日
  function solveTime(time) {
    var aa = time.split(' ')
    var bb = aa[0].split('/')
    var formatTime = ''
    if (flag === 'listitem') {
      // formatTime = bb[0] + '/' + bb[1] + '/' + bb[2]
      let tempArr = aa[0].split('-')
      formatTime = tempArr[0] + '/' + tempArr[1] + '/' + tempArr[2]
    } else {
      var cc = aa[1].split(':')
      formatTime = bb[0] + '年' + bb[1] + '月' + bb[2] + '日' + ' ' + cc[0] + ':' + cc[1]
    }
    return formatTime;
  }

  //获取时-分
  function getTime(time) {
    var formatTime = '';
    //参数time的形式为1970/1/1 上午8:00:11，获取空格的索引值，直接输出
    var index = time.indexOf(' ') + 1;
    for (var i = index; i < time.length - 3; i++) {
      formatTime += time[i];
    }
    return formatTime;
  }

  var now = new Date(new Date().setHours(0, 0, 0, 0)).getTime() + 86400000;
  //时间戳给定为毫秒，除1000转化为秒，除3600转化为小时，24转化为天，计算输入时间和今天的时间差
  var timeDiff = (now - timestamp) / (24 * 3600 * 1000);
  var ftime = '';
  if (timeDiff > 7) {
    ftime = new Date(parseInt(timestamp)).toLocaleString();

    ftime = solveTime(ftime);

  } else if (timeDiff >= 2) {
    var week = new Date(parseInt(timestamp)).getDay();
    if (week === 0) {
      ftime = '星期日';
    } else if (week === 1) {
      ftime = '星期一';
    } else if (week === 2) {
      ftime = '星期二';
    } else if (week === 3) {
      ftime = '星期三';
    } else if (week === 4) {
      ftime = '星期四';
    } else if (week === 5) {
      ftime = '星期五';
    } else if (week === 6) {
      ftime = '星期六';
    }
    if (flag === 'chatlist') {
      ftime = ftime + ' ' + getTime(new Date(parseInt(timestamp)).toLocaleString())
    }
  } else if (timeDiff >= 1) { //距离今天小于2天大于1天，添加显示昨天
    ftime = '昨天';
    if (flag === 'chatlist') {
      ftime = ftime + ' ' + getTime(new Date(parseInt(timestamp)).toLocaleString())
    }
  } else {
    ftime = new Date(parseInt(timestamp)).toLocaleString();
    ftime = getTime(ftime);
    if (flag === 'picbowser') {
      ftime = '今天'
    }
  }
  // var giventime = new Date(parseInt(timestamp) * 1000).toLocaleString().replace(/年|月/g, '-').replace(/日/g, ' ').substr(0, 13)
  return ftime;
}
