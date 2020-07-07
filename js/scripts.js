// On scroll event minimalize logo and show go up button
$(window).scroll(function () {
    scroll = $(window).scrollTop();

    // Start of scrolling
    if (scroll >= 50) {
        //$('#headline-sticky').animate({ opacity: 'show', height: 'show' }, 300);
        $('#headline-sticky').fadeIn(800).animate({
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

    // preventing page from redirecting
    $("html").on("dragover", function (e) {
        e.preventDefault();
        e.stopPropagation();
        $("h2").text("Drag here");
    });

    $("html").on("drop", function (e) { e.preventDefault(); e.stopPropagation(); });

    // Drag enter
    $('.dropzone').on('dragenter', function (e) {
        e.stopPropagation();
        e.preventDefault();
        $("h2").text("Drop");
    });

    // Drag over
    $('.dropzone').on('dragover', function (e) {
        e.stopPropagation();
        e.preventDefault();
        $("h2").text("Drop");
    });

    // Drop
    $('.dropzone').on('drop', function (e) {
        e.stopPropagation();
        e.preventDefault();

        $("h2").text("Upload");

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
    $(".to-blur").css("filter", "blur(0px)"); // Discart blur of background
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
            addThumbnail(response);
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
        $(".to-blur").css("filter", "blur(5px)"); // Blur background
        $(".modal-error-message").text("Firstly you have to upload some file."); // Add error message into modal window textfield
        $(".modal-content").fadeIn(200); // Show modal window
    }
}

function initDragzone() {
    // Reload dragzone to initial state
    $(".thumbnail").remove();
    $("#dropzone h2").remove();
    $("#dropzone").append('<h2>Drag and Drop file with conversation here<br />or<br />Click to select file</h2>');
}

// Function for generation of result rows
function getResult() {

    // Get number of result from input
    var num = $('#number-of-results').val().trim();

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
                $(".to-blur").css("filter", "blur(5px)"); // Blur background
                $(".modal-error-message").text("No results were found. Upload another file."); // Add error message into modal window textfield
                $(".modal-content").fadeIn(200); // Show modal window
            }

            else {
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

// Change to "change number"
// Function for deleting of all result rows
function delResult() {
    $(".result-row").remove();
    $(".result-zone p").remove();
    $(".result-zone table").hide();
    $("#change-btn").hide();
    //$(".container-3").hide();
}