"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
var plugin_1 = require("../../src/plugin-host/plugin/plugin");
var Plugin = /** @class */ (function (_super) {
    __extends(Plugin, _super);
    function Plugin() {
        var _this = _super.call(this, "Spongemock", "1.0.0", {}) || this;
        _this.registerCommand("spongemock", function (_params) {
            var spaces = 0;
            return ["" + _params.join(' ').split("").map(function (value, idx) { return ((idx + ((value === ' ') ? spaces++ : spaces)) % 2) ? value.toLowerCase() : value.toUpperCase(); }).join("")];
        });
        return _this;
    }
    return Plugin;
}(plugin_1.AbstractPlugin));
exports.Plugin = Plugin;
