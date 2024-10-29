<?php
/**
 * @package AMW-Chat_Fixed
 * @version 1.1
 */
/*
Plugin Name: AMW Chat Fixed
Plugin URI: http://wordpress.org/extend/plugins/amw_chat/
Description: A small live chat module that allows members/guests to chat with each other as they browse your site. Includes public chat as well as private messaging.  Discussions carry across pages as users browse your site.
Author: gearsgod
Version: 1.1
Author URI: http://gearsworks.host22.com
*/
/*  
	Copyright 2011 AlexMakesWebsites.com  (email : alex@alexmakeswebsites.com)

    This program is free software; you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation; either version 2 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.
	
	You are free to user this script on your website and edit it 
	in any way you wish as long as you do not sell it for profit.
*/

//prints the required javascript
function amw_chat() {
	echo '<script type="text/javascript" src="https://ajax.googleapis.com/ajax/libs/jquery/1.6.2/jquery.min.js"></script>
<script type="text/javascript" src="https://ajax.googleapis.com/ajax/libs/jqueryui/1.8.14/jquery-ui.min.js"></script>';
	echo '<script type="text/javascript" src="'.plugins_url().'/amw-chat/js/amw.chat.js"></script>';
}

//places the javascript into the footer of each page
add_action( 'wp_footer', 'amw_chat' );

//prints the required css
function amw_chat_css() {
	echo '<link rel="stylesheet" type="text/css" href="'.plugins_url().'/amw-chat/css/amw.chat.css">';
}


//create the database used for storing users and messages
function amw_chat_install() {
   global $wpdb;

   $table_name = $wpdb->prefix . "amw_chat";
      
   $sql = "CREATE TABLE `" . $table_name . "_messages` (
  `message_id` int(11) NOT NULL auto_increment,
  `ID` int(10) NOT NULL,
  `name` varchar(250) collate latin1_german2_ci NOT NULL,
  `recipient` int(10) NOT NULL,
  `message` text collate latin1_german2_ci NOT NULL,
  `time_stamp` timestamp NOT NULL default CURRENT_TIMESTAMP,
  PRIMARY KEY  (`message_id`)
) ;

CREATE TABLE `" . $table_name . "_online_users` (
  `ID` int(11) NOT NULL auto_increment,
  `IP` varchar(100) collate latin1_german2_ci NOT NULL,
  `name` varchar(250) collate latin1_german2_ci NOT NULL,
  `type` tinyint(2) NOT NULL,
  `last_active` timestamp NOT NULL default CURRENT_TIMESTAMP on update CURRENT_TIMESTAMP,
  `connection_status` tinyint(2) NOT NULL default '0',
  `top` int(4) NOT NULL default '0',
  `left` int(4) NOT NULL default '0',
  `click_id` varchar(150) collate latin1_german2_ci default NULL,
  PRIMARY KEY  (`ID`),
  UNIQUE KEY `IP` (`IP`,`name`)
);";

   require_once(ABSPATH . 'wp-admin/includes/upgrade.php');
   dbDelta($sql);

}
//add the css to page header
add_action( 'wp_head', 'amw_chat_css' );
register_activation_hook(__FILE__,'amw_chat_install');
?>
