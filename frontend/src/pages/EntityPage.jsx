import { useCallback, useEffect, useState } from 'react'
import { Navigate, useParams } from 'react-router-dom'
import { api } from '../api/client'
import { useAuth } from '../context/AuthContext'
import { ACCESS, ENTITIES } from '../config/entities'
import DataTable from '../components/DataTable'
import FormModal from '../components/FormModal'

const btn = 'rounded-lg px-2.5 py-1 text-xs font-medium'

// One generic list + add/edit/delete page, driven by config/entities.js
export default function EntityPage() {
  const { entity } = useParams()
  const { user } = useAuth()
  const cfg = ENTITIES[entity]

  const [rows, setRows] = useState([])
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('')
  const [editing, setEditing] = useState(null) // null | 'new' | row
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(true)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      setRows(await api.list(entity))
      setMessage('')
    } catch (err) {
      setMessage(err.message)
    }
    setLoading(false)
  }, [entity])

  useEffect(() => { load() }, [load])

  if (!cfg || !ACCESS[user.role].includes(entity)) return <Navigate to="/" replace />

  const canEdit = cfg.roles.includes(user.role)
  const canAdd = canEdit || entity === 'requests'
  const statusField = cfg.fields.find((f) => f.k === 'status')

  const visible = rows.filter(
    (r) => JSON.stringify(r).toLowerCase().includes(search.toLowerCase()) && (!status || r.status === status),
  )

  const run = async (fn, okMsg) => {
    try { await fn(); setMessage(okMsg); load() } catch (err) { setMessage(err.message) }
  }

  const save = async (body) => {
    if (editing === 'new') await api.create(entity, body)
    else await api.update(entity, editing[cfg.id], body)
    setEditing(null)
    setMessage('Saved')
    load()
  }

  return (
    <>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-semibold">{cfg.title}</h1>
        <div className="flex flex-wrap items-center gap-2">
          <input type="search" value={search} onChange={(e) => setSearch(e.target.value)} placeholder={`Search ${cfg.title.toLowerCase()}`}
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm" />
          {statusField && (
            <select value={status} onChange={(e) => setStatus(e.target.value)} className="rounded-lg border border-slate-300 px-3 py-2 text-sm">
              <option value="">All statuses</option>
              {statusField.opts.map((o) => <option key={o}>{o}</option>)}
            </select>
          )}
          {canAdd && (
            <button onClick={() => setEditing('new')} className="rounded-lg bg-teal-700 px-4 py-2 text-sm font-medium text-white hover:bg-teal-800">Add new</button>
          )}
        </div>
      </div>

      {message && <p className="mb-4 rounded-lg bg-slate-200 px-3 py-2 text-sm">{message}</p>}

      <div className="rounded-xl border border-slate-200 bg-white p-4">
        {loading ? (
          <div className="py-10 text-center text-slate-500">Loading...</div>
        ) : (
          <DataTable rows={visible} columns={cfg.cols} renderActions={(r) => {
            const id = r[cfg.id]
            return (
              <>
                {cfg.approve && user.role === 'Admin' && r.status === 'Pending' && (
                  <>
                    <button onClick={() => run(() => api.approveBooking(id), 'Booking approved')} className={`${btn} bg-teal-700 text-white`}>Approve</button>
                    <button onClick={() => run(() => api.rejectBooking(id), 'Booking rejected')} className={`${btn} bg-red-600 text-white`}>Reject</button>
                  </>
                )}
                {canEdit && (
                  <>
                    <button onClick={() => setEditing(r)} className={`${btn} border border-slate-300`}>Edit</button>
                    <button
                      onClick={() => confirm('Delete this record? This cannot be undone.') && run(() => api.remove(entity, id), 'Deleted')}
                      className={`${btn} bg-red-600 text-white`}>Delete</button>
                  </>
                )}
              </>
            )
          }} />
        )}
      </div>

      {editing && (
        <FormModal
          title={`${editing === 'new' ? 'Add' : 'Edit'} ${cfg.title.toLowerCase()}`}
          fields={cfg.fields}
          row={editing === 'new' ? null : editing}
          onSave={save}
          onClose={() => setEditing(null)}
        />
      )}
    </>
  )
}
