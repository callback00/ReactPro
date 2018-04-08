// webworker 具体应用，每隔10秒钟读取一次系统日志，并返回给前端。worker不能操作dom。
var i = 0;

function timedCount() {
    i = i + 1;
    postMessage(i);
    setTimeout("timedCount()", 500);
}

timedCount();