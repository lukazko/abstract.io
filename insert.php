<?php

// MySQL user and connection
$dbUser = 'root';
$dbPassword = '12345';
$dbServer = 'localhost';
$dbName = 'highlights';
$dbTable = "input"; // Table for saving data
// CSV file specification
$fieldseparator = ";"; 
$lineseparator = "\n";
$csvfile = "uploads/test.csv";

if(!file_exists($csvfile)) {
    die("File not found. Make sure you specified the correct path.");
}

try {
    $pdo = new PDO("mysql:host=$dbServer;dbname=$dbName", $dbUser, $dbPassword,
        array(
            PDO::MYSQL_ATTR_LOCAL_INFILE => true,
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION
        )
    );
} catch (PDOException $e) {
        die("database connection failed: ".$e->getMessage());
    }

$affectedRows = $pdo->exec("
    LOAD DATA LOCAL INFILE ".$pdo->quote($csvfile)." INTO TABLE `$dbTable`
      FIELDS TERMINATED BY ".$pdo->quote($fieldseparator)."
      LINES TERMINATED BY ".$pdo->quote($lineseparator)."(Time,Name,Text)"
    );

echo "Loaded a total of $affectedRows records from this csv file.";

?>