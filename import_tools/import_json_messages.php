<?php
/**
 * Tranform JSON to MySQL INSERT
 *
 * @category None
 * @package  None
 * @author   Jesse Kaufman <glandix@lloydnet.org>
 * @license  All rights reserved
 * @link     none
 */
define( 'MYSQL_HOST', 'localhost' );
define( 'MYSQL_DB', 'messages' );
define( 'MYSQL_USER', 'messages' );
define( 'MYSQL_PASS', 'not_tellin' );
ini_set( 'mysqli.default_socket', '/home/containers/mariadb/mysqld/mysqld.sock' );

// Create connection

$db = new mysqli( MYSQL_HOST, MYSQL_USER, MYSQL_PASS, MYSQL_DB );

// Check connection
if ( $db->connect_error ) {
	die( 'Connection failed: ' . $db->connect_error );
}

// read JSON file
$json = json_decode( file_get_contents( "./13167653048.json" ) );
$msgs = array_reverse( $json->listSms );

$json = json_decode( file_get_contents( "./17857641660.json" ) );
$msgs = array_merge( $msgs, array_reverse( $json->listSms ) );

foreach ( $msgs as $msg ) {
	$number = preg_replace( '/[^0-9]/', '', str_replace( '+1', '', $msg->adress ) );

	if ( $msg->type === 1 ) {
		$direction = 'IN';
  } else {
		$direction = 'OUT';
		$number    = '3162502647';
	}

  $date = date( 'Y-m-d H:i:s', ( $msg->time / 1000 ) - 18000 );

	$sql  = 'INSERT INTO texts
					 SET date_sent="' . $db->real_escape_string( $date ) . '",
							 from_number="' . $number . '",
							 direction="' . $direction . '",
							 body="' . $db->real_escape_string( trim( $msg->body ) ) . '"';

	echo $sql . "\n\n";

	$db->query( $sql ) or die( $db->error );
}

