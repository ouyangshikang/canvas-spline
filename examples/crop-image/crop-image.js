$(function () {
    var a = new tailorImg();
    a.iniData();
});
//
var tailorImg = function(){
    this.iniData = function () {
        //画布
        this.can.id = "canvas";
        this.can.w = 400;
        this.can.h = 400;
        this.can.roundr = 7;
        this.can.roundrr = 3;
        this.can.curPointIndex = 0;
        this.can.imgBack.src = "./img/bg.png";
        this.can.canvas = document.getElementById(this.can.id).getContext("2d");
        //图片
        this.img.w = 400;
        this.img.h = 400;
        this.img.image.src = "./img/avatar.png";
        //加载事件：
        //初始化事件：
        var a = this;
        var p = a.can.pointList;
        $("#" + a.can.id).mousemove(function (e) {
            if (a.can.paint) {//是不是按下了鼠标  
                if (p.length > 0) {
                    a.equalStartPoint(p[p.length - 1].pointx, p[p.length - 1].pointy);
                }
                a.roundIn(e.offsetX, e.offsetY);
            }
            //判断是否在直线上
            //光标移动到线的附近如果是闭合的需要重新划线，并画上新添加的点
            a.AddNewNode(e.offsetX, e.offsetY);
        });
        $("#" + a.can.id).mousedown(function (e) {
            a.can.paint = true;
            //点击判断是否需要在线上插入新的节点：
            if (a.can.tempPointList.length > 0) {
                a.can.pointList.splice(a.can.tempPointList[1].pointx, 0, new a.point(a.can.tempPointList[0].pointx, a.can.tempPointList[0].pointy));
                //清空临时数组
                a.can.tempPointList.length = 0;
            }
        });
        $("#" + a.can.id).mouseup(function (e) {
            //拖动结束
            a.can.paint = false;
            //拖动结束；
            if (a.can.juPull) {
                a.can.juPull = false;
                a.can.curPointIndex = 0;
                //验证抠图是否闭合：闭合，让结束点=开始点；添加标记
                a.equalStartPoint(p[p.length - 1].pointx, p[p.length - 1].pointy);
                //判断是否闭合：
                if (a.can.IsClose) {

                }
            }
            else {
                //如果闭合：禁止添加新的点；
                if (!a.can.IsClose) {//没有闭合
                    p.push(new a.point(e.offsetX, e.offsetY));
                    //验证抠图是否闭合：闭合，让结束点=开始点；添加标记
                    a.equalStartPoint(p[p.length - 1].pointx, p[p.length - 1].pointy);
                    //判断是否闭合：
                    //重新画；
                    if (p.length > 1) {
                        a.drawLine(p[p.length - 2].pointx, p[p.length - 2].pointy, p[p.length - 1].pointx, p[p.length - 1].pointy);
                        a.drawArc(p[p.length - 1].pointx, p[p.length - 1].pointy);
                    } else {
                        a.drawArc(p[p.length - 1].pointx, p[p.length - 1].pointy);
                    }
                }
                else {
                    //闭合
                }
            }
            //验证是否填充背景：
            if (a.can.IsClose) {
                a.fillBackColor();
                a.drawAllLine();
            }
        });
        $("#" + a.can.id).mouseleave(function (e) {
            a.can.paint = false;
        });
        //鼠标点击事件：
        $("#" + a.can.id).click(function (e) {
            //空
        });
    }
    this.point = function (x, y) {
        this.pointx = x;
        this.pointy = y;
    };
    //图片
    this.img = {
        image:new Image(),
        id: "",
        w:0,
        h:0
    };
    //画布；
    this.can = {
        canvas:new Object(),
        id: "",
        w: 0,
        h: 0,
        //坐标点集合
        pointList: new Array(),
        //临时存储坐标点
        tempPointList: new Array(),
        //圆点的触发半径：
        roundr: 7,
        //圆点的显示半径：
        roundrr: 7,
        //当前拖动点的索引值；
        curPointIndex : 0,
        //判断是否点击拖动
        paint : false,
        //判断是否点圆点拖动，并瞬间离开,是否拖动点；
        juPull : false,
        //判断是否闭合
        IsClose: false,
        imgBack: new Image()
        
    };
    //函数：
    //更新画线
    this.drawAllLine=function () {
        for (var i = 0; i < this.can.pointList.length - 1; i++) {
            //画线
            var p = this.can.pointList;
            this.drawLine(p[i].pointx, p[i].pointy, p[i + 1].pointx, p[i + 1].pointy);
            //画圈
            this.drawArc(p[i].pointx, p[i].pointy);
            if (i == this.can.pointList.length - 2) {
                this.drawArc(p[i+1].pointx, p[i+1].pointy);
            }
        }
    }
    //画线
    this.drawLine = function (startX, startY, endX, endY) {
        //var grd = this.can.canvas.createLinearGradient(0, 0,2,0); //坐标，长宽
        //grd.addColorStop(0, "black"); //起点颜色
        //grd.addColorStop(1, "white");
        //this.can.canvas.strokeStyle = grd;
        this.can.canvas.strokeStyle = "blue"
        this.can.canvas.lineWidth =1;
        this.can.canvas.moveTo(startX, startY);
        this.can.canvas.lineTo(endX, endY);
        this.can.canvas.stroke();
    }
    //画圈：
    this.drawArc=function(x, y) {
        this.can.canvas.fillStyle = "blue";
        this.can.canvas.beginPath();
        this.can.canvas.arc(x, y,this.can.roundrr, 360, Math.PI * 2, true);
        this.can.canvas.closePath();
        this.can.canvas.fill();
    }
    //光标移到线上画大圈：
    this.drawArcBig = function (x, y) {
        this.can.canvas.fillStyle = "blue";
        this.can.canvas.beginPath();
        this.can.canvas.arc(x, y, this.can.roundr+2, 360, Math.PI * 2, true);
        this.can.canvas.closePath();
        this.can.canvas.fill();
    }
    //渲染图片往画布上
    this.showImg=function() {
        this.img.image.onload = function () {
            this.can.canvas.drawImage(this.img.image, 0, 0, this.img.w,this.img.h);
        };
    }
    //填充背景色
    this.fillBackColor = function () {
        for (var i = 0; i <this.img.w; i += 96) {
            for (var j = 0; j <= this.img.h; j += 96) {
                this.can.canvas.drawImage(this.can.imgBack, i, j, 96, 96);
            }
        }
        this.can.canvas.globalCompositeOperation = "destination-out";
        this.can.canvas.beginPath();
        for (var i = 0; i <this.can.pointList.length; i++) {
            this.can.canvas.lineTo(this.can.pointList[i].pointx,this.can.pointList[i].pointy);
        }
        this.can.canvas.closePath();
        this.can.canvas.fill();
        this.can.canvas.globalCompositeOperation = "destination-over";
        this.drawAllLine();
    }
    //去掉pointlist最后一个坐标点：
    this.clearLastPoint=function () {
        this.can.pointList.pop();
        //重画：
        this.clearCan();
        this.drawAllLine();
    }
    //判断结束点是否与起始点重合；
    this.equalStartPoint = function (x,y) {
        var p = this.can.pointList;
        if (p.length > 1 && Math.abs((x - p[0].pointx) * (x - p[0].pointx)) + Math.abs((y - p[0].pointy) * (y - p[0].pointy)) <= this.can.roundr * this.can.roundr) {
            //如果闭合
            this.can.IsClose = true;
            p[p.length - 1].pointx = p[0].pointx;
            p[p.length - 1].pointy = p[0].pointy;
        }
        else {
            this.can.IsClose = false;
        }
    }
    //清空画布
    this.clearCan=function (){
        this.can.canvas.clearRect(0, 0, this.can.w, this.can.h);
    }
    //剪切区域
    this.CreateClipArea=function () {
        this.showImg();
        this.can.canvas.beginPath();
        for (var i = 0; i <this.can.pointList.length; i++) {
            this.can.canvas.lineTo(this.can.pointList[i].pointx,this.can.pointList[i].pointy);
        }
        this.can.canvas.closePath();
        this.can.canvas.clip();
    }
    //
    this.CreateClipImg=function()
    {

    }
    //判断鼠标点是不是在圆的内部：
    this.roundIn = function (x, y) {
        //刚开始拖动
        var p = this.can.pointList;
        if (!this.can.juPull) {
            for (var i = 0; i < p.length; i++) {

                if (Math.abs((x - p[i].pointx) * (x - p[i].pointx)) + Math.abs((y - p[i].pointy) * (y - p[i].pointy)) <= this.can.roundr * this.can.roundr) {
                    //说明点击圆点拖动了；
                    this.can.juPull = true;//拖动
                    //
                    this.can.curPointIndex = i;
                    p[i].pointx = x;
                    p[i].pointy = y;
                    //重画：
                    this.clearCan();
                    //showImg();
                    if (this.can.IsClose) {
                        this.fillBackColor();
                    }
                    this.drawAllLine();
                    return;
                }
            }
        }
        else {//拖动中
            p[this.can.curPointIndex].pointx = x;
            p[this.can.curPointIndex].pointy = y;
            //重画：
            this.clearCan();
            if (this.can.IsClose) {
                this.fillBackColor();
            }
            this.drawAllLine();
        }
    };

    //光标移到线上，临时数组添加新的节点：
    this.AddNewNode=function(newx, newy) {
        //如果闭合
        var ii=0;
        if (this.can.IsClose) {
            //判断光标点是否在线上：
            var p = this.can.pointList;
            for (var i = 0; i < p.length - 1; i++) {
                //计算a点和b点的斜率
                var k = (p[i + 1].pointy - p[i].pointy) / (p[i + 1].pointx - p[i].pointx);
                var b = p[i].pointy - k * p[i].pointx;
                //if (parseInt((p[i + 1].pointy - p[i].pointy) / (p[i + 1].pointx - p[i].pointx)) ==parseInt((p[i + 1].pointy - newy) / (p[i + 1].pointx - newx)) && newx*2-p[i+1].pointx-p[i].pointx<0 && newy*2-p[i+1].pointy-p[i].pointy<0) {
                //    //如果在直线上
                //    alert("在直线上");
                //}
                $("#txtone").val(parseInt(k * newx + b));
                $("#txttwo").val(parseInt(newy));
                if (parseInt(k * newx + b) == parseInt(newy) && (newx - p[i + 1].pointx) * (newx - p[i].pointx) <= 2 && (newy - p[i + 1].pointy) * (newy - p[i].pointy) <= 2) {
                    //
                    //parseInt(k * newx + b) == parseInt(newy)
                    //添加临时点：
                    this.can.tempPointList[0] = new this.point(newx, newy);//新的坐标点
                    this.can.tempPointList[1] = new this.point(i+1, i+1);//需要往pointlist中插入新点的索引；
                    i++;
                    //alert();
                    //光标移动到线的附近如果是闭合的需要重新划线，并画上新添加的点；
                    if (this.can.tempPointList.length > 0) {
                        //重画：
                        this.clearCan();
                        //showImg();
                        if (this.can.IsClose) {
                            this.fillBackColor();
                        }
                        this.drawAllLine();
                        this.drawArcBig(this.can.tempPointList[0].pointx, this.can.tempPointList[0].pointy);
                        return;
                    }
                    return;
                }
                else {
                    // $("#Text1").val("");
                }
            }
            if (ii == 0) {
                if (this.can.tempPointList.length > 0) {
                    //清空临时数组；
                    this.can.tempPointList.length = 0;
                    //重画：
                    this.clearCan();
                    //showImg();
                    if (this.can.IsClose) {
                        this.fillBackColor();
                    }
                    this.drawAllLine();
                    //this.drawArc(this.can.tempPointList[0].pointx, this.can.tempPointList[0].pointy);
                }
            }
        }
        else {
            //防止计算误差引起的添加点，当闭合后，瞬间移动起始点，可能会插入一个点到临时数组，当再次执行时，
            //就会在非闭合情况下插入该点，所以，时刻监视：
            if (this.can.tempPointList.length > 0) {
                this.can.tempPointList.length = 0;
            }
        }
    }
    
};
