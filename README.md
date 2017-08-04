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


### 在公司项目中遇到了一个需要画板的模块，但是找了很久没有中意的，与项目相符的组件，于是打算自己写一个
#### 知识点
 1. webview
 2. postMessage
 3. canvas
 4. 列表内容
#### 预知内容
 1. 你应该了解rn的webview
 2. postMessage的作用
 3. canvas基本api的使用
 4. js的语法。。这个是废话
#### 贴上代码

```
constructor(props) {
    super(props);
    this.state = {
      height: this.props.height,
      width: this.props.width
    }
  }
```
**我们希望组件的宽高由外部的父组件决定，webview初始化html的时候也需要设置成跟组件的宽高相同，所以传入了宽和高**
```
  render() {
    return (
      <View style={{width:this.state.width, height:this.state.height}}>  
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
      </View>
    );
  }
```
1 . **我们将webview组件保存成为这个类的一个属性，而不是this.refs的形式，看着更加清爽**
2. **其次我们为webview传入我们自己写好的canvas画布的html代码**
3. **监听webview，并在加载成功后注入我们的js代码，注入的代码来初始化我们的canvas画布** 
```
  webviewload(){
    // alert('加载成功！')
    this.webview.injectJavaScript('init_canvas('+this.props.width+', '+this.props.height+');');  
  }
```
**调用html中写好的初始化方法，初始化整个画布**
### 通信部分
```
// 用于监听html想rn发送的信息
onMessage={this.messageHandler.bind(this)}
```
```
  messageHandler(e){
    var obj = JSON.parse(e.nativeEvent.data);
    if (obj.action == 0){
      this.props.handleBase64(obj.data);
    }
  } 
```
**唯一的通信只是将canvas转换成base64传到我们的组件** 
```
  // 将我们的指令打包成json字符串传送给html
  post(obj){
    this.webview.postMessage(JSON.stringify(obj));
  }
  // 得到图片的base64形式
  _getBase64(){
    this.post({action: 0})
  }
```
### 再来看html部分
```
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
        }
    });
```
**通过postMessage为html传输指令，调用html中的api，实现效果**
### 其他的都是通过html中的js代码实现的，我只是做了一个实现的方法，具体的大家可以根据大家自己的需要改写html代码 
* ps: 刚接触rn的童鞋可以来看看我这个随便写的项目，里面是我练手的项目，我会慢慢把他写完，也会遇到很多坑，欢迎大家来一起踩坑 ，欢迎喜欢的童鞋star
* [项目地址](https://github.com/qn9301/react-native-aijinbao)