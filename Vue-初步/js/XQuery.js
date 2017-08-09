'use strict';
function XQuery(arg){
	this.elements=[];//存选择出来的元素
	this.domString='';//存要创建的元素
	switch (typeof arg){
		case 'function':
			domReady(arg);
			break;
		case 'string':
			if(arg.indexOf('<')!=-1){
				//创建元素 （存起来）
				this.domString=arg;
			}else{
				this.elements=getEle(arg);
			}
			break;
		default:
			if(arg instanceof Array){
				this.elements=this.elements.concat(arg);
			}else{
				this.elements.push(arg);
			}
			break;
	}
};
//css
XQuery.prototype.css=function(name,value){
	if(arguments.length==2){ //一个设置一个
		for (var i = 0; i < this.elements.length; i++) {
			this.elements[i].style[name]=value;
		}
	}else{
		if(typeof name=='string'){
			return getStyle(this.elements[0],name);
		}else{
			var json=name;
			for (var i=0;i<this.elements.length;i++) {
				for (var name in json) {
					this.elements[i].style[name]=json[name];
				}
			}
		}
	}
	return this;
};
//attr 自定义属性
XQuery.prototype.attr=function(name,value){
	if(arguments.length==2){ //一个设置一个
		for (var i = 0; i < this.elements.length; i++) {
			this.elements[i].setAttribute(name,value);
		}
	}else{
		if(typeof name=='string'){
			return this.elements[0].getAttribute(name);
		}else{
			var json=name;
			for (var i=0;i<this.elements.length;i++) {
				for (var name in json) {
					this.elements[i].setAttribute(name,json[name]);
				}
			}
		}
	}
	return this;
};
//XQuery.prototype.click=function(fn){
//	for (var i=0;i<this.elements.length;i++) {
//		addEvent(this.elements[i],'click',fn);
//	}
//};
'click mouseover mousedown mouseup mousemove mouseout keydown keyup load resize focus blur'.replace(/\w+/g,function(sEv){
	XQuery.prototype[sEv]=function(fn){
		for (var i=0;i<this.elements.length;i++) {
			addEvent(this.elements[i],sEv,fn);
		}
		return this;
	};
});
//解决mouseover移入的bug
XQuery.prototype.mouseenter=function(fn){
	for (var i=0;i<this.elements.length;i++) {
		addEvent(this.elements[i],'mouseover',function(ev){
			var from=ev.fromElement || ev.relatedTarget;
			if(this.contains(from))return;//是子元素就return
			fn && fn.apply(this,arguments);
		});
	}
	return this;
};
//解决mouseout的bug
XQuery.prototype.mouseleave=function(fn){
	for (var i=0;i<this.elements.length;i++) {
		addEvent(this.elements[i],'mouseout',function(ev){
			var to=ev.toElement || ev.relatedTarget;
			if(this.contains(to))return;//是子元素就return
			fn && fn.apply(this,arguments);
		});
	}
	return this;
};
//hover
XQuery.prototype.hover=function(fnOver,fnOut){
	this.mouseenter(fnOver);
	this.mouseleave(fnOut);
	return this;
};
//toggle
XQuery.prototype.toggle=function(){
	var args=arguments;
	var count=0;
	var _this=this;
	for (var i=0;i<this.elements.length;i++) {
		(function(count){
			addEvent(_this.elements[i],'click',function(){
				var fn=args[count%args.length];
				fn && fn.apply(this,arguments);
				count++;
			});
		})(0);
	}
	return this;
};
//添加事件绑定
XQuery.prototype.on=function(sEv,fn){
	for (var i=0;i<this.elements.length;i++) {
		addEvent(this.elements[i],sEv,fn);
	}
};
//DOM添加  删除
XQuery.prototype.appendTo=function(str){
	//getEle(str)  获取父级元素
	var aParent=getEle(str);

	for (var i=0;i<aParent.length;i++) {
		aParent[i].insertAdjacentHTML('beforeEnd',this.domString);
	}
	return this;
};
XQuery.prototype.prependTo=function(str){
	//getEle(str)  获取父级元素
	var aParent=getEle(str);
	for (var i=0;i<aParent.length;i++) {
		aParent[i].insertAdjacentHTML('afterBegin',this.domString);
	}
	return this;
};
XQuery.prototype.insertBefore=function(str){
	//getEle(str)  获取父级元素
	var aParent=getEle(str);
	for (var i=0;i<aParent.length;i++) {
		aParent[i].insertAdjacentHTML('beforeBegin',this.domString);
	}
	return this;
};
XQuery.prototype.insertAfter=function(str){
	//getEle(str)  获取父级元素
	var aParent=getEle(str);
	for (var i=0;i<aParent.length;i++) {
		aParent[i].insertAdjacentHTML('afterEnd',this.domString);
	}
	return this;
};
//删除
XQuery.prototype.remove=function(){
	for (var i=0;i<this.elements.length;i++) {
		this.elements[i].parentNode.removeChild(this.elements[i]);
	}
	return this;
};
//非表单元素设置内容
XQuery.prototype.html=function(str){
	if(str || str==''){
		for (var i=0;i<this.elements.length;i++) {
			this.elements[i].innerHTML=str;
		}
	}else{
		//获取一个
		return this.elements[0].innerHTML;
	}
	return this;
};
//表单元素设置内容
XQuery.prototype.val=function(str){
	if(str || str==''){
		for (var i=0;i<this.elements.length;i++) {
			this.elements[i].value=str;
		}
	}else{
		//获取一个
		return this.elements[0].value;
	}
	return this;
};
//class
XQuery.prototype.addClass=function(sClass){
	var reg=new RegExp('\\b'+sClass+'\\b');
	for (var i=0;i<this.elements.length;i++) {
		if(sClass){
			if(this.elements[i].className){
				if(!reg.test(this.elements[i].className))
				{
					this.elements[i].className+=' '+sClass;
				}
			}else{
				this.elements[i].className=sClass;
			}
		}
	}
	return this;
};
XQuery.prototype.removeClass=function(sClass){
	var reg=new RegExp('\\b'+sClass+'\\b');
	for (var i=0;i<this.elements.length;i++)
	{
		if(reg.test(this.elements[i].className))
		{
			this.elements[i].className=this.elements[i].className.replace(reg,'').replace(/^\s+|\s+$/g,'').replace(/\s+/g,' ');
		}
	}
	return this;
};
//show
XQuery.prototype.show=function(){
	for (var i=0;i<this.elements.length;i++)
	{
		this.elements[i].style.display='block';
	}
	return this;
};
//hide
XQuery.prototype.hide=function(){
	for (var i=0;i<this.elements.length;i++)
	{
		this.elements[i].style.display='none';
	}
	return this;
};
//eq
XQuery.prototype.eq=function(n){
	return	$(this.elements[n]);
};
//get
XQuery.prototype.get=function(n){
	return	this.elements[n];
};
//index索引
XQuery.prototype.index=function(){
	var obj=this.elements[0];
	var aSibling=obj.parentNode.children;
	for (var i=0;i<aSibling.length;i++) {
		if(obj==aSibling[i]){
			return i;
		}
	}
	return this;
};
//find
XQuery.prototype.find=function(str){
	var aParent=this.elements;
	var aChild=getEle(str,aParent);
	return $(aChild);
};
//each
XQuery.prototype.each=function(fn){
	for (var i=0;i<this.elements.length;i++) {
		fn.call(this.elements[i],i,this.elements[i]);
	}
	//return this;
};
//animate
XQuery.prototype.animate=function(json,options){

	for (var i=0;i<this.elements.length;i++) {
		move(this.elements[i],json,options);
	};
	return this;
};
//ajax
$.ajax=XQuery.ajax=function(json){
	ajax(json);
};
//jsonP
$.jsonp=XQuery.jsonp=function(json){
	jsonP(json);
};
//插件
$.fn=XQuery.prototype;
$.fn.extend=XQuery.prototype.extend=function(json){
	for (var name in json) {
		XQuery.prototype[name]=json[name];
	}
};
//事件绑定
//function addEvent(obj,sEv,fn){
//	if(obj.addEventListener){
//		obj.addEventListener(sEv,function(ev){
//			var oEvent=ev || event;
//			fn.apply(obj,arguments);
//		},false);
//	}else{
//		obj.attachEvent('on'+sEv,function(ev){
//			var oEvent=ev || event;
//			fn.apply(obj,arguments);
//		});
//	}
//};
function addEvent(obj,sEv,fn){
	if(obj.addEventListener){
		obj.addEventListener(sEv,function(ev){
			var oEvent=ev || event;//新的火狐可能不用兼容
			if(fn.apply(obj,arguments)==false)
			{
				oEvent.cancelBubble=true;//阻止冒泡
				oEvent.preventDefault();//阻止默认行为

			};
			//fn.apply(obj,arguments);
		},false);
	}else{
		obj.attachEvent('on'+sEv,function(ev){
			var oEvent=ev || event;
			if(fn.apply(obj,arguments)==false)
			{
				oEvent.cancelBubble=true;//阻止冒泡
				return false;
			}

		});
	}
};
//getStyle
function getStyle(obj,name){
	return (obj.currentStyle || getComputedStyle(obj,false))[name];
};
function $(arg){
	return new XQuery(arg);
};

