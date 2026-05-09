// src/components/TaskCard.jsx
import { useState } from 'react'
import { Check, Pencil, Trash2, Clock, Flag, RotateCcw } from 'lucide-react'
import { format } from 'date-fns'

const PRIORITY_STYLES = {
  low:    { dot: 'bg-blue-400',   badge: 'text-blue-600 dark:text-blue-400',   label: 'Low'    },
  medium: { dot: 'bg-amber-400',  badge: 'text-amber-600 dark:text-amber-400', label: 'Medium' },
  high:   { dot: 'bg-red-400',    badge: 'text-red-600 dark:text-red-400',     label: 'High'   },
}

export default function TaskCard({ task, onEdit, onDelete, onToggle }) {
  const [deleting, setDeleting] = useState(false)
  const p = PRIORITY_STYLES[task.priority] || PRIORITY_STYLES.medium

  const createdDate = task.createdAt?.toDate
    ? format(task.createdAt.toDate(), 'MMM d, yyyy')
    : 'Just now'

  const isCompleted = task.status === 'Completed'

  async function handleDelete() {
    if (!confirm('Delete this task?')) return
    setDeleting(true)
    try { await onDelete(task.id) } finally { setDeleting(false) }
  }

  return (
    <article
      className={`group relative rounded-2xl border p-5 transition-all duration-200 animate-slide-up ${
        isCompleted
          ? 'bg-surface-50 dark:bg-surface-850 border-surface-200 dark:border-surface-700 opacity-75'
          : 'bg-white dark:bg-surface-900 border-surface-200 dark:border-surface-700 hover:shadow-md hover:-translate-y-0.5'
      }`}
    >
      {/* Priority stripe */}
      <div className={`absolute left-0 top-4 bottom-4 w-1 rounded-full ${p.dot}`} />

      <div className="pl-3">
        {/* Top row */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <h3
              className={`font-semibold text-base leading-snug ${
                isCompleted
                  ? 'line-through text-surface-400 dark:text-surface-500'
                  : 'text-surface-900 dark:text-white'
              }`}
            >
              {task.title}
            </h3>

            {task.description && (
              <p className="mt-1 text-sm text-surface-500 dark:text-surface-400 line-clamp-2">
                {task.description}
              </p>
            )}
          </div>

          {/* Action buttons — visible on hover */}
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
            <button
              onClick={() => onEdit(task)}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-surface-400 hover:text-brand-600 hover:bg-brand-50 dark:hover:bg-brand-900/20 transition"
              title="Edit"
            >
              <Pencil size={14} />
            </button>
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-surface-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition disabled:opacity-50"
              title="Delete"
            >
              <Trash2 size={14} />
            </button>
          </div>
        </div>

        {/* Bottom row */}
        <div className="mt-3 flex items-center gap-3 flex-wrap">
          {/* Status toggle */}
          <button
            onClick={() => onToggle(task.id, task.status)}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold transition ${
              isCompleted
                ? 'bg-brand-100 text-brand-700 dark:bg-brand-900/30 dark:text-brand-300 hover:bg-brand-200 dark:hover:bg-brand-900/50'
                : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300 hover:bg-amber-200'
            }`}
          >
            {isCompleted ? <RotateCcw size={10} /> : <Check size={10} />}
            {task.status}
          </button>

          {/* Priority */}
          <span className={`flex items-center gap-1 text-xs font-medium ${p.badge}`}>
            <Flag size={10} />
            {p.label}
          </span>

          {/* Date */}
          <span className="ml-auto flex items-center gap-1 text-xs text-surface-400 dark:text-surface-500 font-mono">
            <Clock size={10} />
            {createdDate}
          </span>
        </div>
      </div>
    </article>
  )
}
