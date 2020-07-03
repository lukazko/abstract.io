$(function() {

    // preventing page from redirecting
    $("html").on("dragover", function(e) {
        e.preventDefault();
        e.stopPropagation();
        $("h2").text("Drag here");
    });

    $("html").on("drop", function(e) { e.preventDefault(); e.stopPropagation(); });

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
    $("#dropzone").click(function(){
        $("#file").click();
    });

    // file selected
    $("#file").change(function(){
        var fd = new FormData();

        var files = $('#file')[0].files[0];

        fd.append('file',files);

        uploadData(fd);
    });
});

// Sending AJAX request and upload file
function uploadData(formdata){

    $.ajax({
        url: 'upload.php',
        type: 'post',
        data: formdata,
        contentType: false,
        processData: false,
        dataType: 'json',
        success: function(response){
            addThumbnail(response);
        }
    });
}

// Added thumbnail
function addThumbnail(data){
    $("#dropzone h2").remove();  
    var len = $("#dropzone div.thumbnail").length;

    var num = Number(len);
    num = num + 1;

    var name = data.name;
    var size = convertSize(data.size);
    var src = data.src;

    // Creating an thumbnail, name and size of file
    $("#dropzone").append('<div id="thumbnail_'+num+'" class="thumbnail"></div>');
    $("#thumbnail_"+num).append('<img src="'+src+'" width="100%" height="100%">');
    $("#thumbnail_"+num).append('<span class="name">'+name+'<span><br>');
    $("#thumbnail_"+num).append('<span class="size">'+size+'<span>');
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
    if ($( ".thumbnail" ).length>0) {
        window.open('result.html');
    
        // After click => reload dragzone to initial state
        $(".thumbnail").remove();
        $("#dropzone h2").remove();
        $("#dropzone").append('<h2>Drag and Drop file with conversation here<br />or<br />Click to select file</h2>');
    }  
    
    else {
        alert("You have to upload file firstly");
    }   
}