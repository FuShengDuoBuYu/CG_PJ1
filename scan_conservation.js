//绘制一个点
function drawPoint(cxt, x, y, color) {
    //建立一条新的路径
    cxt.beginPath();
    //设置画笔的颜色
    cxt.strokeStyle = "rgb(" + color[0] + "," +color[1] + "," +color[2] + ")";
    // cxt.strokeStyle = "black";
    //设置路径起始位置
    cxt.moveTo(x, y);
    //在路径中添加一个节点
    cxt.lineTo(x + 10, y + 10);
    //用画笔颜色绘制路径
    cxt.stroke();
}