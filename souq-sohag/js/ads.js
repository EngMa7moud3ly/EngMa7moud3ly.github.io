$(document).ready(function () {

    function update() {
        $(".loader").show();
        db.ref('ads/').once('value').then(function (snapshot) {
            var x = snapshot.val();
            $('#ads_items').find('tr').remove().end();
            for (var id in x) {
                add(id)
            }
            $(".loader").hide();
        });
    }
    $("#ads").click(update);

    function loading(x) {
        x.find(".spinner").show();
        x.find(".save").hide();
        x.find(".del").hide();
    }
    function loaded(x) {
        x.find(".spinner").hide();
        x.find(".save").show();
        x.find(".del").show();
    }

    function add(id) {
        if (id == "") {
            img = "images/loginn-logo.png"
        } else {
            img = "ads%2F" + id + ".jpg"
            img = "https://firebasestorage.googleapis.com/v0/b/market-sohag.appspot.com/o/" + img + "?alt=media";
        }
        var x = `<tr>
                            <td><img alt="Avatar" height="80" src="` + img + `" class="add_img cat_img" ></td>
                            <td>
                                <form class="upload" action="upload" method="post">
                                    <input name="img" type="file" class="file img" />
                                    <input name="img_id" class="img_id" type="hidden" value="` + id + `"/>
                                </form>
                            </td>
                            <td>
                                <i class="tools spinner fa fa-spinner fa-spin w3-text-blue" style="display:none"></i>
                                <i class="tools save fa fa-save"></i>
                                <i class="tools del fa fa-cut"></i>
                           </td>
                 </tr>
                        `
        $("#ads_items").append(x);
    }

    $("#add_ads").click(function () {
        add("");
    });

    $("#ads_items").on("click", ".del", function () {
        var item = $(this).closest('tr');
        var id = item.find(".img_id").val();
        if (id == "") return;
        db.ref('ads/' + id).set(null);
        storage.ref().child("ads/" + id + '.jpg').delete().then(function () {
            update();
        });
    });

    //save new add
    $("#ads_items").on('click', 'i.save', function () {
        var item = $(this).closest('tr');
        if (item.find(".img").val() == "") {
            alert("حدد صورة الاعلان");
            return;
        }
        var first = false;
        var id = item.find(".img_id").val();
        if (id == "") {
            id = db.ref().child('ads').push().key;
            item.find(".img_id").val(id);
            first = true;
        }
        loading(item);
        var file = item.find(".upload").find(".img")[0].files[0]
        var img = "ads/" + id + ".jpg";
        loading(item)
        storage.ref().child(img).put(file).then(function (snapshot) {
            db.ref('ads/' + id).set({ id: id });
            loaded(item)
            update();
        });

    });
});
