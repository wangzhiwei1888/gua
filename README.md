# gua.js

一个移动端的刮刮乐活动的，工具，没有任何依赖。





## 设定

一些设定值。

```js
gua.init(el,{
	bg : 'url', //中奖图片的地址
	fg : 'url', //待刮图片的地址
	size : 5, //默认为5，每次刮的大小
	p : 0,	//刮掉的占剩余的百分比，默认为0，只要设置这个值，程序内部自动判断值，达到这个值后，直接执行clear函数
	start : function,
	move : function,
	end : function,
	clear : function //清除后，执行的回调
})
//init 第一个参数也可以接受选择器，字符串类型
```

## 例子

请看exp.html:

## 引入
```js
<script type="text/javascript" src="gua.js"></script>
```

### 设定

```js
gua.init(oDiv,{
		bg : '1.jpg',
		fg : '2.jpg',
		p : 40,
		clear : function(){
			alert('只要设定属性p，clear就会自动生效,40%以到，自动清除');
		},
		size : 15
	});
```


### 方法

```js
gua.init();//初始化
gua.changeImg();//更换奖品图片
```


## 说明

* 不用任何依赖
* 暂时只支持移动端


## 许可

zasqw2222

Copyright (C) 2013-2015 Websanova http://zasqw2222.com