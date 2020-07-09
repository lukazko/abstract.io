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
$csvfiles = glob('../uploads/*.csv');

//if(!file_exists($csvfiles)) {
//    die("File not found. Make sure you specified the correct path.");
//}

// Connecting to db
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

// Import of multiple files into db, every csv in uploads folder is loaded separate
foreach($csvfiles as $file){
    $affectedRows = $pdo->exec("
    LOAD DATA LOCAL INFILE ".$pdo->quote($file)." INTO TABLE `$dbTable`
      FIELDS TERMINATED BY ".$pdo->quote($fieldseparator)."
      LINES TERMINATED BY ".$pdo->quote($lineseparator)."(Time,Name,Text)");
      echo "Loaded a total of $affectedRows records from this csv file.\n"; // Log about number of processed rows
}

// Procedures which scoring conversation aka db back-end
$sql = "CALL transferData();CALL getScore();";
$statement = $pdo->prepare($sql);
$statement->execute();

// Deleting everything in uploads dir
array_map('unlink', array_filter((array) glob("../uploads/*")));

?>