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

    $("ul.list-procedures select").each(function(){
        this.options[this.options.selectedIndex].setAttribute("selected","selected");
    });

    var procedures = $('ul.list-procedures').html();
    var variables = $('#variable-manager-entries').html();
    var sprites = $('#sprite-manager-entries').html();

    var dataToSave = procedures+'--=--'+variables+'--=--'+sprites;

    client.writeFile('saved_data.txt', dataToSave, function (error) {
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

    var result = client.readFile('saved_data.txt', function (error, data) {
        if (error) {
            // Try to complete OAuth flow.
            alert('Error: '+error);
        }
        var processedStoredData = data.split('--=--');
        $('ul.list-procedures').html(processedStoredData[0]);
        $('#variable-manager-entries').html(processedStoredData[1]);
        $('#sprite-manager-entries').html(processedStoredData[2]);
    });
}