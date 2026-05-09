// src/pages/Dashboard.jsx
import { useState, useMemo } from 'react'
import { Plus, Search, ListTodo, CheckCircle2, Clock, SlidersHorizontal, Loader2 } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useTasks } from '../hooks/useTasks'
import TaskCard from '../components/TaskCard'
import TaskForm from '../components/TaskForm'
import toast from 'react-hot-toast'

const FILTERS = ['All', 'Pending', 'Completed']

export default function Dashboard() {
  const { currentUser }    = useAuth()
  const { tasks, loading, createTask, updateTask, deleteTask, toggleStatus } = useTasks()

  const [showForm, setShowForm]   = useState(false)
  const [editTask, setEditTask]   = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [filter, setFilter]       = useState('All')
  const [priority, setPriority]   = useState('All')
  const [search, setSearch]       = useState('')

  // Stats
  const total     = tasks.length
  const completed = tasks.filter((t) => t.status === 'Completed').length
  const pending   = total - completed

  // Filtered tasks
  const filtered = useMemo(() => {
    return tasks.filter((t) => {
      const matchStatus   = filter   === 'All' || t.status   === filter
      const matchPriority = priority === 'All' || t.priority === priority.toLowerCase()
      const matchSearch   = !search  || t.title.toLowerCase().includes(search.toLowerCase()) ||
                            t.description?.toLowerCase().includes(search.toLowerCase())
      return matchStatus && matchPriority && matchSearch
    })
  }, [tasks, filter, priority, search])

  async function handleCreate(data) {
    setSubmitting(true)
    try {
      await createTask(data)
      toast.success('Task created!')
      setShowForm(false)
    } catch { toast.error('Failed to create task') }
    finally { setSubmitting(false) }
  }

  async function handleUpdate(data) {
    setSubmitting(true)
    try {
      await updateTask(editTask.id, data)
      toast.success('Task updated!')
      setEditTask(null)
    } catch { toast.error('Failed to update task') }
    finally { setSubmitting(false) }
  }

  async function handleDelete(id) {
    try {
      await deleteTask(id)
      toast.success('Task deleted')
    } catch { toast.error('Failed to delete task') }
  }

  const firstName = currentUser?.displayName?.split(' ')[0] || 'there'

  return (
    <div className="min-h-screen bg-surface-50 dark:bg-surface-950">
      <div className="max-w-6xl mx-auto px-4 py-8">

        {/* Greeting */}
        <div className="mb-8 animate-fade-in">
          <h1 className="font-display text-3xl font-bold text-surface-900 dark:text-white">
            Hey, {firstName} 👋
          </h1>
          <p className="text-surface-500 dark:text-surface-400 mt-1">
            {pending > 0
              ? `You have ${pending} pending task${pending > 1 ? 's' : ''} to tackle`
              : 'All caught up! Great work.'}
          </p>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { label: 'Total',     value: total,     icon: ListTodo,    color: 'text-surface-600 dark:text-surface-300', bg: 'bg-surface-100 dark:bg-surface-800' },
            { label: 'Pending',   value: pending,   icon: Clock,       color: 'text-amber-600 dark:text-amber-400',     bg: 'bg-amber-50 dark:bg-amber-900/20'   },
            { label: 'Completed', value: completed, icon: CheckCircle2, color: 'text-brand-600 dark:text-brand-400',   bg: 'bg-brand-50 dark:bg-brand-900/20'   },
          ].map(({ label, value, icon: Icon, color, bg }) => (
            <div
              key={label}
              className="bg-white dark:bg-surface-900 rounded-2xl border border-surface-200 dark:border-surface-700 p-5 flex items-center gap-4"
            >
              <div className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center shrink-0`}>
                <Icon size={20} className={color} />
              </div>
              <div>
                <p className="text-2xl font-display font-bold text-surface-900 dark:text-white">{value}</p>
                <p className="text-xs text-surface-500 dark:text-surface-400 font-medium">{label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          {/* Search */}
          <div className="relative flex-1">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-surface-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search tasks..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-900 text-surface-900 dark:text-white placeholder-surface-400 focus:outline-none focus:ring-2 focus:ring-brand-400 text-sm transition"
            />
          </div>

          {/* Status filter */}
          <div className="flex bg-white dark:bg-surface-900 rounded-xl border border-surface-200 dark:border-surface-700 p-1">
            {FILTERS.map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${
                  filter === f
                    ? 'bg-brand-500 text-white shadow-sm'
                    : 'text-surface-500 dark:text-surface-400 hover:text-surface-700 dark:hover:text-surface-200'
                }`}
              >
                {f}
              </button>
            ))}
          </div>

          {/* Priority filter */}
          <div className="flex items-center gap-2 bg-white dark:bg-surface-900 rounded-xl border border-surface-200 dark:border-surface-700 px-3 py-1.5">
            <SlidersHorizontal size={14} className="text-surface-400" />
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className="bg-transparent text-sm text-surface-700 dark:text-surface-300 focus:outline-none"
            >
              <option value="All">All Priority</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>

          {/* New task */}
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-600 text-white text-sm font-semibold transition shadow-sm shadow-brand-500/30 shrink-0"
          >
            <Plus size={16} />
            New Task
          </button>
        </div>

        {/* Task list */}
        {loading ? (
          <div className="flex items-center justify-center py-20 text-surface-400 dark:text-surface-500">
            <Loader2 size={28} className="animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-16 h-16 rounded-2xl bg-surface-100 dark:bg-surface-800 flex items-center justify-center mb-4">
              <ListTodo size={28} className="text-surface-400" />
            </div>
            <h3 className="font-semibold text-surface-900 dark:text-white mb-1">
              {tasks.length === 0 ? 'No tasks yet' : 'No tasks match your filters'}
            </h3>
            <p className="text-sm text-surface-500 dark:text-surface-400">
              {tasks.length === 0 ? 'Click "New Task" to get started' : 'Try adjusting your search or filters'}
            </p>
          </div>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onEdit={setEditTask}
                onDelete={handleDelete}
                onToggle={toggleStatus}
              />
            ))}
          </div>
        )}
      </div>

      {/* Modals */}
      {showForm && (
        <TaskForm
          onSubmit={handleCreate}
          onCancel={() => setShowForm(false)}
          loading={submitting}
        />
      )}
      {editTask && (
        <TaskForm
          initialData={editTask}
          onSubmit={handleUpdate}
          onCancel={() => setEditTask(null)}
          loading={submitting}
        />
      )}
    </div>
  )
}
