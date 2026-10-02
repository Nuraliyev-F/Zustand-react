import React, { useMemo } from 'react';
import { useTaskStore } from '../store/taskStore';
import type { Task, ColumnId } from '../types';
import { KanbanColumn } from './KanbanColumn';

interface KanbanBoardProps {
  onEditTask: (task: Task) => void;
  onAddTaskToColumn: (columnId: ColumnId) => void;
}

export const KanbanBoard: React.FC<KanbanBoardProps> = ({
  onEditTask,
  onAddTaskToColumn,
}) => {
  const { tasks, columns, filters } = useTaskStore();

  // Filter and Sort Tasks
  const filteredAndSortedTasks = useMemo(() => {
    let result = [...tasks];

    // 1. Search Query
    if (filters.searchQuery.trim()) {
      const q = filters.searchQuery.toLowerCase();
      result = result.filter(
        (t) =>
          t.title.toLowerCase().includes(q) ||
          t.description.toLowerCase().includes(q) ||
          t.category.toLowerCase().includes(q)
      );
    }

    // 2. Priority Filter
    if (filters.priority !== 'all') {
      result = result.filter((t) => t.priority === filters.priority);
    }

    // 3. Category Filter
    if (filters.category && filters.category !== 'all') {
      result = result.filter((t) => t.category === filters.category);
    }

    // 4. Sorting
    const priorityWeight: Record<string, number> = {
      urgent: 4,
      high: 3,
      medium: 2,
      low: 1,
    };

    result.sort((a, b) => {
      let comparison: number;

      switch (filters.sortBy) {
        case 'title':
          comparison = a.title.localeCompare(b.title);
          break;
        case 'dueDate':
          if (!a.dueDate) return 1;
          if (!b.dueDate) return -1;
          comparison = new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
          break;
        case 'priority':
          comparison = (priorityWeight[b.priority] || 0) - (priorityWeight[a.priority] || 0);
          break;
        case 'createdAt':
        default:
          comparison = new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
          break;
      }

      return filters.sortOrder === 'asc' ? -comparison : comparison;
    });

    return result;
  }, [tasks, filters]);

  return (
    <div className="kanban-board-container">
      <div className="kanban-grid">
        {columns.map((col) => {
          const colTasks = filteredAndSortedTasks.filter((t) => t.status === col.id);
          return (
            <KanbanColumn
              key={col.id}
              column={col}
              tasks={colTasks}
              onEditTask={onEditTask}
              onAddTaskToColumn={onAddTaskToColumn}
            />
          );
        })}
      </div>
    </div>
  );
};