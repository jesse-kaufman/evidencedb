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
define('MYSQL_HOST', 'localhost');
define('MYSQL_DB', 'messages');
define('MYSQL_USER', 'messages');
define('MYSQL_PASS', 'shh_dont_tell');
ini_set('mysqli.default_socket', '/home/containers/mariadb/mysqld/mysqld.sock');

// Create connection

$db = new mysqli(MYSQL_HOST, MYSQL_USER, MYSQL_PASS, MYSQL_DB);

// Check connection
if ($db->connect_error ) {
    die('Connection failed: ' . $db->connect_error);
}

$dom = new DOMDocument();
$dom->loadHTML(file_get_contents('./17857662381.html'));
foreach ( $dom->getElementsByTagName('div') as $node ) {

    if ($node->getAttribute('class') === 'message' ) {
        $i = 0;
        $body = '';
        // echo $node->textContent . "\n";
        echo "-------------------\n";

        $separator = "\n";

        $line = strtok($node->textContent, $separator);

        while ( $line !== false ) {
            switch ( $i ) {
            case 0:
                list( $date, ) = explode('(', $line);
                $date = date( 'Y-m-d H:i:s', strtotime( $date ) );
                break;
            case 1:
                $number = preg_replace( '/[^0-9]/', '', str_replace( '+1', '', $line ) );
                break;
            default:
                $body .= $line . "\n";
                break;
            }


            $line = strtok($separator);
            ++$i;
        }

        if ( $number ) {
            $direction = 'IN';
        } else {
            $number = '3164611421';
            $direction = 'OUT';
        }

        $sql  = 'INSERT INTO texts
        SET date_sent="' . $db->real_escape_string( $date ) . '",
        from_number="' . $number . '",
        direction="' . $direction . '",
        victim="jesse",
        body="' . $db->real_escape_string( trim( $body ) ) . '"';

        echo $sql . "\n\n";

        $db->query( $sql ) or die( $db->error );
    }
}