//domReady
function domReady(fn){
	if(document.addEventListener){
		document.addEventListener('DOMContentLoaded',fn,false);
	}else{
		document.attachEvent('onreadystatechange',function(){
			if(document.readyState=='complete'){
				fn && fn();
			}
		});
	}
};
//getEle
function getEle(str,aParent){
		//获取用户传入的元素
		var arr=str.replace(/^\s+|\s+$/g,'').split(/\s+/);
		//存一个要找的元素的一个父级
		var aParent=aParent ||[document];
		//要找的元
		var aChild=[];
///***上次得到的结果是下一次的父级
		for (var i = 0; i < arr.length; i++) {
			aChild=getStr(aParent,arr[i]);
			aParent=aChild;
		}
		//最后得到的一个结果
		return aChild;
};
	function getStr(aParent,str){
		var aChild=[];
		for (var i = 0; i < aParent.length; i++)
		{
			switch (str.charAt(0)){
				case '#':
					var obj=document.getElementById(str.substring(1));
					aChild.push(obj);
					break;
				case '.':
					var aEle=getByClass(aParent[i],str.substring(1));
					for(var j=0;j<aEle.length;j++){
//						/aChild[j]=aEle[j];
						aChild.push(aEle[j]);
					}
					break;
				default://标签
					if(/\w+\.\w+/.test(str)){//li.cf
						//li 跟 .cf分开
						var aStr=str.split('.');
						var aEle=aParent[i].getElementsByTagName(aStr[0]);
						var reg=new RegExp('\\b'+aStr[1]+'\\b');
						for (var j=0;j<aEle.length;j++)
						{
							if(reg.test(aEle[j].className))
							{
								aChild.push(aEle[j]);
							}
						}
					}else if(/\w+:\w+(\(\d+\))?/.test(str)){//伪类
						var aStr=str.split(/:|\(|\)/g);
						var aEle=aParent[i].getElementsByTagName(aStr[0]);
						//判断伪类
						switch (aStr[1]){
							case 'first':
								aChild.push(aEle[0]);
								break;
							case 'last':
								aChild.push(aEle[aEle.length-1]);
								break;
							case 'odd'://奇数
								for(var k=1;k<aEle.length;k+=2)
								{
									aChild.push(aEle[k]);
								}
								break;
							case 'even'://偶数
								for(var k=0;k<aEle.length;k+=2)
								{
									aChild.push(aEle[k]);
								}
								break;
							case 'eq':
								var n=aStr[2];
								aChild.push(aEle[n]);
								break;
							case 'lt'://小于
								var n=aStr[2];
								for (var k=0;k<n;k++) {
									aChild.push(aEle[k]);
								}
								break;
							case 'gt'://大于
								var n=aStr[2];
								for (var k=n;k<aEle.length;k++) {
									aChild.push(aEle[k]);
								}
								break;
							default:
								break;
						}
					}else if(/\w+\[\w+=\w+\]/.test(str)){//input[type=text]
						var aStr=str.split(/\[|\]|=/g);
						var aEle=aParent[i].getElementsByTagName(aStr[0]);
						for (var k=0;k<aEle.length;k++) {
							if(aEle[k].getAttribute(aStr[1])==aStr[2]){
								aChild.push(aEle[k]);
							}
						}
					}

					else{
						var aEle=aParent[i].getElementsByTagName(str);
						for (var j = 0; j < aEle.length; j++)
						{
							//aChild[j]=aEle[j];//每次都在覆盖
							aChild.push(aEle[j]);//一直追加
						}
					}
					break;
			}
		}

		return aChild;
	};
