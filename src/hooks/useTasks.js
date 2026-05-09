// src/hooks/useTasks.js
import { useState, useEffect, useCallback } from 'react'
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
  orderBy,
  onSnapshot,
  serverTimestamp,
} from 'firebase/firestore'
import { db } from '../utils/firebase'
import { useAuth } from '../context/AuthContext'

export function useTasks() {
  const { currentUser } = useAuth()
  const [tasks, setTasks]     = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState(null)

  // Real-time listener
  useEffect(() => {
    if (!currentUser) { setTasks([]); setLoading(false); return }

    const q = query(
      collection(db, 'tasks'),
      where('uid', '==', currentUser.uid),
      orderBy('createdAt', 'desc')
    )

    const unsub = onSnapshot(
      q,
      (snap) => {
        setTasks(snap.docs.map((d) => ({ id: d.id, ...d.data() })))
        setLoading(false)
      },
      (err) => { setError(err.message); setLoading(false) }
    )

    return unsub
  }, [currentUser])

  const createTask = useCallback(async ({ title, description, priority = 'medium' }) => {
    await addDoc(collection(db, 'tasks'), {
      uid: currentUser.uid,
      title:       title.trim(),
      description: description.trim(),
      priority,
      status:    'Pending',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    })
  }, [currentUser])

  const updateTask = useCallback(async (id, updates) => {
    await updateDoc(doc(db, 'tasks', id), { ...updates, updatedAt: serverTimestamp() })
  }, [])

  const deleteTask = useCallback(async (id) => {
    await deleteDoc(doc(db, 'tasks', id))
  }, [])

  const toggleStatus = useCallback(async (id, currentStatus) => {
    const next = currentStatus === 'Pending' ? 'Completed' : 'Pending'
    await updateDoc(doc(db, 'tasks', id), { status: next, updatedAt: serverTimestamp() })
  }, [])

  return { tasks, loading, error, createTask, updateTask, deleteTask, toggleStatus }
}
