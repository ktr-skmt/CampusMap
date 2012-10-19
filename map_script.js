var ids = {A:0,B:0,E:1,CD:2,K:3,L:3,M:3,F:4,P:4,Q:4,U:4,W:4,G:5,N:6,T:7,J:8,R:9,I:10,O:11,H:12};

function get_rooms() {
  var rooms = new Array(), str = "", index = 0, flag = 0;
  for (var id in ids) {
    if (index == ids[id]) {
      str += id;
    } else {
      rooms[index] = "room" + str;
      str = id;
      index = ids[id];
    }
  }
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
