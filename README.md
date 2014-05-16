# Api Faker
这里可以查看示例：[http://demo.apifaker.com/~apifaker/](http://demo.apifaker.com/~apifaker/)

### 简介

Api模拟器，顾名思义，它是一个模拟器，它可以模拟api行为返回json(jsonp),text或xml格式数据。

同时你也可以把它当作一个简易的api文档管理工具。

Api管理平台支持浏览器: Chrome, Firefox, Safari, Opera, Internet Explorer 9+.

### 安装

Api Faker运行在Nodejs环境下，请确保系统中已经安装好Nodejs。

从下面地址下载最新的文件
[https://github.com/hylin/apifaker/archive/master.zip](https://github.com/hylin/apifaker/archive/master.zip)
解压到任意目录，命令行中cd到该解压目录，安装依赖组件，根据实际情况修改config.js配置，然后启动即可。

```
npm install
// modify the config file as yours
node apifaker.js
```



### 特性

- Api基本信息管理
- 支持同一接口根据不同参数，返回不同模拟数据
- 支持模拟返回json(jsonp),text,xml格式数据
- 支持自动代理，即如果没有匹配的请求的模拟数据，自动转发到实际服务器

### 说明

#### Api信息管理
1.访问http://工具所在服务器地址/~apifaker/，即可开始管理Api

2.添加接口和添加模拟数据记录页各个字段都有详细的说明，请参考各个字段说明

#### Api模拟

1.将你希望模拟的api的域名host到工具部署所在机器，到工具页面添加对应api信息，然后浏览器中访问api即可看到返回模拟的数据。

例如，工具自带两个qq地图的webservice接口示例。你只需要在你本机做以下host（192.210.195.6是demo.apifaker.com的ip）
```
192.210.195.6 apis.map.qq.com
```
然后再用浏览器访问 http://apis.map.qq.com/ws/coord/v1/translate?locations=39.12,116.83;30.21,115.43&type=3&callback=test&key=OB4BZ-D4W3U-B7VVO-4PJWW-6TKDJ-WPB77 即可看到接口返回值，是Api Faker模拟返回的。

2.要使用自动代理功能，务必将本工具部署到其它机器，并且不能对请求的域名进行host。

比如，你要在机器A(192.168.1.2)上测试http://api.example.com/v1/get_user_info 接口。

首先你在机器B(192.168.1.3)上部署这个工具，并确认机器B上没有对api.example.com域名进行host。

然后，在机器A上配置host
```
192.168.1.3 api.example.com
```
。
这样在机器A上访问http://api.example.com/v1/get_user_info 时，如果没有匹配上设置的模拟数据条件，则该工具会自动从机器B发起一个相同的请求访问http://api.example.com/v1/get_user_info ，由于机器B上没有host，所以会去访问实际的api.example.com域名下的接口

还是demo.apifaker.com上的示例，host不变，你访问 http://apis.map.qq.com/ws/geocoder/v1?location=39.984154,116.307490&key=OB4BZ-D4W3U-B7VVO-4PJWW-6TKDJ-WPB77&callback=test ，虽然apis.map.qq.com被host到了192.210.195.6，但是还是返回了正确结果，因为该接口目前停止了模拟，并开启了代理模式。

### License

Apache License 2.0

&copy; 2014 http://www.apifaker.com/

