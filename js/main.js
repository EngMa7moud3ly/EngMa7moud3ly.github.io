var pp = 220;
var slideIndex = 1;

function plusDivs(n) {
    showDivs(slideIndex += n);
}

function showDivs(n) {
    var i;
    var pp = document.getElementsByClassName("mySlides");
    if (n > pp.length) {
        slideIndex = 1
    }
    if (n < 1) {
        slideIndex = pp.length
    }
    for (i = 0; i < pp.length; i++) {
        pp[i].style.display = "none";
    }
    pp[slideIndex - 1].style.display = "block";
}

function isEmail(email) {
    var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    return regex.test(email);
}

function add_projects(name, details, img, langs, url) {
    var skills = "";
    for (var id in langs) {
        var lang = langs[id];
        skills += `<div class="chip blue lighten-2 lighten-1  white-text left">` + lang + `</div>`
    }
    img = "https://firebasestorage.googleapis.com/v0/b/mahmoud-aly.appspot.com/o/" + img + "?alt=media";
    var txt = `<div class="w3-display-container mySlides">
                        <div class="project-img">
                            <img src="` + img + `" class="center" alt="project image" height="100%"/>
                        </div>
                        <div class="project-skills w3-display-topmiddle hide-on-med-and-down show-on-large-only">` + skills + `</div>
                        <div class="w3-display-bottommiddle w3-large w3-container w3-padding-16 project-details">
                            <h2><a href="`+ url + `" target="_blank" class="fonty2" style=" text-decoration:underline;">` + name + `</a></h2>
                            <p class="fonty3">` + details + `</p>
                        </div>
                    </div>`

    $(".project-container").append(txt);
}


db.ref('projects/').once('value').then(function (snapshot) {
    var x = snapshot.val();
    $('#projects').find('li').remove().end();
    for (var id in x) {
        var xx = x[id];
        var name = xx.name;
        var details = xx.details;
        var langs = xx.langs == null ? "" : xx.langs;
        var img = xx.screenshot == null ? "" : xx.screenshot
        var url = xx.url == null ? "" : xx.url;
        add_projects(name, details, img, langs, url);
    }
    var btns = `      <button class="w3-button w3-display-left white more" onclick="plusDivs(-1)">&#10094;</button>
                    <button class="w3-button w3-display-right white more" onclick="plusDivs(1)">&#10095;</button>`
    $(".project-container").append(btns);
    showDivs(slideIndex);
});

$(document).ready(function () {

    $("header").show();
    $("main").show();
    $("#loader").hide();

    $(".project-container").click(function () {
        $(this).find(".project-details").toggle()
        $(this).find(".project-skills").toggle()

    });

    $("#send").click(function () {

        var from = $("#from").val();
        var msg = $("#msg").val();
        if (!isEmail(from)) {
            Materialize.toast("your email is incorrect :(", 3000);
            return;
        }
        if (msg == "") {
            Materialize.toast("message is empty :(", 3000);
            return;
        }

        var url = "mail.php?msg=" + msg + "&from=" + from;
        $.get(url, function (data, status) {
            if (status == "success" && data == "done") {
                $("#from").val("");
                $("#msg").val("");
                Materialize.toast('email was sent successfully , thanks :)', 3000, 'rounded');
            } else
                Materialize.toast('failed to send the email :(', 3000, 'rounded');
        });

    });

    $(".waves-effect").removeClass("orange red green  blue");
    var hash = window.location.hash;
    if (hash == '#about')
        $(".waves-orange").addClass("orange")
    else if (hash == '#skills')
        $(".waves-green").addClass("green")
    else if (hash == '#projects')
        $(".waves-blue").addClass("blue")
    else if (hash == '#contact')
        $(".waves-red").addClass("red")
    else
        $(".waves-orange").addClass("orange")

    $(".waves-effect").click(function () {
        $(".waves-effect").removeClass("orange red green blue");
        var hash = window.location.hash;
        if ($(this).hasClass("waves-red"))
            $(this).addClass("red")
        else if ($(this).hasClass("waves-green"))
            $(this).addClass("green")
        else if ($(this).hasClass("waves-blue"))
            $(this).addClass("blue")
        else if ($(this).hasClass("waves-orange"))
            $(this).addClass("orange")
    });


    $(document).keydown(function (e) {
        var k = e.which;

        if (window.location.hash == "#projects" && (k == 37 || k == 39)) {
            if (k == 37)
                plusDivs(-1)
            else
                plusDivs(+1)
            return;
        }
        if (k == 33 || k == 38) {//up
            var hash = window.location.hash;

            if (hash == '#about' || hash == "") {
                window.location.hash = "#contact";
                $(".waves-effect").removeClass("orange red green blue");
                $(".waves-red").addClass("red")
            } else if (hash == '#skills') {
                window.location.hash = "#about";
                $(".waves-effect").removeClass("orange red green blue");
                $(".waves-orange").addClass("orange")
            } else if (hash == '#projects') {
                window.location.hash = "#skills"
                $(".waves-effect").removeClass("orange red green blue");
                $(".waves-green").addClass("green")
            } else if (hash == '#contact') {
                window.location.hash = "#projects";
                $(".waves-effect").removeClass("orange red green blue");
                $(".waves-blue").addClass("blue")
            }
        } else if (k == 34 || k == 40) {
            var hash = window.location.hash;
            if (hash == '#about' || hash == "") {
                window.location.hash = "#skills";
                $(".waves-effect").removeClass("orange red green blue");
                $(".waves-green").addClass("green")
            } else if (hash == '#skills') {
                window.location.hash = "#projects";
                $(".waves-effect").removeClass("orange red green blue");
                $(".waves-blue").addClass("blue")
            } else if (hash == '#projects') {
                window.location.hash = "#contact";
                $(".waves-effect").removeClass("orange red green blue");
                $(".waves-red").addClass("red")
            } else if (hash == '#contact') {
                window.location.hash = "#about";
                $(".waves-effect").removeClass("orange red green blue");
                $(".waves-orange").addClass("orange")
            }
        }
    });

    $('.button-collapse').sideNav({
        menuWidth: pp,
        edge: 'left',
        closeOnClick: false,
        draggable: true
    });

    $('.materialboxed').materialbox();

});


