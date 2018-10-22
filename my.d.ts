import { VNode } from "hyperapp";

declare global {
    namespace JSX {
        interface Element extends VNode<any> { }
        interface IntrinsicElements {
            [elemName: string]: any
        }
    }
}