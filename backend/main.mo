import Bool "mo:base/Bool";

import Array "mo:base/Array";
import Debug "mo:base/Debug";
import Text "mo:base/Text";
import Nat "mo:base/Nat";
import Iter "mo:base/Iter";

actor {
    // Define the Todo type
    public type Todo = {
        id: Nat;
        text: Text;
        completed: Bool;
    };

    // Store todos in a stable variable for persistence
    private stable var todos: [Todo] = [];
    private stable var nextId: Nat = 0;

    // Add a new todo
    public func addTodo(text: Text) : async Todo {
        let todo: Todo = {
            id = nextId;
            text = text;
            completed = false;
        };
        nextId += 1;
        todos := Array.append(todos, [todo]);
        return todo;
    };

    // Get all todos
    public query func getTodos() : async [Todo] {
        return todos;
    };

    // Toggle todo completion status
    public func toggleTodo(id: Nat) : async Bool {
        let updatedTodos = Array.map<Todo, Todo>(
            todos,
            func (todo: Todo) : Todo {
                if (todo.id == id) {
                    return {
                        id = todo.id;
                        text = todo.text;
                        completed = not todo.completed;
                    };
                };
                todo;
            }
        );
        todos := updatedTodos;
        return true;
    };

    // Delete a todo
    public func deleteTodo(id: Nat) : async Bool {
        let filteredTodos = Array.filter<Todo>(
            todos,
            func(todo: Todo) : Bool {
                todo.id != id
            }
        );
        todos := filteredTodos;
        return true;
    };
}
