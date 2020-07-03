<?php

// MySQL user and connection
$dbUser = 'root';
$dbPassword = '12345';
$dbServer = 'localhost';
$dbName = 'highlights';

$pdo = new PDO("mysql:host=$dbServer;dbname=$dbName", $dbUser, $dbPassword);

// SQL query that we will be running.
$sql = "SELECT `Time`, `Name`, `Text` FROM `result` ORDER BY `Rating` DESC LIMIT 2";

// Prepare SELECT statement.
$statement = $pdo->prepare($sql);

// Execute the SQL statement.
$statement->execute();

// Fetch result as an associative array.
$results = $statement->fetchAll(PDO::FETCH_ASSOC);

// Echo the $results array in a JSON format
echo json_encode($results);