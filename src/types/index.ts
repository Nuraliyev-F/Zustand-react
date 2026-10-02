export type Priority = 'low' | 'medium' | 'high' | 'urgent';

export type ColumnId = 'todo' | 'in_progress' | 'review' | 'done';

export interface SubTask {
  id: string;
  title: string;
  completed: boolean;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  priority: Priority;
  status: ColumnId;
  category: string;
  dueDate?: string;
  createdAt: string;
  subtasks: SubTask[];
}

export interface Column {
  id: ColumnId;
  title: string;
  description: string;
  color: string;
  badgeBg: string;
}

export type SortOption = 'createdAt' | 'dueDate' | 'priority' | 'title';

export interface FilterState {
  searchQuery: string;
  priority: Priority | 'all';
  category: string;
  sortBy: SortOption;
  sortOrder: 'asc' | 'desc';
}

export type ThemeMode = 'light' | 'dark';

export type AccentColor = 'indigo' | 'emerald' | 'violet' | 'rose' | 'amber' | 'cyan';

export interface ToastNotification {
  id: string;
  message: string;
  type: 'success' | 'info' | 'warning' | 'error';
}