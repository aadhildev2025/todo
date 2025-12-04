import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useAuthStore = create(
    persist(
        (set) => ({
            user: null,
            isAuthenticated: false,

            login: async (credentials) => {
                // Simple localStorage-based auth
                const users = JSON.parse(localStorage.getItem('users') || '[]');
                const user = users.find(u => u.email === credentials.email && u.password === credentials.password);

                if (user) {
                    set({ user: { id: user.id, name: user.name, email: user.email }, isAuthenticated: true });
                    return { success: true };
                }
                return { success: false, error: 'Invalid credentials' };
            },

            register: async (userData) => {
                const users = JSON.parse(localStorage.getItem('users') || '[]');

                // Check if user exists
                if (users.find(u => u.email === userData.email)) {
                    return { success: false, error: 'User already exists' };
                }

                // Create new user
                const newUser = {
                    id: Date.now().toString(),
                    name: userData.name,
                    email: userData.email,
                    password: userData.password, // In production, this should be hashed
                };

                users.push(newUser);
                localStorage.setItem('users', JSON.stringify(users));

                set({ user: { id: newUser.id, name: newUser.name, email: newUser.email }, isAuthenticated: true });
                return { success: true };
            },

            logout: () => {
                set({ user: null, isAuthenticated: false });
            },
        }),
        {
            name: 'auth-storage',
        }
    )
);
