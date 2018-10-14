declare module "hyperapp/src/index.js" {
  export type Children = VNode | string | number | null

  export enum VNodeType {
    DEFAULT = 0,
    RECYCLED_NODE,
    TEXT_NODE,
  }

  export interface VNode<Props = {}> {
    name: string,
    props: Props,
    children: Array<VNode>
    element: Element,
    key: string,
    type: VNodeType
  }

  /**
   * Create a new virtual DOM node. A virtual DOM is a description of what a DOM should look like using a tree of virtual nodes.
   * @param name The name of an Element or a function that returns a virtual DOM node.
   * @param props HTML props, SVG props, DOM events, Lifecycle Events, and Keys.
   * @param children The element's child nodes.
   */
  export function h<Props>(
    name: string,
    props?: Props | null,
    ...children: Array<Children | Children[]>
  ): VNode<Props>

  export type Action<S, P = {}> = (state: S, props: P, ev: Event) => S | [S, JSX.Element | object];
  export type EffectRunner<P> = (props: P, dispatch: DispatchType) => void;
  export type Effect<Props, RunnerProps> = (props: Props) => {
    [X in keyof RunnerProps]: RunnerProps[X];
  } & {
    effect: EffectRunner<RunnerProps>
  };

  export type DispatchType = (obj: Function, data?: any) => void;

  export function app<State>(
    props: {
      init: State | [State, any],
      view: (state: State) => VNode,
      container: Element
    }
  ): {
      dispatch: DispatchType
    }
}
