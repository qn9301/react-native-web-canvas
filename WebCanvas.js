/**
 * Created by Zyf on 2017/8/2.
 * 基于webview的Canvas画布
 */
import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Text,
  WebView,
  TouchableOpacity
} from 'react-native';
var html = 
`<html>
<head>
  <title>canvas</title>
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <script src="http://www.jq22.com/jquery/jquery-1.10.2.js"></script>
  <style>
    *{
      margin: 0;
      padding: 0;
    }
  </style>
</head> 
<body>
  <canvas id='can'>
    您的浏览器不支持canvas
  </canvas>
  <script>
    var $can = $('#can'),isclean=false,drawState=false,lastX,lastY,ctx;
    var _width,_height;
    window.document.addEventListener('message', function (e){
        var obj = JSON.parse(e.data);
        switch (parseInt(obj.action)){
          case 1:
              /* 铅笔 */
              isclean=false;
              break;
          case 2:
              /* 橡皮 */
              isclean=true;
              break;
          case 3:
              /* 右转 */
              rotateRight();
              break;
          case 4:
              /* url */
              createImg(obj.data);
              break;
          case 5:
              /* case64 */
              createImg(obj.data);
              break;
          case 0:
              /* 返回base64 */
              returnBase64();
              break;
          case -1:
              /* 初始化画板 */
              ctx.clearRect(0,0, _width, _height);
              break;
        }
    });

    function init_canvas(width,height){
      _width = width;
      _height = height;
      $can.attr('width', width);
      $can.attr('height', height);
      ctx = $can[0].getContext("2d");
      registDraw();
    }


    function registDraw(){
        var ox;
        var oy;
        var ox2;
        var oy2;
        $can.on("touchstart", function (e){
            e = e.originalEvent.touches[0];
            ox2 = e.screenX;
            oy2 = e.screenY;
            drawState = true;
            drawState = true;
            var x = e.clientX -  $can.offset().left;
            var y = e.clientY -  $can.offset().top + $(document).scrollTop();
            lastX = x;
            lastY = y;
            draw(x, y, true, isclean);
            return false;
        });
        $can.on("touchmove", function (ev){
            e = ev.originalEvent.touches[0];
            if (drawState){
                if (lastX == null || lastY == null ){
                    $can.lastX = $can.lastY = null;
                    lastX = e.clientX - $can.offset().left;
                    lastY = e.clientY - $can.offset().top + $(document).scrollTop();
                }
                draw(e.clientX - $can.offset().left, 
                    e.clientY - $can.offset().top + $(document).scrollTop(),true,isclean);
                return false;
            }
            return false;
        });
        $(document).on("touchend", function (e){
            drawState = false;
        });
    };

    function draw(x, y, isDown, isclean){
        if (isDown) {
            ctx.globalCompositeOperation = isclean ? "destination-out" : "source-over";
            ctx.beginPath();
            ctx.strokeStyle = 'black';
            ctx.lineWidth = isclean ? 30 : 5;
            ctx.lineJoin = "round";
            ctx.moveTo(lastX, lastY);
            ctx.lineTo(x, y);
            ctx.closePath();
            ctx.stroke();
        }
        lastX = x;
        lastY = y;
    };

    /* 旋转 */
    function rotateRight(){
        var obj = ctx.getImageData(0,0,_width, _height);
        var new_obj = ctx.createImageData(obj.height, obj.width);
        var num = 0;
        for (var j=0;j<obj.width;j++){
            for (var i=obj.height;i>0;i--){
                new_obj.data[num++] = obj.data[(j + obj.width*(i-1))*4];
                new_obj.data[num++] = obj.data[(j + obj.width*(i-1))*4+1];
                new_obj.data[num++] = obj.data[(j + obj.width*(i-1))*4+2];
                new_obj.data[num++] = obj.data[(j + obj.width*(i-1))*4+3];
            }
        }
        _width = new_obj.width;
        _height = new_obj.height;
        $can.attr("width", this.width);
        $can.attr("height",this.height);
        ctx.clearRect(0,0,this.width,this.height);  
        ctx.putImageData(new_obj, 0, 0);
    };

    function createImg(data){
      var img = new Image();
      img.crossOrigin = '*';
      img.onload = function (){
        var width = img.naturalWidth;
        var height = img.naturalHeight;
        can = $can[0];
        ctx = can.getContext("2d");
        ctx.drawImage(img, 0, 0, _width, _height);
      };
      $(img).attr('src', data);
    }

    function imageData2base64(imgdata){
        var can = $("<canvas>").attr("width", imgdata.width).attr("height", imgdata.height);
        can = can[0];
        var ctx = can.getContext("2d");
        ctx.putImageData(imgdata, 0, 0);
        return can.toDataURL();
    }

    /*
        保存图片功能，将图片保存成一张图片并返回base64
    */
    function saveAsBase64(){
        var obj = this.ctx_img.getImageData(0,0,this.width, this.height);
        var obj2 = this.ctx_edit.getImageData(0,0,this.width, this.height);
        var new_obj = this.ctx_img.createImageData(this.width, this.height);
        var len = obj2.data.length / 4;
        for(var i=0;i<len;i++){
            if (obj2.data[i*4+3] != 0){
                new_obj.data[i*4] = obj2.data[i*4];
                new_obj.data[i*4+1] = obj2.data[i*4+1];
                new_obj.data[i*4+2] = obj2.data[i*4+2];
                new_obj.data[i*4+3] = 255;
            }else{
                new_obj.data[i*4] = obj.data[i*4];
                new_obj.data[i*4+1] = obj.data[i*4+1];
                new_obj.data[i*4+2] = obj.data[i*4+2];
                new_obj.data[i*4+3] = obj.data[i*4+3];
            }
        } 
        return imageData2base64(new_obj);
    }


    /* 将图片处理成base64返回 */
    function returnBase64(){
      var data = $can[0].toDataURL();
      window.postMessage(JSON.stringify({action: 0, data: data}));
    }
  </script>
</body>
</html>
`;

