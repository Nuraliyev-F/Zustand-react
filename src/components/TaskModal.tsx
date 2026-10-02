import React, { useState } from 'react';
import type { Task, ColumnId, Priority, SubTask } from '../types';
import { useTaskStore, INITIAL_COLUMNS } from '../store/taskStore';
import { useToastStore } from '../store/toastStore';
import { X, Plus, Trash2, CheckCircle2 } from 'lucide-react';

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  taskToEdit?: Task | null;
  defaultColumnId?: ColumnId;
}

const CATEGORIES = [
  'Frontend',
  'Backend',
  'UI/UX',
  'Architecture',
  'TypeScript',
  'DevOps',
  'Bug Fix',
  'Testing',
  'Other',
];

interface TaskModalFormProps {
  onClose: () => void;
  taskToEdit?: Task | null;
  defaultColumnId: ColumnId;
}

const TaskModalForm: React.FC<TaskModalFormProps> = ({
  onClose,
  taskToEdit,
  defaultColumnId,
}) => {
  const { addTask, updateTask } = useTaskStore();
  const addToast = useToastStore((state) => state.addToast);

  const [title, setTitle] = useState(taskToEdit ? taskToEdit.title : '');
  const [description, setDescription] = useState(taskToEdit?.description || '');
  const [priority, setPriority] = useState<Priority>(taskToEdit?.priority || 'medium');
  const [status, setStatus] = useState<ColumnId>(taskToEdit?.status || defaultColumnId);
  const [category, setCategory] = useState(taskToEdit?.category || 'Frontend');
  const [dueDate, setDueDate] = useState(() => {
    if (taskToEdit?.dueDate) return taskToEdit.dueDate;
    const d = new Date();
    d.setDate(d.getDate() + 3);
    return d.toISOString().slice(0, 10);
  });
  const [subtasks, setSubtasks] = useState<SubTask[]>(() =>
    taskToEdit ? [...taskToEdit.subtasks] : []
  );
  const [newSubtaskTitle, setNewSubtaskTitle] = useState('');

  const handleAddSubtask = () => {
    if (!newSubtaskTitle.trim()) return;
    const newSub: SubTask = {
      id: 'sub-' + Date.now().toString(36) + Math.random().toString(36).substring(2, 5),
      title: newSubtaskTitle.trim(),
      completed: false,
    };
    setSubtasks([...subtasks, newSub]);
    setNewSubtaskTitle('');
  };

  const handleRemoveSubtask = (id: string) => {
    setSubtasks(subtasks.filter((s) => s.id !== id));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      alert('Iltimos, vazifa nomini kiriting!');
      return;
    }

    if (taskToEdit) {
      updateTask(taskToEdit.id, {
        title: title.trim(),
        description: description.trim(),
        priority,
        status,
        category,
        dueDate: dueDate || undefined,
        subtasks,
      });
      addToast(`"${title.trim()}" muvaffaqiyatli yangilandi`, 'success');
    } else {
      addTask({
        title: title.trim(),
        description: description.trim(),
        priority,
        status,
        category,
        dueDate: dueDate || undefined,
        subtasks,
      });
      addToast(`Yangi vazifa yaratildi: "${title.trim()}"`, 'success');
    }

    onClose();
  };

  return (
    <div className="modal-card" onClick={(e) => e.stopPropagation()}>
      {/* Modal Header */}
      <div className="modal-header">
        <div>
          <h2 className="modal-title">
            {taskToEdit ? 'Vazifani tahrirlash' : 'Yangi vazifa yaratish'}
          </h2>
          <p className="modal-subtitle">
            {taskToEdit ? 'Mavjud vazifa parametrlarini o\'zgartiring' : 'Kanban doskasiga yangi vazifa qo\'shing'}
          </p>
        </div>
        <button onClick={onClose} className="modal-close-btn" aria-label="Yopish">
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Modal Form */}
      <form onSubmit={handleSubmit} className="modal-form">
        {/* Title */}
        <div className="form-group">
          <label className="form-label">
            Vazifa nomi <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            placeholder="Masalan: API bilan integratsiyani ulash..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="form-input"
            autoFocus
          />
        </div>

        {/* Description */}
        <div className="form-group">
          <label className="form-label">Tavsif (ixtiyoriy)</label>
          <textarea
            placeholder="Vazifa haqida batafsil ma'lumot kiriting..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="form-textarea"
          />
        </div>

        {/* Row: Status & Priority */}
        <div className="form-row">
          <div className="form-group flex-1">
            <label className="form-label">Holat (Ustun)</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as ColumnId)}
              className="form-select"
            >
              {INITIAL_COLUMNS.map((col) => (
                <option key={col.id} value={col.id}>
                  {col.title}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group flex-1">
            <label className="form-label">Muhimlik darajasi</label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value as Priority)}
              className="form-select"
            >
              <option value="low">🟢 Past (Low)</option>
              <option value="medium">🟡 O'rta (Medium)</option>
              <option value="high">🟠 Yuqori (High)</option>
              <option value="urgent">🔴 Shoshilinch (Urgent)</option>
            </select>
          </div>
        </div>

        {/* Row: Category & Due Date */}
        <div className="form-row">
          <div className="form-group flex-1">
            <label className="form-label">Kategoriya</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="form-select"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group flex-1">
            <label className="form-label">Yakunlash muddati</label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="form-input"
            />
          </div>
        </div>

        {/* Subtasks Section */}
        <div className="form-group">
          <label className="form-label">Kichik qismlar (Subtasks / Checklist)</label>
          <div className="subtask-input-row">
            <input
              type="text"
              placeholder="Qism qo'shish (masalan: UI tayyorlash)..."
              value={newSubtaskTitle}
              onChange={(e) => setNewSubtaskTitle(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddSubtask();
                }
              }}
              className="form-input flex-1"
            />
            <button
              type="button"
              onClick={handleAddSubtask}
              className="btn btn-secondary btn-icon"
            >
              <Plus className="w-4 h-4" />
              <span>Qo'shish</span>
            </button>
          </div>

          {/* Subtasks Preview */}
          {subtasks.length > 0 && (
            <div className="modal-subtask-list">
              {subtasks.map((sub, index) => (
                <div key={sub.id} className="modal-subtask-item">
                  <span className="text-xs font-semibold text-muted">#{index + 1}</span>
                  <span className="text-sm flex-1">{sub.title}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveSubtask(sub.id)}
                    className="text-muted hover:text-rose-500"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer Buttons */}
        <div className="modal-footer">
          <button
            type="button"
            onClick={onClose}
            className="btn btn-secondary"
          >
            Bekor qilish
          </button>
          <button
            type="submit"
            className="btn btn-primary btn-icon"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>{taskToEdit ? 'O\'zgarishlarni saqlash' : 'Vazifa yaratish'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export const TaskModal: React.FC<TaskModalProps> = ({
  isOpen,
  onClose,
  taskToEdit,
  defaultColumnId = 'todo',
}) => {
  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <TaskModalForm
        key={taskToEdit ? taskToEdit.id : `new-${defaultColumnId}`}
        onClose={onClose}
        taskToEdit={taskToEdit}
        defaultColumnId={defaultColumnId}
      />
    </div>
  );
};