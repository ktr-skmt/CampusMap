var english_words = {"0":"106", "1":"101", "2":"102", "3":"103", "4":"104", "5":"105"},
    num_of_words = 0;
for (var word in english_words) {num_of_words++;}
if (locale == en) {
  for (var i = 0; i < num_of_words; i++) {
    document.getElementById('word_' + i).innerSVG = english_words[i];
  }
}