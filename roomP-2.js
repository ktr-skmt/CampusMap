var english_words = {"0":"↓Library 2F", "1":"↓Machine Shop"},
    num_of_words = 0;
for (var word in english_words) {num_of_words++;}
if (locale == en) {
  for (var i = 0; i < num_of_words; i++) {
    document.getElementById('word_' + i).innerSVG = english_words[i];
  }
}