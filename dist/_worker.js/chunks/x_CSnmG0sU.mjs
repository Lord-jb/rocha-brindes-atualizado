globalThis.process ??= {}; globalThis.process.env ??= {};
import { f as splitProps, g as ssrElement, m as mergeProps, e as escape, a as createComponent, D as Dynamic, F as For } from './_@astro-renderers_C0wH7-Ml.mjs';

/**
* @license lucide-solid v0.456.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
var defaultAttributes = {
  xmlns: "http://www.w3.org/2000/svg",
  width: 24,
  height: 24,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  "stroke-width": 2,
  "stroke-linecap": "round",
  "stroke-linejoin": "round"
};
var defaultAttributes_default = defaultAttributes;

var toKebabCase = (string) => string.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();
var mergeClasses = (...classes) => classes.filter((className, index, array) => {
  return Boolean(className) && className.trim() !== "" && array.indexOf(className) === index;
}).join(" ").trim();
var Icon = (props) => {
  const [localProps, rest] = splitProps(props, ["color", "size", "strokeWidth", "children", "class", "name", "iconNode", "absoluteStrokeWidth"]);
  return ssrElement("svg", mergeProps(defaultAttributes_default, {
    get width() {
      return localProps.size ?? defaultAttributes_default.width;
    },
    get height() {
      return localProps.size ?? defaultAttributes_default.height;
    },
    get stroke() {
      return localProps.color ?? defaultAttributes_default.stroke;
    },
    get ["stroke-width"]() {
      return localProps.absoluteStrokeWidth ? Number(localProps.strokeWidth ?? defaultAttributes_default["stroke-width"]) * 24 / Number(localProps.size) : Number(localProps.strokeWidth ?? defaultAttributes_default["stroke-width"]);
    },
    get ["class"]() {
      return mergeClasses("lucide", "lucide-icon", localProps.name != null ? `lucide-${toKebabCase(localProps?.name)}` : void 0, localProps.class != null ? localProps.class : "");
    }
  }, rest), () => escape(createComponent(For, {
    get each() {
      return localProps.iconNode;
    },
    children: ([elementName, attrs]) => {
      return createComponent(Dynamic, mergeProps({
        component: elementName
      }, attrs));
    }
  })));
};
var Icon_default = Icon;

var iconNode$2 = [["line", {
  x1: "4",
  x2: "20",
  y1: "12",
  y2: "12",
  key: "1e0a9i"
}], ["line", {
  x1: "4",
  x2: "20",
  y1: "6",
  y2: "6",
  key: "1owob3"
}], ["line", {
  x1: "4",
  x2: "20",
  y1: "18",
  y2: "18",
  key: "yk5zj1"
}]];
var Menu = (props) => createComponent(Icon_default, mergeProps(props, {
  name: "Menu",
  iconNode: iconNode$2
}));
var menu_default = Menu;

var iconNode$1 = [["circle", {
  cx: "8",
  cy: "21",
  r: "1",
  key: "jimo8o"
}], ["circle", {
  cx: "19",
  cy: "21",
  r: "1",
  key: "13723u"
}], ["path", {
  d: "M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12",
  key: "9zh506"
}]];
var ShoppingCart = (props) => createComponent(Icon_default, mergeProps(props, {
  name: "ShoppingCart",
  iconNode: iconNode$1
}));
var shopping_cart_default = ShoppingCart;

var iconNode = [["path", {
  d: "M18 6 6 18",
  key: "1bl5f8"
}], ["path", {
  d: "m6 6 12 12",
  key: "d8bk6v"
}]];
var X = (props) => createComponent(Icon_default, mergeProps(props, {
  name: "X",
  iconNode
}));
var x_default = X;

export { Icon_default as I, menu_default as m, shopping_cart_default as s, x_default as x };
