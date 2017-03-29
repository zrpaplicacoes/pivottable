(function() {
  var callWithJQuery;

  callWithJQuery = function(pivotModule) {
    if (typeof exports === "object" && typeof module === "object") {
      return pivotModule(require("jquery"));
    } else if (typeof define === "function" && define.amd) {
      return define(["jquery"], pivotModule);
    } else {
      return pivotModule(jQuery);
    }
  };

  callWithJQuery(function($) {
    return $.pivotUtilities.exporters = {
      "CSV": function(pivotData, opts) {
        var agg, colAttrs, colKey, colKeys, csv, defaults, encodedUri, i, j, k, l, len, len1, len2, len3, len4, len5, link, m, n, r, result, row, rowAttr, rowAttrs, rowKey, rowKeys;
        defaults = {
          localeStrings: {}
        };
        opts = $.extend(true, {}, defaults, opts);
        rowKeys = pivotData.getRowKeys();
        if (rowKeys.length === 0) {
          rowKeys.push([]);
        }
        colKeys = pivotData.getColKeys();
        if (colKeys.length === 0) {
          colKeys.push([]);
        }
        rowAttrs = pivotData.rowAttrs;
        colAttrs = pivotData.colAttrs;
        result = [];
        row = [];
        for (i = 0, len = rowAttrs.length; i < len; i++) {
          rowAttr = rowAttrs[i];
          row.push(rowAttr);
        }
        if (colKeys.length === 1 && colKeys[0].length === 0) {
          row.push(pivotData.aggregatorName);
        } else {
          for (j = 0, len1 = colKeys.length; j < len1; j++) {
            colKey = colKeys[j];
            row.push(colKey.join("-"));
          }
        }
        result.push(row);
        for (k = 0, len2 = rowKeys.length; k < len2; k++) {
          rowKey = rowKeys[k];
          row = [];
          for (l = 0, len3 = rowKey.length; l < len3; l++) {
            r = rowKey[l];
            row.push(r);
          }
          for (m = 0, len4 = colKeys.length; m < len4; m++) {
            colKey = colKeys[m];
            agg = pivotData.getAggregator(rowKey, colKey);
            if (agg.value() != null) {
              row.push(agg.value());
            } else {
              row.push("");
            }
          }
          result.push(row);
        }
        csv = "data:text/csv;charset=utf-8,";
        for (n = 0, len5 = result.length; n < len5; n++) {
          r = result[n];
          csv += r.join(';') + "\n";
        }
        encodedUri = encodeURI(csv);
        link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "pivottable.csv");
        document.body.appendChild(link);
        link.click();
        return link.remove();
      }
    };
  });

}).call(this);

//# sourceMappingURL=exporters.js.map
