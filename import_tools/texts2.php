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
define( 'MYSQL_PASS', 'shh' );
ini_set( 'mysqli.default_socket', '/home/containers/mariadb/mysqld/mysqld.sock' );

// Create connection

$db = new mysqli( MYSQL_HOST, MYSQL_USER, MYSQL_PASS, MYSQL_DB );

// Check connection
if ( $db->connect_error ) {
	die( 'Connection failed: ' . $db->connect_error );
}

$filter = '1';

if ( ! empty( $_GET['date_sent_date'] ) ) {
	$filter .= ' AND date_sent_date="' . $db->real_escape_string( $_GET['date_sent_date'] ) . '"';
}
if ( ! empty( $_GET['from_number'] ) ) {
	$filter .= ( $filter ? ' AND' : '' ) . ' from_number="' . $db->real_escape_string( $_GET['from_number'] ) . '"';
}
if ( ! empty( $_GET['query'] ) ) {
	$filter .= ( $filter ? ' AND' : '' )
	. ' body LIKE "%' . $db->real_escape_string( $_GET['query'] ) . '%"';
}

?>
<html>
<head>
  <title>Harassing Texts from Brian Tiemeyer</title>
  <style>
	.hl {
	  background-color: yellow;
	  font-weight: bold;
	}
	.message.brian strong.jesse,
	.message.brian strong.shannon {
	  background-color: rgb(139, 195, 74);
	  display: inline-block;
	  padding: 0 0.55em;
	  border-radius: 1em;
	  border: 0.5px solid white;
	}
	.message.brian strong.jesse {
	  background-color: #0288d1;
	}
	.nowrap {
	  white-space: nowrap;
	  display: inline-block;
	  margin-top: 0.5em;
	  margin-bottom: 0.5em;
	}
	body {
	  font-family: Helvetica, sans-serif;
	  font-weight: 400;
	  font-size: 14px;
	  line-height: 1.4em;
	  position: relative;
	}
	html,body {
	  padding: 0;
	  margin: 0;
	}
	form {
	  margin: 0;
	}
	#search {
	  background: grey;
	  padding: 0.25em 1em;
	  padding-left: 225px;
	  font-size: 0.9em;
	  line-height: 1.3em;
	  box-sizing: border-box;
	  width: 100%;
	  position: fixed;
	  top: 0;
	}
	#message_list {
	  margin-top: 50px;
	}
	#stats {
	  font-size: 1.2em;
	  display: inline-block;
	  position: absolute;
	  padding: 1em 1.6em;
	  border-bottom-left-radius: 20px;
	  border-bottom-right-radius: 20px;
	  box-sizing: border-box;
	  top: 0;
	  left: 1em;
	  background: #333;
	  color: white;
	}
	form {
	  display: inline-block;
	}
	#search input,
	#search select {
	  font-size: 1em;
	  margin-right: 1.5em;
	}
	#search select,
	#search input[type=submit] {
	  background: #333;
	  color: white;
	  border: 1px solid white;
	  border-radius: 1.2em;
	  padding: 0.25em 1em;
	}
	#search input[type=submit] {
	  background: #0288d1;
	}
	.message {
	  margin: 0.5em;
	  border: 1px solid #ccc;
	  border-radius: 20px;
	  background: lightgrey;
	  max-width: 70%;
	  width: fit-content;
	  overflow: hidden;
	}
	.body {
	  padding: 0.5em 1em;
	}
	.meta {
	  padding: 4px 1em;
	  font-style: italic;
	  background: rgba(0,0,0,0.1);
	  font-size: 0.9em;
	}
	.rcvd {
	  color: lightgrey;
	}
	.sent {
	  color: rgb(139, 195, 74);
	}
	.message.shannon {
	  background: rgb(139, 195, 74);
	  margin-left: auto;
	  margin-right: 0;
	}
  </style>
  <script>

  </script>
</head>
<body>
<div id="search">
  <div id="stats">
<?php
	$sql = 'SELECT COUNT(id) AS count,direction FROM texts WHERE ' . $filter . '
            GROUP BY direction';
