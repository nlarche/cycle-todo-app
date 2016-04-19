import Rx from 'rx';
import Cycle from '@cycle/core';
import CycleDOM from '@cycle/dom';

const {h, div, input, makeDOMDriver} = CycleDOM;

const Operations = {
    AddItem: newItem => state => ({
        items: state.items.concat(newItem)
    }),
    RemoveItem: itemToRemove => state => ({
        items: state.items.filter(item => item !== itemToRemove)
    })
};

// Actions
function intent(DOMSource) {
    return {
        addTodo$: DOMSource.select('input').events('change').
            map(evt => evt.target.value).
            filter(val => val.trim().length),
        removeTodo$: DOMSource.select('button').events('click').
            map(evt => evt.target.previousElementSibling.innerText.trim())
    };
}

// Model
function model(actions) {
    var addTodo$ = actions.addTodo$.
        map(item => Operations.AddItem(item));

    var removeTodo$ = actions.removeTodo$.
        map(item => Operations.RemoveItem(item));

    var allActions$ = Rx.Observable.merge(addTodo$, removeTodo$);

    var state$ = allActions$.
        scan((state, operation) => operation(state), { items: [] });

    return state$;
}

// View
function view(state$) {
    return state$
        .startWith({ items: [] })
        .map(state =>
            div('.container', [
                div('.input-div', [
                    input('.input', { type: 'text', placeholder: 'give me something to do...', value: '' }),
                ]),
                h('ul', [state.items.map(i =>
                    h('li', [
                        h('span', i),
                        h('button', 'delete')
                    ])
                )])
            ])
        )
}


function main(sources) {
    const actions = intent(sources.DOM);
    const state$ = model(actions);
    const vtree$ = view(state$);
    return {
        DOM: vtree$
    };
}

const drivers = {
    DOM: makeDOMDriver('#app')
};

Cycle.run(main, drivers);