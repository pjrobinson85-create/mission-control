#!/usr/bin/env python3
"""
Simple To-Do List Application
A command-line task manager with add, view, and mark-as-done functionality.
"""

import json
import os
from datetime import datetime

# File to persist tasks
TASKS_FILE = "tasks.json"


def load_tasks():
    """Load tasks from JSON file."""
    if os.path.exists(TASKS_FILE):
        try:
            with open(TASKS_FILE, "r") as f:
                return json.load(f)
        except (json.JSONDecodeError, IOError):
            return []
    return []


def save_tasks(tasks):
    """Save tasks to JSON file."""
    with open(TASKS_FILE, "w") as f:
        json.dump(tasks, f, indent=2)


def add_task(tasks):
    """Add a new task."""
    task_text = input("\n📝 Enter task description: ").strip()
    if not task_text:
        print("❌ Task cannot be empty!")
        return
    
    task = {
        "id": len(tasks) + 1,
        "description": task_text,
        "done": False,
        "created": datetime.now().strftime("%Y-%m-%d %H:%M")
    }
    tasks.append(task)
    save_tasks(tasks)
    print(f"✅ Task added: {task_text}")


def view_tasks(tasks):
    """Display all tasks."""
    if not tasks:
        print("\n📭 No tasks yet! Add one to get started.")
        return
    
    print("\n📋 Your Tasks:")
    print("-" * 60)
    for task in tasks:
        status = "✓" if task["done"] else " "
        description = task["description"]
        if task["done"]:
            description = f"~~{description}~~"
        print(f"  [{status}] {task['id']}. {description}")
    print("-" * 60)


def mark_done(tasks):
    """Mark a task as done."""
    if not tasks:
        print("\n📭 No tasks to mark as done!")
        return
    
    view_tasks(tasks)
    try:
        task_id = int(input("\n✏️  Enter task number to mark as done: "))
        for task in tasks:
            if task["id"] == task_id:
                task["done"] = True
                save_tasks(tasks)
                print(f"✅ Task '{task['description']}' marked as done!")
                return
        print("❌ Task not found!")
    except ValueError:
        print("❌ Please enter a valid task number!")


def delete_task(tasks):
    """Delete a task."""
    if not tasks:
        print("\n📭 No tasks to delete!")
        return
    
    view_tasks(tasks)
    try:
        task_id = int(input("\n🗑️  Enter task number to delete: "))
        tasks[:] = [t for t in tasks if t["id"] != task_id]
        if len(tasks) < len([t for t in load_tasks() if t["id"] != task_id]) + 1:
            save_tasks(tasks)
            print("✅ Task deleted!")
        else:
            print("❌ Task not found!")
    except ValueError:
        print("❌ Please enter a valid task number!")


def show_menu():
    """Display the main menu."""
    print("\n" + "="*60)
    print("📌 TO-DO LIST APPLICATION")
    print("="*60)
    print("1. ➕ Add Task")
    print("2. 📋 View Tasks")
    print("3. ✓ Mark Task as Done")
    print("4. 🗑️  Delete Task")
    print("5. 🚪 Exit")
    print("="*60)


def main():
    """Main application loop."""
    print("\n🎉 Welcome to your To-Do List!")
    
    while True:
        show_menu()
        choice = input("\nChoose an option (1-5): ").strip()
        
        tasks = load_tasks()
        
        if choice == "1":
            add_task(tasks)
        elif choice == "2":
            view_tasks(tasks)
        elif choice == "3":
            mark_done(tasks)
        elif choice == "4":
            delete_task(tasks)
        elif choice == "5":
            print("\n👋 Goodbye! Keep being productive!\n")
            break
        else:
            print("❌ Invalid option! Please choose 1-5.")


if __name__ == "__main__":
    main()
