import React, { useReducer, useState } from 'react';
import './styles.css';

// Define action types
const ACTIONS = {
  ADD_TASK: 'add-task',
  DELETE_TASK: 'delete-task',
  EDIT_TASK: 'edit-task',
  TOGGLE_COMPLETE_TASK: 'toggle-complete-task',
  SEARCH_TASK: 'search-task',
};

// Initial state for the reducer
const initialState = {
  tasks: [],
  searchQuery: '',
};

// Reducer function to manage state
function reducer(state, action) {
  switch (action.type) {
    case ACTIONS.ADD_TASK:
      // Ensure task title is unique
      if (state.tasks.some((task) => task.title === action.payload.title)) {
        alert('Task title must be unique.');
        return state;
      }
      return {
        ...state,
        tasks: [...state.tasks, action.payload],
      };

    case ACTIONS.DELETE_TASK:
      return {
        ...state,
        tasks: state.tasks.filter((_, index) => index !== action.payload),
      };

    case ACTIONS.EDIT_TASK:
      return {
        ...state,
        tasks: state.tasks.map((task, index) =>
          index === action.payload.index ? action.payload.task : task
        ),
      };

    case ACTIONS.TOGGLE_COMPLETE_TASK:
      return {
        ...state,
        tasks: state.tasks.map((task, index) =>
          index === action.payload ? { ...task, completed: !task.completed } : task
        ),
      };

    case ACTIONS.SEARCH_TASK:
      return {
        ...state,
        searchQuery: action.payload,
      };

    default:
      return state;
  }
}

const App = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [newTask, setNewTask] = useState({ title: '', description: '', dueDate: '', priority: 'Low' });
  const [isEditing, setIsEditing] = useState(false);
  const [currentTaskIndex, setCurrentTaskIndex] = useState(null);

  // Handle input changes for the form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewTask((prevTask) => ({ ...prevTask, [name]: value }));
  };

  // Validate due date
  const validateDueDate = (dueDate) => {
    const today = new Date().toISOString().split('T')[0]; // Format YYYY-MM-DD
    return dueDate >= today;
  };

  // Add or edit a task
  const saveTask = () => {
    if (newTask.title.trim() === '' || newTask.description.trim() === '') {
      alert('Both title and description are required!');
      return;
    }

    if (!validateDueDate(newTask.dueDate)) {
      alert('Due date must be today or in the future.');
      return;
    }

    if (isEditing) {
      dispatch({
        type: ACTIONS.EDIT_TASK,
        payload: { index: currentTaskIndex, task: newTask },
      });
      setIsEditing(false);
      setCurrentTaskIndex(null);
    } else {
      dispatch({ type: ACTIONS.ADD_TASK, payload: { ...newTask, completed: false } });
    }

    setNewTask({ title: '', description: '', dueDate: '', priority: 'Low' });
  };

  // Search for tasks by title
  const handleSearchChange = (e) => {
    dispatch({ type: ACTIONS.SEARCH_TASK, payload: e.target.value });
  };

  return (
    <div className="App">
      <h1>Task Manager</h1>
      <div className="task-form">
        <input
          type="text"
          name="title"
          value={newTask.title}
          onChange={handleInputChange}
          placeholder="Enter task title"
        />
        <input
          type="text"
          name="description"
          value={newTask.description}
          onChange={handleInputChange}
          placeholder="Enter task description"
        />
        <input
          type="date"
          name="dueDate"
          value={newTask.dueDate}
          onChange={handleInputChange}
        />
        <select name="priority" value={newTask.priority} onChange={handleInputChange}>
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
        </select>
        <button onClick={saveTask}>{isEditing ? 'Edit Task' : 'Add Task'}</button>
      </div>

      <input
        type="text"
        placeholder="Search tasks by title..."
        onChange={handleSearchChange}
        value={state.searchQuery}
      />

      <div className="task-list">
        <table>
          <thead>
            <tr>
              <th>Title</th>
              <th>Description</th>
              <th>Due Date</th>
              <th>Priority</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {state.tasks
              .filter((task) => task.title.toLowerCase().includes(state.searchQuery.toLowerCase()))
              .map((task, index) => (
                <tr key={index} className={task.completed ? 'completed' : ''}>
                  <td>{task.title}</td>
                  <td>{task.description}</td>
                  <td>{task.dueDate}</td>
                  <td>{task.priority}</td>
                  <td>{task.completed ? 'Completed' : 'Pending'}</td>
                  <td>
                    <button onClick={() => dispatch({ type: ACTIONS.TOGGLE_COMPLETE_TASK, payload: index })}>
                      {task.completed ? 'Unmark' : 'Complete'}
                    </button>
                    <button onClick={() => {
                      setNewTask(task);
                      setIsEditing(true);
                      setCurrentTaskIndex(index);
                    }}>Edit</button>
                    <button onClick={() => dispatch({ type: ACTIONS.DELETE_TASK, payload: index })}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default App;