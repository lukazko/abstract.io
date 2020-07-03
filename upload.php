<?php

/* Getting file name */
$filename = $_FILES['file']['name'];

/* Getting File size */
$filesize = $_FILES['file']['size'];

/* Location */
$location = "uploads/".$filename;

$return_arr = array();

/* Upload files */
if(move_uploaded_file($_FILES['file']['tmp_name'],$location)){
    $src = "img/default.png";

    // checking file is image or not
    if(is_array(getimagesize($location))){
        $src = $location;
    }
    $return_arr = array("name" => $filename,"size" => $filesize, "src"=> $src);
}

echo json_encode($return_arr);
?>