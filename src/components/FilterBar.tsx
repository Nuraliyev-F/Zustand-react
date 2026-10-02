import React from 'react';
import { useTaskStore } from '../store/taskStore';
import type { Priority, SortOption } from '../types';
import { Search, ArrowUpDown, X, Filter } from 'lucide-react';

export const FilterBar: React.FC = () => {
  const { filters, setSearchQuery, setPriorityFilter, setCategoryFilter, setSortBy, toggleSortOrder, resetFilters, tasks } = useTaskStore();

  // Extract distinct categories from tasks
  const categories = Array.from(new Set(tasks.map((t) => t.category).filter(Boolean)));

  const isFiltered =
    filters.searchQuery.trim() !== '' ||
    filters.priority !== 'all' ||
    filters.category !== 'all' ||
    filters.sortBy !== 'createdAt';

  return (
    <div className="filter-bar">
      {/* Search Input */}
      <div className="search-box">
        <Search className="search-icon w-4 h-4" />
        <input
          type="text"
          placeholder="Vazifalarni qidirish (nomi yoki tavsifi)..."
          value={filters.searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-input"
        />
        {filters.searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="search-clear-btn"
            title="Tozalash"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      <div className="filters-group">
        {/* Priority Filter */}
        <div className="filter-item">
          <label className="filter-label">Muhimlik:</label>
          <select
            value={filters.priority}
            onChange={(e) => setPriorityFilter(e.target.value as Priority | 'all')}
            className="filter-select"
          >
            <option value="all">Barchasi</option>
            <option value="urgent">🔴 Shoshilinch</option>
            <option value="high">🟠 Yuqori</option>
            <option value="medium">🟡 O'rta</option>
            <option value="low">🟢 Past</option>
          </select>
        </div>

        {/* Category Filter */}
        {categories.length > 0 && (
          <div className="filter-item">
            <label className="filter-label">Kategoriya:</label>
            <select
              value={filters.category}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="filter-select"
            >
              <option value="all">Barchasi</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Sort By */}
        <div className="filter-item">
          <label className="filter-label">Saralash:</label>
          <select
            value={filters.sortBy}
            onChange={(e) => setSortBy(e.target.value as SortOption)}
            className="filter-select"
          >
            <option value="createdAt">Yaratilgan sana</option>
            <option value="dueDate">Muddat bo'yicha</option>
            <option value="priority">Muhimlik darajasi</option>
            <option value="title">Alifbo bo'yicha</option>
          </select>
        </div>

        {/* Sort Order Toggle */}
        <button
          onClick={toggleSortOrder}
          className="btn btn-secondary btn-icon-only"
          title={`Tartib: ${filters.sortOrder === 'asc' ? 'O\'sish tartibida' : 'Kamayish tartibida'}`}
          aria-label="Tartibni o'zgartirish"
        >
          <ArrowUpDown className="w-4 h-4" />
        </button>

        {/* Reset Filters button */}
        {isFiltered && (
          <button
            onClick={resetFilters}
            className="btn btn-outline btn-icon"
            title="Filtrlarni bekor qilish"
          >
            <Filter className="w-3.5 h-3.5" />
            <span>Tozalash</span>
          </button>
        )}
      </div>
    </div>
  );
};