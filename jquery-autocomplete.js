$.fn.autocomplete = function(keywords) {
  'use strict';
  this.keywords = keywords;
  this.autocompleteUid = generateUid();
  this.on('input', showSuggestions.bind(this));
  $('<div id="' + uid.call(this) + '" class="autocomplete-container"></div>').hide().insertAfter(this);

  this.keydown(function(event) {
    console.log(event.which);
    var $container = $('#' + uid.call(this));
    var $activeItem = $container.find('li.active');
    if(!$activeItem.length) {
      return;
    }
    switch (event.which) {
      case 13:
        if ($container.css('display') === 'none') {
          return;
        }

        this.val($activeItem.children().text());
        $container.hide();
        break;
      case 40:
        event.preventDefault();
        if (!$activeItem.next().length) {
          return;
        }

        $activeItem.removeClass('active');
        $activeItem.next().addClass('active');
        break;

      case 38:
        event.preventDefault();
        if (!$container.find('li.active').prev().length) {
          return;
        }

        $container.find('li.active').removeClass('active')
          .prev().addClass('active');
        break;

      case 9:
      case 27:
        event.preventDefault();
        $container.hide();
        break;

      default:
        return;
    }

    $container.scrollTop($container.scrollTop() + $container.find('li.active').position().top - $container.height() / 2 + $container.find('li.active').height() / 2);
  }.bind(this));

  function showSuggestions() {
    /*jshint validthis:true */
    var input = this.val();
    if (input === '') {
      $('#' + uid.call(this)).hide();
      return;
    }

    var itemsList = $('<ul>');
    var suggestions = findSuggestions.call(this, input);
    suggestions.forEach(function(suggestion) {
      itemsList.append('<li><div class="autocomplete-item">' + suggestion + '</div></li>');
    });

    itemsList.find('.autocomplete-item').first().parent().addClass('active');
    $('#' + uid.call(this)).html(itemsList).show();
  }

  function findSuggestions(input) {
    var suggestions = [];
    /*jshint validthis:true */
    this.keywords.forEach(function(keyword) {
      if (keyword.toLowerCase().indexOf(input.toLowerCase()) !== -1) {
        suggestions.push(keyword);
      }
    });

    suggestions = suggestions.sort(function(a, b) {
      return a.indexOf(input) - b.indexOf(input);
    });

    return suggestions;
  }

  function uid() {
    /*jshint validthis:true */
    if (!this.autocompleteUid) {
      this.autocompleteUid = generateUid();
    }

    return this.autocompleteUid;
  }

  function generateUid() {
    var uid = 1;
    while ($('#autocomplete' + uid).length) {
      uid++;
    }

    return 'autocomplete' + uid;
  }

  return this;
};
