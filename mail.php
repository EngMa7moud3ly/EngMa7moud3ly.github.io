<?php

if ($_SERVER['REQUEST_METHOD'] === 'GET' && isset($_GET['msg'])&& isset($_GET['from'])) {
  $msg = $_GET['msg'];
  $from = $_GET['from'];
  $msg = wordwrap($msg,70);
  $headers = "From: $from";
  $x=mail("ma7moud3ly2012@gmail.com","Ma7moud3ly.com",$msg,$headers);
  if($x)echo "done";
  else echo "failed";
}
else echo "error";
?>
