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
define( 'MYSQL_PASS', 'super_secret_pass' );
ini_set( 'mysqli.default_socket', '/home/containers/mariadb/mysqld/mysqld.sock' );

// Create connection

$db = new mysqli( MYSQL_HOST, MYSQL_USER, MYSQL_PASS, MYSQL_DB );

// Check connection
if ( $db->connect_error ) {
	die( 'Connection failed: ' . $db->connect_error );
}

// read JSON file
$json = json_decode( file_get_contents( './test.json' ) );

foreach ( $json as $msg ) {
	list($number, $body) = explode( ' said: ', $msg );
	$number              = str_replace( '+1', '', preg_replace( '/[^0-9]/', '', $number ) );

	if ( strstr( $body, ' Received on ' ) ) {
		$direction = 'IN';

		list( $body, $raw_date) = explode( '. Received on ', $body );
	} elseif ( strstr( $body, ' Sent on ' ) ) {
		$number    = '3162502647';
		$direction = 'OUT';
		$body      = str_replace( '. Delivered.', '', $body );

		list( $body, $raw_date ) = explode( '. Sent on ', $body );
	}

	$raw_date = str_replace( '.', '', $raw_date );
	$raw_date = str_replace( ' at', '', $raw_date );
	$raw_date = str_replace( ' AM', 'AM', $raw_date );
	$raw_date = str_replace( ' PM', 'PM', $raw_date );

	echo 'Raw date: ' . $raw_date . "\n\n";

	$date = date( 'Y-m-d H:i:s', strtotime( $raw_date ) );
	$sql  = 'INSERT INTO texts
					 SET date_sent="' . $db->real_escape_string( $date ) . '",
							 from_number="' . $number . '",
							 direction="' . $direction . '",
							 body="' . $db->real_escape_string( trim( $body ) ) . '"';

	echo $sql . "\n\n";

	$db->query( $sql ) or die( $db->error );
}

