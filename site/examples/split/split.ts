//!state

import {basicSetup} from "codemirror"
import {EditorState} from "@codemirror/state"

let startState = EditorState.create({
  doc: "The document\nis\nshared",
  extensions: basicSetup
})

//!syncDispatch

import {EditorView} from "@codemirror/view"
import {Transaction, Annotation} from "@codemirror/state"

let views: EditorView[] = []

let syncAnnotation = Annotation.define<boolean>()

function syncDispatch(from: number, to: number) {
  return (tr: Transaction) => {
    views[from].update([tr])
    if (!tr.changes.empty && !tr.annotation(syncAnnotation))
      views[to].dispatch({changes: tr.changes,
                          annotations: syncAnnotation.of(true)})
  }
}

//!setup

views.push(
  new EditorView({
    state: startState,
    parent: document.querySelector("#editor1"),
    dispatch: syncDispatch(0, 1)
  }),
  new EditorView({
    state: startState,
    parent: document.querySelector("#editor2"),
    dispatch: syncDispatch(1, 0)
  })
)
