import { useCallback, useState, useEffect, useRef } from 'react';

const useStateCallback = (initialState) => {
    const [state, setState] = useState(initialState);
    const cbRef = useRef(null); // init mutable ref container for callbacks

    const setStateCallback = useCallback((state, cb) => {
        cbRef.current = cb; // store current, passed callback in ref
        setState(state);
    }, []); // keep object reference stable, exactly like `useState`

    useEffect(() => {
        // cb.current is `null` on initial render, 
        // so we only invoke callback on state *updates*
        if (cbRef.current) {
            cbRef.current(state);
            cbRef.current = null; // reset callback after execution
        }
    }, [state]);

    return [state, setStateCallback];
}

const useStateCallbackAfter500 = (initialState) => {
    const [state, setState] = useState(initialState);
    const cbRef = useRef(null); // init mutable ref container for callbacks

    const setStateCallback = useCallback((state, cb) => {
        cbRef.current = cb; // store current, passed callback in ref
        setState(state);
    }, []); // keep object reference stable, exactly like `useState`

    useEffect(() => {
        // cb.current is `null` on initial render, 
        // so we only invoke callback on state *updates* after 500ms
        if (cbRef.current) {
            setTimeout(() => {
                cbRef.current(state);
                cbRef.current = null; // reset callback after execution
            }, 500)
        }
    }, [state]);

    return [state, setStateCallback];
}

export { useStateCallback, useStateCallbackAfter500 }