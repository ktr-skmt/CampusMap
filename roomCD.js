var url = 'http://pcavil.itsc.ynu.ac.jp/api.php?room=',
    is_msie = $.browser.msie && window.XDomainRequest,
    locale = 'ja',
    en = 'en',
    room_ids = new Array('d', 'c');
if (document.cookie) {
  var cookies = document.cookie.split("; ");
  for (var i = 0; i < cookies.length; i++) {
    var str = cookies[i].split("=");
    if (str[0] == "locale") {
      var cookie_value = unescape(str[1]);
      if (cookie_value == en) locale = en;
    }
  }
}
if (locale == en) {
  document.getElementById('japanese_words').style.display = 'none';
  document.getElementById('english_words').style.display = '';
}
function set_xdr(room_id) {
  var xdr = new XDomainRequest();
  xdr.onload = function() {set_map(jQuery.parseJSON(xdr.responseText), room_id);}
  xdr.open("get", url + room_id.toUpperCase(), true);
  xdr.send(null);
}
for (var i = 0; i < room_ids.length; i++) {
  if (is_msie) {
    set_xdr(room_ids[i]);
  } else {
    jQuery.getJSON(url + room_ids[i].toUpperCase(), function(data) {set_map(data, room_ids[i]);});
  }
}
function turn_on(pc_id) {
  var id = 'pc_' + pc_id + '_';
  document.getElementById(id + 'on').style.display = '';
  document.getElementById(id + 'off').style.display = 'none';
}
function set_map(seats, room_id) {
  var num_total_seats = seats['total_seats'],
      ids = seats['pc_id'];
  for (var pc_id = 1; pc_id <= num_total_seats; pc_id++) {
    for (var id in ids) {
      if (ids[id] == pc_id) turn_on(room_id + pc_id);
    }
  }
}
