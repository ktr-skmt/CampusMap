var base_url = 'http://pcavil.itsc.ynu.ac.jp/api.php?',
    is_msie = $.browser.msie && window.XDomainRequest,
    seats = new Array(),
    locale = 'ja',
    en = 'en',
    room_name = "room_name",
    room_id = location.href,
    timetable_id = "&timetable=this_today",
    room_ids4class_use = ['A', 'B', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O'];
room_id = room_id.substring(room_id.lastIndexOf("/") + 1, room_id.length);
room_id = room_id.substring(0, room_id.indexOf("."));
var can_use_this4class = jQuery.inArray(room_id, room_ids4class_use) >= 0,
    url = base_url + 'room=' + room_id;
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
  room_name = "english_room_name";
  document.getElementById('japanese_words').style.display = 'none';
  document.getElementById('english_words').style.display = '';
}
function undisplay_ajax_loader() {
  document.getElementById('ajax_loader').style.display = 'none';
  document.getElementById('pc_map').style.display = '';
}
if (is_msie) {
  var xdr = new XDomainRequest();
  xdr.onload = function() {
    seats = jQuery.parseJSON(xdr.responseText);
    set_room_name();
    set_pc_map(room_id);
    if (!can_use_this4class) undisplay_ajax_loader();
  }
  xdr.open("get", url, true);
  xdr.send(null);
  if (can_use_this4class) {
    xdr = new XDomainRequest();
    xdr.onload = function() {
      set_timetable(jQuery.parseJSON(xdr.responseText));
      undisplay_ajax_loader();
    }
    xdr.open("get", url + timetable_id, true);
    xdr.send(null);
  }
} else {
  jQuery.getJSON(url, function (data) {
    seats = data;
    set_room_name();
    set_pc_map(room_id);
    if (!can_use_this4class) undisplay_ajax_loader();
  });
  if (can_use_this4class) {
    jQuery.getJSON(url + timetable_id, function (data) {
      set_timetable(data);
      undisplay_ajax_loader();
    });
  }
}
function set_timetable(timetable) {
  var w = (new Date()).getDay(),
      youbi = ['日', '月', '火', '水', '木', '金', '土'],
      weekday = ['Sun', 'Mon', 'Tues', 'Wednes', 'Thurs', 'Fri', 'Satur'];
  if (locale == en) document.getElementById('timetable_name').innerSVG = weekday[w] + "day's Timetable";
  else document.getElementById('timetable_name').innerSVG = youbi[w] + "曜日の時間割";
  for (var i = 1; i < 7; i++) {
    var period_name = i + "限",
        period_id = period_name;
    if (i == 6) period_id = "夜間";
    var today_timetable = timetable[period_id][0];
    if (typeof today_timetable != "undefined") {
      document.getElementById('subject_' + i).innerSVG = today_timetable['subject'];
      document.getElementById('lecturer_' + i).innerSVG = today_timetable['lecturer'] + ' ' + today_timetable['date'];
    }
    if (locale == en) period_name = "Period " + i;
    document.getElementById('period_' + i).innerSVG = period_name;
  }
}
function turn_on(pc_id) {
  var id = 'pc_' + pc_id + '_';
  document.getElementById(id + 'on').style.display = '';
  document.getElementById(id + 'off').style.display = 'none';
}
function set_pc_map(room_id) {
  if (room_id == 'P-2') set_pc(66);
  else set_pc(1);
}
function set_pc(start) {
  var num_total_seats = seats['total_seats'],
      ids = seats['pc_id'];
  for (var pc_id = start; pc_id < start + num_total_seats; pc_id++) {
    for (var id in ids) {
      if (ids[id] == pc_id) turn_on(pc_id);
    }
  }
}
function set_room_name() {
  document.getElementById('room_id').innerSVG = seats[room_name];
}
