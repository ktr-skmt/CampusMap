var ids = {A:0,B:0,E:1,CD:2,K:3,L:3,M:3,F:4,"P-1":4,"P-2":4,Q:4,U:4,W:4,G:5,N:6,T:7,J:8,R:9,I:10,O:11,H:12},
    base_url = 'http://pcavil.itsc.ynu.ac.jp/api.php?',
    seats = new Array(),
    is_msie = $.browser.msie && window.XDomainRequest,
    url = base_url + 'room=all',
    en = 'en',
    roomE = 'E',
    locale = 'ja',
    colors = new Array(),
    rooms = get_rooms();
if (document.cookie) {
  var cookies = document.cookie.split("; ");
  for (var i = 0; i < cookies.length; i++) {
    var str = cookies[i].split("=");
    if (str[0] == "locale") {
      var cookie_value = unescape(str[1]);
      if (cookie_value == en) locale = en;
      break;
    }
  }
}
if (is_msie) {
  var xdr = new XDomainRequest();
  xdr.onload = function() {
    seats = jQuery.parseJSON(xdr.responseText);
    colors = get_colors();
    set_colors();
  }
  xdr.open("get", url, true);
  xdr.send(null);
} else {
  jQuery.getJSON(url, function (data) {
    seats = data;
    colors = get_colors();
    set_colors();
  });
}
function set_colors() {
  for (var i = 0, room; room = rooms[i]; i++) {
    var nodeb = get_nodeb(room), color = colors[i];
    nodeb.setAttribute("fill", color);
  }
}
function convert_base10to16(base10) {
  var base16 = base10.toString(16);
  if (base16.length == 0) {
    base16 = "00";
  } else if (base16.length == 1) {
    base16 = "0" + base16;
  } else if (base16.length > 2) {
    if (base16.charAt(1) == '.') {
      base16 = "0" + base16.charAt(0);
    } else {
      base16 = base16.slice(0, 2);
    }
  }
  return base16;
}
function get_color(num_of_available_seats, num_of_total_seats) {
  var red = 228, green = 142, blue = 0, ratio = num_of_available_seats / num_of_total_seats;
  red += 16 * ratio;
  red = convert_base10to16(red);
  green += 18 * ratio;
  green = convert_base10to16(green);
  blue = (1 - ratio) * 140;
  blue = convert_base10to16(blue);
  return '#' + red + green + blue;
}
function get_colors() {
  var building = 0,
      is_same = false,
      num_of_available_seats = 0,
      num_of_total_seats = 0,
      available_seats = "available_seats",
      total_seats = "total_seats",
      colors = new Array();
  for (var id in ids) {
    is_same = building == ids[id];
    if (!is_same) {
      colors[building] = get_color(num_of_available_seats, num_of_total_seats);
      building = ids[id];
      num_of_available_seats = 0;
      num_of_total_seats = 0;
    }
    if (id == 'CD') {
      num_of_available_seats = seats['C'][available_seats] + seats['D'][available_seats];
      num_of_total_seats = seats['C'][total_seats] + seats['D'][total_seats];
    } else {
      num_of_available_seats += seats[id][available_seats];
      num_of_total_seats += seats[id][total_seats];
    }
  }
  colors[building] = get_color(num_of_available_seats, num_of_total_seats);
  return colors;
}
function in_session_mode_contents(subject, lecturer) {
  return new Array(subject, lecturer);
}
function open_mode_contents(prefix, num_of_available_seats, num_of_total_seats, available_still) {
  return new Array(prefix + ":<tspan font-weight=\"bold\" fill=\"green\">" + num_of_available_seats + "</tspan>/" + num_of_total_seats, "-" + available_still);
}
function closed_mode_contents(pronoun, opening_hours_are, opening_time, closing_time, period) {
  return new Array(pronoun + opening_hours_are, opening_time + "-" + closing_time + period);
}
function is_afternoon() {
  var is_afternoon = true, date = new Date();
  if (date.getHours() < 12) is_afternoon = false;
  return is_afternoon; 
}
function get_contents(id, data, locale) {
  var contents = new Array(),
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
    contents = in_session_mode_contents(data[id][subject], data[id][lecturer]);
    break;
  case 'open':
    if (locale == en) {
      contents = open_mode_contents("Available Seats", seats[id][available_seats], seats[id][total_seats], data[id][available_still]);
    } else {
      contents = open_mode_contents("空席", seats[id][available_seats], seats[id][total_seats], data[id][available_still]);
    }
    break;
  case 'closed':
    var pronoun = "", opening_time = "", closing_time = "", period = "";
    if (locale == en) {
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
        contents = new Array("Closed " + pronoun.toLowerCase() + period, "");
      } else {
        contents = closed_mode_contents(pronoun, "'s opening hours are ", opening_time, closing_time, period);
      }
    } else {
      if (is_afternoon()) {
        pronoun = "明日";
        opening_time = data[id][tomorrow_opening_time];
        closing_time = data[id][tomorrow_closing_time];
      } else {
        pronoun = "今日";
        opening_time = data[id][today_opening_time];
        closing_time = data[id][today_closing_time];
      }
      period = "です。";
      if ((opening_time == "") || (closing_time == "")) {
        contents = new Array( pronoun + "は閉室" + period, "");
      } else {
        contents = closed_mode_contents(pronoun, "の開館時間は", opening_time, closing_time, period);
      }
    }
    break;
  default: break;
  }
  return contents;
}
function set_data2map (data) {
  var room_name = 'room_name', more = '&gt;&gt;';
  if (locale == en) {
    room_name = 'english_room_name';
    more += "more";
  } else more += "詳細";
  for (var id in ids) {
    var node = document.getElementById(id + '_room_name'), contents = new Array();
    if (id == 'CD') {
      if (locale == en) {
        node.innerSVG = "Machine Shop C &amp; D";
      } else {
        node.innerSVG = "ＰＣ教室ＣＤ";
      }
      contents = get_contents('C', data, locale);
    } else {
      if (locale == en) {
        if (id == 'N') {
          node.innerSVG = "Seisan-tō Ⅰ 305";
        } else if (id == 'J') {
          node.innerSVG = "Center for Educational Research &amp;Practices";
        } else if (id == 'K') {
          node.innerSVG = "Denjō-tō 1F Terminal Room";
        } else if (id == 'L') {
          node.innerSVG = "Denjō-tō 3F Terminal Room 1";
      	} else if (id == 'M') {
          node.innerSVG = "Denjō-tō 3F Terminal Room 2";
        } else {
          node.innerSVG = data[id][room_name];
        }
	  } else {
        node.innerSVG = data[id][room_name];
      }
      contents = get_contents(id, data, locale);
    }
    document.getElementById(id + '_content_0').innerSVG = contents[0];
    document.getElementById(id + '_content_1').innerSVG = contents[1]
    document.getElementById(id + '_more').innerSVG = more;
  }
}
url = base_url + 'map=default';
if (is_msie) {
  var xdr = new XDomainRequest();
  xdr.onload = function() {
    set_data2map(jQuery.parseJSON(xdr.responseText));
  }
  xdr.open("get", url, true);
  xdr.send(null);
} else {
  jQuery.getJSON(url, function (data) {set_data2map(data)});
}
function prepend_room(str) {
  return "room" + str;
}
function get_rooms() {
  var rooms = new Array(), str = "", index = 0;
  for (var id in ids) {
    if (index == ids[id]) {
      str += id;
    } else {
      rooms[index] = prepend_room(str);
      str = id;
      index = ids[id];
    }
  }
  rooms[index] = prepend_room(str);
  return rooms;
}
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
function blur(node, nodeb, room) {
  node.style.display = 'none';
  nodeb.setAttribute("fill", colors[rooms.indexOf(room)]);
}
function hide_id(id) {
  hide(rooms[ids[id]]);
}
function hide(room) {
  blur(get_node(room), get_nodeb(room), room);
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
    blur(node, nodeb, room);
  }
}
function exe(index) {
  hide_except(index);
  toggle(index);
}
