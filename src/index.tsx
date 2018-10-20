import { h, app, Action, Effect, EffectRunner, DispatchableType, SubscriptionEffectRunner, SubscriptionEffect } from 'hyperapp/src/index.js';

interface DelayEffectProps {
    action: any;
    interval: number;
}

// delay Effect Runner
const delayEffect: EffectRunner<DelayEffectProps> = (props, dispatch) =>
    setTimeout(() => dispatch(props.action), props.interval);

// delay Effect Constructor
const delay: Effect<DelayEffectProps, DelayEffectProps> = (props) => ({
    effect: delayEffect,
    ...props,
});


interface TickEffectProps {
    action: DispatchableType<any, any, any>;
    interval: number;
}

const tickEffect: SubscriptionEffectRunner<TickEffectProps> = (props, dispatch) => {
    const id = setInterval(() => dispatch(props.action, { time: Date.now() }), props.interval);
    return () => clearInterval(id);
};

const tick: SubscriptionEffect<TickEffectProps, TickEffectProps> = (props) => ({
    effect: tickEffect,
    ...props,
});


const mainState = {
    value: 0,
    value2: 0,
    tickEnabled: false,
    count: 0,
    countTime: '',
}

type MainStateType = typeof mainState;
type MainAction<P = {}, D = {}> = Action<MainStateType, P, D>;

// Type check function
function act<S, P, D>(dispatchable: DispatchableType<S, P, D>): DispatchableType<S, P, D> {
    return dispatchable;
}

const IncrementBy: MainAction<{ num: number }> = (state, args) => ({ ...state, value: state.value + args.num });
const Reset: MainAction = state => ({ ...state, value: 0 });
const DelayIncrementBy: MainAction<{ num: number, delay: number }> = (state, args) => [
    state,
    delay({ interval: args.delay, action: act([IncrementBy, { num: args.num }]) }),
];

const SetTickEnabled: MainAction<{ enable: boolean }, Event> = (state, args, event) =>
    ({ ...state, tickEnabled: args.enable });

const CountUp: MainAction<{ time: number }> = (state, args, ev) => { console.log(args, ev); return({ ...state, count: state.count + 1 })};

app({
    init: [
        mainState,
        delay({ interval: 1000, action: act([IncrementBy, { num: 2 }]) })
    ],
    view: state => (
        <div>
            <button onClick={act([IncrementBy, { num: 5 }])}>increment</button>
            <button onClick={act(Reset)}>reset</button>
            <button onClick={act([DelayIncrementBy, { num: 10, delay: 500 }])}>delay increment</button>
            <p>value: {state.value}</p>
            <p>
                <input id="count" type="checkbox" checked={state.tickEnabled} onClick={act([SetTickEnabled, { enable: !state.tickEnabled }])}></input>
                <label for="count">tick: {state.count}</label> {state.countTime}
            </p>
        </div>
    ),
    subscriptions: state => {
        return [
            state.tickEnabled && tick({ action: act([CountUp]), interval: 100 }),
        ];
    },
    container: document.body,
});

// init pattern (dispatch)
// {abc:"foo"}
// action("foo")
// [action, "foo"]
// () => [{abc: "foo"}, effect({action: [action, "foo"], ...})]
// [(props) => [...], "foo"]
