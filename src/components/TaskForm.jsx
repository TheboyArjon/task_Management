// src/components/TaskForm.jsx
import { useState, useEffect } from 'react'
import { X, Loader2, Tag } from 'lucide-react'

const PRIORITIES = [
  { value: 'low',    label: 'Low',    color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'   },
  { value: 'medium', label: 'Medium', color: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300' },
  { value: 'high',   label: 'High',   color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300'     },
]

export default function TaskForm({ onSubmit, onCancel, initialData, loading }) {
  const [form, setForm] = useState({
    title:       '',
    description: '',
    priority:    'medium',
    status:      'Pending',
  })

  useEffect(() => {
    if (initialData) {
      setForm({
        title:       initialData.title       || '',
        description: initialData.description || '',
        priority:    initialData.priority    || 'medium',
        status:      initialData.status      || 'Pending',
      })
    }
  }, [initialData])

  function handleChange(e) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }))
  }

  function handleSubmit(e) {
    e.preventDefault()
    if (!form.title.trim()) return
    onSubmit(form)
  }

  const inputCls =
    'w-full px-3.5 py-2.5 rounded-xl border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-800 text-surface-900 dark:text-white placeholder-surface-400 focus:outline-none focus:ring-2 focus:ring-brand-400 text-sm transition'

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-md bg-white dark:bg-surface-900 rounded-2xl shadow-2xl border border-surface-200 dark:border-surface-700 animate-scale-in">
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-surface-100 dark:border-surface-800">
          <h2 className="font-display text-lg font-bold text-surface-900 dark:text-white">
            {initialData ? 'Edit Task' : 'New Task'}
          </h2>
          <button
            onClick={onCancel}
            className="w-8 h-8 rounded-full flex items-center justify-center text-surface-400 hover:text-surface-600 dark:hover:text-surface-200 hover:bg-surface-100 dark:hover:bg-surface-800 transition"
          >
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Title */}
          <div>
            <label className="block text-xs font-semibold text-surface-500 dark:text-surface-400 uppercase tracking-wider mb-1.5">
              Title *
            </label>
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="What needs to be done?"
              required
              className={inputCls}
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-surface-500 dark:text-surface-400 uppercase tracking-wider mb-1.5">
              Description
            </label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Add more details..."
              rows={3}
              className={`${inputCls} resize-none`}
            />
          </div>

          {/* Priority */}
          <div>
            <label className="block text-xs font-semibold text-surface-500 dark:text-surface-400 uppercase tracking-wider mb-1.5">
              <Tag size={11} className="inline mr-1" />Priority
            </label>
            <div className="flex gap-2">
              {PRIORITIES.map((p) => (
                <button
                  key={p.value}
                  type="button"
                  onClick={() => setForm((f) => ({ ...f, priority: p.value }))}
                  className={`flex-1 py-2 rounded-lg text-xs font-semibold transition border-2 ${
                    form.priority === p.value
                      ? `${p.color} border-current`
                      : 'border-transparent bg-surface-100 dark:bg-surface-800 text-surface-500 dark:text-surface-400 hover:bg-surface-200 dark:hover:bg-surface-700'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* Status — only for edit */}
          {initialData && (
            <div>
              <label className="block text-xs font-semibold text-surface-500 dark:text-surface-400 uppercase tracking-wider mb-1.5">
                Status
              </label>
              <select
                name="status"
                value={form.status}
                onChange={handleChange}
                className={inputCls}
              >
                <option value="Pending">Pending</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 py-2.5 rounded-xl border border-surface-200 dark:border-surface-700 text-sm font-semibold text-surface-600 dark:text-surface-400 hover:bg-surface-50 dark:hover:bg-surface-800 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !form.title.trim()}
              className="flex-1 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-600 text-white text-sm font-semibold transition flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading && <Loader2 size={15} className="animate-spin" />}
              {initialData ? 'Save Changes' : 'Create Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
