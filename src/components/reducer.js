//All the logic for the app is located in this file
export const initialState = [];

export const ACTIONS = {
  ADD_TODO: "add-todo",
  DELETE_TODO: "delete-todo",
  EDIT_TODO: "edit-todo"
};

export function reducer(state, action) {
  switch (action.type) {
    case ACTIONS.ADD_TODO:
      return [
        ...state,
        { id: Date.now() + Math.random(), task: action.payload, completed: false },
      ];
    case ACTIONS.DELETE_TODO:
      return state.filter(e=> e.id !== action.payload);

    case ACTIONS.EDIT_TODO:
      return state.map((item)=> 
        item.id === action.payload.id 
        ? {...item, task: action.payload.text} : item
      );
    default:
      return state;
  }
}