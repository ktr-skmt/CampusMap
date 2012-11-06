var english_words = {"0":"Entrance"},
    num_of_words = 1;
if (locale == en) {
  for (var i = 0; i < num_of_words; i++) {
    document.getElementById('word_' + i).innerSVG = english_words[i];
  }
}