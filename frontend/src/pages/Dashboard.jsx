import { useEffect, useState } from 'react'
import { api } from '../api/client'
import DataTable from '../components/DataTable'

const sum = (rows, k) => rows.reduce((a, r) => a + Number(r[k] || 0), 0)

function Kpi({ value, label, tone = 'border-teal-600' }) {
  return (
    <div className={`rounded-xl border border-slate-200 border-l-4 bg-white p-4 ${tone}`}>
      <div className="text-3xl font-semibold">{value}</div>
      <div className="text-sm text-slate-500">{label}</div>
    </div>
  )
}

export default function Dashboard() {
  const [data, setData] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    Promise.all([api.view('lab_health'), api.view('expiring_licenses'), api.view('lab_usage')])
      .then(([health, licenses, usage]) => setData({ health, licenses, usage }))
      .catch((e) => setError(e.message))
  }, [])

  if (error) return <p className="rounded-lg bg-red-50 px-3 py-2 text-red-700">{error}</p>
  if (!data) return <p className="text-slate-500">Loading...</p>

  const { health, licenses, usage } = data
  const cols = (rows) => Object.keys(rows[0] || {})

  return (
    <>
      <h1 className="mb-5 text-2xl font-semibold">Dashboard</h1>
      <div className="mb-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Kpi value={health.length} label="Labs" />
        <Kpi value={sum(health, 'total_computers')} label="Computers" />
        <Kpi value={sum(health, 'under_maintenance')} label="Under maintenance" tone="border-amber-500" />
        <Kpi value={licenses.length} label="Licences expiring in 60 days" tone="border-red-500" />
      </div>
      {[['Lab health', health], ['Licences expiring soon', licenses], ['Most-used labs', usage]].map(([title, rows]) => (
        <section key={title} className="mb-5 rounded-xl border border-slate-200 bg-white p-4">
          <h2 className="mb-2 text-lg font-semibold">{title}</h2>
          <DataTable rows={rows} columns={cols(rows)} />
        </section>
      ))}
    </>
  )
}
