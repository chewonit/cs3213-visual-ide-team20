var client = new Dropbox.Client({ key: 'ac37pkslbk3prcc' });

function loginDropbox() {
    client.authenticate(function (error, client) {
        if (error) {
            alert('Error: ' + error);
        } else {
            client.getAccountInfo(function (error, info) {
                setDropboxProfile(info);
                $(".save-load-file").show();
            });
        }
    });
}

function loggedIntoDropbox()
{
    return client.isAuthenticated();
}

function setDropboxProfile(obj) {
    $("#login-area").removeClass("no-margin");
    $("#login-area").html("Welcome " + obj.name);
}

function saveToDropbox() {
    client.authenticate(function (error, client) {
        if (error) {
            alert('Error: ' + error);
        } else {
            saveProcedure();
        }
    });
}

function loadFromDropbox() {
    client.authenticate(function (error, client) {
        if (error) {
            alert('Error: ' + error);
        } else {
            loadProcedure();
        }
    });
}

function saveProcedure() {
    $("input").each(function(){
        $(this).attr("value", $(this).val());
    });

    var procedures = $('ul.list-procedures').html();

    client.writeFile('saved_data.txt', procedures, function (error) {
        if (error) {
            // Try to complete OAuth flow.
            alert('Error: '+error);
        } else {
            alert('Procedures saved!');
        }
    });
}

function loadProcedure() {
    alert("Please wait while we load your saved procedures.");
    var procedures = $('ul.list-procedures').html();

    var result = client.readFile('saved_data.txt', function (error, data) {
        if (error) {
            // Try to complete OAuth flow.
            alert('Error: '+error);
        }
        $('ul.list-procedures').html(data);
    });
}