var _width,_height;
export default class WebCanvas extends Component {
  webview = {};
  constructor(props) {
    super(props);
    this.state = {
      height: this.props.height,
      width: this.props.width
    }
  }
  // 铅笔
  _pen(){
    this.post({action: 1})
  }
  // 橡皮
  _clean(){
    this.post({action: 2})
  }
  // 初始化画板
  _init(){
    this.post({action: '-1'})
  }

  // 以url的形式添加背景
  _addImageUrl(data){
    this.post({action: 4, data: data})
  }

  // 以base64的形式添加背景
  _addImageBase64(data){
    this.post({action: 5, data: data})
  }

  _addImage(data){
    this.post({action: 4, data: data})
  }

  // 得到图片的base64形式
  _getBase64(){
    this.post({action: 0})
  }

  // 图片右转
  _rotateRight(){
    this.post({action: 3})
  }

  post(obj){
    this.webview.postMessage(JSON.stringify(obj));
  }

  webviewload(){
    // alert('加载成功！')
    this.webview.injectJavaScript('init_canvas('+this.props.width+', '+this.props.height+');');

    if (this.props.onLoad){
      this.props.onLoad();
    }
  }

  messageHandler(e){
    var obj = JSON.parse(e.nativeEvent.data);
    if (obj.action == 0){
      this.props.handleBase64(obj.data);
    }
  } 

  render() {
    return (
      <View style={[styles.container, {width:this.state.width, height:this.state.height}]}>  
        <WebView 
          style={{width:this.state.width, height:this.state.height}}
          ref = {(w) => {this.webview = w}}
          onLoad={this.webviewload.bind(this)}
          source={{html: html}}
          onMessage={this.messageHandler.bind(this)}
          javaScriptEnabled={true}
          domStorageEnabled={false}
          automaticallyAdjustContentInsets={true}
          scalesPageToFit={false}
          />
          <TouchableOpacity onPress={()=>this.webview.reload()}>
            <Text>刷新</Text>
          </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({ 
    container: {  
        alignItems: 'flex-start',  
        backgroundColor: 'green',

    }
});  
