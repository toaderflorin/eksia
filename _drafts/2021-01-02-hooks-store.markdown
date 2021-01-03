---
layout: post
title:  "Hooks Store"
date:   2021-01-02 00:39:37 +0300
description: "
One aspect that can be challenging for React newcomers is how to handle state updates since React mandates application state be immutable. Functional code generally doesn't mutate existing objects - it creates new instances of objects with properties changed. In this article, we'll look at ways of using some of Javascript's functional features like map, reduce, filter, and the spread operator to achieve the state changes without actually mutating the existing state object.
"
icon: "immutable-patterns/logo.png"
categories:
---
While the rumors about Redux's demise are most likely mostly exaggerated, there is no doubt that there is no doubt we can achieve a lot of the functionality it provides with hooks. Also, as a rule of thumb, we should avoid as many external libraries as possible because chances are they could become deprecated in the future. While using the useReducer hook is relatively straightforward, React doesn't provide a prescription on how to structure a relatively large application. To make matters worse, virtually every blog article on the internet recommends using a different approach.

Another relatively new addition to React is the Provider API, but again, the documentation is not specific on how it should be used. A couple could include:
We could have different providers per route with separate data stores for each of them.
We could use a single provider, which is in the vein of what Redux does.
With hooks, React provides powerful features, and it's not opinionated on how you use them. The problem is, choosing the right approach can be tricky because there are so many permutations. 

We'll go with the second option.

Since we plan to lay the groundwork for a complex app, we'll assume that this application has multiple "modules" (vertical slices in the application). We plan to recreate the ubiquitous "tasks" app, so we'll have two modules: tasks and settings.

<div class="margin-bottom">
<pre><code class="language-js line-numbers">
import { Dispatch } from 'react'
import { NotesAction } from './types'
import { AppState } from '../../types'

export const ADD_NOTE = 'ADD_NOTE'
export const REMOVE_NOTE = 'REMOVE_NOTE'
export const UPDATE_NOTE = 'UPDATE_NOTE'

export function addNote(title: string, description: string) {
  return async function (state: AppState, dispatch: Dispatch&lt;NotesAction&gt;) {
    dispatch({
      type: ADD_NOTE,
      title,
      description
    })
  }
}

export function removeNote(noteId: string) {
  return async function (state: AppState, dispatch: Dispatch&lt;NotesAction&gt;) {
    dispatch({
      type: REMOVE_NOTE,
      noteId
    })
  }
}

export function updateNote(noteId: string, title: string, description: string) {
  return async function (state: AppState, dispatch: Dispatch&lt;NotesAction&gt;) {
    dispatch({
      type: UPDATE_NOTE,
      noteId,
      title,
      description
    })
  }
}
</code></pre>
</div>

<div class="margin-bottom">
<pre><code class="language-js line-numbers">
import { NotesState, NotesAction, Note } from './types'
import { ADD_NOTE, REMOVE_NOTE, UPDATE_NOTE } from './actions'
import { v4 } from 'uuid'

export const initialNotesState: NotesState = {
  notes: []
}

export function notesReducer(state: NotesState, action: NotesAction) {
  switch (action.type) {
    case ADD_NOTE: {
      const note = {
        id: v4(),
        title: action.title,
        description: action.description
      }

      return {
        ...state,
        notes: [...state.notes, note]
      }
    }

    case REMOVE_NOTE: {
      return {
        ...state,
        notes: state.notes.filter((note: Note) => note.id !== action.noteId)
      }
    }

    case UPDATE_NOTE: {
      return {
        ...state,
        notes: state.notes.map((note: Note) => {
          if (note.id === action.noteId) {
            return {
              ...note,
              title: action.title,
              description: action.description
            }
          } else {
            return note
          }
        })
      }
    }

    default: {
      return state
    }
  }
}

</code></pre>
</div>

And finally, let's define the *types.ts* file.

<div class="margin-bottom">
<pre><code class="language-js line-numbers">
import { ADD_NOTE, REMOVE_NOTE, UPDATE_NOTE } from './actions'

export type Note = {
  id: string
  title: string
  description: string
}

export type NotesState = {
  notes: Note[]
}

export type NotesAction =
  | { type: typeof ADD_NOTE, title: string, description: string }
  | { type: typeof REMOVE_NOTE, noteId: string }
  | { type: typeof UPDATE_NOTE, noteId: string, title: string, description: string }
</code></pre>
</div>

Let us now look at what we need to create.

<div class="margin-bottom">
<pre><code class="language-js line-numbers">
import React, { useReducer, Dispatch } from 'react'
import { notesReducer, initialNotesState } from './modules/notes/store/reducer'
import { tasksReducer, initialTasksState } from './modules/tasks/store/reducer'
import { AppState, ChildrenProps } from './modules/types'
import { NotesAction } from './modules/notes/store/types'
import { TasksAction } from './modules/tasks/store/types'

export type ExecuteFunc = (state: AppState, dispatch: Dispatch<any>) => Promise<void> | void

type Action =
  | NotesAction
  | TasksAction

export type AppContextType = {
  state: AppState
  execute: (action: ExecuteFunc) => Promise<void>
}

const initialAppState = {
  tasks: initialTasksState,
  notes: initialNotesState
}

function appReducer(state: AppState, action: Action) {
  return {
    notes: notesReducer(state.notes, action as NotesAction),
    tasks: tasksReducer(state.tasks, action as TasksAction)
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const AppContext = React.createContext({} as any as AppContextType)

export default function AppContextProvider(props: ChildrenProps) {
  const [state, dispatch] = useReducer(appReducer, initialAppState)

  async function execute(action: (state: AppState, dispatch: Dispatch<Action>) => Promise<void> | void) {
    try {
      await action(state, dispatch)
    } catch (error) {
      // take appropriate action and report the error
      alert('The application encountered an error.')
    }
  }

  return (
    &lt;AppContext.Provider value={{ state, execute }}&gt;
      {props.children}
    &lt;/AppContext.Provider&gt;
  )
}
</code></pre>
</div>
