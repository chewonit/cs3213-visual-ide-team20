var client = new Dropbox.Client({ key: 'ac37pkslbk3prcc' });

function saveProcedure() {
    var d = new Date();
    d.getHours();
    d.getMinutes();
    d.getSeconds();

    var procedures = $('ul.list-procedures').html();

    client.writeFile('saved_data.txt', procedures, function (error) {
        if (error) {
            // Try to complete OAuth flow.
            alert('Error: '+error);
        } else {
            alert('Saved into Dropbox!');
        }
    });
}

function loadProcedure() {
    var d = new Date();
    d.getHours();
    d.getMinutes();
    d.getSeconds();

    var procedures = $('ul.list-procedures').html();

    var result = client.readFile('saved_data.txt', function (error, data) {
        if (error) {
            // Try to complete OAuth flow.
            alert('Error: '+error);
        }
        $('ul.list-procedures').html(data);
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

$('#load-btn').on('click', function (e) {
    client.authenticate(function (error, client) {
        if (error) {
            alert('Error: ' + error);
        } else {
            loadProcedure();
        }
    });
});