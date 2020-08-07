firebase.auth().onAuthStateChanged(function (user) {
    if (!user)
        window.location = "login.html";
});

$(document).ready(function () {

    $(".loader").show();
    update("");

    //fetch projects from database
    function update(txt) {
        db.ref('projects/').once('value').then(function (snapshot) {
            var x = snapshot.val();
            $('#projects').find('li').remove().end();
            for (var id in x) {
                var xx = x[id];
                var name = xx.name;
                var img = xx.screenshot == null ? "" : xx.screenshot;
                if (txt != "") {
                    if (
                        xx.name.indexOf(txt) != -1 ||
                        xx.details.indexOf(txt) != -1 ||
                        JSON.stringify(xx.langs).indexOf(txt) != -1
                    )
                        add(id, name, img);
                } else
                    add(id, name, img);
            }
            $(".loader").hide();
        });
    }
    //show loading view
    function _loading() {
        $(".prod_spinner").show();
        $(".new").hide();
        $(".save").hide();
    }
    //hide loading view
    function _loaded() {
        $(".prod_spinner").hide();
        $(".new").show();
        $(".save").show();
    }
    //apend project to page
    function add(id, name, img) {
        if (img == "") {
            img = "imgs/admin-logo.png"
        } else {
            img = "https://firebasestorage.googleapis.com/v0/b/mahmoud-aly.appspot.com/o/" + img + "?alt=media";
        }
        var x =
            `
                         <li class="w3-padding-16" data="` + id + `">
                            <i  class=" tools w3-button w3-transparent w3-xlarge w3-left fa fa-edit edit"></i>
                            <i class=" tools w3-button w3-transparent w3-xlarge w3-left fa fa-remove del"></i>
                            <img src="` + img + `" class="w3-right w3-circle w3-margin-right">
                            <span class="prod-name w3-large w3-margin">` + name + `</span>
                            <br>
                            <span class="prod-name w3-large w3-margin"></span>
                        </li>       
                `
        $("#projects").append(x);
    }
    //search for a project py name
    $("#search").keyup(function () {
        var txt = $(this).val();
        update(txt)
    });
    $(".new").click(function () {
        $("#id").val("");
        $("#img").val("");
    });

    //store new project data
    $('#upload').on('submit', function (e) {
        e.preventDefault();
        var form = $("#upload");
        var name = $("#name").val();
        var url = $("#url").val();
        var details = $("#details").val();
        var langs = [];
        $('input:checkbox').each(function () {
            var val = (this.checked ? $(this).val() : null);
            if (val == null)
                return;
            langs.push(val);
        });
        var id = $("#id").val();
        var first = false;
        if (id == "") {
            id = db.ref().child('projects').push().key;
            $("#id").val(id);
            first = true;
        }
        _loading();

        //store details of new project
        if ($("#screenshot").val() != "") {

            var files = new FormData(form[0]);
            var screenshot = id + ".jpg";
            var file = document.getElementById('screenshot').files[0];
            storage.ref().child(screenshot).put(file).then(function (snapshot) {
                db.ref('projects/' + id).set({
                    name: name, details: details, url: url, langs: langs, screenshot: screenshot
                });
                _loaded();
                update("");
            });
            //upgrade project details
        } else {
            if (first)
                db.ref('projects/' + id).set({
                    name: name, details: details, langs: langs, url: url, screenshot: ""
                });
            else {
                var c = { name: name, details: details, url: url };
                if (langs != null && langs.length > 0) c['langs'] = langs;
                db.ref('projects/' + id).update(c);
            }
            //hide loading view
            _loaded();
            //update project view with new added project
            update("");
        }
    });

    //edit project
    $("#projects").on('click', 'i.edit', function () {
        $(".loader").show();
        $("#screenshot").val("");
        var id = $(this).closest('li').attr("data");
        db.ref('projects/' + id).once('value').then(function (snapshot) {
            var x = snapshot.val();
            $("#id").val(id);
            $("#url").val(x.url);
            $("#name").val(x.name);
            $("#details").val(x.details);
            var langs = (x.langs.toString()).split(',');
            var inputs = document.querySelectorAll("input[type='checkbox']");
            for (var i = 0; i < inputs.length; i++)
                inputs[i].checked = false;

            for (var i = 0; i < inputs.length; i++) {
                for (var j = 0; j < langs.length; j++) {
                    var lang = langs[j];
                    if (inputs[i].value == lang) { inputs[i].checked = true; break; }
                }
            }
            $(".loader").hide();
        });
    });
    //delete project
    $("#projects").on('click', 'i.del', function () {
        var id = $(this).closest('li').attr("data");
        var desertRef = storage.ref().child(id + '.jpg');
        desertRef.delete().then(function () {
            db.ref('projects/' + id).once('value').then(function (snapshot) {
                var x = snapshot.val();
                var img = x.img;
                db.ref('projects/' + id).set(null);
                $(this).closest('li').remove();
                update("");
                alert("تم الحذف");
            });
        }).catch(function (error) {
            alert("فشل فى الحذف");
        });
    });
});
