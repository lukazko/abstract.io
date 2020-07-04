// Function for generation of result rows
function getResult() {

    // Get number of result from input
    var num = $('#number-of-results').val().trim();

    $.ajax({
        url: 'result.php', // The URL of the PHP file that searches MySQL
        // input data
        data: {
            lim: num
        },
        success: function (returnData) {

            delResult(); // deleting of all result rows

            var results = JSON.parse(returnData); // Parse the JSON from result.php

            // for each result create table row
            $.each(results, function (key, value) {
                $('.result-table').append('<tr class="result-row" id="result-row-' + key + '">');
                $('#result-row-' + key).append('<th class="time-cell">' + value.Time + '</th>');
                $('#result-row-' + key).append('<th class="author-cell">' + value.Name + '</th>');
                $('#result-row-' + key).append('<th class="message-cell">' + value.Text + '</th>');
                $('.result-table').append('</tr>');
            });

            // Empty table protection
            if (results.length == 0) {
                $('.result-zone').append('<p>No results were found!</p>');
            }
            
            $(".result-zone table").show(); // show generated table
        }
    });
}

// Function for deleting of all result rows
function delResult() {
    $(".result-row").remove();
    $(".result-zone p").remove();
    $(".result-zone table").hide();
}

