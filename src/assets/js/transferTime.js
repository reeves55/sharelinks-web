export default function transferTime(timestamp) {
    var time = new Date(timestamp).getTime();
    var now = new Date().getTime();
    var interval = (now - time) / 1000; // 距今的秒数

    if (interval < 5 * 60) {
        return "就在刚刚";
    }

    if (interval < 60 * 60) {
        // 时间间隔小于60分钟
        return Math.round(interval / 60) + "分钟前";
    }

    if (interval < 24 * 60 * 60) {
        return Math.round(interval / 3600) +"小时前";
    }

    if (interval < 30 * 24 * 60 * 60) {
        return Math.round(interval / (24 * 60 * 60)) +"天前";
    }

    if (interval < 12 * 30 * 24 * 60 * 60) {
        return Math.round(interval / (30 * 24 * 60 * 60)) +"月前";
    }

    return "挺久之前";
}