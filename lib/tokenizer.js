/*!
 * lunr.tokenizer
 * Copyright (C) @YEAR Oliver Nightingale
 */

/**
 * A function for splitting a string into tokens ready to be inserted into
 * the search index.
 *
 * @module
 * @param {String} obj The string to convert into tokens
 * @returns {Array}
 */
lunr.tokenizer = function (obj) {
  if (!arguments.length || obj == null || obj == undefined) return []
  if (Array.isArray(obj)) return obj.map(function (t) { return t.toLowerCase() })

  var txt = obj.toString();
  var escapeTxt;
  var i = txt.length;
  var isJapanese = false;
  while (i--) {
    escapeTxt = escape(txt.substring(i, i+1));
    if (escapeTxt.length >= 6) {
      isJapanese = true;
      break;
    }
  }

  if (isJapanese) {
    var reSpaceOnly = /^[　 ]+$/;
    var rePunctuationOnly = /^[-–—―.。・（）()［］\[\]｛｝{}【】⟨⟩、､,，،…‥〽「」『』〜~！!：:？?\"'|_＿“”‘’;/⁄／«»]+$/;
    var segmenter = new TinySegmenter();

    return segmenter
      .segment(txt)
      .filter(function(s) {
        return !reSpaceOnly.test(s) && !rePunctuationOnly.test(s)
      })
  } else {
    return obj.toString().trim().toLowerCase().split(/[\s\-]+/)
  }
}

