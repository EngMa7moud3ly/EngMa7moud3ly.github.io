$(document).ready(function () {

    function refresh() {
        $(".loader").show();
        db.ref('public/companies/').once('value').then(function (snapshot) {
            $('#prod_comp').find('option').remove().end();
            $("#prod_comp").append("<option selected></option>");
            var x = snapshot.val();
            for (var id in x) {
                var xx = x[id];
                $("#prod_comp").append("<option data=\"" + id + "\">" + xx.name + "</option>");
            }
            $(".loader").hide();
        });
    }
    $("#prod").click(refresh);

    function _loading() {
        $(".prod_spinner").show();
        $(".prod_new").hide();
        $(".prod_save").hide();
    }
    function _loaded() {
        $(".prod_spinner").hide();
        $(".prod_new").show();
        $(".prod_save").show();
    }

    $("#prod_comp").change(function () {
        get_departs("");
    });

    //get all departments of selected company
    function get_departs(ss) {
        var id = $('option:selected', $("#prod_comp")).attr('data');
        var company = $('option:selected', $("#prod_comp")).val();
        $(".loader").show();
        db.ref('public/companies/' + id + '/departs').once('value').then(function (snapshot) {
            $('#prod_departs').find('option').remove().end();
            var x = snapshot.val();
            for (var depart_id in x) {
                var xx = x[depart_id];
                $("#prod_departs").append("<option data=\"" + depart_id + "\">" + xx.name + "</option>")
            }
            $(".loader").hide();
            if (ss != "")
                $("#prod_departs").val(ss);
        });
        update_products(company)
    }

    //load products
    function update_products(search) {
        $('#products').find('li').remove().end();
        if (search == "" || search.trim() == "") return;
        db.ref('public/products/').once('value').then(function (snapshot) {
            var x = snapshot.val();
            for (var id in x) {
                var xx = x[id];
                var name = xx.name;
                var comp = xx.company;
                var imgs = xx.imgs
                if (name.indexOf(search) !== -1 || comp.indexOf(search) !== -1)
                    add_product_item(id, name, comp, imgs);
            }
            $(".loader").hide();
        });
    }
    //append product to product list
    function add_product_item(id, name, comp, imgs) {
        if (imgs == 0 || imgs == '' || imgs == undefined) {
            img = "images/loginn-logo.png"
        } else {
            img = "products%2F" + id + "__1.jpg"
            img = "https://firebasestorage.googleapis.com/v0/b/market-sohag.appspot.com/o/" + img + "?alt=media";
        }
        var x =
            `
                         <li class="w3-padding-16" data_id="` + id + `" data_imgs="` + imgs + `">
                            <i  class=" tools w3-button w3-transparent w3-xlarge w3-left fa fa-edit prod-edit"></i>
                            <i class=" tools w3-button w3-transparent w3-xlarge w3-left fa fa-remove prod-del"></i>
                            <img src="` + img + `" class="w3-right w3-circle w3-margin-right" style="width:50px;max-width:50px;height:50px;max-height:50px;">
                            <span class="prod-name w3-large w3-margin">` + name + `</span>
                            <br>
                            <span class="comp-name w3-small w3-margin">` + comp + `</span>
                        </li>       
                `
        $("#products").append(x);
    }
    //search for product
    $("#prod_search_btn").click(function () {
        var txt = $("#search").val();
        $(".loader").show();
        update_products(txt)
    });
    function _new() {
        $("#prod_id").val("");
        $("#imgs").val("");
    }
    //clear inputs
    $(".prod_new").click(_new);
    //upload product
    $('#product_upload').on('submit', function (e) {
        e.preventDefault();
        var name = $("#prod_name").val();
        var details = $("#prod_details").val();
        var price = $("#prod_price").val();
        var discount = $("#prod_discount").val();
        var company = $("#prod_comp").val();
        var company_id = $('option:selected', $("#prod_comp")).attr('data');
        var department = "", department_id = "";
        if (document.getElementById("prod_departs").length) {
            department = $("#prod_departs").val();
            department_id = $('option:selected', $("#prod_departs")).attr('data');
        }
        var id = $("#prod_id").val();
        var prod_num_imgs = $("#prod_num_imgs").val();
        var first = false;
        if (id == "") {
            id = db.ref().child('products').push().key;
            $("#prod_id").val(id);
            first = true;
        }
        var files = document.getElementById("products_imgs").files;
        if (files.length > 0) { prod_num_imgs = files.length; $("#prod_num_imgs").val(prod_num_imgs) }
        else if (prod_num_imgs == '0' || prod_num_imgs == '') prod_num_imgs = 0;
        var data = {
            name: name, details: details, price: price, discount: discount, company: company,
            company_id: company_id, department_id: department_id, department: department,
            imgs: prod_num_imgs
        }
        add_multiple(data, files, name, id);
    });

    //send data query
    function add_multiple(data, files, name, id) {
        _new();
        $(".loader").show();
        _loading();
        let j = files.length
        if (j == 0) {
            $(".loader").hide();
            db.ref('public/products/' + id).update(data);
            update_products(name);
            _loaded();
        }
        else {
            for (let i = 0; i < files.length; i++) {
                file = files[i];
                img = "public/products/" + id + "__" + (i + 1) + ".jpg"
                storage.ref().child(img).put(file).then(function (snapshot) {
                    j--;
                    if (j == 0) {
                        $(".loader").hide();
                        db.ref('public/products/' + id).update(data);
                        update_products(name);
                        _loaded();
                    }
                });
            }
        }

    }

    //edit product
    $("#products").on('click', 'i.prod-edit', function () {
        var id = $(this).closest('li').attr("data_id");
        db.ref('public/products/' + id).once('value').then(function (snapshot) {
            var x = snapshot.val();
            $("#prod_id").val(id);
            $("#prod_comp").val(x.company);
            get_departs(x.department);
            $("#prod_name").val(x.name);
            $("#prod_details").val(x.details);
            $("#prod_price").val(x.price);
            $("#prod_discount").val(x.discount);
        });
    });
    //delete product
    $("#products").on('click', 'i.prod-del', function () {
        var id = $(this).closest('li').attr("data_id");
        var imgs = $(this).closest('li').attr("data_imgs");
        db.ref('public/products/' + id).set(null);
        for (var i = 0; i < imgs; i++) {
            img = "public/products/" + i + id + ".jpg"
            storage.ref().child(img).delete().then(function () {
            });
        }
        update_products($("#prod_comp").val());

    });
});
