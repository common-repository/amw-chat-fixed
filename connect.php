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
 $ip = $_SERVER['REMOTE_ADDR'];
 $connection_status = (int)$_POST['status'];
 get_currentuserinfo();
 $chat_login_name = $current_user->user_login;
 if($chat_login_name != ''){	
 $name = $chat_login_name;	
 $type = 2;
 if($admin) $type = 1;
 $query = "INSERT INTO ".$wpdb->prefix."amw_chat_online_users(IP, name, type, connection_status) VALUES('$ip', '$name', $type, $connection_status) ON DUPLICATE KEY UPDATE connection_status = $connection_status, last_active = DEFAULT";
 $result = $wpdb->query($query);	
 $new_id = mysql_insert_id();	
 if($new_id != $_COOKIE['chat_id'])	setcookie("chat_id", mysql_insert_id(), (time()+(3600*24*7)), "/", $_SERVER['HTTP_HOST']);
 }
 elseif(isset($_COOKIE['chat_name'])){	
 $type = 0;
 $name = "*guest_".$_COOKIE['chat_name'];	
 $query = "INSERT INTO ".$wpdb->prefix."amw_chat_online_users(IP, name, type, connection_status) VALUES('$ip', '$name', $type, $connection_status) ON DUPLICATE KEY UPDATE connection_status = $connection_status, last_active = DEFAULT";
 $result = $wpdb->query($query);	
 $new_id = mysql_insert_id();	
 if($new_id != $_COOKIE['chat_id'])	setcookie("chat_id", mysql_insert_id(), (time()+(3600*24*7)), "/", $_SERVER['HTTP_HOST']);
 }
 else{	
 $type = 0;
 $name = rand(0, 1000);	
 setcookie("chat_name", $name, (time()+(3600*24*7)), "/", $_SERVER['HTTP_HOST']);
 $query = "INSERT INTO ".$wpdb->prefix."amw_chat_online_users(IP, name, type, connection_status) VALUES('$ip', '*guest_$name', $type, $connection_status) ON DUPLICATE KEY UPDATE connection_status = $connection_status, last_active = DEFAULT";
 $result = $wpdb->query($query);
 setcookie("chat_id", mysql_insert_id(), (time()+(3600*24*7)), "/", $_SERVER['HTTP_HOST']);
 }
 $query = "SELECT * FROM ".$wpdb->prefix."amw_chat_online_users WHERE last_active > NOW() - INTERVAL 1 MINUTE ORDER BY last_active ASC LIMIT 0, 5";
 $results = $wpdb->get_results($query);
 if($results) {
 foreach($results as $fields) 
 { 
 echo $fields->ID.";".$fields->name.";".$fields->type.";".$fields->connection_status."|";	
 }
 }
?>