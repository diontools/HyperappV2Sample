import { h, app, Action, Effect, EffectRunner } from 'hyperapp/src/index.js';

interface DelayEffectProps {
    action: any;
    interval: number;
}

// Effect Runner
const delayEffect: EffectRunner<DelayEffectProps> = (props, dispatch) =>
    setTimeout(() => dispatch(props.action), props.interval);

// Effect Constructor
const delay: Effect<DelayEffectProps, DelayEffectProps> = (props) => ({
    effect: delayEffect,
    ...props,
});


const mainState = {
    value: 0,
    value2: 0,
    count: 0,
}

type MainStateType = typeof mainState;
type MainAction<P = {}> = Action<MainStateType, P>;

// Type check function
function act<S>(action: Action<S, {}>): [Action<S, {}>];
function act<S, P>(action: Action<S, P>, props: P): [Action<S, P>, P];
function act(action: any, props?: any) {
    return props ? [action, props] : [action]
}

const IncrementBy: MainAction<{ num: number }> = (state, args) => ({ ...state, value: state.value + args.num });
const Reset: MainAction = state => ({ ...state, value: 0 });
const DelayIncrementBy: MainAction<{ num: number, delay: number }> = (state, args) => [
    state,
    delay({ interval: args.delay, action: act(IncrementBy, { num: args.num }) }),
];

const CountUp: MainAction = state => { console.log('CountUp'); return { ...state, count: state.count + 1 } };

app({
    init: [
        mainState,
        delay({ interval: 1000, action: act(IncrementBy, { num: 2 }) })
    ],
    view: state => (
        <div>
            <button onClick={act(IncrementBy, { num: 5 })}>increment</button>
            <button onClick={act(Reset)}>reset</button>
            <button onClick={act(DelayIncrementBy, { num: 10, delay: 500 })}>delay increment</button>
            <p>value: {state.value}</p>
            <p>count: {state.count}</p>
        </div>
    ),
    container: document.body,
    subscriptions: state => { console.log('subs'); return [delay({ action: CountUp, interval: 100 })] },
});