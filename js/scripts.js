// On scroll event minimalize logo and show go up button
$(window).scroll(function () {
    scroll = $(window).scrollTop();

    // Start of scrolling
    if (scroll >= 50) {
        //$('#headline-sticky').animate({ opacity: 'show', height: 'show' }, 300);
         $('#headline-sticky').fadeIn(900).animate({
            'top': '0px'
        }, { duration: 200, queue: false });
        $('.go-up-btn').animate({ opacity: 'show', height: 'show' }, 500);
    }

    // Back to the top
    else {
        //$('#headline-sticky').animate({ opacity: 'hide', height: 'hide' }, 300);
        $('#headline-sticky').fadeOut(300).animate({
            'top': '-50px'
        }, { duration: 300, queue: false });
        $('.go-up-btn').animate({ opacity: 'hide', height: 'hide' }, 500);
    }
});

$(function () {

    // preventing page from redirecting on dragover
    $("html").on("dragover", function (e) {
        e.preventDefault();
        e.stopPropagation();
    });

    $("html").on("drop", function (e) { 
        e.preventDefault(); 
        e.stopPropagation(); 
    });

    // preventing page from redirecting on drop and error message about that
    $("#container-1").on("drop", function (e) { 
        e.preventDefault(); 
        e.stopPropagation(); 
        errorMsg("You must drag the file into the marked area."); // Error message if file is dropped outside of marked area
        
        // If it was the first uploaded file reload dropzone text to initial text
        if ($(".thumbnail").length <= 0) {
            $(".dropzone h2").text("Drag and Drop csv file with conversation here\nor\nClick to select file");
        }
        // On the other hand "lets continue" text
        else {
            $(".dropzone h2").text("Now click on process or add more files");
        }
    });

    // Drag outside of site
    $('#container-1').on('dragleave', function (e) {
        e.stopPropagation();
        e.preventDefault();
        
        // If it was the first uploaded file reload dropzone text to initial text
        if ($(".thumbnail").length <= 0) {
            $(".dropzone h2").text("Drag and Drop csv file with conversation here\nor\nClick to select file");
        }
        // On the other hand "lets continue" text
        else {
            $(".dropzone h2").text("Now click on process or add more files");
        }
    });

    // Drag enter
    $('.dropzone').on('dragenter', function (e) {
        e.stopPropagation();
        e.preventDefault();
        $(".dropzone h2").text("Drop");
    });

    // Drag over
    $('.dropzone').on('dragover', function (e) {
        e.stopPropagation();
        e.preventDefault();
        $(".dropzone h2").text("Drop");
    });

    // Drag outside of dropzone area
    $('.dropzone').on('dragleave', function (e) {
        e.stopPropagation();
        e.preventDefault();
        $(".dropzone h2").text("Drag here");
    });

    // Drop
    $('.dropzone').on('drop', function (e) {
        e.stopPropagation();
        e.preventDefault();
        $(".dropzone h2").text("Drag and Drop csv file with conversation here\nor\nClick to select file");

        var file = e.originalEvent.dataTransfer.files;
        var fd = new FormData();

        fd.append('file', file[0]);

        uploadData(fd);
    });

    // Open file selector on div click
    $("#dropzone").click(function () {
        $("#file").click();
    });

    // file selected
    $("#file").change(function () {
        var fd = new FormData();

        var files = $('#file')[0].files[0];

        fd.append('file', files);

        uploadData(fd);
    });
});

// Will close modal window  
function closeModal() {
    $(".to-blur").removeClass("blur-active"); // Discart blur of background
    $('.modal-content').fadeOut(200); // and fade out modal window
};

// Hide everything except the start screen
function clearIt() {
    $("#container-2").hide();
    $("#container-3").hide();
    $(".go-up-btn").fadeOut();
    $.ajax({ url: 'php/delete.php', success: function (returnData) { console.log('ok') } });
    initDragzone(); // After click => reload dragzone to initial state
}

// Will show the second container and scroll to centre of it
function scroll2() {
    $('#container-2').show();
    //$('.go-up-btn').fadeIn();
    $('html,body').animate({ scrollTop: $("#container-2").offset().top + $("#container-2").height() / 2 }, 'slow');
}

// Will show the third container and scroll to centre of it
function scroll3() {
    $('#container-3').show();
    //$('.go-up-btn').fadeIn();
    $('html, body').animate({ scrollTop: $("#container-3").offset().top + $("#container-3").height() / 2 }, 'slow');
}

