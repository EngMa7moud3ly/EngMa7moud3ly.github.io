var dropzone;
dropzone = document.getElementById("image_box");
dropzone.addEventListener("dragenter", dragenter, false);
dropzone.addEventListener("dragover", dragover, false);
dropzone.addEventListener("drop", drop, false);

var src="";
$('#add_image').fadeOut(300);  

function dragenter(e) {
  e.stopPropagation();
  e.preventDefault();
}

function dragover(e) {
  e.stopPropagation();
  e.preventDefault();
}


function drop(e) {
  e.stopPropagation();
  e.preventDefault();

  var dt = e.dataTransfer;
  var files = dt.files;

  handleFiles(files);
}


function handleFiles(files) {

  for (var i = 0; i < files.length; i++) {

    var file = files[i];
    var imageType = /image.*/;

    if (!file.type.match(imageType)) {
      continue;
    }

    var img = document.createElement("img");
    img.classList.add("obj");
    img.file = file;

    var reader = new FileReader();
    reader.onload = (function(aImg) {
      return function(e) {
        aImg.onload = function() {

          var canvas = document.createElement("canvas");
          var ctx = canvas.getContext("2d");
          canvas.width = aImg.width;
          canvas.height = aImg.height;
          ctx.drawImage(aImg, 0, 0);

          var newImg = new Image();
          newImg.onload = function() {
            src=newImg.src;
            $('#image_box').css("background-image", "url("+src+")");
            $('#image_box').css("background-size", "200px 150px");
            $('#add_image').fadeIn(300);  
          }
          newImg.src = canvas.toDataURL('image/jpeg');
        }
        aImg.src = e.target.result;
      };
    })(img);
    reader.readAsDataURL(file);

  } 
} 