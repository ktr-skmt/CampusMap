var base_url = 'http://pcavil.itsc.ynu.ac.jp/api.php?',
    is_msie = $.browser.msie && window.XDomainRequest,
    seats = new Array(),
    locale = 'ja',
    en = 'en',
    room_name = "room_name",
    room_id = location.href;
room_id = room_id.substring(room_id.lastIndexOf("/") + 1, room_id.length);
room_id = room_id.substring(0, room_id.indexOf("."));
var url = base_url + 'room=' + room_id;
if (document.cookie) {
  var cookies = document.cookie.split("; ");
  for (var i = 0; i < cookies.length; i++) {
    var str = cookies[i].split("=");
    if (str[0] == "locale") {
      var cookie_value = unescape(str[1]);
      if (cookie_value == en) locale = en;
    } else if (str[0] == "room_id") {
      var cookie_value = unescape(str[1]);
      room_id = cookie_value;
    }
  }
}
if (locale == en) room_name = "english_room_name";
if (is_msie) {
  var xdr = new XDomainRequest();
  xdr.onload = function() {
    seats = jQuery.parseJSON(xdr.responseText);
    set_room_name();
    set_pc_map();
  }
  xdr.open("get", url, true);
  xdr.send(null);
} else {
  jQuery.getJSON(url, function (data) {
    seats = data;
    set_room_name();
    set_pc_map();
  });
}
function turn_on(pc_id) {
  var id = 'pc_' + pc_id + '_';
  document.getElementById(id + 'on').style.display = '';
  document.getElementById(id + 'off').style.display = 'none';
}
function set_pc_map() {
  var num_total_seats = seats['total_seats'],
      ids = seats['pc_id'];
  for (var pc_id = 1; pc_id <= num_total_seats; pc_id++) {
    for (var id in ids) {
      if (ids[id] == pc_id) turn_on(pc_id);
    }
  }
}
function set_room_name() {
  document.getElementById('room_id').innerSVG = seats[room_name];
}
