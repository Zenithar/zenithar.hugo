!function(t){"use strict";function e(t){var e,i,s=[];if("number"==typeof t)s.push(t);else{i=t.split(",");for(var n=0;n<i.length;n++)if(e=i[n].split("-"),2===e.length)for(var a=parseInt(e[0],10);a<=e[1];a++)s.push(a);else 1===e.length&&s.push(parseInt(e[0],10))}return s}var i={};t.fn.gist=function(s){return this.each(function(){function n(i){var s,n,a,l,o;i&&i.div?(i.stylesheet&&(0===i.stylesheet.indexOf("<link")?i.stylesheet=i.stylesheet.replace(/\\/g,"").match(/href=\"([^\s]*)\"/)[1]:0!==i.stylesheet.indexOf("http")&&(0!==i.stylesheet.indexOf("/")&&(i.stylesheet="/"+i.stylesheet),i.stylesheet="https://gist.github.com"+i.stylesheet)),i.stylesheet&&0===t('link[href="'+i.stylesheet+'"]').length&&(s=document.createElement("link"),n=document.getElementsByTagName("head")[0],s.type="text/css",s.rel="stylesheet",s.href=i.stylesheet,n.insertBefore(s,n.firstChild)),o=t(i.div),o.removeAttr("id"),b.html("").append(o),c&&(l=e(c),o.find("td.line-data").css({width:"100%"}),o.find(".js-file-line").each(function(e){-1!==t.inArray(e+1,l)&&t(this).css({"background-color":"rgb(255, 255, 204)"})})),h&&(a=e(h),o.find(".js-file-line").each(function(e){-1===t.inArray(e+1,a)&&t(this).parent().remove()})),g&&(o.find(".gist-meta").remove(),o.find(".gist-data").css("border-bottom","0px"),o.find(".gist-file").css("border-bottom","1px solid #ddd")),u&&o.find(".js-line-number").remove()):b.html("Failed loading gist "+r)}function a(t){b.html("Failed loading gist "+r+": "+t)}function l(){"function"==typeof s&&s()}var o,r,d,h,f,c,g,u,m,p,y,b=t(this),v={};return b.css("display","block"),o=b.data("gist-id")||"",d=b.data("gist-file"),g=b.data("gist-hide-footer")===!0,u=b.data("gist-hide-line-numbers")===!0,h=b.data("gist-line"),c=b.data("gist-highlight-line"),p=b.data("gist-show-spinner")===!0,m=p?!1:void 0!==b.data("gist-show-loading")?b.data("gist-show-loading"):!0,d&&(v.file=d),o?(r="https://gist.github.com/"+o+".json",y=b.data("gist-enable-cache")===!0||i[r],f="Loading gist "+r+(v.file?", file: "+v.file:"")+"...",m&&b.html(f),p&&b.html('<img style="display:block;margin-left:auto;margin-right:auto"  alt="'+f+'" src="https://assets-cdn.github.com/images/spinners/octocat-spinner-32.gif">'),void t.ajax({url:r,data:v,dataType:"jsonp",timeout:2e4,beforeSend:function(){if(y){if(i[r])return i[r].then(function(t){n(t),l()},function(t){a(t)}),!1;i[r]=t.Deferred()}},success:function(t){y&&i[r]&&i[r].resolve(t),n(t)},error:function(t,e){a(e)},complete:function(){l()}})):!1})},t(function(){t("[data-gist-id]").gist()})}(jQuery);

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
