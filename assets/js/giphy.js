var topics = ["cat", "dog"];

$(document).ready(function(){

  display.dropdown();
  $('#add').on('click', function() {
    handle.addTopic();
  });

});

var display = {

  carouselIndicators: function(num) {
    var ind = $('<li>').attr('data-target', '#myCarousel');
    ind.attr('data-slide-to', num).addClass('indicators');
    if (num === 0) ind.addClass('active');
    return ind;
  },
  carouselInner: function(num, rating, src, src_s) {
    var item = $('<div>').addClass('item').attr('number', num);
    if (num === 0) item.addClass('active');

    var img = $('<img>').attr('src', src).addClass('giphy');
    img.attr('data-animate', src);
    img.attr('data-still', src_s);
    img.attr('data-rating', rating);
    item.append(img);
    return item;
  },
  carouselArrow: function(direction) {
    var arrow = $('<a>').addClass(direction).addClass('carousel-control');
    arrow.attr('href', '#myCarousel');
    direction === "left" ? arrow.attr('data-slide', 'prev') : arrow.attr('data-slide', 'next');
  
    var span1 = $('<span>').addClass('glyphicon');
    span1.addClass('glyphicon-chevron-'+direction);
    var span2 = $('<span>').addClass('sr-only');
    direction === "left" ? span2.text("Previous") : span2.text('Next');

    arrow.append(span1);
    arrow.append(span2);
    $('.carousel').append(arrow);
  },
  dropdown: function() {
    $('.dropdown-menu').empty();
    for (var i = 0; i < topics.length; i++) {
      var item = $('<li>').addClass('drop-item topics');
      item.data('topic', topics[i]);
      var a = $('<a>').text(topics[i]);
      item.append(a);
      $('.dropdown-menu').append(item);
    }
  }
}

var handle = {
  clickTopic: function() {
    var topic = $(this).data('topic');
    handle.selectTopic(topic);
  },
  selectTopic: function(topic) {
    $('#title').text(topic.toUpperCase()+"-GIPHIES");

    var queryURL = "https://api.giphy.com/v1/gifs/search?q=" +
      topic + "&api_key=dc6zaTOxFJmzC&limit=10";

    $.ajax({
      url: queryURL,
      method: "GET"
    }).done(function(response) {
      var results = response.data;

      $('.carousel').empty();
      var ol = $('<ol>').addClass('carousel-indicators');
      var div = $('<div>').addClass('carousel-inner');

      for (var i = 0; i < response.data.length; i++) {
        var rating = response.data[i].rating.toUpperCase();
        var src = response.data[i].images.fixed_height.url;
        var src_s = response.data[i].images.fixed_height_still.url;
        ol.append(display.carouselIndicators(i));
        div.append(display.carouselInner(i, rating, src, src_s));
      }

      $('.carousel').append(ol);
      $('.carousel').append(div);
      display.carouselArrow("left");
      display.carouselArrow("right");
    }); 
  },
  addTopic: function() {
    var topic = $('#input').val();
    if (topic !== "") {
      topics.push(topic);
      display.dropdown();
      $('#input').val('');
      handle.selectTopic(topic);
    }
  },
  toggleGifs: function() {
    $(this).attr('src') === $(this).data('still') ? $(this).attr('src', $(this).data('animate')) 
                                                  : $(this).attr('src', $(this).data('still'));
  }
}

$(document).on('click', '.topics', handle.clickTopic);
$(document).on('click', '.giphy', handle.toggleGifs);
$(document).keypress(function(e) {
  if(e.which == 13) handle.addTopic();
});
$(document).on('click', '.carousel-control', function() {
  var num = parseInt($('.carousel-inner').find('.active').attr('number'));
  $('.indicators').removeClass('active');
  var direction = $(this).attr('data-slide');

  if (direction === "prev") {
    num === 0 ? num = 9 : num--;
  }
  else {
    num === 9 ? num = 0 : num++;
  }
  var makeActive = $('.indicators')[num];
  $('.carousel-indicators').find(makeActive).addClass('active');
});
$(document).on('click', '.indicators', function() { 
  $('.indicators').removeClass('active');
  var makeActive = $('.indicators')[$(this).attr('data-slide-to')];
  $('.carousel-indicators').find(makeActive).addClass('active');
});

