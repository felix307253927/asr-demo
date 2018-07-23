/**
 * @author zhangyu
 * @date 2016年11月01日
 */
$(function(){
	//status参数含义：0：初始状态；1：准备状态；2：播放状态；
	var status = 0;
	//isGirl参数含义：0：女声；1：男生；
	var isGirl = 0;
	//0 不可点击  ，1 可点击； 
	var canClick = 1;
	// 检查是否正在播放
	
    var isPlaying = false;
    var ttsText = "";
	var globalServerPath = $.trim($("#global_server_path").html());
    var player = document.getElementById('tts_audio');
    //    TTS 服务起来之后，注释下面的这行代码
    var logdiv = document.getElementById('output');
    function stop(msg) {
        logdiv.innerHTML += msg + "</br>";
    }
    /**
     * 播放器监听
     */
    var watchAudio = function (audio) {
    	// 播放状态监听
    	$addEvent(audio, 'canplay', function () {
    		$(".midlle-zone").removeClass("waitting");
    		$(".midlle-zone").addClass("playing");
    		status = 2;
	    })
	    // 结束监听
	    $addEvent(audio, 'ended', function () {
    		$("#shade").hide();
    		$("#speedSlider").slider( "enable" );
    		$("#voicePitchSlider").slider( "enable" );
    		$("#voiceVolumeSlider").slider( "enable" );
    		$(".midlle-zone").removeClass("waitting");
    		$(".midlle-zone").removeClass("playing");
    		audio.pause()
    		//$(".voiceSpeedSele").removeClass("gray");
    		status = 0;
    		canClick = 1;
	    })
	    // 暂停状态监听
	    $addEvent(audio, 'pause', function () {
	    	$(".midlle-zone").removeClass("waitting");
    		$(".midlle-zone").removeClass("playing");
    		canClick = 1;
	    })
	    // 暂停错误监听
	    $addEvent(audio, 'error', function () {
	    	$("#shade").hide();
    		$("#speedSlider").slider( "enable" );
    		$("#voicePitchSlider").slider( "enable" );
    		$("#voiceVolumeSlider").slider( "enable" );
    		$(".midlle-zone").removeClass("waitting");
    		$(".midlle-zone").removeClass("playing");
    		audio.pause()
    		//$(".voiceSpeedSele").removeClass("gray");
    		status = 0;
    		canClick = 1;
	    })
	   
    }
   
	/**
	 * 获取audio标签（兼容ie）
	 */
	var getNewAudio = function (src) {
		var ad = new Audio();
		ad.src = src;
		ad.autoplay="autoplay";
		ad.controls="controls"; 
		ad.innerHTML = 'Your browser does not support the audio element.';
		return ad
	}
	function isIE() { //ie?  
	    if (!!window.ActiveXObject || "ActiveXObject" in window) return true;
	    else return false;
	}
	if (!isIE()) {
		watchAudio(player)
	}
	var ad = null;
	var catchURl = ''
	//提交需求
	$("#playBtn").click(function(){
		/*var a = $("#voicePitchSlider").slider( "value" );
		var b = $("#voiceVolumeSlider").slider( "value" );*/
		
		/*var c = $(".voiceSpeedSele").find(".selected").attr("data-val");*/
		
		if(isGirl == 1){
			return;
		}
		canClick = 0;
		var txt = $('#userMsg').val();
		var voiceName = $("#voiceName").html();
		var voicePitch = $("#voicePitchSlider").slider( "value" );
		var voiceVolume = $("#voiceVolumeSlider").slider( "value" );
		//var voiceSpeed = $(".voiceSpeedSele").find(".fa-check-circle-o").parent().parent().attr("data-val");
		var voiceSpeed = $("#speedSlider").slider( "value" );
		if(txt == null || txt.length <=0){
			alertMessage("请输入您想要语音合成的文字！");
			return;
		}
		if(status == 0){
			$("#shade").show();
			$("#speedSlider").slider( "disable" );
			$("#voicePitchSlider").slider( "disable" );
			$("#voiceVolumeSlider").slider( "disable" );
			//$(".voiceSpeedSele").addClass("gray");
			$(".midlle-zone").addClass("waitting"); 
		    var url = globalServerPath+"/TTSServlet?text=" + encodeURIComponent(txt) + "&voiceName=" + voiceName + "&voicePitch=" + voicePitch + "&voiceSpeed=" + voiceSpeed + "&voiceVolume=" + voiceVolume ;
		    console.log(url);
		    // ie兼容性,播放异常
		    if (!isIE()) {
				player.src = url;
			    player.play();
		    } else {
			    ad = null;
			    catchURl = url;
				ad = getNewAudio(url)
				$('#newAudio').html(ad);
			    ad.play()
			    watchAudio(ad)
		    }
		}else if(status == 2){
			$("#shade").hide();
			$("#speedSlider").slider( "enable" );
			$("#voicePitchSlider").slider( "enable" );
			$("#voiceVolumeSlider").slider( "enable" );
			//$(".voiceSpeedSele").removeClass("gray");
			if (isIE()) {
				ad.pause();
			} else {
		    	player.pause();
			}
			//
			status = 0;
		}   
	});
	/*$(".girl-zone,.boy-zone").click(function(){
		if(!hasClassByJQ($(this), "selected")){
			$(this).siblings(".gender").each(function(index,dom){
				$(dom).removeClass("selected");
			})
			if(hasClassByJQ($(this),"girl-zone")){
				$(".top").removeClass("boy").addClass("girl");
				$("#userMsg").show();
				$(".tipBoy").hide();
				$(".tip").show();
				$("#userMsg").val(ttsText);
				isGirl = 0;
			}else if(hasClassByJQ($(this),"boy-zone")){
				$(".top").removeClass("girl").addClass("boy");
				$("#userMsg").hide();
				$(".tip").hide();
				$(".tipBoy").show();
				ttsText = $("#userMsg").val();
				$("#userMsg").val("");
				isGirl = 1;
			}
			$(this).addClass("selected");
		}
	});*/
	
	
	$(".rightSele_content").on("click",function(){
		if(canClick == 0 ){
			return false;
		}
		$(this).siblings().each(function(){
			$(this).removeClass("active");
		})
		var theId = $(this).attr("data-val");
		$(".girl-zone-content").hide();
		$("#"+theId+"").show();
		$(this).addClass("active");
	})
	
	
	$(".imgDiv").on("click",function(){
		/*$(this).parent().siblings().each(function(){
			$(this).removeClass("selected");
		})
		
		$(this).parent().addClass("selected");*/
		$(".imgDiv i").attr("class","fa fa-circle-o");
		$(this).find("i").attr("class","fa fa-check-circle-o");
	})
	
	$("#speedSlider").slider({
		  width:"100px",
	      orientation: "horizontal",
	      range: "min",
	      min: 1,
	      max: 100,
	      value: 50
	});
	$("#voicePitchSlider").slider({
		  width:"100px",
	      orientation: "horizontal",
	      range: "min",
	      min: 1,
	      max: 100,
	      value: 50
    });
	
	$("#voiceVolumeSlider").slider({
	      orientation: "horizontal",
	      range: "min",
	      min: 1,
	      max: 100,
	      value: 50
	});
	
	
	//返回
	getEleByClassName("back", "div")[0].onclick = function(){
		window.history.back(-1); 
	}
	
	//导航头的切换
	// $(".selectedLi").removeClass("selectedLi");
	
	// var footer = getEleByClassName("navbar-fixed-bottom", "div")[0];
	// removeClass(footer, "navbar-fixed-bottom");
	// addClass(footer, "navbar-footer");
});