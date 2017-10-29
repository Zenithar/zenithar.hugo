window.WebFontConfig = {
  google: { families: [ 'Raleway' ] }
};

jQuery(function($) {

  $(document).on('click', function() { $('.collapse').collapse('hide'); })

  $(document).ready( function() {
    // Async CSS loader for making PageSpeed happy !
    var stylesheet = document.createElement('link');
    stylesheet.href = '/css/main.css';
    stylesheet.rel = 'stylesheet';
    stylesheet.type = 'text/css';
    // temporarily set media to something inapplicable to ensure it'll fetch without blocking render
    stylesheet.media = 'bogus';
    // set the media back when the stylesheet loads
    stylesheet.onload = function() {stylesheet.media = 'all'}
    document.getElementsByTagName('head')[0].appendChild(stylesheet);

    // Font loader
    var wf = document.createElement('script');
    wf.src = ('https:' == document.location.protocol ? 'https' : 'http') + '://ajax.googleapis.com/ajax/libs/webfont/1.5.18/webfont.js';
    wf.type = 'text/javascript';
    wf.async = 'true';
    var s = document.getElementsByTagName('script')[0];
    s.parentNode.insertBefore(wf, s);
  });

});
