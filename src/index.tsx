import { h, app } from 'hyperapp/src/index.js';
type Actions<S, P = {}> = (state: S, props: P, ev: Event) => S;

const mainState = {
    value: 0,
}

type MainStateType = typeof mainState;
type MainActions<P = {}> = Actions<MainStateType, P>;

const IncrementBy: MainActions<{ num: number }> = (state, args) => ({ ...state, value: state.value + args.num });
const Reset: MainActions = state => ({ value: 0 });

function act<S, P>(tuple: [Actions<S, P>, P]) {
    return tuple;
}

app({
    init: mainState,
    view: state => (
        <div>
            <button onClick={act([IncrementBy, { num: 5 }])}>increment</button>
            <button onClick={Reset}>reset</button>
            count: {state.value}
        </div>
    ),
    container: document.body,
});