// Will scroll back up to input-zone
function scrollBack2() {
    $('html,body').animate({ scrollTop: $("#container-2").offset().top + 2 }, 'slow');
}

// Will scroll back up to start screen
function scrollBack1() {
    $('html,body').animate({ scrollTop: $("#container-1").offset().top - 50 }, 'slow');
    //$('.go-up-btn').hide();
}

// Sending AJAX request and upload file
function uploadData(formdata) {

    $.ajax({
        url: 'php/upload.php',
        type: 'post',
        data: formdata,
        contentType: false,
        processData: false,
        dataType: 'json',
        success: function (response) {
            // If uploaded file is csv add thumbnail to dropzone
            if (response != 0) {
                addThumbnail(response);
            }
            // If uploaded file isn't csv print error
            else {
                errorMsg("You can only upload csv files.");    
            }
        }
    });
}

// Added thumbnail
function addThumbnail(data) {
    $("#dropzone h2").remove();
    var len = $("#dropzone div.thumbnail").length;

    var num = Number(len);
    num = num + 1;

    var name = data.name;
    var size = convertSize(data.size);
    var src = data.src;

    // Creating an thumbnail, name and size of file
    $("#dropzone").append('<div id="thumbnail_' + num + '" class="thumbnail"></div>');
    $("#thumbnail_" + num).append('<img src="' + src + '" width="100%" height="100%">');
    $("#thumbnail_" + num).append('<span class="name">' + name + '<span><br>');
    $("#thumbnail_" + num).append('<span class="size">' + size + '<span>');
    $("#dropzone").append('<h2 id="h2-process">Now click on process or add more files</h2>');

}

// Bytes conversion
function convertSize(size) {
    var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    if (size == 0) return '0 Byte';
    var i = parseInt(Math.floor(Math.log(size) / Math.log(1024)));
    return Math.round(size / Math.pow(1024, i), 2) + ' ' + sizes[i];
}

// Click on process button
function processFile() {
    if ($(".thumbnail").length > 0) {
        // Importing data from files to csv
        $.ajax({ url: 'php/insert.php', success: function (returnData) { console.log('ok') } });
        scroll2(); // One-page version       
        initDragzone(); // After click => reload dragzone to initial state
    }

    else {
        errorMsg("Firstly you have to upload some file.");
    }
}

// Reload dragzone to initial state
function initDragzone() {
    $(".thumbnail").remove();
    $("#dropzone h2").remove();
    $("#dropzone").append('<h2>Drag and Drop csv file with conversation here<br />or<br />Click to select file</h2>');
}

// Function for generation of result rows
function getResult() {

    var num = $('#number-of-results').val().trim(); // Get number of result from input
    $('#loader-space').append('<img class="loader" src="img/ring-loader.svg" />'); // Loading before table is generated

    $.ajax({
        url: 'php/result.php', // The URL of the PHP file that searches MySQL
        // input data
        data: {
            lim: num
        },
        success: function (returnData) {

            delResult(); // deleting of all result rows

            var results = JSON.parse(returnData); // Parse the JSON from result.php

            // Empty table protection
            if (results.length == 0) {
                errorMsg("No results were found. Upload another file.");
            }

            else {
                $('.loader').remove();
                // for each result create table row
                $.each(results, function (key, value) {
                    $('.result-table').append('<tr class="result-row" id="result-row-' + key + '">');
                    $('#result-row-' + key).append('<th class="author-cell"><img src="img/avatar.png" title="' + value.Time + '"/><br>' + value.Name + '</th>');
                    //$('#result-row-' + key).append('<th class="time-cell">' + value.Time + '</th>');
                    $('#result-row-' + key).append('<th class="message-cell">' + value.Text + '</th>');
                    $('.result-table').append('</tr>');
                });
                $(".result-zone table").show(); // show generated table
                $("#container-3").show();
                $("#change-btn").show();
                scroll3(); // scroll to generated table
                $("#number-of-results").val('');
            }
        }
    });
}

// Function for deleting of all result rows
function delResult() {
    $(".result-row").remove();
    $(".result-zone p").remove();
    $(".result-zone table").hide();
    $("#change-btn").hide();
}

// General function to generate modal window with error 
function errorMsg(text) {
    $(".to-blur").addClass("blur-active"); // Blur background
    $(".modal-error-message").text(text); // Add error message into modal window textfield
    $(".modal-content").fadeIn(200); // Show modal window
}