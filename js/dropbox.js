var client = new Dropbox.Client({ key: 'ac37pkslbk3prcc' });

function saveProcedure() {
    var d = new Date(); // for now
    d.getHours(); // => 9
    d.getMinutes(); // =>  30
    d.getSeconds(); // => 51

    var procedures = $('ul.list-procedures').html();

    client.writeFile('saved_data_'+d+'.txt', procedures, function (error) {
        if (error) {
            alert('Error: ' + error);
        } else {
            alert('File written successfully!');
        }
    });
}

        // Try to complete OAuth flow.
        client.authenticate({ interactive: false }, function (error, client) {
            if (error) {
                alert('Error: ' + error);
            }
        });

        if (client.isAuthenticated()) {
            saveProcedure();
        }

        document.getElementById('saveBtn').onclick = function () {
            client.authenticate(function (error, client) {
                if (error) {
                    alert('Error: ' + error);
                } else {
                    saveProcedure();
                }
            });
        };