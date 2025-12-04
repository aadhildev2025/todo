import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Check, Trash2, Calendar, Bell, ChevronRight } from 'lucide-react';
import { useTodoStore, checkDailyReminders } from '../store/todoStore';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { cn } from '../lib/utils';

export default function TodoPage() {
    const { todos, fetchTodos, addTodo, updateTodo, deleteTodo, toggleTodo } = useTodoStore();
    const [showAddModal, setShowAddModal] = useState(false);
    const [editingTodo, setEditingTodo] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        priority: 'medium',
        dueDate: '',
        reminder: { enabled: false },
    });

    useEffect(() => {
        fetchTodos();
        requestNotificationPermission();

        const now = new Date();
        const next6AM = new Date();
        next6AM.setHours(6, 0, 0, 0);
        if (next6AM < now) {
            next6AM.setDate(next6AM.getDate() + 1);
        }

        const timeUntil6AM = next6AM.getTime() - now.getTime();

        setTimeout(() => {
            checkDailyReminders();
            setInterval(checkDailyReminders, 24 * 60 * 60 * 1000);
        }, timeUntil6AM);
    }, []);

    const requestNotificationPermission = async () => {
        if ('Notification' in window && Notification.permission === 'default') {
            const permission = await Notification.requestPermission();
            if (permission === 'granted') {
                toast.success('Notifications enabled!');
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const result = editingTodo
            ? await updateTodo(editingTodo._id, formData)
            : await addTodo(formData);

        if (result.success) {
            toast.success(editingTodo ? 'Updated' : 'Added');
            setShowAddModal(false);
            setEditingTodo(null);
            setFormData({
                title: '',
                description: '',
                priority: 'medium',
                dueDate: '',
                reminder: { enabled: false },
            });
        }
    };

    const handleEdit = (todo) => {
        setEditingTodo(todo);
        setFormData({
            title: todo.title,
            description: todo.description || '',
            priority: todo.priority,
            dueDate: todo.dueDate ? format(new Date(todo.dueDate), 'yyyy-MM-dd') : '',
            reminder: todo.reminder || { enabled: false },
        });
        setShowAddModal(true);
    };

    const handleDelete = async (id) => {
        await deleteTodo(id);
        toast.success('Deleted');
    };

    const handleToggle = async (id) => {
        await toggleTodo(id);
    };

    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'high':
                return 'text-red-400';
            case 'medium':
                return 'text-yellow-400';
            case 'low':
                return 'text-green-400';
            default:
                return 'text-gray-400';
        }
    };

    return (
        <div className="min-h-screen bg-[#191919] text-[#e6e6e6]">
            {/* Notion-style Header */}
            <div className="border-b border-[#3f3f3f]">
                <div className="max-w-4xl mx-auto px-6 py-4">
                    <div className="flex items-center gap-2 text-sm text-gray-400 mb-2">
                        <span>Workspace</span>
                        <ChevronRight className="w-4 h-4" />
                        <span className="text-[#e6e6e6]">My Todos</span>
                    </div>
                    <h1 className="text-4xl font-bold text-[#e6e6e6]">📝 My Todos</h1>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-4xl mx-auto px-6 py-8">
                {/* Add New Todo Button */}
                <button
                    onClick={() => setShowAddModal(true)}
                    className="w-full notion-card rounded-lg p-3 mb-4 flex items-center gap-2 text-gray-400 hover:text-[#e6e6e6] text-left"
                >
                    <Plus className="w-5 h-5" />
                    <span>New todo</span>
                </button>

                {/* Todo List */}
                <div className="space-y-1">
                    <AnimatePresence>
                        {todos.map((todo) => (
                            <motion.div
                                key={todo._id}
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, height: 0 }}
                                className="notion-card rounded-lg p-4 group"
                            >
                                <div className="flex items-start gap-3">
                                    {/* Checkbox */}
                                    <button
                                        onClick={() => handleToggle(todo._id)}
                                        className={cn(
                                            'mt-0.5 w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 transition',
                                            todo.completed
                                                ? 'bg-[#2383e2] border-[#2383e2]'
                                                : 'border-gray-600 hover:border-gray-500'
                                        )}
                                    >
                                        {todo.completed && <Check className="w-3 h-3 text-white" />}
                                    </button>

                                    {/* Content */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-start justify-between gap-2">
                                            <div className="flex-1">
                                                <h3
                                                    className={cn(
                                                        'text-[15px] font-normal',
                                                        todo.completed && 'line-through text-gray-500'
                                                    )}
                                                >
                                                    {todo.title}
                                                </h3>
                                                {todo.description && (
                                                    <p className="text-sm text-gray-500 mt-1">
                                                        {todo.description}
                                                    </p>
                                                )}

                                                {/* Meta info */}
                                                <div className="flex items-center gap-3 mt-2">
                                                    {todo.dueDate && (
                                                        <div className="flex items-center gap-1 text-xs text-gray-500">
                                                            <Calendar className="w-3 h-3" />
                                                            {format(new Date(todo.dueDate), 'MMM d')}
                                                        </div>
                                                    )}
                                                    {todo.reminder?.enabled && (
                                                        <div className="flex items-center gap-1 text-xs text-gray-500">
                                                            <Bell className="w-3 h-3" />
                                                            Reminder
                                                        </div>
                                                    )}
                                                    <span className={cn('text-xs', getPriorityColor(todo.priority))}>
                                                        {todo.priority}
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Actions */}
                                            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition">
                                                <button
                                                    onClick={() => handleEdit(todo)}
                                                    className="p-1.5 hover:bg-[#3f3f3f] rounded text-gray-400 hover:text-[#e6e6e6]"
                                                >
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                    </svg>
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(todo._id)}
                                                    className="p-1.5 hover:bg-[#3f3f3f] rounded text-gray-400 hover:text-red-400"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>

                    {todos.length === 0 && (
                        <div className="text-center py-16 text-gray-500">
                            <p>No todos yet. Click "New todo" to get started.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Modal */}
            <AnimatePresence>
                {showAddModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50"
                        onClick={() => {
                            setShowAddModal(false);
                            setEditingTodo(null);
                        }}
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-[#2f2f2f] border border-[#3f3f3f] rounded-lg p-6 w-full max-w-md"
                        >
                            <h2 className="text-xl font-semibold mb-4">
                                {editingTodo ? 'Edit todo' : 'New todo'}
                            </h2>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <input
                                        type="text"
                                        placeholder="Todo title"
                                        value={formData.title}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                        required
                                        className="w-full px-3 py-2 notion-input rounded-md text-sm"
                                    />
                                </div>

                                <div>
                                    <textarea
                                        placeholder="Description (optional)"
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        rows={3}
                                        className="w-full px-3 py-2 notion-input rounded-md text-sm resize-none"
                                    />
                                </div>

                                <div>
                                    <select
                                        value={formData.priority}
                                        onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                                        className="w-full px-3 py-2 notion-input rounded-md text-sm"
                                    >
                                        <option value="low">Low Priority</option>
                                        <option value="medium">Medium Priority</option>
                                        <option value="high">High Priority</option>
                                    </select>
                                </div>

                                <div>
                                    <input
                                        type="date"
                                        value={formData.dueDate}
                                        onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                                        className="w-full px-3 py-2 notion-input rounded-md text-sm"
                                    />
                                </div>

                                <div className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        id="reminder"
                                        checked={formData.reminder.enabled}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                reminder: { enabled: e.target.checked },
                                            })
                                        }
                                        className="w-4 h-4 rounded accent-[#2383e2]"
                                    />
                                    <label htmlFor="reminder" className="text-sm text-gray-300">
                                        Daily reminder (6 AM)
                                    </label>
                                </div>

                                <div className="flex gap-2 pt-2">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setShowAddModal(false);
                                            setEditingTodo(null);
                                        }}
                                        className="flex-1 px-4 py-2 notion-button rounded-md text-sm font-medium"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="flex-1 px-4 py-2 notion-button-primary rounded-md text-sm font-medium"
                                    >
                                        {editingTodo ? 'Update' : 'Create'}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
