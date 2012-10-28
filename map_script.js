var ids = {A:0,B:0,E:1,CD:2,K:3,L:3,M:3,F:4,"P-1":4,"P-2":4,Q:4,U:4,W:4,G:5,N:6,T:7,J:8,R:9,I:10,O:11,H:12},
    base_url = 'http://pcavil.itsc.ynu.ac.jp/api.php?',
    seats = new Array(),
    is_msie = $.browser.msie && window.XDomainRequest,
    url = base_url + 'room=all';
if (is_msie) {
  var xdr = new XDomainRequest();
  if (xdr) {
    xdr.onload = function() {
      seats = jQuery.parseJSON(xdr.responseText);
    }
    xdr.open("get", url, true);
    xdr.send(null);
  }
} else {
  jQuery.getJSON(url, function (data) {seats = data;});
}
function in_session_mode_content(subject, lecturer, suffix) {
  return subject + "(" + lecturer + ")" + suffix;
}
function open_mode_content(prefix, num_of_available_seats, num_of_total_seats, available_still) {
  return prefix + ":<tspan font-weight=\"bold\" fill=\"red\">" + num_of_available_seats + "</tspan>/" + num_of_total_seats + " now-" + available_still;
}
function closed_mode_content(pronoun, opening_hours_are, opening_time, closing_time, period) {
  return pronoun + opening_hours_are + opening_time + "-" + closing_time + period;
}
function is_afternoon() {
  var is_afternoon = true, date = new Date();
  if (date.getHours() < 12) is_afternoon = false;
  return is_afternoon; 
}
function get_content(id, data, locale) {
  var content = "",
      subject = "subject",
      lecturer = "lecturer",
      available_seats = "available_seats",
      total_seats = "total_seats",
      available_still = "available_still",
      tomorrow_opening_time = "tomorrow_opening_time",
      tomorrow_closing_time = "tomorrow_closing_time",
      today_opening_time = "today_opening_time",
      today_closing_time = "today_closing_time";
  switch (data[id]["mode"]) {
  case 'in_session':
    if (locale == 'en') {
      content = in_session_mode_content(data[id][subject], data[id][lecturer], " is in session.");
    } else {
      content = in_session_mode_content(data[id][subject], data[id][lecturer], "が講義中です。");
    }
    break;
  case 'open':
    if (locale == 'en') {
      content = open_mode_content("Available Seats", seats[id][available_seats], seats[id][total_seats], data[id][available_still]);
    } else {
      content = open_mode_content("空席", seats[id][available_seats], seats[id][total_seats], data[id][available_still]);
    }
    break;
  case 'closed':
    var pronoun = "", opening_time = "", closing_time = "", period = "";
    if (locale == 'en') {
      if (is_afternoon()) {
        pronoun = "Tomorrow";
        opening_time = data[id][tomorrow_opening_time];
        closing_time = data[id][tomorrow_closing_time];
      } else {
        pronoun = "Today";
        opening_time = data[id][today_opening_time];
        closing_time = data[id][today_closing_time];
      }
      period = ".";
      if ((opening_time == "") || (closing_time == "")) {
        content = "Closed " + pronoun.toLowerCase() + period;
      } else {
        content = closed_mode_content(pronoun, "'s opening hours are ", opening_time, closing_time, period);
      }
    } else {
      if (is_afternoon()) {
        pronoun = "明日";
        opening_time = data[id][tomorrow_opening_time];
        closing_time = closing_time = data[id][tomorrow_closing_time];
      } else {
        pronoun = "今日";
        opening_time = data[id][today_opening_time];
        closing_time = data[id][today_closing_time];
      }
      period = "です。";
      if ((opening_time == "") || (closing_time == "")) {
        content = pronoun + "は閉室" + period;
      } else {
        content = closed_mode_content(pronoun, "の開館時間は", opening_time, closing_time, period);
      }
    }
    break;
  default: break;
  }
  return content;
}
url = base_url + 'map=default';
if (is_msie) {
  var xdr = new XDomainRequest();
  if (xdr) {
    xdr.onload = function() {
      parse_map(jQuery.parseJSON(xdr.responseText));
    }
    xdr.open("get", url, true);
    xdr.send(null);
  }
} else {
  jQuery.getJSON(url, function (data) {parse_map(data)});
}
function parse_map (data) {
  var locale = 'ja', room_name = 'room_name', more = '&gt;&gt;';
  if (locale == 'en') {
    room_name = 'english_room_name';
    more += "more";
  } else more += "詳細";
  for (var id in ids) {
    var node = document.getElementById(id + '_room_name'), content = "";
    if (id == 'CD') {
      if (locale == 'en') {
        node.innerSVG = "Machine Shop C &amp; D";
      } else {
        node.innerSVG = "ＰＣ教室ＣＤ";
      }
      content = get_content('C', data, locale);
    } else {
      node.innerSVG = data[id][room_name];
      content = get_content(id, data, locale);
    }
    node = document.getElementById(id + '_content');
    node.innerSVG = content;
    node = document.getElementById(id + '_more');
    node.innerSVG = more;
  }
}
function pretend_room(str) {
  return "room" + str;
}
function get_rooms() {
  var rooms = new Array(), str = "", index = 0;
  for (var id in ids) {
    if (index == ids[id]) {
      str += id;
    } else {
      rooms[index] = pretend_room(str);
      str = id;
      index = ids[id];
    }
  }
  rooms[index] = pretend_room(str);
  return rooms;
}
var rooms = get_rooms();
function get_node(room) {
  return document.getElementById(room);
}
function get_nodeb(room) {
  return document.getElementById(room + 'b');
}
function focus_on(node, nodeb) {
  node.style.display = '';
  nodeb.setAttribute("fill", "red");
}
function blur(node, nodeb) {
  node.style.display = 'none';
  nodeb.setAttribute("fill", "#F4A000");
}
function hide_id(id) {
  hide(rooms[ids[id]]);
}
function hide(room) {
  blur(get_node(room), get_nodeb(room));
}
function hide_except(index) {
  for (var i = 0, room; room = rooms[i]; i++) {
    if (i != index) hide(room);
  }
}
function toggle(index) {
  var room = rooms[index],
    node = get_node(room),
    nodeb = get_nodeb(room);
  if (node.style.display == 'none') {
    focus_on(node, nodeb);
  } else {
    blur(node, nodeb);
  }
}
function exe(index) {
  hide_except(index);
  toggle(index);
}
