$(document).ready(function () {

    var w = 800;

    function open() {

        if (window.innerWidth > w) {
            document.getElementById("main").style.marginRight = "20%";
            document.getElementById("mySidebar").style.width = "20%";
        } else {
            document.getElementById("main").style.marginRight = "100%";
            document.getElementById("mySidebar").style.width = "100%";
        }
        document.getElementById("mySidebar").style.display = "block";
    }

    function close() {
        document.getElementById("main").style.marginRight = "0%";
        document.getElementById("mySidebar").style.display = "none";
    }

    var b = false;
    if (window.innerWidth > w) {
        open()
        var b = true;
    }

    $("#toggle").click(function () {
        if (b) {
            close();
            b = !b;
        } else {
            open();
            b = !b;
        }
    });

    $("a").click(function () {
        var c = $(this).attr("id");
        $("a").removeClass("w3-red")
        $(this).addClass("w3-red")
        $(".parts").hide();
        $("#" + c + "_part").show(100);
        if (window.innerWidth < 800)
            close();
    });

    $("#cat").addClass("w3-red").show();

    $("#logout").click(function () {
        firebase.auth().signOut();
        window.location = "login.html";
    });
});
