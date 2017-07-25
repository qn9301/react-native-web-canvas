# react-native-web-canvas
## 基于webview实现的canvas画布，提供了默认的几个接口
1. `_pen`画笔
2. `_clean`橡皮
3. `_addImageUrl`以url的方式导入图片
4. `_addImageBase64`以base64的方式导入图片
5. `_rotateRight`向右旋转
6. `_getBase64`把画布以base64的形式导出
7. 通过props设置画布的宽高
8. 通过回调的方式获取base64
# demo
```
<WebCanvas 
      handleBase64={this._handleBase64.bind(this)}
      ref='canvas'
      height={500} 
      width={500}
    />
```
# 功能实现
```
_pen(){
this.refs.canvas._pen();
}

_clean(){
this.refs.canvas._clean();
}

// 以url的形式添加背景
_addImageUrl(){
this.refs.canvas._addImageUrl(url);
}

// 以base64的形式添加背景
_addImageBase64(){
this.refs.canvas._addImageBase64(base64);
}

// 得到图片的base64形式
_getBase64(){
this.refs.canvas._getBase64(base64);
}

// 保存base64
_handleBase64(data){
alert(data)
}

// 图片右转
_rotateRight(){
this.refs.canvas._rotateRight();
}
```
# 使用
- `git clone git@github.com:qn9301/react-native-web-canvas.git`
 - 将`WebCanvas.js`文件放入你的项目中
 - `import WebCanvas from 'path/to/WebCanvas'`即可