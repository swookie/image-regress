/**
 * image-regress
 * https://github.com/swookie/image-regress
 * MIT License
 * a work in progress
 */
(function (window, document) {
  'use strict';

  var imageRegressTimer;

  // @todo take in parameter to target image sets, so we don't recalculate for every set on the page when one set fails
  var imageRegress = function (options) {
    var imageSets = $('.imageRegress');
    var windowWidth = $(window).width();
    var options = options || {
      loadLargerSizesBeforeFallback: false // not currently used, needs more testing
    };

    imageSets.each(function () {
      var sourceSet = $(this).children('span');
      var targetImg = $(this).children('img');
      var targetSrc = targetImg.attr('src');
      var fallbackSrc = targetImg.attr('data-fallbackSrc');
      var didProcess = false;
      sourceSet.each(function () {
        var currEl = $(this);
        var currSrc = currEl.attr('data-src');
        var currTried = currEl.data('tried');
        var currFail = currEl.data('fail');
        var currMinWidth = currEl.data('minwidth');
        if (currFail === true) {
          return true; // skip to the next source
        }
        if (windowWidth >= currMinWidth) {
          didProcess = true;
          if (currSrc === targetSrc) {
            return false; // don't need to do anything, we're already on a working source
          }

          currEl.attr('data-tried', true);
          targetImg.on('error', function () {
            currEl.attr('data-fail', true);
            // $(this).off('error');
            imageRegress(); // @todo target just this image set, and don't recalculate for every image set on the page
          });
          targetImg.on('load', function () {
            $(this).addClass('imageRegressLoaded');
            $(this).off('error');
            $(this).off('load');
          });
          targetImg.attr('src', currSrc);
          return false;
        }
      });
      if (!didProcess) {
        targetImg.attr('src', fallbackSrc);
      }
    });
  };

  $(window).on('resize', function () {
    clearTimeout(imageRegressTimer);
    imageRegressTimer = setTimeout(imageRegress, 500);
  });

  // export imageRegress to window
  window.imageRegress = imageRegress;

  // run on dom ready, may still need to run after view is rendered for MVC frameworks
  $(document).ready(imageRegress);
})(window, document);
