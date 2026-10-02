import React from 'react';
import { useTaskStore } from '../store/taskStore';
import { useToastStore } from '../store/toastStore';
import {
  CheckCircle2,
  Clock,
  ListTodo,
  AlertOctagon,
  TrendingUp,
  Trash2
} from 'lucide-react';

export const StatsBar: React.FC = () => {
  const tasks = useTaskStore((state) => state.tasks);
  const clearAllTasks = useTaskStore((state) => state.clearAllTasks);
  const addToast = useToastStore((state) => state.addToast);

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.status === 'done').length;
  const inProgressTasks = tasks.filter((t) => t.status === 'in_progress').length;
  const urgentTasks = tasks.filter((t) => t.priority === 'urgent' && t.status !== 'done').length;

  const completionPercent = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const handleClear = () => {
    if (totalTasks === 0) return;
    if (window.confirm('Haqiqatan ham barcha vazifalarni tozalamoqchimisiz?')) {
      clearAllTasks();
      addToast('Barcha vazifalar tozalandi', 'warning');
    }
  };

  return (
    <section className="stats-section">
      <div className="stats-grid">
        {/* Total Tasks */}
        <div className="stat-card">
          <div className="stat-icon-box stat-blue">
            <ListTodo className="w-5 h-5" />
          </div>
          <div className="stat-info">
            <span className="stat-label">Jami vazifalar</span>
            <span className="stat-value">{totalTasks}</span>
          </div>
        </div>

        {/* In Progress */}
        <div className="stat-card">
          <div className="stat-icon-box stat-cyan">
            <Clock className="w-5 h-5" />
          </div>
          <div className="stat-info">
            <span className="stat-label">Jarayonda</span>
            <span className="stat-value">{inProgressTasks}</span>
          </div>
        </div>

        {/* Completed */}
        <div className="stat-card">
          <div className="stat-icon-box stat-emerald">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div className="stat-info">
            <span className="stat-label">Yakunlangan</span>
            <span className="stat-value">{completedTasks}</span>
          </div>
        </div>

        {/* Urgent Attention */}
        <div className="stat-card">
          <div className="stat-icon-box stat-rose">
            <AlertOctagon className="w-5 h-5" />
          </div>
          <div className="stat-info">
            <span className="stat-label">Shoshilinch</span>
            <span className="stat-value">{urgentTasks}</span>
          </div>
        </div>

        {/* Progress % */}
        <div className="stat-card stat-card-progress">
          <div className="stat-progress-header">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-muted">
              <TrendingUp className="w-4 h-4 text-accent" />
              <span>Samaradorlik</span>
            </div>
            <span className="stat-percent-text">{completionPercent}%</span>
          </div>
          <div className="progress-track">
            <div
              className="progress-fill"
              style={{ width: `${completionPercent}%` }}
            />
          </div>
        </div>

        {/* Quick actions */}
        {totalTasks > 0 && (
          <button
            onClick={handleClear}
            className="stat-action-btn"
            title="Barchasini tozalash"
            aria-label="Barcha vazifalarni tozalash"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>
    </section>
  );
};