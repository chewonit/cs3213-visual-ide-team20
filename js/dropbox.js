var client = new Dropbox.Client({ key: 'ac37pkslbk3prcc' });

function saveProcedure() {
    var d = new Date();
    d.getHours();
    d.getMinutes();
    d.getSeconds();

    var procedures = $('ul.list-procedures').html();

    client.writeFile('saved_data_'+d+'.txt', procedures, function (error) {
        if (error) {
            // Try to complete OAuth flow.
            alert('Error: '+error);
        } else {
            alert('File written successfully!');
        }
    });
}

$('#save-btn').on('click', function (e) {
    client.authenticate(function (error, client) {
        if (error) {
            alert('Error: ' + error);
        } else {
            saveProcedure();
        }
    });
});