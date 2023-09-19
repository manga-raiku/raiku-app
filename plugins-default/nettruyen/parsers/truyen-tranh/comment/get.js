"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var raiku_pgs_1 = require("raiku-pgs");
var parseComment_1 = require("../../__helpers__/parseComment");
function default_1(html, now) {
    var $ = (0, raiku_pgs_1.parseDom)(html);
    return $(".item")
        .toArray()
        .map(function (item) { return (0, parseComment_1.parseComment)($, $(item), now); });
}
exports.default = default_1;
