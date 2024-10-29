//initializing some variables
var last_message = 0;
var chat_message_to = 0;
var send_message = '';
var busy_communication = false;
var z_index = 1;
var chat_hide = 0;
var chat_tab_active = 'public';


 
function chat_start(start){
if(start == 2){
	var chat_height = "25px";
	chat_hide = 1;
	}else{
	var chat_height = "171px";
	}
	if(chat_hide == 1)
		var chat_toggle="expand";
	else
		var chat_toggle="collapse";
//start the ajax calls
window.onload = get_users();
//window.onload = send_recieve_messages();
setInterval("get_users()", 10000);
setInterval("send_recieve_messages()", 3000);
window.onbeforeunload = function () {
    get_users(0);
}


	$("body").append('<div class="chat_box" style="height: '+chat_height+';">'
	+'<div class="chat_header">'
	+'<div id="chat_tab_public" onclick="chat_tab(0);" class="chat_tab chat_tab_active">Public</div>'
	+'<div id="chat_end"class="chat_tab" onclick="return chat_end();"><img src="/wp-content/plugins/amw-chat/img/end.png" alt="[X]" /></div>'
	+'<div id="chat_toggle" class="chat_tab" onclick="return chat_toggle();"><img src="/wp-content/plugins/amw-chat/img/'+chat_toggle+'.png"  alt="-" /></div>'
	+'</div>'
	+'<div class="chat_body">'
	+'<div class="chat_window" id="chat_window_public">'
	+'</div>'
	+'<div class="chat_users">'
	+'<p>Loading...</p>'
	+'</div>'
	+'<div class="chat_submit">'
	+'<form id="chat_form" onsubmit="return set_message(0);">'
	+'<input id="send_message_public" class="send_message" type="text" value="" placeholder="enter your message..."/>'
	+'<input type="submit" id="chat_submit_public" class="chat_submit_botton" value="enter" />'
	+'</form>'
	+'</div>'
	+'<div class="catchall"></div>'
	+'</div>'
	+'<div class="catchall"></div>'
+'</div>');

}

function get_users(status) {//get a list of online users and send current user's status
    status = typeof (status) != 'undefined' ? status : 1; //1 = active, 0 = disconnected
    $.ajax({
        url: '/wp-content/plugins/amw-chat/connect.php',
        type: "POST",
        data: "status=" + status,
        success: function (data) {
            var UserArray = data.split("|");
            $(".chat_users").html("");
            for (i = 0; i < UserArray.length - 1; i++) {
                //alert(UserArray[i]);
                var UserData = UserArray[i].split(";");
                if (UserData[3] == '1') var status_icon = "connected";
                else var status_icon = "disconnected";
				if(getCookie('chat_id') == UserData[0]) var chat_me = "chat_me";
				else var chat_me = "";
                $(".chat_users").append("<div class=\"chat_user "+chat_me+"\" onClick=\"message_user(this);\" id=\"" + UserData[0] + "\">" + "<div id=\"status\" class=\"" + status_icon + "\"></div>" + UserData[1] + "</div>");
                if ($('#chat_tab_' + UserData[0]).length) {
                    $('#chat_tab_' + UserData[0]).find('#status').attr('class', status_icon);
                }
            }
        }
    });
}

function getCookie(c_name)
{
var i,x,y,ARRcookies=document.cookie.split(";");
for (i=0;i<ARRcookies.length;i++)
{
  x=ARRcookies[i].substr(0,ARRcookies[i].indexOf("="));
  y=ARRcookies[i].substr(ARRcookies[i].indexOf("=")+1);
  x=x.replace(/^\s+|\s+$/g,"");
  if (x==c_name)
    {
    return unescape(y);
    }
  }
}
function setCookie(c_name,value,exdays)
{
var exdate=new Date();
exdate.setDate(exdate.getDate() + exdays);
var c_value=escape(value) + ((exdays==null) ? "" : "; expires="+exdate.toUTCString());
document.cookie=c_name + "=" + c_value;
}
function chat_callback() {//clears any pending tab animations for new message alerts so they don't build up.
    $(this).clearQueue();
};

