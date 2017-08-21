var topics = ["eclipse", "sun", "stars"];

$(document).ready(function(){

  display.dropdown();
  $('#add').on('click', function() {
    handle.addTopic();
  });

  $('input[type=range]').on('input', function () {
    var numGifs = $('#slider').val();
    var string;
    numGifs === "1" ? string = numGifs + " Gif" : string = numGifs + " Gifs";
    $('#num_gifs').text("Retrieve " + string);
  });

  $('input[type=range]').mouseup(function(){
    var numGifs = $('#slider').val();

    if ($('.carousel').attr('topic') !== "") {
      var num = parseInt($('.carousel-inner').find('.active').attr('number'));
      $('.indicators').removeClass('active');

      var active;
      num > numGifs-1 ? active = numGifs-1 : active = num;
      handle.selectTopic($('.carousel').attr('topic'), active);
    }
  });

});

var display = {

  carouselIndicators: function(num, active) {
    var ind = $('<li>').attr('data-target', '#myCarousel');
    ind.attr('data-slide-to', num).addClass('indicators');
    if (num === active) ind.addClass('active');
    return ind;
  },
  carouselInner: function(num, active, src, src_s, rating) {
    var item = $('<div>').addClass('item').attr('number', num);
    item.attr('rating', rating);
    if (num === active) item.addClass('active');

    var img = $('<img>').attr('src', src).addClass('giphy');
    img.attr('data-animate', src);
    img.attr('data-still', src_s);
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
    $('.carousel').attr('topic', topic);
    handle.selectTopic(topic, 0);
    $('#input').val(topic);
  },
  selectTopic: function(topic, active) {
    $('#title').text(topic.toUpperCase()+"-GIPHIES");
    var numGifs = $('#slider').val();

    var queryURL = "https://api.giphy.com/v1/gifs/search?q=" +
      topic + "&api_key=dc6zaTOxFJmzC&limit="+numGifs;

    $.ajax({
      url: queryURL,
      method: "GET"
    }).done(function(response) {
      var results = response.data;

      $('.carousel').empty();
      var ol = $('<ol>').addClass('carousel-indicators');
      var div = $('<div>').addClass('carousel-inner');
      var caption = $('<p>').addClass('caption');
      var rated;

      for (var i = 0; i < response.data.length; i++) {
        var rating = response.data[i].rating.toUpperCase();
        if (i === active) rated = rating;
        var src = response.data[i].images.fixed_height.url;
        var src_s = response.data[i].images.fixed_height_still.url;
        ol.append(display.carouselIndicators(i, active));
        div.append(display.carouselInner(i, active, src, src_s, rating));
      }

      $('.carousel').append(ol);
      $('.carousel').append(div);
      caption.text("Rated: "+rated);
      $('.carousel').append(caption);

      display.carouselArrow("left");
      display.carouselArrow("right");
    }); 
  },
  addTopic: function() {
    var topic = $('#input').val().toLowerCase();
    $('.carousel').attr('topic', topic);
    if (topic !== "") {
      console.log(topic);
      if (topics.indexOf(topic) === -1) {
        topics.push(topic);
        display.dropdown();
      }
      handle.selectTopic(topic, 0);
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

  var maxNum = parseInt($('#slider').val())-1;
  if (direction === "prev") num === 0 ? num = maxNum : num--;
  else num === maxNum ? num = 0 : num++;

  var makeActive = $('.indicators')[num];
  $('.carousel-indicators').find(makeActive).addClass('active');

  var activeItem = $('.item')[num];
  var rated = $('.carousel-inner').find(activeItem).attr('rating');
  $('.caption').text("Rated: "+rated);
});
$(document).on('click', '.indicators', function() { 
  $('.indicators').removeClass('active');

  var makeActive = $('.indicators')[$(this).attr('data-slide-to')];
  $('.carousel-indicators').find(makeActive).addClass('active');

  var activeItem = $('.item')[$(this).attr('data-slide-to')];
  var rated = $('.carousel-inner').find(activeItem).attr('rating');
  $('.caption').text("Rated: "+rated);
});

