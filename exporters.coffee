callWithJQuery = (pivotModule) ->
    if typeof exports is "object" and typeof module is "object" # CommonJS
        pivotModule require("jquery")
    else if typeof define is "function" and define.amd # AMD
        define ["jquery"], pivotModule
    # Plain browser env
    else
        pivotModule jQuery

callWithJQuery ($) ->

    $.pivotUtilities.exporters = "CSV": (pivotData, opts) ->
        defaults = localeStrings: {}

        opts = $.extend(true, {}, defaults, opts)

        rowKeys = pivotData.getRowKeys()
        rowKeys.push [] if rowKeys.length == 0
        colKeys = pivotData.getColKeys()
        colKeys.push [] if colKeys.length == 0
        rowAttrs = pivotData.rowAttrs
        colAttrs = pivotData.colAttrs

        result = []

        row = []
        for rowAttr in rowAttrs
            row.push rowAttr
        if colKeys.length == 1 and colKeys[0].length == 0
            row.push pivotData.aggregatorName
        else
            for colKey in colKeys
                row.push colKey.join("-")

        result.push row

        for rowKey in rowKeys
            row = []
            for r in rowKey
                row.push r

            for colKey in colKeys
                agg = pivotData.getAggregator(rowKey, colKey)
                if agg.value()?
                    row.push agg.value()
                else
                    row.push ""
            result.push row
        csv = "data:text/csv;charset=utf-8,"
        for r in result
            csv += r.join(',') + "\n";

        encodedUri = encodeURI(csv)

        link = document.createElement("a")
        link.setAttribute("href", encodedUri)
        link.setAttribute("download", "pivottable.csv")
        document.body.appendChild(link)

        link.click()
        link.remove()

