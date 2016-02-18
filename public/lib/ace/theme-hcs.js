ace.define('ace/theme/hcs', ['require', 'exports', 'module' , 'ace/lib/dom'], function(require, exports, module) {

exports.isDark = false;
exports.cssClass = "ace-language";
exports.cssText = ".ace-language{\
}\
.ace_token_Keyword.ace_keyword{\
	color: #708;\
}\
.ace_string{\
	color: blue;\
}\
.ace_variable.ace_def{\
	color: #71a;\
}\
.ace_entity-name-tag.ace_atom{\
	color: #05a;\
}\
.ace_entity-name-tag.ace_type{\
	color: #39238c;\
	font-style: italic;\
}\
.ace_entity-name-tag.ace_true{\
	color: #20800b;\
}\
.ace_entity-name-tag.ace_false{\
	color: #be361b;\
}\
.ace_url{\
	color: #0000FF;\
}\
.ace_variables{\
	color: #000000;\
}\
.ace_comment{\
	color: #236e24;\
}\
.ace_variable.ace_functions.ace_1{\
	color: #DF7401;\
}\
.ace-language .ace_gutter {\
background: rgba(250, 250, 250, 0.5);\
color: #BDBDBD;\
overflow : visible;\
border-right: 1px solid rgba(0,0,0,0.05);\
}\
.ace-language .ace_print-margin {\
width: 1px;\
background: #e8e8e8;\
}\
.ace-language {\
background-color: #FFFFFF;\
}\
.ace-language .ace_cursor {\
color: black;\
}\
.ace-language .ace_invisible {\
color: rgb(191, 191, 191);\
}\
.ace-language .ace_constant.ace_buildin {\
color: rgb(88, 72, 246);\
}\
.ace-language .ace_constant.ace_language {\
color: rgb(88, 92, 246);\
}\
.ace-language .ace_constant.ace_library {\
color: rgb(6, 150, 14);\
}\
.ace-language .ace_invalid {\
background-color: rgb(153, 0, 0);\
color: white;\
}\
.ace-language .ace_fold {\
}\
.ace-language .ace_support.ace_function {\
color: rgb(60, 76, 114);\
}\
.ace-language .ace_support.ace_constant {\
color: rgb(6, 150, 14);\
}\
.ace-language .ace_support.ace_type,\
.ace-language .ace_support.ace_class\
.ace-language .ace_support.ace_other {\
color: rgb(109, 121, 222);\
}\
.ace-language .ace_variable.ace_parameter {\
font-style:italic;\
color:#FD971F;\
}\
.ace-language .ace_constant.ace_numeric {\
color: rgb(0, 0, 205);\
}\
.ace-language .ace_xml-pe {\
color: rgb(104, 104, 91);\
}\
.ace-language .ace_entity.ace_name.ace_function {\
color: #0000A2;\
}\
.ace-language .ace_heading {\
color: rgb(12, 7, 255);\
}\
.ace-language .ace_list {\
color:rgb(185, 6, 144);\
}\
.ace-language .ace_marker-layer .ace_selection {\
background: rgba(45, 151, 221, 0.29);\
}\
.ace-language .ace_marker-layer .ace_step {\
background: rgb(252, 255, 0);\
}\
.ace-language .ace_marker-layer .ace_stack {\
background: rgb(164, 229, 101);\
}\
.ace-language .ace_marker-layer .ace_bracket {\
margin: -1px 0 0 -1px;\
border: 1px solid rgb(192, 192, 192);\
}\
.ace-language .ace_marker-layer .ace_active-line {\
background: rgba(133, 151, 170, 0.09);\
}\
.ace-language .ace_gutter-active-line {\
background-color: rgba(66, 66, 66, 0.06);\
border-right: 1px solid rgba(66, 128, 178, 0.19);\
right: -1px;\
}\
.ace-language .ace_marker-layer .ace_selected-word {\
background: rgba(66, 128, 178, 0.12);\
border-bottom: 1px solid rgba(66, 128, 178, 0.19);\
}\
.ace-language .ace_storage,\
.ace-language .ace_meta.ace_tag {\
color: rgb(147, 15, 128);\
}\
.ace-language .ace_entity.ace_other.ace_attribute-name {\
color: #994409;\
}\
";

var dom = require("../lib/dom");
dom.importCssString(exports.cssText, exports.cssClass);
});
