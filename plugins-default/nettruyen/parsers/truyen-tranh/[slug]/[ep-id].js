"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SERVERS = void 0;
/* eslint-disable camelcase */
var raiku_pgs_1 = require("raiku-pgs");
var parseComment_1 = require("../../__helpers__/parseComment");
function epId(html, now) {
    var _a, _b, _c, _d, _e, _f, _g, _h;
    var $ = (0, raiku_pgs_1.parseDom)(html);
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    var image = $("#ctl00_Head1 > meta:nth-child(12)").attr("content");
    var name = $("h1").text().split("-").slice(0, -1).join("-").trim();
    var path_manga = (0, raiku_pgs_1.parseAnchor)($("#ctl00_divCenter > div > div:nth-child(1) > div.top > h1 > a")).path;
    var manga_id = parseInt((_b = (_a = html.match(/gOpts\.comicId=(\d+)/)) === null || _a === void 0 ? void 0 : _a[1]) !== null && _b !== void 0 ? _b : "") + "";
    var ep_id = parseInt((_d = (_c = html.match(/gOpts\.chapterId=(\d+)/)) === null || _c === void 0 ? void 0 : _c[1]) !== null && _d !== void 0 ? _d : "") + "";
    var cdn = (_e = html.match(/gOpts\.cdn="([^"]+)"/)) === null || _e === void 0 ? void 0 : _e[1];
    var cdn2 = (_f = html.match(/gOpts\.cdn2="([^"]+)"/)) === null || _f === void 0 ? void 0 : _f[1];
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    var key = html.match(/gOpts\.key=('|")([^"']+)\1/)[2];
    var updated_at = (0, raiku_pgs_1.parseTimeAgo)($("#ctl00_divCenter > div > div:nth-child(1) > div.top > i")
        .text()
        .trim()
        .slice(16, -1), now);
    var pages = $(".reading-detail img")
        .toArray()
        .map(function (item) {
        var $item = $(item);
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        var src = $item.attr("src");
        var original = $item.attr("data-original");
        var cdn = $item.attr("data-cdn");
        return {
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            src: src.includes("/logos/logo-nettruyen.png") ? original : src,
            original: original,
            cdn: cdn,
        };
    });
    var comments = $("#nt_comments .comment-list .item")
        .toArray()
        .map(function (item) { return (0, parseComment_1.parseComment)($, $(item), now); });
    var comments_count = parseInt($(".comment-count").text());
    var comments_pages = parseInt((_h = (_g = $("#ctl00_mainContent_divPager > ul > li:nth-child(14) > a")
        .last()
        .attr("href")) === null || _g === void 0 ? void 0 : _g.slice(1)) !== null && _h !== void 0 ? _h : "1") || 1;
    return {
        name: name,
        image: image,
        manga_id: manga_id,
        // key,
        path_manga: path_manga,
        ep_id: ep_id,
        updated_at: updated_at,
        pages: pages,
        cdn: cdn,
        cdn2: cdn2,
        comments: comments,
        comments_count: comments_count,
        comments_pages: comments_pages,
    };
}
exports.default = epId;
var headersNettruyen = {
    referer: "https://www.nettruyenmax.com",
};
exports.SERVERS = [
    {
        name: "Server 1",
        has: function () { return true; },
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        parse: function (item) { return withProxyImage(item.src, headersNettruyen); },
    },
    {
        name: "Server 2",
        has: function (item) { return item.original !== null && item.original !== item.src; },
        parse: function (item) {
            var _a;
            if (((_a = item.original) === null || _a === void 0 ? void 0 : _a.indexOf("focus-opensocial.googleusercontent")) !== -1) {
                return withProxyImage(
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                decodeURIComponent(item.original.split("&url", 2)[1]), headersNettruyen);
            }
            return withProxyImage("https://images2-focus-opensocial.googleusercontent.com/gadgets/proxy?container=focus&gadget=a&no_expand=1&resize_h=0&rewriteMime=image%2F*&url=".concat(encodeURIComponent(item.original)), headersNettruyen);
        },
    },
    {
        name: "Server 3",
        has: function (item) { return item.cdn !== null; },
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        parse: function (item) { return withProxyImage(item.cdn, headersNettruyen); },
    },
    {
        name: "Server 4",
        has: function (item, _a) {
            var cdn = _a.cdn, cdn2 = _a.cdn2;
            return item.cdn !== null && !!cdn && !!cdn2;
        },
        parse: function (item, _a) {
            var cdn = _a.cdn, cdn2 = _a.cdn2;
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            return withProxyImage(item.cdn.replace(cdn, cdn2), headersNettruyen);
        },
    },
];
