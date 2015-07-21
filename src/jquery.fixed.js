/**
 * jQuery fixed plugin
 * Author: bashkos
 *
 * License: MIT
 *
 * https://github.com/bashkos/jquery.fixed
 *
 * Version: 1.0.0
 */

(function ($) {
    'use strict';

    var $window = $(window),
        itemSet = [],

        createShadow = function ($el) {
            var $shadow = $('<div/>'),
                style = ['marginTop', 'marginRight', 'marginBottom', 'marginLeft', 'paddingTop', 'paddingRight',
                         'paddingBottom', 'paddingLEft', 'clear', 'float', 'position', 'left', 'right', 'top', 'bottom',
                         'vertical-align', 'width', 'height', 'box-sizing', 'overflow', 'line-height'];

            $(style).each(function (index, element) {
                $shadow.css(element, $el.css(element));
            });

            $shadow.hide();

            $el.before($shadow);

            return $shadow;
        },

        getTop = function (item) {
            var $el;

            if (item.fixed) {
                $el = item.$shadow;
            } else {
                $el = item.$el;
            }

            return $el.offset().top -
                   (item.settings.indent > 0 ? item.settings.indent : parseInt($el.css('marginTop'), 10));
        },

        updateItem = function (item, fixed) {
            if (fixed) {
                item.$shadow.css('display', item.$el.css('display'));
                item.$el
                    .css('position', 'fixed')
                    .addClass(item.settings.fixedClass);
                item.fixed = true;
            } else {
                item.$shadow.hide();
                item.$el
                    .css('position', item.defaultPosition)
                    .removeClass(item.settings.fixedClass);
                item.fixed = false;
            }
        },

        update = function () {
            var scrollTop = $window.scrollTop();

            $(itemSet).each(function (index, item) {
                var itemTop = getTop(item);

                if (item.fixed && itemTop > scrollTop) {
                    updateItem(item, false);
                } else if (!item.fixed && itemTop < scrollTop) {
                    updateItem(item, true);
                }
            });
        };


    $.fn.fixed = function (options) {
        if (this.length) {
            this.each(function () {
                var $el = $(this),
                    index = $el.data('fixedIndex');

                if (typeof index === 'undefined') {
                    index = itemSet.length;
                    itemSet[index] = {
                        $el: $el,
                        $shadow: createShadow($el),
                        fixed: false,
                        defaultPosition: $el.css('position'),
                        settings: {
                            fixedClass: '__fixed',
                            indent: 0
                        }
                    };

                    $el.data('fixedIndex', index);
                }

                itemSet[index].settings = $.extend(itemSet[index].settings, options);
            });

            update();
            $window.on('scroll', update);
        }

        return this;
    };
})(jQuery);
