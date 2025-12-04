import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useTodoStore = create(
    persist(
        (set, get) => ({
            todos: [],

            fetchTodos: async () => {
                // Todos are already loaded from localStorage via persist middleware
                return { success: true };
            },

            addTodo: async (todoData) => {
                const newTodo = {
                    _id: Date.now().toString(),
                    ...todoData,
                    completed: false,
                    createdAt: new Date().toISOString(),
                };

                set({ todos: [newTodo, ...get().todos] });

                // Schedule notification if reminder is enabled
                if (newTodo.reminder?.enabled && newTodo.dueDate) {
                    scheduleNotification(newTodo);
                }

                return { success: true };
            },

            updateTodo: async (id, updates) => {
                set({
                    todos: get().todos.map((todo) =>
                        todo._id === id ? { ...todo, ...updates } : todo
                    ),
                });

                // Update notification if reminder settings changed
                const updatedTodo = get().todos.find(t => t._id === id);
                if (updatedTodo?.reminder?.enabled && updatedTodo?.dueDate) {
                    scheduleNotification(updatedTodo);
                }

                return { success: true };
            },

            deleteTodo: async (id) => {
                set({ todos: get().todos.filter((todo) => todo._id !== id) });
                return { success: true };
            },

            toggleTodo: async (id) => {
                const todo = get().todos.find((t) => t._id === id);
                if (todo) {
                    return get().updateTodo(id, { completed: !todo.completed });
                }
            },
        }),
        {
            name: 'todo-storage',
        }
    )
);

// Notification scheduling function
function scheduleNotification(todo) {
    if ('Notification' in window && Notification.permission === 'granted') {
        const dueDate = new Date(todo.dueDate);
        const now = new Date();
        const timeUntilDue = dueDate.getTime() - now.getTime();

        // Schedule notification for the due date at 6 AM
        const notificationTime = new Date(dueDate);
        notificationTime.setHours(6, 0, 0, 0);
        const timeUntilNotification = notificationTime.getTime() - now.getTime();

        if (timeUntilNotification > 0) {
            setTimeout(() => {
                new Notification('Todo Reminder 🔔', {
                    body: `Don't forget: ${todo.title}`,
                    icon: '/vite.svg',
                    badge: '/vite.svg',
                    tag: todo._id,
                });
            }, timeUntilNotification);
        }
    }
}

// Check and send daily reminders
export function checkDailyReminders() {
    const todos = JSON.parse(localStorage.getItem('todo-storage') || '{"state":{"todos":[]}}');
    const todaysTodos = todos.state?.todos?.filter(todo => {
        if (!todo.dueDate || todo.completed) return false;
        const dueDate = new Date(todo.dueDate);
        const today = new Date();
        return dueDate.toDateString() === today.toDateString();
    }) || [];

    if (todaysTodos.length > 0 && Notification.permission === 'granted') {
        new Notification('Daily Todo Reminder 📋', {
            body: `You have ${todaysTodos.length} todo(s) due today!`,
            icon: '/vite.svg',
        });
    }
}
