<?php
/**
 * Parse email into database
 */

define( 'MYSQL_HOST', 'localhost' );
define( 'MYSQL_DB', 'messages' );
define( 'MYSQL_USER', 'messages' );
define( 'MYSQL_PASS', 'secret' );
ini_set( 'mysqli.default_socket', '/home/containers/mariadb/mysqld/mysqld.sock' );

// Create connection

$db = new mysqli( MYSQL_HOST, MYSQL_USER, MYSQL_PASS, MYSQL_DB );

// Check connection
if ( $db->connect_error ) {
	die( 'Connection failed: ' . $db->connect_error );
}

$files = file( 'emails' );

foreach ( $files as $file ) {
	// $file = str_replace("[", "\[", $file);
	// $file = str_replace("]", "\]", $file);
	// $file = str_replace("(", "\(", $file);
	// $file = str_replace(")", "\)", $file);
	$file = trim( $file );
	echo $file;
	echo "\n" . '----------------------' . "\n";
	$mail   = mailparse_msg_parse_file( trim( $file ) );
	$struct = mailparse_msg_get_structure( $mail );

	foreach ( $struct as $st ) {
		echo "\n" . '----------------------' . "\n";
		$section = mailparse_msg_get_part( $mail, $st );
		$info    = mailparse_msg_get_part_data( $section );
		if ( empty( $info['headers'] ) ) {
			break;
		}

		if ( isset( $info['headers']['from'] ) ) {
			$from       = $info['headers']['from'];
			$to_address = $info['headers']['to'];
			$subject    = $info['headers']['subject'];
			$date       = $info['headers']['date'];
			$message_id = $info['headers']['message-id'];
		}

		if ( stristr( $to_address, 'shannon' ) ) {
			$direction = 'IN';
		} elseif ( stristr( $to_address, 'glandix' ) || stristr( $to_address, 'jesse' ) ) {
			$direction = 'IN';
		} else {
			$direction = 'OUT';
		}

		$shannon = false;
		$jesse   = false;

		if ( stristr( $to_address, 'shannon' ) || stristr( $from, 'shannon' ) ) {
			$shannon = true;
		}

		if ( stristr( $to_address, 'glandix' )
			|| stristr( $to_address, 'jesse' )
			|| stristr( $from, 'glandix' )
			|| stristr( $from, 'jesse' )
		) {
			$jesse = true;
		}

		if ( $shannon && $jesse ) {
			$victim = 'both';
		} elseif ( $shannon ) {
			$victim = 'shannon';
		} elseif ( $jesse ) {
			$victim = 'jesse';
		} else {
			$victim = 'others';
		}

		if ( 'text/plain' === $info['content-type'] ) {
			$content_charset = $info['content-charset'];
			echo 'Plain: ' . $content_charset;
			ob_start();
			mailparse_msg_extract_part_file( $section, $file );
			$content    = ob_get_clean();
			$body_plain = $content;
		} elseif ( 'text/html' === $info['content-type'] ) {
			$content_charset = $info['content-charset'];
			echo 'HTML: ' . $content_charset;
			ob_start();
			mailparse_msg_extract_part_file( $section, $file );
			$content = ob_get_clean();
			$body    = $content;
		}
		echo "\n" . '----------------------' . "\n";
	}

	mailparse_msg_free( $mail );
	$date = str_replace( ' -0600', '', $date );
	$date = str_replace( ' -0500', '', $date );
	$date = date( 'Y-m-d H:i:s', strtotime( $date ) );
	echo $date . "\n";

	if ( stristr( $info['content-type'], 'image' ) ) {
		print_r( $info );
		$att_fields = 'attachment_id="' . $info['content-id'] . '",
			message_id="' . $message_id . '",
			filename="' . $info['content-name'] . '"';
		$att_sql    = 'INSERT INTO attachments SET ' . $att_fields . '
			ON DUPLICATE KEY UPDATE ' . $att_fields;
echo $att_sql . "\n\n";

		$att_dir = '/home/containers/texts/data/resources/attachments/' . $info['content-id'];
		echo $att_dir . "\n";

		if ( ! is_dir( $att_dir ) && ! file_exists( $att_dir ) ) {
			mkdir( $att_dir, 0755, true );
		}

		ob_start();
		mailparse_msg_extract_part_file( $section, $file );
		$att_content = ob_get_clean();

		file_put_contents( $att_dir . '/' . $info['content-name'], $att_content );

		echo $att_sql;
		// $db->execute_query( $att_sql );
	}

	if ( 'UTF-8' !== $content_charset && 'us-ascii' !== $content_charset ) {
		$body       = iconv( 'Windows-1252//IGNORE', 'UTF-8', $body );
		$body_plain = iconv( 'Windows-1252//IGNORE', 'UTF-8', $body_plain );
	}
	$fields = 'from_address="' . $from . '",
			to_address="' . $db->real_escape_string( $to_address ) . '",
			date_sent="' . $date . '",
			subject="' . $subject . '",
			body_html="' . $db->real_escape_string( $body ) . '",
			body="' . $db->real_escape_string( $body_plain ) . '",
			victim="' . $victim . '",
			direction="' . $direction . '",
			message_id="' . $message_id . '"';
	$sql    = 'INSERT INTO emails SET ' . $fields . '
		ON DUPLICATE KEY UPDATE ' . $fields;
	echo "\n" . '----------------------' . "\n";
	// echo $sql;
	// $db->execute_query( $sql );
	echo "\n" . '----------------------' . "\n";
}
