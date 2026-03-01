# To-Do List Application

A simple, functional command-line to-do list application built with Python.

## Features

- ✅ **Add Tasks** - Create new tasks with descriptions
- 📋 **View Tasks** - Display all tasks with completion status
- ✓ **Mark Done** - Mark tasks as complete
- 🗑️ **Delete Tasks** - Remove unwanted tasks
- 💾 **Persistent Storage** - Tasks are saved to `tasks.json`
- 🎯 **Simple Menu** - Easy-to-use text-based interface

## Usage

### Run the Application

```bash
python3 todo_app.py
```

### Menu Options

1. **Add Task** - Enter a new task description
2. **View Tasks** - See all your tasks (✓ = completed)
3. **Mark Task as Done** - Select a task number to complete it
4. **Delete Task** - Remove a task from the list
5. **Exit** - Quit the application

### Example Session

```
📌 TO-DO LIST APPLICATION
============================================================
1. ➕ Add Task
2. 📋 View Tasks
3. ✓ Mark Task as Done
4. 🗑️  Delete Task
5. 🚪 Exit
============================================================

Choose an option (1-5): 1
📝 Enter task description: Buy groceries
✅ Task added: Buy groceries
```

## Data Storage

Tasks are automatically saved to `tasks.json` in the same directory. Each task includes:
- ID (auto-assigned)
- Description
- Completion status
- Creation timestamp

## Requirements

- Python 3.6+
- No external dependencies required (uses only built-in libraries)

## Files

- `todo_app.py` - Main application script
- `tasks.json` - Auto-generated file storing your tasks

---

Simple. Functional. Ready to use.
