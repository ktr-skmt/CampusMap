var url = 'http://pcavil.itsc.ynu.ac.jp/api.php?room=',
    is_msie = $.browser.msie && window.XDomainRequest,
    locale = 'ja',
    en = 'en',
    room_ids = ['d', 'c'],
    timetable_id = "&timetable=this_today";
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
function undisplay_ajax_loader() {
  document.getElementById('ajax_loader').style.display = 'none';
  document.getElementById('pc_map').style.display = '';
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
    var xdr = new XDomainRequest();
    xdr.onload = function() {
      set_timetable(jQuery.parseJSON(xdr.responseText));
    }
    xdr.open("get", url + 'C' + timetable_id, true);
    xdr.send(null);
  } else {
    if (i == 0) {
      jQuery.getJSON(url + room_ids[i].toUpperCase(), function(data) {set_map_d(data);});
    } else if (i == 1) {
      jQuery.getJSON(url + room_ids[i].toUpperCase(), function(data) {set_map_c(data);});
    }
    jQuery.getJSON(url + 'C' + timetable_id, function(data) {set_timetable(data);});
  }
}
undisplay_ajax_loader();
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
function set_map_c(seats) {set_map(seats, "c");}
function set_map_d(seats) {set_map(seats, "d");}
function set_map(seats, room_id) {
  var num_total_seats = seats['total_seats'],
      ids = seats['pc_id'];
  for (var pc_id = 1; pc_id <= num_total_seats; pc_id++) {
    for (var id in ids) {
      if (ids[id] == pc_id) turn_on(room_id + pc_id);
    }
  }
}
