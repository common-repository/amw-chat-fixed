<?php ### Load WP-Config File If This File Is Called Directly
if (!function_exists('add_action')) {	
	$wp_root = '../../..';	
if (file_exists($wp_root.'/wp-load.php')) {
	require_once($wp_root.'/wp-load.php');	
	} 
	else {
	require_once($wp_root.'/wp-config.php');
	}
	}	
	get_currentuserinfo();
	$chat_login_name = $current_user->user_login;
	$last_message = (int)$_POST['last_message'];
	$message_to = (int)$_POST['message_to'];
	$message = htmlspecialchars(trim($_POST['send_message']), ENT_QUOTES);
	$id = $_COOKIE['chat_id'];
	if($chat_login_name != ''){
	$name = $chat_login_name;
	}
	else{	
	$name = "*guest_".$_COOKIE['chat_name'];
	}
	if($message != ''){
	$query = "INSERT INTO ".$wpdb->prefix."amw_chat_messages(ID, name, recipient, message) VALUES('$id', '$name', $message_to, '$message')";
	$wpdb->query($query);
	}
	$query = "SELECT *, ".$wpdb->prefix."amw_chat_messages.name AS name,  ".$wpdb->prefix."amw_chat_messages.ID AS ID,  ".$wpdb->prefix."amw_chat_online_users.name AS r_name FROM  ".$wpdb->prefix."amw_chat_messages LEFT OUTER JOIN  ".$wpdb->prefix."amw_chat_online_users ON  ".$wpdb->prefix."amw_chat_online_users.ID =  ".$wpdb->prefix."amw_chat_messages.recipient WHERE (recipient = 0 OR recipient = '".$id."' OR  ".$wpdb->prefix."amw_chat_messages.ID = '".$id."') AND message_id > $last_message ORDER BY time_stamp DESC LIMIT 0, 15";
	$results =  $wpdb->get_results($query);
	$new_last_message = false;if($results) {	
	foreach($results as $fields) {	
	$timestamp = explode(" ", $fields->time_stamp);	
	$time_stamp = $timestamp[1];		
	if($id == $fields->ID && $fields->recipient != 0) { 
	echo $fields->ID."'".$fields->recipient."'".$fields->name."'".$time_stamp."'".$fields->message."'".$fields->r_name."\"";
    }	
	else {	
	echo $fields->recipient."'".$fields->ID."'".$fields->name."'".$time_stamp."'".$fields->message."'".$fields->name."\"";
	}
	if(!$new_last_message) {
	$new_last_message = $fields->message_id;
		}
		}
		}
		echo $new_last_message;

?>