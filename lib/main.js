/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is not neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
define("simplePlugin", [], () => /******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/index.ts":
/*!**********************!*\
  !*** ./src/index.ts ***!
  \**********************/
/*! namespace exports */
/*! export PluginMode [provided] [no usage info] [missing usage info prevents renaming] */
/*! export PluginPosition [provided] [no usage info] [missing usage info prevents renaming] */
/*! export PluginType [provided] [no usage info] [missing usage info prevents renaming] */
/*! export PluginViewType [provided] [no usage info] [missing usage info prevents renaming] */
/*! export default [provided] [used in main] [usage prevents renaming] */
/*! other exports [not provided] [no usage info] */
/*! runtime requirements: __webpack_require__.r, __webpack_exports__, __webpack_require__.d, __webpack_require__.* */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"PluginMode\": () => /* binding */ PluginMode,\n/* harmony export */   \"PluginType\": () => /* binding */ PluginType,\n/* harmony export */   \"PluginViewType\": () => /* binding */ PluginViewType,\n/* harmony export */   \"PluginPosition\": () => /* binding */ PluginPosition,\n/* harmony export */   \"default\": () => /* binding */ pluginInit\n/* harmony export */ });\nvar PluginMode;\n(function (PluginMode) {\n    PluginMode[\"REMOTE\"] = \"remote\";\n    PluginMode[\"DYNAMIC\"] = \"dynamic\";\n})(PluginMode || (PluginMode = {}));\nvar PluginType;\n(function (PluginType) {\n    PluginType[\"view\"] = \"view\";\n    PluginType[\"server\"] = \"server\";\n})(PluginType || (PluginType = {}));\nvar PluginViewType;\n(function (PluginViewType) {\n    PluginViewType[\"iframe\"] = \"iframe\";\n    PluginViewType[\"panel\"] = \"panel\";\n    PluginViewType[\"none\"] = \"none\";\n})(PluginViewType || (PluginViewType = {}));\nvar PluginPosition;\n(function (PluginPosition) {\n    PluginPosition[\"left\"] = \"left\";\n    PluginPosition[\"center\"] = \"center\";\n    PluginPosition[\"right\"] = \"right\";\n    PluginPosition[\"none\"] = \"none\";\n})(PluginPosition || (PluginPosition = {}));\nfunction pluginInit() {\n    return {\n        pluginId: 'simplePlugin',\n        moduleName: 'simplePlugin',\n        version: '0.0.1',\n        type: PluginType.view,\n        viewType: PluginViewType.iframe,\n        position: PluginPosition.left,\n        mode: PluginMode.REMOTE,\n        content: 'http://127.0.0.1:8080/example/simplePlugin.html',\n        active: true,\n        description: {\n            title: 'plusimplePlugingin1',\n            description: 'simplePlugin des',\n        },\n    };\n}\n\n\n//# sourceURL=webpack://simplePlugin/./src/index.ts?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		if(__webpack_module_cache__[moduleId]) {
/******/ 			return __webpack_module_cache__[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => Object.prototype.hasOwnProperty.call(obj, prop)
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	// module exports must be returned from runtime so entry inlining is disabled
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__("./src/index.ts");
/******/ })()
.default);;