error_log( $sql );
	$result = $db->execute_query( $sql );

	$counts = array(
		'IN'  => 0,
		'OUT' => 0,
	);

	foreach ( $result as $row ) {
		$counts[ $row['direction'] ] = $row['count'];
	}

	echo '<strong class="rcvd">RCVD:</strong> ' . $counts['IN'] . ' • <strong class="sent">SENT:</strong> ' . $counts['OUT'];
	?>
  </div>
  <form action="?" method="GET">
	<div class="nowrap">
	  <strong>Search:</strong>
	  <input type="text" name="query" value="<?php echo htmlspecialchars( $_GET['query'] ); ?>"/>
	</div>
	<div class="nowrap">
	  <strong>Brian's #:</strong>
	  <select name="from_number">
		<option value="">All numbers</option>
  <?php
		$sql = 'SELECT from_number,COUNT(id) AS count
                FROM texts
                WHERE direction="IN"
                GROUP BY from_number
                ORDER BY from_number';

		$result = $db->execute_query( $sql );

	foreach ( $result as $row ) {
		if ( ! empty( $_GET['from_number'] ) && $_GET['from_number'] === $row['from_number'] ) {
			$selected = true;
		} else {
			$selected = false;
		}

			$number = substr( $row['from_number'], 0, 3 )
			  . '-' . substr( $row['from_number'], 3, 3 )
			  . '-' . substr( $row['from_number'], -4 );
		?>
		  <option value="<?php echo $row['from_number']; ?>"<?php echo $selected ? ' selected="selected"' : ''; ?>><?php echo $number . ' (' . $row['count'] . ' rcvd)'; ?></option>
		<?php
	}
	?>
	  </select>
	</div>
	<div class="nowrap">
	  <strong>Date:</strong>
	  <select name="date_sent_date">
		<option value="">All dates</option>
  <?php
		$sql = 'SELECT date_sent_date, COUNT(id) AS count
                FROM texts
                WHERE direction="IN"
                GROUP BY date_sent_date
                ORDER BY date_sent_date';

		$result     = $db->execute_query( $sql );
		$last_month = null;

	foreach ( $result as $row ) {
		if ( $last_month !== substr( $row['date_sent_date'], 5, 2 ) ) {
			if ( $last_month !== null ) {
				echo '</optgroup>';
			}
			echo '<optgroup label="' . date( 'F Y', strtotime( $row['date_sent_date'] ) ) . '">';
			$last_month = substr( $row['date_sent_date'], 5, 2 );
		}
		if ( ! empty( $_GET['date_sent_date'] ) && $_GET['date_sent_date'] === $row['date_sent_date'] ) {
			$selected = true;

		} else {
			$selected = false;
		}
		?>
		  <option value="<?php echo $row['date_sent_date']; ?>"<?php echo $selected ? ' selected="selected"' : ''; ?>><?php echo $row['date_sent_date'] . ' (' . $row['count'] . ' rcvd)'; ?></option>
		<?php
	}
	?>
	  </select>
	</div>
  </form>
</div>

<?php
$sql    = 'SELECT * FROM texts WHERE ' . $filter . ' ORDER BY date_sent';
$result = $db->execute_query( $sql );
?>

<div id="message_list">
<?php
foreach ( $result as $row ) {
	$number = substr( $row['from_number'], 0, 3 )
		  . '-' . substr( $row['from_number'], 3, 3 )
		  . '-' . substr( $row['from_number'], -4 );

	$body = $row['body'];

	// Highlight search result
	if ( ! empty( $_GET['query'] ) ) {
		$body = preg_replace( '/(' . $_GET['query'] . ')/i', '<span class="hl">\\0</span>', $body );
	}

	$body = preg_replace(
		'~[[:alpha:]]+://[^<>[:space:]]+[[:alnum:]/]~',
		"<a href=\"\\0\">\\0</a>",
		$body
	);

	$datetime = date( 'F j, Y \a\t g:i:sA', strtotime( $row['date_sent'] ) );
	?>
  <div class="message <?php echo $row['direction'] === 'OUT' ? $row['victim'] : 'brian'; ?>">
	<div class="meta">
	  <span class="number">
		<?php echo ( $row['direction'] === 'IN' ? '<strong>Brian Tiemeyer</strong> (' . $number . ') <strong>to</strong> ' : '' ) . '<strong class="' . $row['victim'] . '">' . ucwords( $row['victim'] ) . '</strong>'; ?>
	  </span> on
	  <span class="date"><?php echo $datetime; ?></span>
	</div>
	<div class="body"><?php echo nl2br( $body ); ?></div>
	</div>
	<?php
}
?>
</div>
<script src="jquery.js"></script>
<script src="gen.js"></script>
</body>
</html>
