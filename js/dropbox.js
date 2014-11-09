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

function loadFromDropbox(canvas) {
    client.authenticate(function (error, client) {
        if (error) {
            alert('Error: ' + error);
        } else {
            loadProcedure(canvas);
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

function loadProcedure(canvas) {
    $('ul.list-procedures').html('<div id=\'loading-div\'><img src=\'../img/loading.gif\'></div>');

    var result = client.readFile('saved_data.txt', function (error, data) {
        if (error) {
            // Try to complete OAuth flow.
            alert('Error: '+error);
        }
        var processedStoredData = data.split('--=--');
        $('ul.list-procedures').html(processedStoredData[0]);
        $('#variable-manager-entries').html(processedStoredData[1]);
        $('#sprite-manager-entries').html(processedStoredData[2]);

        var i;
        var spriteTableArray = VisualIDE.SpriteManager.spriteTable;
        var varTableArray = VisualIDE.VariableManager.varTable;

        for(i=1; i<spriteTableArray.length; i++){
            canvas.removeSprite(spriteTableArray[i].name);
            spriteTableArray.splice(i, 1);
        }

        for(i=3; i<varTableArray.length; i++){
            varTableArray.splice(i, 1);
        }

        var spriteimg_array = $("#sprite-manager-entries img").map(function() {
            return $(this).attr("src");
        });

        var spritename_array = $("#sprite-manager-entries input").map(function() {
            return $(this).attr("value");
        });

        var varname_array = $("#variable-manager-entries input").map(function() {
            return $(this).attr("value");
        });

        for (i = 3; i < varname_array.length; i++) {
            VisualIDE.VariableManager.varTable.push({
                name: varname_array[i],
                defalut: false,
            });
        }

        for (i = 1; i < spriteimg_array.length; i++) {
            var sprite = new VisualIDE.CanvasSprite(spriteimg_array[i]);
            
            VisualIDE.SpriteManager.spriteTable.push({
                name: spritename_array[i],
                target: "sprite",
                url: spriteimg_array[i],
                defalut: false,
            });

            canvas.addSprite(spritename_array[i], sprite);
            initIntepreter(canvas, spritename_array[i]);
        }

        VisualIDE.VariableManager.refreshView();
        VisualIDE.VariableManager.refreshSelectVeiws();
        VisualIDE.SpriteManager.refreshView();
        VisualIDE.SpriteManager.refreshSelectVeiws();
    });

function addVar( that, name ) {
    var objVar = {};
    objVar.defalut = false;
    objVar.name = name;
    objVar.value = 0;

    for ( var i=0; i<that.varTable.length; i++ ) {
        if ( that.varTable[i].name.toLowerCase() == name.toLowerCase() ) {
            return;
        }
    }

    that.varTable.push(objVar);
}

function addSprite( that, name, url, target ) {
    var objVar = {};
    objVar.defalut = false;
    objVar.name = name;
    objVar.url = url;
    objVar.target = target;

    for ( var i=0; i<that.spriteTable.length; i++ ) {
        if ( that.spriteTable[i].name.toLowerCase() == name.toLowerCase() ) {
            return;
        }
    }

    that.spriteTable.push(objVar);
    refreshManagerView( $('#sprite-manager-entries-container'), { spriteTable: that.spriteTable }, VisualIDE.Templates.spriteManagerEntry );
}
}