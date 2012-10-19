var rooms = new Array('roomAB','roomE','roomCD','roomKLM','roomFPQUW','roomG','roomN','roomT','roomJ','roomR','roomI','roomO','roomH');
function get_index_from_id(id) {
  var index = -1;
  switch (id) {
    case 'A': index = 0; break; 
    case 'B': index = 0; break;
    case 'E': index = 1; break;
    case 'CD': index = 2; break;
    case 'K': index = 3; break;
    case 'L': index = 3; break;
    case 'M': index = 3; break;
    case 'F': index = 4; break;
    case 'P': index = 4; break;
    case 'Q': index = 4; break;
    case 'U': index = 4; break;
    case 'W': index = 4; break;
    case 'G': index = 5; break;
    case 'N': index = 6; break;
    case 'T': index = 7; break;
    case 'J': index = 8; break;
    case 'R': index = 9; break;
    case 'I': index = 10; break;
    case 'O': index = 11; break;
    case 'H': index = 12; break;
  }
  return index;
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
function blur(node, nodeb) {
  node.style.display = 'none';
  nodeb.setAttribute("fill", "#F4A000");
}
function hide_id(id) {
  var index = get_index_from_id(id);
  if (index + 1) hide(rooms[index]);
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
  var room = rooms[index];
  var node = get_node(room);
  var nodeb = get_nodeb(room);
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
