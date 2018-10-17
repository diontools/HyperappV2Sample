import { h, app, Action, Effect, EffectRunner, DispatchableType } from 'hyperapp/src/index.js';

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
    action: DispatchableType<any, any>;
    interval: number;
}

const tickEffect: EffectRunner<TickEffectProps> = (props, dispatch) => {
    const id = setInterval(() => dispatch(props.action), props.interval);
    return () => clearInterval(id);
};

const tick: Effect<TickEffectProps, TickEffectProps> = (props) => ({
    effect: tickEffect,
    ...props,
});


const mainState = {
    value: 0,
    value2: 0,
    tickEnabled: false,
    count: 0,
}

type MainStateType = typeof mainState;
type MainAction<P = {}> = Action<MainStateType, P>;

// Type check function
function act<S, P>(dispatchable: DispatchableType<S, P>): DispatchableType<S, P> {
    return dispatchable;
}

const IncrementBy: MainAction<{ num: number }> = (state, args) => ({ ...state, value: state.value + args.num });
const Reset: MainAction = state => ({ ...state, value: 0 });
const DelayIncrementBy: MainAction<{ num: number, delay: number }> = (state, args) => [
    state,
    delay({ interval: args.delay, action: act([IncrementBy, { num: args.num }]) }),
];

const SetTickEnabled: MainAction<{ enable: boolean }> = (state, args, event) =>
    ({ ...state, tickEnabled: args.enable });

const CountUp: MainAction = state => ({ ...state, count: state.count + 1 });

const InitAction: MainAction<MainStateType> = (_, props) => [
    { ...props },
    delay({ interval: 1000, action: act([IncrementBy, { num: 2 }]) })
];

app({
    // init: [
    //     mainState,
    //     delay({ interval: 1000, action: act([IncrementBy, { num: 2 }]) })
    // ],
    init: [InitAction, mainState],
    view: state => (
        <div>
            <button onClick={act([IncrementBy, { num: 5 }])}>increment</button>
            <button onClick={act(Reset)}>reset</button>
            <button onClick={act([DelayIncrementBy, { num: 10, delay: 500 }])}>delay increment</button>
            <p>value: {state.value}</p>
            <p>
                <input id="count" type="checkbox" checked={state.tickEnabled} onClick={act([SetTickEnabled, { enable: !state.tickEnabled }])}></input>
                <label for="count">count: {state.count}</label>
            </p>
        </div>
    ),
    container: document.body,
    subscriptions: state => {
        console.log('subs', state);
        return [
            state.tickEnabled && tick({ action: act(CountUp), interval: 100 })
        ];
    },
});

// init pattern (dispatch)
// {abc:"foo"}
// action("foo")
// [action, "foo"]
// () => [{abc: "foo"}, effect({action: [action, "foo"], ...})]
// [(props) => [...], "foo"]
