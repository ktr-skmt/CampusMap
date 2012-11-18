var base_url = 'http://pcavil.itsc.ynu.ac.jp/api.php?',
    is_msie = $.browser.msie && window.XDomainRequest,
    locale = 'ja',
    en = 'en',
    room_id = '',
    url_c = base_url + 'room=C',
    url_d = base_url + 'room=D';

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
if (locale == en) {
  document.getElementById('japanese_words').style.display = 'none';
  document.getElementById('english_words').style.display = '';
}
if (is_msie) {
  var xdr = new XDomainRequest();
  xdr.onload = function() {set_d_map(jQuery.parseJSON(xdr.responseText));}
  xdr.open("get", url_d, true);
  xdr.send(null);
  xdr = new XDomainRequest();
  xdr.onload = function() {set_c_map(jQuery.parseJSON(xdr.responseText));}
  xdr.open("get", url_c, true);
  xdr.send(null);
} else {
  jQuery.getJSON(url_d, function(data) {set_d_map(data);});
  jQuery.getJSON(url_c, function(data) {set_c_map(data);});
}
function turn_on(pc_id) {
  var id = 'pc_' + pc_id + '_';
  document.getElementById(id + 'on').style.display = '';
  document.getElementById(id + 'off').style.display = 'none';
}
function set_c_map(seats) {
  var num_total_seats = seats['total_seats'],
      ids = seats['pc_id'];
  for (var pc_id = 1; pc_id <= num_total_seats; pc_id++) {
    for (var id in ids) {
      if (ids[id] == pc_id) turn_on('c' + pc_id);
    }
  }
}
function set_d_map(seats) {
  var num_total_seats = seats['total_seats'],
    ids = seats['pc_id'];
  for (var pc_id = 1; pc_id <= num_total_seats; pc_id++) {
    for (var id in ids) {
      if (ids[id] == pc_id) turn_on('d' + pc_id);
    }
  }
}