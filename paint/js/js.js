/*resize canvas to fit screen size*/


var sheet = document.getElementById('sheet'),
context = sheet.getContext('2d');
function resizeCanvas() {
	sheet.width = parseInt($("body").css("width"));
	sheet.height = parseInt($("body").css("height"))-50
	sheet.style.marginTop="50px";
}
window.addEventListener('resize', resizeCanvas, false);
resizeCanvas();


$(document).ready(function() {

	var pointerX=0;
	var pointerY=0;

	var canvas = new fabric.Canvas('sheet',{backgroundColor : "white"});
	canvas.freeDrawingBrush.color ="#FF0000";
	canvas.isDrawingMode=true;
	canvas.freeDrawingBrush.width =30 

	function bubble(obj){
		if(obj.id==null)return;
		var w=obj.w!=null?obj.w:null;
		var h=obj.h!=null?obj.h:null;
		var pos=obj.pos!=null?obj.pos:null;

		var el=$("#"+obj.id);
		var elpos = el.offset();
		var elw=parseInt(el.css("width"))/2;
		var elh=parseInt(el.css("height"));

		var x=elpos.left-elw/2;
		if(pos==null||pos=='center')
			x-=(w/2);	
		else if(pos=='right')
			x-=w;

		var y=elpos.top-elh/2;

		var tw=obj.tw!=null?obj.tw:null;
		var th=obj.th!=null?obj.th:null;

		var bg=obj.bg!=null?obj.bg:"#FFF";
		var border=obj.border!=null?obj.border:"#000";
		var color=obj.color!=null?obj.color:"#000";
		var text=obj.text!=null?obj.text:"";
		var textSize=obj.textSize!=null?obj.textSize:null;
		if(textSize==null)
			textSize=w/10;

		var angle=obj.angle!=null?obj.angle:0;
		var textAngle=obj.textAngle!=null?obj.textAngle:"";
		if(textAngle==null)textAngle=angle;

		if(w==null)w=200;
		if(h==null)h=50;
		if(tw==null)tw=w/10;
		if(th==null)th=h/4;
		var tl;

		if(pos=='center')
			tl=x+w/2-tw/2;
		else if(pos=='right')
			tl=x+w-tw;
		else if(pos=='left')
			tl=x;
		else 
			tl=x+w/2-tw/2;

		var rect = new fabric.Rect({ left:x, top:y,width: w, height: h, fill: bg,stroke:border });
		var tri = new fabric.Triangle({left:tl, top:y-th,width:tw, height:th,fill: bg,stroke:border});
		var l=text.length;
		var txtWidth=(l*textSize)/2;
		var txtX=x;
		var offset=(w-txtWidth)/2
		if(w>txtWidth)
			txtX+=offset
		var txtY=y+h/2-textSize/2;
		var txt = new fabric.Text(text,{ left:txtX,angle:textAngle, top: txtY,fontFamily: 'rial',fontSize:textSize,fill:color});
		
		var group = new fabric.Group([rect, tri,txt], { left: x, top: y,angle:angle,selectable:false});
		canvas.add(group);
		return group;
	}


	var help_bubbles
	function show_help(){
		if(window.innerWidth<650)return;
		var b12= bubble({id:"help",w:120,h:25,tw:4,th:20,pos:'left',textSize:15,text:'  click here to hide',bg:'red',border:'black',color:'black'})
		var b1= bubble({id:"pointer",w:200,h:40,tw:4,th:50,pos:'right',text:'mouse pointer',bg:'white',border:'black',color:'black'})
		var b2= bubble({id:"pen",w:200,h:40,tw:4,th:100,pos:'right',text:'brush',bg:'white',border:'black',color:'black',index:2})
		var b3= bubble({id:"bg",w:200,h:40,tw:4,th:150,pos:'right',text:'background color',bg:'white',border:'black',color:'black'})
		var b4= bubble({id:"pcolor",w:200,h:40,tw:4,th:200,pos:'right',text:'brush color',bg:'white',border:'black',color:'black'})
		var b5= bubble({id:"line-width",w:200,h:40,tw:4,th:250,pos:'right',text:'brush length',bg:'white',border:'black',color:'black'})
		var b6= bubble({id:"text",w:200,h:40,tw:4,th:300,pos:'center',text:'insert text',bg:'white',border:'black',color:'black'})
		var b7= bubble({id:"image",w:200,h:40,tw:4,th:250,pos:'left',text:'insert image',bg:'white',border:'black',color:'black'})
		var b8= bubble({id:"clear",w:200,h:40,tw:4,th:200,pos:'left',text:'clear sheet',bg:'white',border:'black',color:'black'})
		var b9= bubble({id:"redo",w:200,h:40,tw:4,th:150,pos:'left',text:'undo',bg:'white',border:'black',color:'black'})
		var b10= bubble({id:"undo",w:200,h:40,tw:4,th:100,pos:'left',text:'redo',bg:'white',border:'black',color:'black'})
		var b11= bubble({id:"download",w:200,h:40,tw:4,th:50,pos:'left',text:'save as image',bg:'white',border:'black',color:'black'})
		var by = new fabric.Text("Developed By : Mahmoud Aly ",{ left:window.innerWidth/2-170, top: 370,fontFamily: 'rial',fontSize:20,fill:"green",selectable:false});
		canvas.add(by);
		help_bubbles=[b1,b2,b3,b4,b5,b6,b7,b8,b9,b10,b11,b12,by]
	}

	if(window.innerWidth<650){
		$("#help").hide();
                $(".toolbar").css("height","90px");
                $("#sheet").css("margin-top","100px");
	}else{
		show_help()	
	}

	function hide_help(){
		for(var i=0;i<help_bubbles.length;i++)
			canvas.remove(help_bubbles[i])
		help_bubbles=null;
	}



	$("#help").click(function () {
		if(help_bubbles!=null)hide_help();
		else show_help();
	});


	$("#bg").click(function () {
		$("#bg-color")[0].click();
	});

	$('#bg-color').change(function() {
		var color=$(this).val();
		$("#bg").css("color",color);
		canvas.backgroundColor = color;
		canvas.renderAll();
	});

	$("#pcolor").click(function () {
		$("#pen-color")[0].click();
	});

	$('#pen-color').change(function() {
		var color=$(this).val();
		$("#pcolor").css("color",color);
		$(".line-width").css("color",color);
		canvas.freeDrawingBrush.color =color;
	});


	$("#clear").click(function() {
		help_bubbles=null;
		canvas.clear() 
	});

	$("#draw").css("color","blue");

	function draw() {
		$("#pen").css("color","blue");
		$("#pointer").css("color","white");
		canvas.isDrawingMode = true;
	}

	$("#pen").click(function(){draw()});

	function point() {
		$("#pointer").css("color","blue");
		$("#pen").css("color","white");
		canvas.isDrawingMode = false;
	}


	$("#pointer").click(function(){point()});

	$('#line-width').change(function() {
		var w=parseInt($(this).val(), 10) || 1;
		$(".line-width-icon").fadeIn(500);
		var ww = window.innerWidth-40;
		var wh = window.innerHeight;
		$(".line-width-icon").css("left",ww-w);
		$(".line-width-icon").css("top",wh-w-50);
		$(".line-width-icon").css("width",w);
		$(".line-width-icon").css("height",w);
		$(".line-width-icon").fadeOut(2000);
		canvas.freeDrawingBrush.width =w 
	});

	draw();

	var obj;

	var history=[];
	var index=0;

	canvas.on('mouse:down', function(options) {
try{
		if(options.target!=null&&options.target.text!=null&&options.target.text.indexOf("Mahmoud")>-1){
			window.open("http://ma7moud3ly.com")
			return;
		}
		var pointer = canvas.getPointer(event.e);
		pointerX = pointer.x;
		pointerY= pointer.y;
		if (options.target) ;
			//$("#delete").fadeIn(300);
		else
			$("#delete").fadeOut(300);

		if(history.length<50)
			history.push(JSON.stringify(canvas))
		else
			history=[];
		index=0;
		esc()
}catch(e){}
	});

	canvas.on('object:selected', function(options) {
		if (options.target&&canvas.isDrawingMode==false) {
			$("#delete").fadeIn(300);
		}
	});


	$("#undo").click(function(){
		if(index<history.length){
			canvas.loadFromJSON(history[history.length-index-1])
			if(index<history.length-1)
				index++;
		}else
		$("#redo").attr("enable",true);
	});

	$("#redo").click(function(){
		canvas.loadFromJSON(history[history.length-1])
		index=0;
	});


	function del(){
		canvas.remove(canvas.getActiveObject());
		$("#delete").fadeOut(600);
	}

	$('#delete').click(function(){del()});

	$("#image").click(function(){
		$("#text_box").fadeOut(100);
		var pos = $(this).offset();
            if(window.innerWidth>650){
		$("#image_box").css("top",pos.top+50)
		$("#image_box").css("left",pos.left+30)
	        }else{
		$("#image_box").css("top","95px")
		$("#image_box").css("left","0")
	        }	
		$("#image_box").toggle(500);
	});


	$("#add_image").click(function(){
		fabric.Image.fromURL(src, function(oImg) {
			oImg.set({ left: pointerX, top: pointerY});
			canvas.add(oImg);
		});
		point();
		$("#image_box").fadeOut(100);

	})

	$("#text").click(function(){
		$("#image_box").fadeOut(100);
		var pos = $(this).offset();	
            if(window.innerWidth>650){
		$("#text_box").css("top",pos.top+50)
		$("#text_box").css("left",pos.left+30)
	        }else{
		$("#text_box").css("top","95px")
		$("#text_box").css("left","0")
	        }			
		$("#text_box").toggle(500);
	});

	$("#add_text").click(function(){
		var c=$("#pen-color").val();
		var txt=$("#text_text").val();
		var size=$("#text_font_size").val();
		var text = new fabric.Text(txt, { left: pointerX, top: pointerY,fontFamily: 'tahoma',fontSize:size,fill:c});
		canvas.add(text);
		$("#text_box").fadeOut(100);
		point();
	});

	$("#text_font_size").change(function(){
		var size=$(this).val();
		$("#text_text").css("font-size",size+"px");
	});		

	$("#download").click(function(){
		window.open(canvas.toDataURL('image/png'));
		var gh = canvas.toDataURL('png');
		var a  = document.createElement('a');
		a.href = gh;
		a.download = 'image.png';
		a.click()
	});

	function esc(){
		$(".line-width-icon").fadeOut(100);
		$("#image_box").fadeOut(100);
		$("#text_box").fadeOut(100);
	}


	$(document).keyup(function(e) {
		//alert(e.keyCode)
		if (e.keyCode === 13)draw();     // enter
		else if (e.keyCode === 27)esc();  // esc
		else if (e.keyCode === 77||e.keyCode === 80)point() ; // p or m move
		else if (e.keyCode === 46||e.keyCode === 8)del();  // backspace
		else if (e.keyCode === 67)canvas.clear();  // delete
		else ;
	});

});