function getByClass(oParent,sClass){
	if(oParent.getElementsByClassName){
		return oParent.getElementsByClassName(sClass);
	}else{
		var arr=[];
		var reg=new RegExp('\\b'+sClass+'\\b');
		var aEle=oParent.getElementsByTagName('*');
		for (var i = 0; i < aEle.length; i++) {
			if(reg.test(aEle[i].className)){
				arr.push(aEle[i]);
			}
		}
		return arr;
	}
};
//ajax
function ajax(json){
	json=json || {};
	if(!json.url){
		console.log('url别忘记了！');
		return;
	}
	json.type=json.type || 'get';//提交类型
	json.data=json.data || {};
	json.time=json.time  || 5000;
	var timer=null;
	clearTimeout(timer);
	if (window.XMLHttpRequest) {
		var oAjax=new XMLHttpRequest();
	} else{
		var oAjax=new ActiveXObject('Microsoft.XMLHTTP');
	}
	switch (json.type.toLowerCase()){
		case 'get':
			oAjax.open('GET',json.url+'?'+json2url(json.data),true);
			oAjax.send();
			break;
		case 'post':
			oAjax.open('POST',json.url,true);
			oAjax.setRequestHeader('Content-Type','application/x-www-form-urlencoded');
			oAjax.send(json2url(json.data));
			break;
	}
	//网络加载
	json.fnLoading &&　json.fnLoading();

	oAjax.onreadystatechange=function(){
		if(oAjax.readyState==4)
		{
			json.complete && json.complete();
			if(oAjax.status>=200 && oAjax.status<300 || oAjax.status==304){
				json.success && json.success(oAjax.responseText);
			}else{
				json.error && json.error(oAjax.status);
			}
			clearTimeout(timer);
		}
	};
	//网络超时
	timer=setTimeout(function(){
		alert('您的网络不给力啊');
		oAjax.onreadystatechange=null;
	},json.time);
};
function json2url(json){
	json.t=Math.random();
	var arr=[];
	for(var name in json){
		arr.push(name+'='+json[name]);
	}
	return arr.join('&');
};
//jsonp
function jsonP(json){
	json=json || {};
	if(!json.url){
		console.log('请传接口链接地址');
		return;
	}
	json.data=json.data || {};
	json.cbName=json.cbName || 'callback';

	var fnName='jsonp_'+Math.random();
	fnName=fnName.replace('.','');
	window[fnName]=function(jsonD){
		json.success &&　json.success(jsonD);

		//删除script
		oHead.removeChild(oS);
	};
	json.data[json.cbName]=fnName;
	var arr=[];
	for (var name in json.data) {
		arr.push(name+'='+json.data[name]);
	}
	var oHead=document.getElementsByTagName('head')[0];
	var oS=document.createElement('script');
	oS.src=json.url+'?'+arr.join('&');
	oHead.appendChild(oS);
};
//move
function move(obj,json,options){
	options=options || {};
	options.duration = options.duration || 500;
	options.easing = options.easing || 'linear'

	var count=Math.floor(options.duration/30);
	var start={};  //装起始值

	var dis={};

	for(var name in json){
		//iTarget->json[name]
		start[name]=parseFloat(getStyle(obj,name));

		if(isNaN(start[name])){
			switch(name){
				case 'left':
					start[name]=obj.offsetLeft;
					break;
				case 'top':
					start[name]=obj.offsetTop;
					break;
				case 'width':
					start[name]=obj.offsetWidth;
					break;
				case 'height':
					start[name]=obj.offsetHeight;
					break;
				case 'opacity':
					start[name]=1;
					break;
				//.... fontSize borderWidth

			}
		}

		dis[name]=json[name]-start[name];
	}


	var n=0; //当前走了第几次

	clearInterval(obj.timer);
	obj.timer=setInterval(function(){
		n++;
		for(var name in json){
			switch(options.easing){
				case 'linear':
					var a=n/count;
					var cur=start[name]+dis[name]*a;
					break;
				case 'ease-in':
					var a=n/count;
					var cur=start[name]+dis[name]*Math.pow(a,3);
					break;
				case 'ease-out':
					var a=1-n/count;
					var cur=start[name]+dis[name]*(1-a*a*a);
					break;
			}

			if(name=='opacity'){
				obj.style[name]=cur;
				obj.style.filter='alpha(opacity:'+cur*100+')';
			}else{
				obj.style[name]=cur+'px';
			}
		}

		if(n==count){
			clearInterval(obj.timer);
			options.complete && options.complete.call(obj);
		}
	},30);
};
