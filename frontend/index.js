import { backend } from "declarations/backend";

let todos = [];
const todoInput = document.getElementById('todoInput');
const todoList = document.getElementById('todoList');
const loading = document.getElementById('loading');

// Show/hide loading spinner
const toggleLoading = (show) => {
    loading.classList.toggle('d-none', !show);
};

// Render todos
const renderTodos = () => {
    todoList.innerHTML = todos.map(todo => `
        <li class="list-group-item d-flex justify-content-between align-items-center">
            <div>
                <input type="checkbox" class="form-check-input me-2" 
                    ${todo.completed ? 'checked' : ''} 
                    onchange="window.toggleTodo(${todo.id})">
                <span class="${todo.completed ? 'text-decoration-line-through' : ''}">${todo.text}</span>
            </div>
            <button class="btn btn-danger btn-sm" onclick="window.deleteTodo(${todo.id})">Delete</button>
        </li>
    `).join('');
};

// Load todos
const loadTodos = async () => {
    toggleLoading(true);
    try {
        todos = await backend.getTodos();
        renderTodos();
    } catch (error) {
        console.error('Error loading todos:', error);
    } finally {
        toggleLoading(false);
    }
};

// Add todo
document.getElementById('addTodo').onclick = async () => {
    const text = todoInput.value.trim();
    if (!text) return;

    toggleLoading(true);
    try {
        await backend.addTodo(text);
        todoInput.value = '';
        await loadTodos();
    } catch (error) {
        console.error('Error adding todo:', error);
    } finally {
        toggleLoading(false);
    }
};

// Toggle todo completion
window.toggleTodo = async (id) => {
    toggleLoading(true);
    try {
        await backend.toggleTodo(id);
        await loadTodos();
    } catch (error) {
        console.error('Error toggling todo:', error);
    } finally {
        toggleLoading(false);
    }
};

// Delete todo
window.deleteTodo = async (id) => {
    toggleLoading(true);
    try {
        await backend.deleteTodo(id);
        await loadTodos();
    } catch (error) {
        console.error('Error deleting todo:', error);
    } finally {
        toggleLoading(false);
    }
};

// Handle enter key in input
todoInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        document.getElementById('addTodo').click();
    }
});

// Initial load
loadTodos();
