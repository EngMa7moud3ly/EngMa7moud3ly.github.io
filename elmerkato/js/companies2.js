function add_sub_comp(sub_id, name, img) {
    if (img == "") {
        img = "images/loginn-logo.png"
    } else {
        img = "company%2Fdeparts%2F" + sub_id + ".jpg"
        img = "https://firebasestorage.googleapis.com/v0/b/market-sohag.appspot.com/o/" + img + "?alt=media";
    }
    var x = `
                        <tr>
                            <td><img alt="Avatar" width="50" height="50" src="` + img + `" class="avatar sub_img"></td>
                            <td><input class="inp sub_name" type="text" placeholder="اسم القسم  " value="` + name + `"/></td>
                            <td>
                                <div class="show_file">تحديد صورة</div>       
                                <form class="upload" action="upload.php" method="post">
                                    <input name="img" type="file" class="img" style="display:none" />
\                                    <input " class="img_sub_id" type="hidden" value="` + sub_id + `"/>
                                </form>
                            </td>
                            <td>
                                <i class="tools spinner fa fa-spinner fa-spin w3-text-blue" style="display:none"></i>
                                <i class="tools save fa fa-save"></i>
                                <i class="tools del fa fa-cut"></i>
                            </td>
                        </tr>
                        `
    $("#sub_comp_items").append(x);
}

$(document).ready(function () {

    function sub_comp_loading(x) {
        x.find(".spinner").show();
        x.find(".save").hide();
        x.find(".del").hide();
    }
    function sub_comp_loaded(x) {
        x.find(".spinner").hide();
        x.find(".save").show();
        x.find(".del").show();
    }



    $("#add_sub_comp").click(function () {
        var x = add_sub_comp("", "", "");
    });

    $("#sub_comp_items").on("click", ".show_file", function () {
        var div = $(this);
        var x = $(this).closest('tr');
        var f = x.find(".img");
        f.click();
        f.change(function () {
            div.text($(this).val());
        });
    });

    $("#sub_comp_items").on("click", "i.del", function () {
        var item = $(this).closest('tr');
        var sub_id = item.find(".img_sub_id").val();
        var comp_id = $("#comp_id").val();
        var img = item.find(".sub_img").attr("src");
        if (sub_id == "") return;
        db.ref('public/companies/' + comp_id + '/departs/' + sub_id).set(null);
        if (img.startsWith("https")) {
            storage.ref().child("company/departs/" + sub_id + '.jpg').delete().then(function () {
            });
        }
        update();

    });

    //save new department
    $("#sub_comp_items").on('click', 'i.save', function () {
        var item = $(this).closest('tr');
        var name = item.find(".sub_name").val();
        if (name == "") {
            alert("ضع اسم للقسم");
            return;
        }
        var first = false;
        var comp_id = $("#comp_id").val();
        if (comp_id == "") {
            alert("قم بحفظ الشركة الأول قبل حفظ اقسام الشركه :3")
            return;
        }
        var id = item.find(".img_sub_id").val();
        if (id == "") {
            id = db.ref().child('public/companies/' + comp_id + "/departs").push().key;
            item.find(".img_id").val(id);
            first = true;
        }
        //user selected image file
        if (item.find(".img").val() != "") {
            var file = item.find(".upload").find(".img")[0].files[0]
            var img = "company/departs/" + id + ".jpg"
            storage.ref().child(img).put(file).then(function (snapshot) {
                db.ref('public/companies/' + comp_id + '/departs/' + id).update({ name: name, img: 1 });
                update(comp_id);
                sub_comp_loaded(item);
            });
        }//no image selected
        else {
            var data = first ? { name: name, img: "" } : { name: name }
            db.ref('public/companies/' + comp_id + '/departs/' + id).update(data);
            update(comp_id);
        }
    });

    function update(comp_id) {
        $(".loader").show();
        db.ref('public/companies/' + comp_id + '/departs').once('value').then(function (snapshot) {
            var x = snapshot.val();
            $('#sub_comp_items').find('tr').remove().end();
            for (var sub_id in x) {
                var xx = x[sub_id];
                add_sub_comp(sub_id, xx.name, xx.img)
            }
            $(".loader").hide();
        });
        add_sub_comp("", "", "");
    }

});
