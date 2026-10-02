import { useEffect, useState } from 'react';
import { useThemeStore } from './store/themeStore';
import { Navbar } from './components/Navbar';
import { StatsBar } from './components/StatsBar';
import { FilterBar } from './components/FilterBar';
import { KanbanBoard } from './components/KanbanBoard';
import { TaskModal } from './components/TaskModal';
import { ToastContainer } from './components/ToastContainer';
import type { Task, ColumnId } from './types';

function App() {
  const { theme, accent } = useThemeStore();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState<Task | null>(null);
  const [defaultColumnId, setDefaultColumnId] = useState<ColumnId>('todo');

  // Sync theme & accent with HTML attributes
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    document.documentElement.setAttribute('data-accent', accent);
  }, [theme, accent]);

  const handleOpenNewTaskModal = (columnId: ColumnId = 'todo') => {
    setTaskToEdit(null);
    setDefaultColumnId(columnId);
    setIsModalOpen(true);
  };

  const handleOpenEditTaskModal = (task: Task) => {
    setTaskToEdit(task);
    setDefaultColumnId(task.status);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setTaskToEdit(null);
  };

  return (
    <div className="app-container">
      {/* Toast Notifications */}
      <ToastContainer />

      {/* Top Navigation */}
      <Navbar onOpenNewTaskModal={() => handleOpenNewTaskModal('todo')} />

      {/* Main Workspace */}
      <main className="main-content">
        {/* Real-time Metrics & Stats */}
        <StatsBar />

        {/* Search, Filters, and Sorting */}
        <FilterBar />

        {/* Kanban Board Columns */}
        <KanbanBoard
          onEditTask={handleOpenEditTaskModal}
          onAddTaskToColumn={handleOpenNewTaskModal}
        />
      </main>

      {/* Task Create / Edit Modal */}
      <TaskModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        taskToEdit={taskToEdit}
        defaultColumnId={defaultColumnId}
      />
    </div>
  );
}

export default App;