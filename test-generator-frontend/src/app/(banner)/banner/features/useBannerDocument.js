"use client";

import { useCallback, useReducer } from "react";

function reducer(state, action) {
  switch (action.type) {
    case "commit": {
      const next = action.doc ?? state.live;
      return {
        committed: next,
        live: next,
        past: [...state.past, state.committed].slice(-50),
        future: [],
      };
    }
    case "preview":
      return { ...state, live: action.doc };
    case "undo": {
      if (!state.past.length) return state;
      const prev = state.past[state.past.length - 1];
      return {
        committed: prev,
        live: prev,
        past: state.past.slice(0, -1),
        future: [state.committed, ...state.future],
      };
    }
    case "redo": {
      if (!state.future.length) return state;
      const [next, ...rest] = state.future;
      return {
        committed: next,
        live: next,
        past: [...state.past, state.committed],
        future: rest,
      };
    }
    case "load":
      return {
        committed: action.doc,
        live: action.doc,
        past: [],
        future: [],
      };
    default:
      return state;
  }
}

export function useBannerDocument(initialDoc) {
  const [state, dispatch] = useReducer(reducer, {
    committed: initialDoc,
    live: initialDoc,
    past: [],
    future: [],
  });

  const commit = useCallback((doc) => {
    dispatch({ type: "commit", doc });
  }, []);

  const preview = useCallback((doc) => {
    dispatch({ type: "preview", doc });
  }, []);

  const undo = useCallback(() => dispatch({ type: "undo" }), []);
  const redo = useCallback(() => dispatch({ type: "redo" }), []);
  const load = useCallback((doc) => {
    dispatch({ type: "load", doc });
  }, []);

  return {
    doc: state.live,
    commit,
    preview,
    load,
    undo,
    redo,
    canUndo: state.past.length > 0,
    canRedo: state.future.length > 0,
  };
}

export function replaceElement(doc, nextEl) {
  return {
    ...doc,
    elements: doc.elements.map((el) => (el.id === nextEl.id ? nextEl : el)),
  };
}

export function removeElement(doc, id) {
  return { ...doc, elements: doc.elements.filter((el) => el.id !== id) };
}

export function addElement(doc, el) {
  return { ...doc, elements: [...doc.elements, el] };
}
