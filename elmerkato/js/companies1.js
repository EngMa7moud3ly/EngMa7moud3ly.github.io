//company detailes

$(document).ready(function () {

    function refresh() {
        $(".loader").show();
        db.ref('categories/').once('value').then(function (snapshot) {
            $('#comp_cat').find('option').remove().end();
            var x = snapshot.val();
            for (var id in x) {
                var xx = x[id];
                $("#comp_cat").append("<option>" + xx.category + "</option>")
            }
        });
        company_list_update("");
    }

    //company tab in side navigation viewer
    $("#comp").click(refresh);

    //company data&company departs details
    $(".company_tab").click(function () {
        $(".company_tab").removeClass("w3-border-red");
        $(this).addClass("w3-border-red");
        var x = $(this).attr("data");
        if (x == "1") {
            $("#comp_upload").show();
            $("#sub_comp_part").hide();
            $("#sub_comp_items").html("");
            refresh();
        } else {
            $("#comp_upload").hide();
            $("#sub_comp_part").show();
            $('#companies').find('li').remove().end();
        }
    });

    function company_list_update(search) {
        db.ref('companies/').once('value').then(function (snapshot) {
            var x = snapshot.val();
            $('#companies').find('li').remove().end();
            for (var id in x) {
                var xx = x[id];
                var name = xx.name;
                var imgs = xx.imgs
                if (search != "") {
                    if (xx.name.indexOf(search) !== -1) add_company_item(id, name, xx.details, imgs);
                } else
                    add_company_item(id, name, xx.details, imgs);
            }
            $(".loader").hide();
        });
    }

    function add_company_item(id, name, details, imgs) {
        if (imgs == 0 || imgs == '' || imgs == undefined) {
            img = "images/loginn-logo.png"
        } else {
            img = "company%2F0" + id + ".jpg"
            img = "https://firebasestorage.googleapis.com/v0/b/market-sohag.appspot.com/o/" + img + "?alt=media";
        }
        var x =
            `
                         <li class="w3-padding-16" data_id="` + id + `" data_imgs="` + imgs + `">
                            <i  class=" tools w3-button w3-transparent w3-xlarge w3-left fa fa-edit comp-edit"></i>
                            <i class=" tools w3-button w3-transparent w3-xlarge w3-left fa fa-remove comp-del"></i>
                            <img src="` + img + `" class="w3-right w3-circle w3-margin-right" style=";height:50px;max-height:50px;
                                 width:50px;max-width:50px;">
                            <span class="comp-name w3-large w3-margin">` + name + `</span>
                            <br>
                            <span class="comp-details w3-small w3-margin">` + details + `</span>

                        </li>       
                `
        $("#companies").append(x);
    }

    function _loading() {
        $(".comp_spinner").show();
        $(".comp_new").hide();
        $(".comp_save").hide();
    }
    function _loaded() {
        $(".comp_spinner").hide();
        $(".comp_new").show();
        $(".comp_save").show();
    }
    //search for company
    $("#comp_search_btn").click(function () {
        var txt = $("#comp_search").val();
        $(".loader").show();
        company_list_update(txt)
    });
    //clear all for new company
    function _new() {
        $("#comp_id").val("");
        $("#comp_imgs").val("");
        $("#sub_comp_items").html("");
    }
    $(".comp_new").click(_new);

    //save new company
    $('#comp_upload').on('submit', function (e) {
        e.preventDefault();
        var form = $("#comp_upload");
        var name = $("#comp_name").val();
        var details = $("#comp_details").val();
        var prod = $("#comp_prod").val();
        var address = $("#comp_address").val();
        var category = $("#comp_cat").val();
        var phone = $("#comp_phone").val();
        var code = $("#comp_discount_code").val();
        var discount = $("#comp_discount_value").val();

        var id = $("#comp_id").val();
        var comp_num_imgs = $("#comp_num_imgs").val();

        var first = false;
        if (id == "") {
            id = db.ref().child('companies').push().key;
            $("#comp_id").val(id);
            first = true;
        }
        var files = document.getElementById("comp_imgs").files

        var data = {
            name: name, details: details, address: address, prod: prod,
            category: category, code: code, discount: discount, phone: phone,
            imgs: ((comp_num_imgs == '0' || comp_num_imgs == '') ? files.length : comp_num_imgs)
        }
        add_multiple(data, files, id);
    });
    //send data query
    function add_multiple(data, files, id) {
        $(".loader").show();
        _loading();
        let j = files.length

        if (j == 0) {
            db.ref('companies/' + id).update(data);
            _new();
            _loaded();
            company_list_update("");

        } else {
            for (let i = 0; i < files.length; i++) {
                file = files[i];
                img = "company/" + i + id + ".jpg"
                storage.ref().child(img).put(file).then(function (snapshot) {
                    j--;
                    if (j == 0) {
                        db.ref('companies/' + id).update(data);
                        _new();
                        _loaded();
                        company_list_update("");
                    }
                });
            }
        }
    }

    //edit company
    $("#companies").on('click', 'i.comp-edit', function () {
        var id = $(this).closest('li').attr("data_id");
        db.ref('companies/' + id).once('value').then(function (snapshot) {
            var x = snapshot.val();
            $("#comp_id").val(id);
            $("#comp_num_imgs").val(x.imgs);
            $("#comp_name").val(x.name);
            $("#comp_cat").val(x.category);
            $("#comp_prod").val(x.prod);
            $("#comp_details").val(x.details);
            $("#comp_phone").val(x.phone);
            $("#comp_address").val(x.address);

            $("#comp_discount_code").val(x.code == null ? "" : x.code);
            $("#comp_discount_value").val(x.discount == null ? "" : x.discount);
            $("#comp_depratments").text(x.name);

            if (x.departs != null) {
                $("#sub_comp_items").html("");
                var departs = x.departs;
                for (var sub_id in departs) {
                    var depart = departs[sub_id];
                    add_sub_comp(sub_id, depart.name, depart.img);
                }
            }
        });
    });
    //delete company
    $("#companies").on('click', 'i.comp-del', function () {
        var id = $(this).closest('li').attr("data_id");
        var imgs = $(this).closest('li').attr("data_imgs");
        db.ref('companies/' + id).set(null);
        for (var i = 0; i < imgs; i++) {
            img = "company/" + i + id + ".jpg"
            storage.ref().child(img).delete().then(function () {
            });
        }
        company_list_update("");
    });


});
