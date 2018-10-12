import { VNode } from "hyperapp/src/index.js";

declare global {
    namespace JSX {
        interface Element extends VNode<any> { }
        interface IntrinsicElements {
            [elemName: string]: any
        }
    }
}