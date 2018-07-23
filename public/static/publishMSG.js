/**
 * @author zhangkui
 * @date 2014年12月25日 下午3:40:51
 */
var global_creatorId = $.trim($("#global_creatorId").html())+"";
var global_userType = $.trim($("#global_userType_div").html())+"";
var getPublishMessageTimer ;

//初始化
if(global_creatorId!="null"&&global_userType=="2"){
	getMessageByTimer();
}

function getMessageByTimer(){
	getPublishMessageTimer =  setInterval(function(){
		getPublishMessage();
	},1000*60);
}
	
function getPublishMessage(){
	$.ajax({
		url : "MessageAction!pullMsg.action",
		type : "post",
		dataType : "json",
		data:"creatorId="+global_creatorId,
		async : true,
		success : function(result) {
			if(result != null){
				var status = result.status+"";
				if(status!="1"||status == "undefined"||status=="null"){
						var messageAction = result.messageAction;
						var messageContent = result.messageContent;
						var createTime = result.createTime;
						$("#publishMessageModal .modal-content").html(createTime+messageAction+messageContent);
						//显示message modal
						showPublishMsgModal();
						//关闭此定时器
						//clearInterval(getPublishMessageTimer);
				}
			}
		}
	});
}

$("#message_modal_close").click(function(){
	hidePublishMsgModal();
});

function showPublishMsgModal(){
	 $("#publishMessageModal").animate({bottom: '40px'}, 1000);
}

function hidePublishMsgModal(){
	 $("#publishMessageModal").animate({bottom: '-150px'}, "fast");
}

/*$(function(){
	setInterval(function(){
		getPublishMessage();
	},1000*6);
})*/