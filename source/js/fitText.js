(function ($) {
    $.fn.textfill = function (options) {

        options = jQuery.extend({
            maxFontSize: null,
            minFontSize: 8,
            step: 1
        }, options);

        return this.each(function () {

            var innerElements = $(this).children(':visible'),
                fontSize = options.maxFontSize || innerElements.css("font-size"), 
                maxHeight = $(this).height(),
                maxWidth = $(this).width(),
                innerHeight,
                innerWidth;

            do {

                innerElements.css('font-size', fontSize);

                // use the combined height of all children, eg. multiple <p> elements.
                innerHeight = $.map(innerElements, function (e) {
                    return $(e).outerHeight();
                }).reduce(function (p, c) {
                    return p + c;
                }, 0);

                innerWidth = innerElements.outerWidth(); // assumes that all inner elements have the same width
                fontSize = fontSize - options.step;

            } while ((innerHeight > maxHeight || innerWidth > maxWidth) && fontSize > options.minFontSize);

        });

    };

})(jQuery);