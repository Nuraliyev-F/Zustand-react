import React, { useState } from 'react';
import type { Task, ColumnId } from '../types';
import { useTaskStore, INITIAL_COLUMNS } from '../store/taskStore';
import { useToastStore } from '../store/toastStore';
import {
  Calendar,
  CheckSquare,
  ChevronDown,
  ChevronUp,
  Clock,
  Edit2,
  Flame,
  MoreVertical,
  Plus,
  Trash2,
  ArrowRight,
  ArrowLeft,
  CheckCircle,
  Tag
} from 'lucide-react';

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({ task, onEdit }) => {
  const { deleteTask, moveTask, toggleSubtask, addSubtask, deleteSubtask } = useTaskStore();
  const addToast = useToastStore((state) => state.addToast);

  const [expanded, setExpanded] = useState(false);
  const [showMoveMenu, setShowMoveMenu] = useState(false);
  const [newSubtaskTitle, setNewSubtaskTitle] = useState('');
  const [showAddSubtask, setShowAddSubtask] = useState(false);

  const totalSubtasks = task.subtasks.length;
  const completedSubtasks = task.subtasks.filter((s) => s.completed).length;
  const subtaskProgress = totalSubtasks > 0 ? Math.round((completedSubtasks / totalSubtasks) * 100) : 0;

  // Check if overdue
  const isOverdue = task.dueDate && task.status !== 'done' && new Date(task.dueDate) < new Date(new Date().setHours(0, 0, 0, 0));

  const handleDelete = () => {
    if (window.confirm(`"${task.title}" vazifasini o'chirmoqchimisiz?`)) {
      deleteTask(task.id);
      addToast(`"${task.title}" vazifasi o'chirildi`, 'warning');
    }
  };

  const handleMove = (targetCol: ColumnId) => {
    if (targetCol === task.status) return;
    moveTask(task.id, targetCol);
    setShowMoveMenu(false);
    const colName = INITIAL_COLUMNS.find((c) => c.id === targetCol)?.title || targetCol;
    addToast(`"${task.title}" -> ${colName} ga ko'chirildi`, 'info');
  };

  const handleAddSubtaskSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubtaskTitle.trim()) return;
    addSubtask(task.id, newSubtaskTitle.trim());
    setNewSubtaskTitle('');
    setShowAddSubtask(false);
    addToast('Kichik vazifa qo\'shildi', 'info');
  };

  const getPriorityBadge = () => {
    switch (task.priority) {
      case 'urgent':
        return (
          <span className="priority-badge priority-urgent">
            <Flame className="w-3 h-3 mr-1" /> Shoshilinch
          </span>
        );
      case 'high':
        return <span className="priority-badge priority-high">Yuqori</span>;
      case 'medium':
        return <span className="priority-badge priority-medium">O'rta</span>;
      case 'low':
        return <span className="priority-badge priority-low">Past</span>;
    }
  };

  const currentColIndex = INITIAL_COLUMNS.findIndex((c) => c.id === task.status);

  return (
    <div className={`task-card ${task.status === 'done' ? 'task-card-done' : ''}`}>
      {/* Top Header: Category & Priority */}
      <div className="task-header">
        <div className="flex items-center gap-1.5 flex-wrap">
          {task.category && (
            <span className="task-category-pill">
              <Tag className="w-3 h-3 mr-1" />
              {task.category}
            </span>
          )}
          {getPriorityBadge()}
        </div>

        {/* Action Menu */}
        <div className="relative">
          <button
            onClick={() => setShowMoveMenu(!showMoveMenu)}
            className="card-action-btn"
            title="Amallar"
            aria-label="Vazifa amallari"
          >
            <MoreVertical className="w-4 h-4" />
          </button>

          {showMoveMenu && (
            <div className="card-dropdown">
              <button
                onClick={() => {
                  setShowMoveMenu(false);
                  onEdit(task);
                }}
                className="dropdown-item"
              >
                <Edit2 className="w-3.5 h-3.5" />
                <span>Tahrirlash</span>
              </button>

              <div className="dropdown-divider" />
              <span className="dropdown-subtitle">Ustunga ko'chirish:</span>

              {INITIAL_COLUMNS.map((col) => (
                <button
                  key={col.id}
                  onClick={() => handleMove(col.id)}
                  disabled={col.id === task.status}
                  className={`dropdown-item ${col.id === task.status ? 'opacity-40 cursor-default' : ''}`}
                >
                  <ArrowRight className="w-3.5 h-3.5" />
                  <span>{col.title}</span>
                </button>
              ))}

              <div className="dropdown-divider" />
              <button
                onClick={() => {
                  setShowMoveMenu(false);
                  handleDelete();
                }}
                className="dropdown-item text-rose-500"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>O'chirish</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Title */}
      <h3 className={`task-title ${task.status === 'done' ? 'line-through text-muted' : ''}`}>
        {task.title}
      </h3>

      {/* Description */}
      {task.description && (
        <p className="task-description">
          {task.description}
        </p>
      )}

      {/* Subtasks Summary / Checklist */}
      {totalSubtasks > 0 && (
        <div className="subtasks-container">
          <div
            className="subtasks-toggle-header"
            onClick={() => setExpanded(!expanded)}
          >
            <div className="flex items-center gap-1.5 text-xs text-muted">
              <CheckSquare className="w-3.5 h-3.5 text-accent" />
              <span>
                Qismlar: {completedSubtasks}/{totalSubtasks}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <div className="subtasks-mini-progress">
                <div
                  className="subtasks-mini-progress-fill"
                  style={{ width: `${subtaskProgress}%` }}
                />
              </div>
              <button className="subtasks-chevron-btn" aria-label="Kengaytirish">
                {expanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          {/* Subtasks Details List */}
          {expanded && (
            <div className="subtasks-list">
              {task.subtasks.map((sub) => (
                <div key={sub.id} className="subtask-item">
                  <label className="subtask-label">
                    <input
                      type="checkbox"
                      checked={sub.completed}
                      onChange={() => toggleSubtask(task.id, sub.id)}
                      className="subtask-checkbox"
                    />
                    <span className={sub.completed ? 'subtask-done' : ''}>
                      {sub.title}
                    </span>
                  </label>
                  <button
                    onClick={() => deleteSubtask(task.id, sub.id)}
                    className="subtask-delete-btn"
                    title="O'chirish"
                  >
                    <Trash2 className="w-3 h-3 text-muted hover:text-rose-500" />
                  </button>
                </div>
              ))}

              {/* Add subtask inline */}
              {showAddSubtask ? (
                <form onSubmit={handleAddSubtaskSubmit} className="subtask-add-form">
                  <input
                    type="text"
                    placeholder="Kichik vazifa nomi..."
                    value={newSubtaskTitle}
                    onChange={(e) => setNewSubtaskTitle(e.target.value)}
                    className="subtask-inline-input"
                    autoFocus
                  />
                  <div className="flex gap-1">
                    <button type="submit" className="subtask-inline-btn submit">
                      +
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowAddSubtask(false)}
                      className="subtask-inline-btn cancel"
                    >
                      ✕
                    </button>
                  </div>
                </form>
              ) : (
                <button
                  onClick={() => setShowAddSubtask(true)}
                  className="subtask-add-prompt"
                >
                  <Plus className="w-3 h-3" />
                  <span>Qism qo'shish</span>
                </button>
              )}
            </div>
          )}
        </div>
      )}

      {/* Card Footer: Due date & Quick shift arrows */}
      <div className="task-footer">
        <div className="flex items-center gap-2">
          {task.dueDate ? (
            <span className={`task-date-pill ${isOverdue ? 'date-overdue' : ''}`}>
              {isOverdue ? <Clock className="w-3 h-3 mr-1 text-rose-500" /> : <Calendar className="w-3 h-3 mr-1" />}
              {task.dueDate}
              {isOverdue && ' (Muddati o\'tgan)'}
            </span>
          ) : (
            <span className="task-date-pill text-muted">
              Muddat yo'q
            </span>
          )}
        </div>

        {/* Quick Shift buttons */}
        <div className="flex items-center gap-1">
          {currentColIndex > 0 && (
            <button
              onClick={() => handleMove(INITIAL_COLUMNS[currentColIndex - 1].id)}
              className="quick-move-btn"
              title={`Oldingi: ${INITIAL_COLUMNS[currentColIndex - 1].title}`}
              aria-label="Oldingi ustunga surish"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
            </button>
          )}

          {currentColIndex < INITIAL_COLUMNS.length - 1 && (
            <button
              onClick={() => handleMove(INITIAL_COLUMNS[currentColIndex + 1].id)}
              className="quick-move-btn"
              title={`Keyingi: ${INITIAL_COLUMNS[currentColIndex + 1].title}`}
              aria-label="Keyingi ustunga surish"
            >
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}

          {task.status !== 'done' && (
            <button
              onClick={() => handleMove('done')}
              className="quick-move-btn quick-done-btn"
              title="Yakunlash"
              aria-label="Bajarildi deb belgilash"
            >
              <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};