import { h, app, DispatchType } from 'hyperapp/src/index.js';
type Action<S, P = {}> = (state: S, props: P, ev: Event) => S | [S, JSX.Element | object];
type EffectRunner<P> = (props: P, dispatch: DispatchType) => void;
type Effect<P> = (props: P) => {
    [X in keyof P]: P[X];
} & {
    effect: EffectRunner<P>
};


interface DelayEffectProps {
    action: any;
    interval: number;
}

// Effect Runner
const delayEffect: EffectRunner<DelayEffectProps> = (props, dispatch) =>
    setTimeout(() => dispatch(props.action), props.interval);

// Effect Constructor
const delay: Effect<DelayEffectProps> = (props) => ({
    effect: delayEffect,
    ...props,
});


const mainState = {
    value: 0,
    value2: 0,
}

type MainStateType = typeof mainState;
type MainAction<P = {}> = Action<MainStateType, P>;

// Type check function
function act(state: MainStateType): any;
function act<S, P>(action: Action<S, P>, props: P): any;
function act(...args: any[]) {
    return args.length == 1 ? args[0] : args;
}

const IncrementBy: MainAction<{ num: number }> = (state, args) => ({ ...state, value: state.value + args.num });
const Reset: MainAction = state => ({ ...state, value: 0 });
const DelayIncrementBy: MainAction<{ num: number, delay: number }> = (state, args) => [
    state,
    delay({ interval: args.delay, action: act(IncrementBy, { num: args.num }) }),
];


app({
    init: mainState,
    view: state => (
        <div>
            <button onClick={act(IncrementBy, { num: 5 })}>increment</button>
            <button onClick={Reset}>reset</button>
            <button onClick={act({ ...state, value: 0 })}>reset2</button>
            <button onClick={act(DelayIncrementBy, { num: 10, delay: 500 })}>delay increment</button>
            count: {state.value}
        </div>
    ),
    container: document.body,
});