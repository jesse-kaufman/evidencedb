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
define( 'MYSQL_PASS', 'the_secret_password' );
ini_set( 'mysqli.default_socket', '/home/containers/mariadb/mysqld/mysqld.sock' );

// Create connection

$db = new mysqli( MYSQL_HOST, MYSQL_USER, MYSQL_PASS, MYSQL_DB );

// Check connection
if ( $db->connect_error ) {
	die( 'Connection failed: ' . $db->connect_error );
}

if (($handle = fopen("texts.csv", "r")) !== FALSE) {
	while (($data = fgetcsv($handle, 1000, ",")) !== FALSE) {
		$date = date('Y-m-d H:i:s', strtotime( $data[0] ) );
		$number = preg_replace( '/[^0-9]/', '', str_replace( '+1', '', $data[1] ) );

			$direction = 'IN';

		$sql  = 'INSERT INTO texts
						 SET date_sent="' . $db->real_escape_string( $date ) . '",
								 from_number="' . $number . '",
								 direction="' . $direction . '",
								 body="' . $db->real_escape_string( trim( $data[2] ) ) . '"';

		echo $sql . "\n\n";

		$db->query( $sql ) or die( $db->error );
	}
	fclose($handle);
}

