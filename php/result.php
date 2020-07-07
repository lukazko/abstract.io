<?php

// MySQL user and connection
$dbUser = 'root';
$dbPassword = '12345';
$dbServer = 'localhost';
$dbName = 'highlights';

$pdo = new PDO("mysql:host=$dbServer;dbname=$dbName", $dbUser, $dbPassword);

// Default value of LIMIT
$lim = $_GET['lim'] ?: 3;

// SQL query that we will be running.
$sql = "SELECT `Time`, `Name`, `Text` FROM `result` ORDER BY `Rating` DESC LIMIT $lim";

// Prepare SELECT statement.
$statement = $pdo->prepare($sql);

// Execute the SQL statement.
$statement->execute();

// Fetch result as an associative array.
$results = $statement->fetchAll(PDO::FETCH_ASSOC);

// Comparing times in array and sort from oldest to newest
function date_compare($a, $b)
{
    $t1 = strtotime($a['Time']);
    $t2 = strtotime($b['Time']);
    return $t1 - $t2;
}    
usort($results, 'date_compare');

// Echo the $results array in a JSON format
echo json_encode($results);

?>