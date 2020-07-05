<?php

// Deleting everything in uploads dir
array_map( 'unlink', array_filter((array) glob("uploads/*") ) );

?>