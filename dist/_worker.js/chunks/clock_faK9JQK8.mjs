globalThis.process ??= {}; globalThis.process.env ??= {};
import { I as Icon_default } from './x_CSnmG0sU.mjs';
import { a as createComponent, m as mergeProps } from './_@astro-renderers_C0wH7-Ml.mjs';

var iconNode = [["circle", {
  cx: "12",
  cy: "12",
  r: "10",
  key: "1mglay"
}], ["polyline", {
  points: "12 6 12 12 16 14",
  key: "68esgv"
}]];
var Clock = (props) => createComponent(Icon_default, mergeProps(props, {
  name: "Clock",
  iconNode
}));
var clock_default = Clock;

export { clock_default as c };
