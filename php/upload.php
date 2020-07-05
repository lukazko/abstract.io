<?php

// Getting file name and size
$filename = $_FILES['file']['name'];
$filesize = $_FILES['file']['size'];

// Location of upload directory
$location = "../uploads/".$filename;

// Declaration for future JSON
$return_arr = array();

// Upload file
if(move_uploaded_file($_FILES['file']['tmp_name'],$location)){
    $src = "img/default.png";

    // checking file is image or not
    if(is_array(getimagesize($location))){
        $src = $location;
    }
    $return_arr = array("name" => $filename,"size" => $filesize, "src"=> $src);
}

// Returning JSON with value for HTML element
echo json_encode($return_arr);

?>