//get new messages more recent than last_message var
//Also sends out message if there is one pending
function send_recieve_messages() {
    busy_communication = true;
    //alert(last_message);
    $.ajax({
        url: '/wp-content/plugins/amw-chat/communication.php',
        type: "POST",
        data: "last_message=" + last_message + "&message_to=" + chat_message_to + "&send_message=" + send_message,
        success: function (data) {
            if (send_message != '') {
                $('#send_message_' + chat_message_to).val('');
                $('.chat_submit_botton').val('enter');
                $('.chat_submit_botton').attr("disabled", false);
                $('.send_message').attr("disabled", false);
                send_message = '';
                busy_communication = false;
            }
            if (data != '') {
                var MessagesArray = data.split("\"");
                for (i = MessagesArray.length - 2; i >= 0; i--) {
                    var Message_data = MessagesArray[i].split("'");
					if(getCookie('chat_id') == Message_data[1]) var chat_me = "chat_from_me";
					else var chat_me = "message_from";
                    if (Message_data[0] == '0') {
                        $("#chat_window_public").append("<br/><span class=\""+chat_me+"\">" + Message_data[2] + "</span>" + " <span class=\"message_time\">[" + Message_data[3] + "]</span> <span class=\"message_text\">" + Message_data[4] + "</span> ");
                        $("#chat_window_public").scrollTop($("#chat_window_public").prop("scrollHeight"));
                        $('#chat_tab_public').effect("highlight", {}, 3000, chat_callback);
                    } else {
                        if ($('#private_' + Message_data[1]).length) {
                            $('#chat_tab_' + Message_data[1]).effect("highlight", {}, 3000, chat_callback);

                        } else {
                            $(".chat_body").before('<div class="private"  style="z-index:' + z_index + ';" id="private_' + Message_data[1] + '" ><div class="chat_window_private" id="chat_window_' + Message_data[1] + '"></div><div class="chat_submit"><form onsubmit="return set_message(' + Message_data[1] + ');" id="chat_form"><input type="text" placeholder="enter your message..." value="" id="send_message_' + Message_data[1] + '" class="send_message"><input type="submit" value="enter" id="chat_submit_' + Message_data[1] + '" class="chat_submit_botton"></form></div><div class="chat_delete" onclick="chat_tab_delete(' + Message_data[1] + ');">close tab</div></div>');
                            $(".chat_header").append('<div class="chat_tab" id="chat_tab_' + Message_data[1] + '" onclick="chat_tab(' + Message_data[1] + ');"><div id="status" class="disconnected"></div>' + Message_data[5] + '</div>');
                            z_index++;
                            chat_tab_select(Message_data[1]);
                        }
                        $("#chat_window_" + Message_data[1]).append("<br/><span class=\""+chat_me+"\">" + Message_data[2] + "</span>" + " <span class=\"message_time\">[" + Message_data[3] + "]</span> <span class=\"message_text\">" + Message_data[4] + "</span> ");
						
                        $("#chat_window_" + Message_data[1]).scrollTop($("#chat_window_" + Message_data[1]).prop("scrollHeight"));
                    }
                }
                last_message = MessagesArray[MessagesArray.length - 1];
            }
        }
    });
}

function message_user(user) {//create personal chat window when user is clicked or switches to tab if already opened
    var user_id = user.getAttribute("id");
    var user_name = user.innerHTML;
    if ($('#private_' + user_id).length) {
        $('#private_' + user_id).css("z-index", z_index);
    } else {
        $(".chat_body").before('<div class="private" style="z-index:' + z_index + ';" id="private_' + user_id + '" ><div class="chat_window_private" id="chat_window_' + user_id + '"></div><div class="chat_submit"><form onsubmit="return set_message(' + user_id + ');" id="chat_form"><input type="text" placeholder="enter your message..." value="" id="send_message_' + user_id + '" class="send_message"><input type="submit" value="enter" id="chat_submit_' + user_id + '" class="chat_submit_botton"></form></div><div class="chat_delete" onclick="chat_tab_delete(' + user_id + ');">close tab</div></div>');
        $(".chat_header").append('<div class="chat_tab" id="chat_tab_' + user_id + '" onclick="chat_tab(' + user_id + ');">' + user_name + '</div>');
        z_index++;
        chat_tab_select(user_id);
    }
}

function chat_tab(user_id) {
    if (user_id != 0) $('#private_' + user_id).css("z-index", z_index);
    else {
        $('.chat_body').css("z-index", z_index);
        user_id = "public";
    }

    $('#chat_tab_' + user_id).css("text-decoration", "none");
    z_index++;
    if (chat_hide == 1) chat_toggle();
    chat_tab_select(user_id);
}

function chat_tab_delete(user_id) {
    //chat_tab_select('public');
    if (user_id != 0) {
        $('#private_' + user_id).remove();
        $('#chat_tab_' + user_id).remove();
    }
}

function chat_tab_select(tab_id) {
    $('#chat_tab_' + chat_tab_active).removeClass('chat_tab_active');
    $('#chat_tab_' + tab_id).addClass('chat_tab_active');
    chat_tab_active = tab_id;
}

function set_message(user_id) {
    if (user_id == 0) user_id = 'public';
    if ($('#send_message_' + user_id).val()) {

        chat_message_to = user_id;
        if ($('#send_message' + user_id).val() != '') {
            send_message = $('#send_message_' + user_id).val();
            $('#chat_submit_' + user_id).val('...');
            $('.chat_submit_botton').attr("disabled", true);
            $('.send_message').attr("disabled", true);
        }
        //alert(send_message);
    }

    return false;
}

function chat_end() {
    if ($(".chat_box").is(":hidden")) {
        $(".chat_box").show("slow");
    } else {
		setCookie("chat_start", 3, 1);
        $(".chat_box").slideUp();
    }
    return false;
}

function chat_toggle() {
    if (chat_hide == 0) {
		setCookie("chat_start", 2, 1);
        $(".chat_box").animate({
            height: '25px'
        }, 500, function () {
            // Animation complete.
        });
        chat_hide = 1;
        $("#chat_toggle").html('<img src="/wp-content/plugins/amw-chat/img/expand.png" alt="^" />');
    } else {
			setCookie("chat_start", 1, 1);
        $(".chat_box").animate({
            height: '151px'
        }, 500, function () {
            // Animation complete.
        });
        chat_hide = 0;
        $("#chat_toggle").html('<img src="/wp-content/plugins/amw-chat/img/collapse.png" alt="-" />');
    }
    return false;

}

$(document).ready(function() {
	var start_chat = getCookie("chat_start");

if(start_chat != 3){
	chat_start(start_chat);
}
 });