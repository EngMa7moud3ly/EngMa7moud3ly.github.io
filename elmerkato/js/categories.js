//categories

firebase.auth().onAuthStateChanged(function (user) {
    if (!user)
        window.location = "login.html";
});

$(document).ready(function () {

    var head = `       <tr>
                            <th>-</th>
                            <th>اسم الفئة</th>
                            <th>رفع صورة</th>
                            <th>-</th>
                        </tr>
`

    function update() {
        $(".loader").show();
        db.ref('categories/').once('value').then(function (snapshot) {
            var x = snapshot.val();
            $('#cat_items').find('tr').remove().end();
            $('#cat_items').append(head);
            for (var id in x) {
                var xx = x[id];
                add(id, xx.category, xx.img)
            }
            $(".loader").hide();
        });
    }

    update();

    function loading(item) {
        item.find(".spinner").show();
        item.find(".save").hide();
        item.find(".del").hide();
    }
    function loaded(item) {
        item.find(".spinner").hide();
        item.find(".save").show();
        item.find(".del").show();
    }

    //add category
    function add(id, cat, img) {
        if (img == "") {
            img = "images/loginn-logo.png"
        } else {
            img = "https://firebasestorage.googleapis.com/v0/b/market-sohag.appspot.com/o/" + img + "?alt=media";
        }
        var x = `
                        <tr>
                            <td><img alt="Avatar" width="50" height="50" src="` + img + `" class="avatar cat_img"></td>
                            <td><input class="inp category" type="text" placeholder="اسم الفئه  " value="` + cat + `"/></td>
                            <td>
                                <form class="upload" action="upload" method="post">
                                    <input name="img" type="file" class="file img" />
                                    <input  type="hidden" class="img_id" value="`+ id + `"/>
                                </form>
                            </td>
                            <td>
                                <i class="tools spinner fa fa-spinner fa-spin w3-text-blue" style="display:none"></i>
                                <i class="tools save fa fa-save"></i>
                                <i class="tools del fa fa-cut"></i>
                            </td>
                        </tr>
                        `
        $("#cat_items").append(x);
    }

    $("#add_category").click(function () {
        add("", "", "");
    });

    //delete category
    $("#cat_items").on("click", ".del", function () {
        var item = $(this).closest('tr');
        var id = item.find(".img_id").val();
        var img = item.find(".cat_img").attr("src");
        if (id == "") return;
        db.ref('categories/' + id).set(null);
        if (img.startsWith("https")) {
            storage.ref().child(id + '.jpg').delete().then(function () {
            });
        }
        update();

    });

    //save category
    $("#cat_items").on('click', 'i.save', function () {
        var item = $(this).closest('tr');

        var cat = item.find(".category").val();
        if (cat == "") {
            alert("ضع اسم للفئة");
            return
        }
        var first = false;
        var id = item.find(".img_id").val();
        if (id == "") {
            id = db.ref().child('categories').push().key;
            first = true;
        }
        //user selected image file
        if (item.find(".img").val() != "") {
            var file = item.find(".upload").find(".img")[0].files[0]
            var img = id + ".jpg";
            loading(item)
            storage.ref().child(img).put(file).then(function (snapshot) {
                db.ref('categories/' + id).update({ category: cat, img: img });
                loaded(item)
                update();
            });
        }//no image selected
        else {
            var data = first ? { category: cat, img: "" } : { category: cat }
            db.ref('categories/' + id).update(data);
        }
        update();
    }
    );

});
