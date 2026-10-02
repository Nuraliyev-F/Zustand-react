import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Task, Column, ColumnId, Priority, FilterState, SortOption } from '../types';

export const INITIAL_COLUMNS: Column[] = [
  {
    id: 'todo',
    title: 'Rejada (To Do)',
    description: 'Bajarilishi kerak bo\'lgan vazifalar',
    color: 'from-amber-500 to-orange-500',
    badgeBg: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
  },
  {
    id: 'in_progress',
    title: 'Jarayonda (In Progress)',
    description: 'Hozirda ustida ishlanayotgan vazifalar',
    color: 'from-blue-500 to-cyan-500',
    badgeBg: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
  },
  {
    id: 'review',
    title: 'Ko\'rib chiqish (Review)',
    description: 'Tekshirish va testlash bosqichidagi vazifalar',
    color: 'from-purple-500 to-pink-500',
    badgeBg: 'bg-purple-500/10 text-purple-500 border-purple-500/20',
  },
  {
    id: 'done',
    title: 'Yakunlangan (Done)',
    description: 'Muvaffaqiyatli yakunlangan vazifalar',
    color: 'from-emerald-500 to-teal-500',
    badgeBg: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
  },
];

const INITIAL_TASKS: Task[] = [
  {
    id: 'task-1',
    title: 'Zustand Store arxitekturasini loyihalash',
    description: 'State management uchun persist va devtools middleware integratsiyasi bilan to\'liq store tuzish.',
    priority: 'urgent',
    status: 'done',
    category: 'Architecture',
    dueDate: '2026-09-21',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    subtasks: [
      { id: 'sub-1', title: 'themeStore yaratish', completed: true },
      { id: 'sub-2', title: 'taskStore va filterlar', completed: true },
      { id: 'sub-3', title: 'localStorage bilan persist sozlash', completed: true },
    ],
  },
  {
    id: 'task-2',
    title: 'TypeScript interfeyslarini yozish',
    description: 'Barcha modellar (Task, SubTask, Column, Filter) uchun qat\'iy tur (type) xavfsizligini ta\'minlash.',
    priority: 'high',
    status: 'done',
    category: 'TypeScript',
    dueDate: '2026-09-22',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 18).toISOString(),
    subtasks: [
      { id: 'sub-4', title: 'Task va SubTask turlari', completed: true },
      { id: 'sub-5', title: 'Filter va Theme turlari', completed: true },
    ],
  },
  {
    id: 'task-3',
    title: 'Kanban doskasi komponentlarini ishlab chiqish',
    description: '4 ta ustun bo\'yicha vazifalarni ko\'rsatish, harakatlantirish va filtrlash imkoniyati.',
    priority: 'high',
    status: 'in_progress',
    category: 'Frontend',
    dueDate: '2026-09-23',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(),
    subtasks: [
      { id: 'sub-6', title: 'Ustunlar dizayni va hisoblagichlar', completed: true },
      { id: 'sub-7', title: 'Vazifa kartochkasi va progress bar', completed: true },
      { id: 'sub-8', title: 'Ustunlararo ko\'chirish tugmalari', completed: false },
    ],
  },
  {
    id: 'task-4',
    title: 'Qidiruv va Kengaytirilgan Filtrlash',
    description: 'Real-time qidiruv, muhimlik darajasi va kategoriyalar bo\'yicha bir zumda saralash.',
    priority: 'medium',
    status: 'review',
    category: 'Frontend',
    dueDate: '2026-09-24',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(),
    subtasks: [
      { id: 'sub-9', title: 'Qidiruv qatori inputi', completed: true },
      { id: 'sub-10', title: 'Kategoriya va daraja teglari', completed: true },
    ],
  },
  {
    id: 'task-5',
    title: 'Dark / Light mavzular va Ranglar palitrasi',
    description: 'Foydalanuvchi xohishiga ko\'ra interfeys mavzusi va aktsent ranglarini saqlash.',
    priority: 'medium',
    status: 'in_progress',
    category: 'UI/UX',
    dueDate: '2026-09-25',
    createdAt: new Date().toISOString(),
    subtasks: [
      { id: 'sub-11', title: 'Dark mode to\'liq mosligi', completed: true },
      { id: 'sub-12', title: 'Aktsent ranglar (Indigo, Emerald, Violet...)', completed: true },
    ],
  },
  {
    id: 'task-6',
    title: 'GitHub repozitoriyasiga push qilish va hujjatlashtirish',
    description: 'README.md faylini professional yozish va git orqali GitHub profiliga yuklash.',
    priority: 'urgent',
    status: 'todo',
    category: 'DevOps',
    dueDate: '2026-09-26',
    createdAt: new Date().toISOString(),
    subtasks: [
      { id: 'sub-13', title: 'Batafsil README tayyorlash', completed: false },
      { id: 'sub-14', title: 'Git commit va push', completed: false },
    ],
  },
];

