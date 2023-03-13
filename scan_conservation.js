//绘制一个点
function drawPoint(cxt, x, y, color) {
    //建立一条新的路径
    cxt.beginPath();
    //设置画笔的颜色
    cxt.strokeStyle = "rgb(" + color[0] + "," + color[1] + "," + color[2] + ")";
    // cxt.strokeStyle = "black";
    //设置路径起始位置
    cxt.moveTo(x, y);
    //在路径中添加一个节点
    cxt.lineTo(x + 1, y + 1);
    //用画笔颜色绘制路径
    cxt.stroke();
}

//绘制一条线段
//绘制线段的函数绘制一条从(x1,y1)到(x2,y2)的线段，cxt和color两个参数意义与绘制点的函数相同，
function drawLine(cxt,x1,y1,x2,y2,color){
    cxt.beginPath();
    cxt.strokeStyle ="rgba("+color[0] + "," +
                           +color[1] + "," +
                           +color[2] + "," +
                           +255 + ")" ;
    //这里线宽取1会有色差，但是类似半透明的效果有利于debug，取2效果较好
    cxt.lineWidth =1;
    cxt.moveTo(x1, y1);
    cxt.lineTo(x2, y2);
    cxt.stroke();
}

//绘制一个圈
function drawCircle(cxt, x, y, r) {
    //建立一条新的路径
    cxt.beginPath();
    //设置画笔的颜色
    cxt.strokeStyle = "black";
    //设置路径起始位置
    cxt.moveTo(x+r, y);
    //在路径中添加一个节点
    cxt.arc(x, y, r, 0, 2 * Math.PI);
    //用画笔颜色绘制路径
    cxt.stroke();
}

//绘制画布
function drawCanvas(cxt,vertex_pos,vertex_radius,vertex_color,change_vertex){
    //绘制四边形
    //先绘制不包含变换顶点的四边形
    for(i = 0;i < polygon.length;i++){
        if(polygon[i].indexOf(change_vertex)==-1){
            //找到四边形的四个顶点
            vertexes = [];
            for(j = 0;j < 4;j++){
                vertexes.push(vertex_pos[polygon[i][j]]);
            }
            scanLineFill(vertexes,vertex_color[[polygon[i][0]]]);
        }
    }
    //再绘制包含变换顶点的四边形
    for(i = 0;i < polygon.length;i++){
        if(polygon[i].indexOf(change_vertex)!=-1){
            //找到四边形的四个顶点
            vertexes = [];
            for(j = 0;j < 4;j++){
                vertexes.push(vertex_pos[polygon[i][j]]);
            }
            scanLineFill(vertexes,vertex_color[[polygon[i][0]]]);
        }
    }

    //绘制顶点
    for(i = 0;i < vertex_pos.length;i++){
        drawPoint(cxt,vertex_pos[i][0],vertex_pos[i][1],vertex_color);
        //在每个顶点处画一个圆
        drawCircle(cxt,vertex_pos[i][0],vertex_pos[i][1],vertex_radius);
    }
    
}

//鼠标按下并移动事件
function mouseDownAndMove(dom, callback) {
    let flag = false;
    let fn = function (e) {
        callback(e);
    };
    // 添加鼠标按下监听
    dom.addEventListener("mousedown", function (even) {
        // 当鼠标按下时, 添加鼠标移动监听
        flag = true;
        index = isInCircle(even.offsetX,even.offsetY,vertex_pos,vertex_radius);
        if(index!=-1){
            dom.addEventListener("mousemove", fn);
        }
    })
    // 添加鼠标弹起监听 , 即鼠标不在按下
    dom.addEventListener("mouseup", function () {
        dom.removeEventListener("mousemove", fn);
    })
    // 当鼠标在其他元素中弹起时的操作, 规避鼠标弹起后 dom 无法捕获的异常
    document.addEventListener("mouseup", function () {
        flag = false;
        dom.removeEventListener("mousemove", fn);
    });

}

//重绘画布
function refreshCanvas(cxt){
    //清空画布
    cxt.clearRect(0,0,canvas_size.maxX,canvas_size.maxY);
    //重新绘制画布
    drawCanvas(cxt,vertex_pos,vertex_radius,vertex_color,index);
}

//初始化画布
function initCanvas(canvas,maxX,maxY){
    canvas.width = maxX;
    canvas.height = maxY;
    let cxt = canvas.getContext("2d");
    return cxt;
}

//判断是否在圆内
function isInCircle(x,y,vertex_pos,vertex_radius){
    for(let i=0;i<vertex_pos.length;i++){
        let dis = Math.sqrt(Math.pow(x-vertex_pos[i][0],2)+Math.pow(y-vertex_pos[i][1],2));
        if(dis<vertex_radius){
            return i;
        }
    }
    return -1;
}

//更新顶点坐标
function updateVertexPos(index,x,y){
    vertex_pos[index][0] = x;
    vertex_pos[index][1] = y;
}

//扫描线填充算法
function scanLineFill(vertexes,vertex_color){
    //扫描线填充算法
    //1.找出最大y和最小y
    let maxY = 0;
    let minY = canvas_size.maxY;
    for(let i=0;i<vertexes.length;i++){
        if(vertexes[i][1]>maxY){
            maxY = vertexes[i][1];
        }
        if(vertexes[i][1]<minY){
            minY = vertexes[i][1];
        }
    }
    //2.扫描线从最小y到最大y
    for(let y=minY;y<=maxY;y++){
        //3.找出所有与扫描线相交的边
        let intersectEdges = [];
        for(let i=0;i<vertexes.length;i++){
            let j = (i+1)%vertexes.length;
            if(vertexes[i][1] == vertexes[j][1]){
                continue;
            }
            if(vertexes[i][1] < vertexes[j][1]){
                if(y >= vertexes[i][1] && y < vertexes[j][1]){
                    intersectEdges.push([i,j]);
                }
            }
            if(vertexes[i][1] > vertexes[j][1]){
                if(y >= vertexes[j][1] && y < vertexes[i][1]){
                    intersectEdges.push([i,j]);
                }
            }
        }
        //如果相交边的数量为偶数,则填充
        if(intersectEdges.length%2==0){
            //4.找出所有与扫描线相交的边的交点
            let intersectPoints = [];
            for(let i=0;i<intersectEdges.length;i++){
                let edge = intersectEdges[i];
                let x = vertexes[edge[0]][0] + (y-vertexes[edge[0]][1])*(vertexes[edge[1]][0]-vertexes[edge[0]][0])/(vertexes[edge[1]][1]-vertexes[edge[0]][1]);
                intersectPoints.push(x);
            }
            //5.对交点排序
            intersectPoints.sort(function(a,b){
                return a-b;
            })
            //6.填充
            for(let i=0;i<intersectPoints.length;i+=2){
                let x1 = intersectPoints[i];
                let x2 = intersectPoints[i+1];
                drawLine(cxt,x1,y,x2,y,vertex_color);
            }
        }
        
    }
}
