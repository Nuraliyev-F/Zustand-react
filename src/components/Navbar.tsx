import React, { useState } from 'react';
import { useThemeStore } from '../store/themeStore';
import { useTaskStore } from '../store/taskStore';
import { useToastStore } from '../store/toastStore';
import type { AccentColor } from '../types';
import {
  Sun,
  Moon,
  Plus,
  RotateCcw,
  Download,
  Palette,
  Check,
  KanbanSquare
} from 'lucide-react';

interface NavbarProps {
  onOpenNewTaskModal: () => void;
}

const ACCENT_COLORS: { id: AccentColor; label: string; bg: string }[] = [
  { id: 'indigo', label: 'Indigo', bg: '#6366f1' },
  { id: 'emerald', label: 'Emerald', bg: '#10b981' },
  { id: 'violet', label: 'Violet', bg: '#8b5cf6' },
  { id: 'rose', label: 'Rose', bg: '#f43f5e' },
  { id: 'amber', label: 'Amber', bg: '#f59e0b' },
  { id: 'cyan', label: 'Cyan', bg: '#06b6d4' },
];

export const Navbar: React.FC<NavbarProps> = ({ onOpenNewTaskModal }) => {
  const { theme, toggleTheme, accent, setAccent } = useThemeStore();
  const { resetToDefaults, tasks } = useTaskStore();
  const addToast = useToastStore((state) => state.addToast);

  const [showColorPicker, setShowColorPicker] = useState(false);

  const handleReset = () => {
    if (window.confirm('Barcha vazifalarni dastlabki holatga qaytarishni xohlaysizmi?')) {
      resetToDefaults();
      addToast('Dastlabki namunaviy ma\'lumotlar tiklandi', 'info');
    }
  };

  const handleExport = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(tasks, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `taskflow-export-${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    addToast('Vazifalar JSON fayliga eksport qilindi', 'success');
  };

  return (
    <header className="app-header">
      <div className="header-container">
        {/* Brand */}
        <div className="header-brand">
          <div className="brand-icon-wrapper">
            <KanbanSquare className="w-6 h-6 brand-icon" />
          </div>
          <div>
            <div className="brand-title-row">
              <h1 className="brand-title">TaskFlow <span className="brand-badge">Pro</span></h1>
              <span className="zustand-pill">Zustand + TS</span>
            </div>
            <p className="brand-subtitle">Smart Kanban & Productivity Workspace</p>
          </div>
        </div>

        {/* Actions */}
        <div className="header-actions">
          {/* Accent picker */}
          <div className="relative">
            <button
              onClick={() => setShowColorPicker(!showColorPicker)}
              className="icon-btn"
              title="Ranglar palitrasi"
              aria-label="Ranglar palitrasi"
            >
              <Palette className="w-5 h-5" />
            </button>

            {showColorPicker && (
              <div className="color-picker-dropdown">
                <span className="dropdown-title">Aktsent rangi</span>
                <div className="color-dots-grid">
                  {ACCENT_COLORS.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => {
                        setAccent(c.id);
                        setShowColorPicker(false);
                        addToast(`Rang o'zgartirildi: ${c.label}`, 'info');
                      }}
                      className="color-dot"
                      style={{ backgroundColor: c.bg }}
                      title={c.label}
                    >
                      {accent === c.id && <Check className="w-3.5 h-3.5 text-white" />}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="icon-btn"
            title={theme === 'dark' ? 'Yorug\' rejimga o\'tish' : 'Qorong\'i rejimga o\'tish'}
            aria-label="Mavzuni o'zgartirish"
          >
            {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>

          {/* Export button */}
          <button
            onClick={handleExport}
            className="btn btn-secondary btn-icon"
            title="JSON formatida yuklab olish"
          >
            <Download className="w-4 h-4" />
            <span className="btn-text">Eksport</span>
          </button>

          {/* Reset button */}
          <button
            onClick={handleReset}
            className="btn btn-secondary btn-icon"
            title="Dastlabki ma'lumotlarni tiklash"
          >
            <RotateCcw className="w-4 h-4" />
            <span className="btn-text">Tiklash</span>
          </button>

          {/* Add Task Button */}
          <button
            onClick={onOpenNewTaskModal}
            className="btn btn-primary btn-icon"
          >
            <Plus className="w-5 h-5" />
            <span>Yangi vazifa</span>
          </button>
        </div>
      </div>
    </header>
  );
};