const INITIAL_FILTER: FilterState = {
  searchQuery: '',
  priority: 'all',
  category: 'all',
  sortBy: 'createdAt',
  sortOrder: 'desc',
};

interface TaskState {
  tasks: Task[];
  columns: Column[];
  filters: FilterState;

  // Task Actions
  addTask: (task: Omit<Task, 'id' | 'createdAt'>) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  moveTask: (taskId: string, targetStatus: ColumnId) => void;

  // Subtask Actions
  toggleSubtask: (taskId: string, subtaskId: string) => void;
  addSubtask: (taskId: string, title: string) => void;
  deleteSubtask: (taskId: string, subtaskId: string) => void;

  // Filter Actions
  setSearchQuery: (query: string) => void;
  setPriorityFilter: (priority: Priority | 'all') => void;
  setCategoryFilter: (category: string) => void;
  setSortBy: (sortBy: SortOption) => void;
  toggleSortOrder: () => void;
  resetFilters: () => void;

  // Data Actions
  resetToDefaults: () => void;
  clearAllTasks: () => void;
  importTasks: (tasks: Task[]) => void;
}

export const useTaskStore = create<TaskState>()(
  persist(
    (set) => ({
      tasks: INITIAL_TASKS,
      columns: INITIAL_COLUMNS,
      filters: INITIAL_FILTER,

      addTask: (taskData) =>
        set((state) => ({
          tasks: [
            {
              ...taskData,
              id: 'task-' + Date.now().toString(36) + Math.random().toString(36).substring(2, 6),
              createdAt: new Date().toISOString(),
            },
            ...state.tasks,
          ],
        })),

      updateTask: (id, updates) =>
        set((state) => ({
          tasks: state.tasks.map((task) => (task.id === id ? { ...task, ...updates } : task)),
        })),

      deleteTask: (id) =>
        set((state) => ({
          tasks: state.tasks.filter((task) => task.id !== id),
        })),

      moveTask: (taskId, targetStatus) =>
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === taskId ? { ...task, status: targetStatus } : task
          ),
        })),

      toggleSubtask: (taskId, subtaskId) =>
        set((state) => ({
          tasks: state.tasks.map((task) => {
            if (task.id !== taskId) return task;
            return {
              ...task,
              subtasks: task.subtasks.map((sub) =>
                sub.id === subtaskId ? { ...sub, completed: !sub.completed } : sub
              ),
            };
          }),
        })),

      addSubtask: (taskId, title) =>
        set((state) => ({
          tasks: state.tasks.map((task) => {
            if (task.id !== taskId) return task;
            const newSub = {
              id: 'sub-' + Date.now().toString(36),
              title,
              completed: false,
            };
            return {
              ...task,
              subtasks: [...task.subtasks, newSub],
            };
          }),
        })),

      deleteSubtask: (taskId, subtaskId) =>
        set((state) => ({
          tasks: state.tasks.map((task) => {
            if (task.id !== taskId) return task;
            return {
              ...task,
              subtasks: task.subtasks.filter((sub) => sub.id !== subtaskId),
            };
          }),
        })),

      setSearchQuery: (searchQuery) =>
        set((state) => ({
          filters: { ...state.filters, searchQuery },
        })),

      setPriorityFilter: (priority) =>
        set((state) => ({
          filters: { ...state.filters, priority },
        })),

      setCategoryFilter: (category) =>
        set((state) => ({
          filters: { ...state.filters, category },
        })),

      setSortBy: (sortBy) =>
        set((state) => ({
          filters: { ...state.filters, sortBy },
        })),

      toggleSortOrder: () =>
        set((state) => ({
          filters: {
            ...state.filters,
            sortOrder: state.filters.sortOrder === 'asc' ? 'desc' : 'asc',
          },
        })),

      resetFilters: () =>
        set({
          filters: INITIAL_FILTER,
        }),

      resetToDefaults: () =>
        set({
          tasks: INITIAL_TASKS,
          columns: INITIAL_COLUMNS,
          filters: INITIAL_FILTER,
        }),

      clearAllTasks: () =>
        set({
          tasks: [],
        }),

      importTasks: (imported) =>
        set((state) => ({
          tasks: [...imported, ...state.tasks],
        })),
    }),
    {
      name: 'taskflow-tasks-storage',
    }
  )
);