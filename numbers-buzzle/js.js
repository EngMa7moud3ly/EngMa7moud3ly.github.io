$(document).ready(function(){

	var n1=$("#n1");
	var n2=$("#n2");
	var n3=$("#n3");
	var n4=$("#n4");
	var n5=$("#n5");
	var n6=$("#n6");
	var n7=$("#n7");
	var n8=$("#n8");
	var n9=$("#n9");


	/*counter and game reset*/

	var timer_interval=null;
	var t=6;
	var s=t*60;

	
	function reset(){
		clearInterval(timer_interval);
		$(".num").css("background-color","#FFF")
		$(".num").css("box-shadow","inset 0px 0px 0px 2px #669999");
		s=t*60;
		for(var i=0;i<$(".num").length;i++)
			$(".num")[i].innerText=i+1;
		$("#timer").text("00 : 00");
		$("#play").text("Play");
		done=false;
	}



	function timer(){
		var mm=parseInt(s/60);
		var ss=s-(mm*60);
		$("#timer").text((mm>9?mm:"0"+mm)+" : "+(ss>9?ss:"0"+ss));
		if(s<=0)
			reset();
		s--;
		if(done){
			clearInterval(timer_interval);
			var t1=t*60;
			var t2=s;
			var tt=t1-t2;
			var mm=parseInt(tt/60);
			var ss=tt-(mm*60);
			$("#time").text((mm>9?mm:"0"+mm)+":"+(ss>9?ss:"0"+ss))
			$("#title").css("visibility","hidden");
			$(".congrats").fadeIn(1000);	
		}
	}

	timer_interval=setInterval(timer,1000); 	
	var play=true;
	$("#play").on('click', function () {
		reset();
		play=true;
		$("#play").text("Reset");
		timer_interval=setInterval(timer,1000); 	
	});

	$("#help").on('click', function () {
		reset();
		play=false;
		$(".how-to").fadeIn(1000);	
	});

	$(".how-to").on('click', function () {
		$(this).fadeOut(1000);	
	});

	$(".congrats").on('click', function () {
		$("#title").css("visibility","visible");
		$("#play").text("Play");
		done=false;
		$(this).fadeOut(1000);	
	});


	$("body").on('click', function () {
		if(is_touch_device()==false)
			$(".num").css("box-shadow","inset 0px 0px 0px 2px #669999");
	});

	/*drag and drop elements and change colors*/

	$(".num").on('dragstart', function (ev) {
		if(!play)return;
		var id=$(this).attr("id");
		ev.originalEvent.dataTransfer.setData("id",id);
	});

	$(".box").on('dragover', function (ev) {
		ev.preventDefault();
	});


	done=false;
	function check(nn1,nn2,nn3){
		if(parseInt(nn1.text())+parseInt(nn2.text())+parseInt(nn3.text())==15){
			nn1.css("background-color","#f0f5f5")
			nn2.css("background-color","#f0f5f5")
			nn3.css("background-color","#f0f5f5")
			return true;
		}else{
			nn1.css("background-color","#FFF")
			nn2.css("background-color","#FFF")
			nn3.css("background-color","#FFF")
			return false;
		}
	}


	function checkCells(){
		var b1=check(n1,n2,n3);
		var b2=check(n1,n4,n7);
		var b3=check(n2,n5,n8);
		var b4=check(n3,n6,n9);
		var b5=	check(n3,n5,n7);
		var b6=check(n1,n5,n9);

        ////////////////

        var b7=check(n4,n5,n6);
        var b8=check(n1,n4,n7);
        var b9=check(n2,n5,n8);
        var b10=check(n3,n6,n9);
        var b11=check(n3,n5,n7);
        var b12=check(n1,n5,n9);

        ////////////////

        var b13=check(n7,n8,n9);
        var b14=check(n1,n4,n7);
        var b15=check(n2,n5,n8);
        var b16=check(n3,n6,n9);
        var b17=check(n3,n5,n7);
        var b18=check(n1,n5,n9);

        done=b1&&b2&&b3&&b4&&b5&&b6&&b7&&b8&&b9&&b10&&b11&&b12&&b13&&b14&&b15&&b16&&b17&&b18;
    }


    //swap numbers by Drag and Drop on non-screen
    function swap(id1,id2){
    	var val1=$("#"+id1).text();
    	var val2=$("#"+id2).text();
    	$("#"+id1).text(val2)
    	$("#"+id2).text(val1)
    	
    	$(".num").css("background-color","#FFF")
    	checkCells();
    	$(".num").css("box-shadow","inset 0px 0px 0px 2px #669999");
    	$("#"+id2).css("box-shadow","inset 0px 0px 0px 2px red");
    }


    $(".box").on('drop',function(ev){
    	ev.preventDefault();
    	var id1 = ev.originalEvent.dataTransfer.getData("id");
    	var id2=ev.target.id;
    	swap(id1,id2);
    });

    function is_touch_device() {
    	try {  
    		document.createEvent("TouchEvent");  
    		return true;  
    	} catch (e) {  
    		return false;  
    	} 
    }

    var target=false;
    var target_id='';

    //swap numbers on toutch screen
    if(is_touch_device()){
    	$(".num").on('click',function(ev){
    		if(target==false){
    			target_id=$(this).attr("id")
    			$(".num").css("box-shadow","inset 0px 0px 0px 2px #669999");
    			$(this).css("box-shadow","inset 0px 0px 0px 2px red");
    			target=true;
    		}else{
    			var id2=$(this).attr("id")
    			$(".num").css("box-shadow","inset 0px 0px 0px 2px #669999");
    			$(this).css("box-shadow","inset 0px 0px 0px 2px red");
    			target=false;
    			if(target_id!=id2)
    				swap(target_id,id2)
    		}
    	});
    }
});