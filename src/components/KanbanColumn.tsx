import React from 'react';
import type { Column, Task, ColumnId } from '../types';
import { TaskCard } from './TaskCard';
import { Plus, Inbox } from 'lucide-react';

interface KanbanColumnProps {
  column: Column;
  tasks: Task[];
  onEditTask: (task: Task) => void;
  onAddTaskToColumn: (columnId: ColumnId) => void;
}

export const KanbanColumn: React.FC<KanbanColumnProps> = ({
  column,
  tasks,
  onEditTask,
  onAddTaskToColumn,
}) => {
  return (
    <div className="kanban-column">
      {/* Column Header */}
      <div className="column-header">
        <div className="flex items-center gap-2">
          <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${column.color}`} />
          <h2 className="column-title">{column.title}</h2>
          <span className="column-count-badge">{tasks.length}</span>
        </div>

        <button
          onClick={() => onAddTaskToColumn(column.id)}
          className="column-add-btn"
          title={`${column.title}ga yangi vazifa qo'shish`}
          aria-label="Vazifa qo'shish"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      {/* Column Description */}
      <p className="column-description">{column.description}</p>

      {/* Tasks List */}
      <div className="column-tasks-container">
        {tasks.length > 0 ? (
          tasks.map((task) => (
            <TaskCard key={task.id} task={task} onEdit={onEditTask} />
          ))
        ) : (
          <div className="empty-column-box">
            <Inbox className="w-8 h-8 text-muted opacity-40 mb-1" />
            <p className="empty-column-text">Vazifalar yo'q</p>
            <button
              onClick={() => onAddTaskToColumn(column.id)}
              className="empty-add-btn"
            >
              + Yangi qo'shish
            </button>
          </div>
        )}
      </div>
    </div>
  );
};