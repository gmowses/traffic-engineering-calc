import { useState, useEffect } from 'react'
import { Sun, Moon, Languages, Activity, Plus, Trash2 } from 'lucide-react'

const translations = {
  en: {
    title: 'ISP Traffic Engineering Calculator',
    subtitle: 'Calculate committed bandwidth, peak traffic, oversubscription ratios, and recommended uplinks per plan.',
    plans: 'Subscriber Plans',
    plansDesc: 'Add your speed plans and subscriber distribution',
    addPlan: 'Add Plan',
    speed: 'Speed (Mbps)',
    subscribers: 'Subscribers',
    results: 'Results',
    resultsDesc: 'Traffic engineering output',
    avgUtil: 'Average utilization',
    peakFactor: 'Peak factor',
    totalSubs: 'Total subscribers',
    committedBw: 'Committed bandwidth',
    avgBw: 'Average bandwidth (utilization)',
    peakBw: 'Peak bandwidth',
    recUplink: 'Recommended uplink',
    oversubRatio: 'Oversubscription ratio',
    perPlan: 'Per plan breakdown',
    plan: 'Plan',
    subs: 'Subs',
    committed: 'Committed',
    avg: 'Avg',
    peak: 'Peak',
    oversub: 'Oversub',
    note: 'Typical ISP utilization: 30-40% average, 2-3x peak factor. Recommendation adds 20% headroom.',
    builtBy: 'Built by',
    removePlan: 'Remove plan',
    planName: 'Plan name',
    gbps: 'Gbps',
    mbps: 'Mbps',
  },
  pt: {
    title: 'Calculadora de Engenharia de Trafego ISP',
    subtitle: 'Calcule banda comprometida, pico de trafego, ratios de oversubscricao e uplinks recomendados por plano.',
    plans: 'Planos de Assinantes',
    plansDesc: 'Adicione seus planos de velocidade e distribuicao de assinantes',
    addPlan: 'Adicionar Plano',
    speed: 'Velocidade (Mbps)',
    subscribers: 'Assinantes',
    results: 'Resultados',
    resultsDesc: 'Saida de engenharia de trafego',
    avgUtil: 'Utilizacao media',
    peakFactor: 'Fator de pico',
    totalSubs: 'Total de assinantes',
    committedBw: 'Banda comprometida',
    avgBw: 'Banda media (utilizacao)',
    peakBw: 'Banda de pico',
    recUplink: 'Uplink recomendado',
    oversubRatio: 'Ratio de oversubscricao',
    perPlan: 'Detalhamento por plano',
    plan: 'Plano',
    subs: 'Assinantes',
    committed: 'Comprometido',
    avg: 'Media',
    peak: 'Pico',
    oversub: 'Oversub',
    note: 'Utilizacao tipica ISP: 30-40% media, fator de pico 2-3x. Recomendacao adiciona 20% de margem.',
    builtBy: 'Criado por',
    removePlan: 'Remover plano',
    planName: 'Nome do plano',
    gbps: 'Gbps',
    mbps: 'Mbps',
  },
} as const

type Lang = keyof typeof translations

interface Plan {
  id: string
  name: string
  speed: number
  subscribers: number
}

function fmtBw(mbps: number): string {
  if (mbps >= 1000) return `${(mbps / 1000).toFixed(2)} Gbps`
  return `${Math.round(mbps)} Mbps`
}

const DEFAULT_PLANS: Plan[] = [
  { id: '1', name: '10M', speed: 10, subscribers: 500 },
  { id: '2', name: '50M', speed: 50, subscribers: 1500 },
  { id: '3', name: '100M', speed: 100, subscribers: 2000 },
  { id: '4', name: '200M', speed: 200, subscribers: 800 },
  { id: '5', name: '500M', speed: 500, subscribers: 200 },
]

export default function TrafficEngineeringCalc() {
  const [lang, setLang] = useState<Lang>(() => (navigator.language.startsWith('pt') ? 'pt' : 'en'))
  const [dark, setDark] = useState(() => window.matchMedia('(prefers-color-scheme: dark)').matches)
  const [plans, setPlans] = useState<Plan[]>(DEFAULT_PLANS)
  const [avgUtil, setAvgUtil] = useState(35)
  const [peakFactor, setPeakFactor] = useState(2.5)

  const t = translations[lang]

  useEffect(() => { document.documentElement.classList.toggle('dark', dark) }, [dark])

  const totalSubs = plans.reduce((s, p) => s + p.subscribers, 0)
  const committedMbps = plans.reduce((s, p) => s + p.speed * p.subscribers, 0)
  const avgMbps = committedMbps * (avgUtil / 100)
  const peakMbps = avgMbps * peakFactor
  const recUplinkMbps = peakMbps * 1.2

  const addPlan = () => {
    const id = Date.now().toString()
    setPlans(p => [...p, { id, name: '100M', speed: 100, subscribers: 100 }])
  }

  const removePlan = (id: string) => setPlans(p => p.filter(pl => pl.id !== id))

  const updatePlan = (id: string, field: keyof Plan, value: string | number) => {
    setPlans(p => p.map(pl => pl.id === id ? { ...pl, [field]: value } : pl))
  }

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-[#09090b] text-zinc-900 dark:text-zinc-100 transition-colors">
      <header className="border-b border-zinc-200 dark:border-zinc-800 px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center">
              <Activity size={18} className="text-white" />
            </div>
            <span className="font-semibold">Traffic Engineering</span>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => setLang(l => l === 'en' ? 'pt' : 'en')} className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">
              <Languages size={14} />{lang.toUpperCase()}
            </button>
            <button onClick={() => setDark(d => !d)} className="p-2 rounded-lg border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">
              {dark ? <Sun size={16} /> : <Moon size={16} />}
            </button>
            <a href="https://github.com/gmowses/traffic-engineering-calc" target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>
            </a>
          </div>
        </div>
      </header>

      <main className="flex-1 px-6 py-10">
        <div className="max-w-5xl mx-auto space-y-8">
          <div>
            <h1 className="text-3xl font-bold">{t.title}</h1>
            <p className="mt-2 text-zinc-500 dark:text-zinc-400">{t.subtitle}</p>
          </div>

          <div className="grid gap-6 lg:grid-cols-5">
            {/* Plans */}
            <div className="lg:col-span-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-semibold">{t.plans}</h2>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400">{t.plansDesc}</p>
                </div>
                <button onClick={addPlan} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500 text-white text-sm font-medium hover:bg-emerald-600 transition-colors">
                  <Plus size={14} />{t.addPlan}
                </button>
              </div>

              <div className="space-y-2">
                <div className="grid grid-cols-12 gap-2 text-[10px] uppercase tracking-wide text-zinc-400 px-1">
                  <span className="col-span-3">{t.planName}</span>
                  <span className="col-span-4">{t.speed}</span>
                  <span className="col-span-4">{t.subscribers}</span>
                  <span className="col-span-1"></span>
                </div>
                {plans.map(plan => (
                  <div key={plan.id} className="grid grid-cols-12 gap-2 items-center">
                    <input
                      value={plan.name}
                      onChange={e => updatePlan(plan.id, 'name', e.target.value)}
                      className="col-span-3 rounded-md border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                    <input
                      type="number"
                      value={plan.speed}
                      onChange={e => updatePlan(plan.id, 'speed', Number(e.target.value))}
                      className="col-span-4 rounded-md border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                    <input
                      type="number"
                      value={plan.subscribers}
                      onChange={e => updatePlan(plan.id, 'subscribers', Number(e.target.value))}
                      className="col-span-4 rounded-md border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                    <button onClick={() => removePlan(plan.id)} className="col-span-1 p-1 rounded text-zinc-400 hover:text-red-500 transition-colors" title={t.removePlan}>
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>

              {/* Sliders */}
              <div className="space-y-4 pt-2">
                {[
                  { label: `${t.avgUtil}: ${avgUtil}%`, value: avgUtil, set: setAvgUtil, min: 10, max: 80, step: 5, accent: 'emerald' },
                  { label: `${t.peakFactor}: ${peakFactor}x`, value: peakFactor, set: setPeakFactor, min: 1, max: 5, step: 0.5, accent: 'emerald' },
                ].map(({ label, value, set, min, max, step }) => (
                  <div key={label} className="space-y-1">
                    <div className="flex justify-between">
                      <label className="text-sm font-medium">{label}</label>
                    </div>
                    <input
                      type="range"
                      min={min}
                      max={max}
                      step={step}
                      value={value}
                      onChange={e => set(Number(e.target.value))}
                      className="h-1.5 w-full cursor-pointer accent-emerald-500"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Results */}
            <div className="lg:col-span-2 space-y-4">
              <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 space-y-3">
                <h2 className="font-semibold">{t.results}</h2>
                {[
                  { label: t.totalSubs, value: totalSubs.toLocaleString() },
                  { label: t.committedBw, value: fmtBw(committedMbps) },
                  { label: t.avgBw, value: fmtBw(avgMbps), accent: true },
                  { label: t.peakBw, value: fmtBw(peakMbps), accent: true },
                  { label: t.recUplink, value: fmtBw(recUplinkMbps), accent: true },
                  { label: t.oversubRatio, value: `${(committedMbps / recUplinkMbps).toFixed(1)}:1` },
                ].map(({ label, value, accent }) => (
                  <div key={label} className="flex items-center justify-between py-1.5 border-b border-zinc-100 dark:border-zinc-800 last:border-0">
                    <span className="text-xs text-zinc-500 dark:text-zinc-400">{label}</span>
                    <span className={`text-sm font-bold tabular-nums ${accent ? 'text-emerald-500' : ''}`}>{value}</span>
                  </div>
                ))}
              </div>
              <p className="text-xs text-zinc-400 px-1">{t.note}</p>
            </div>
          </div>

          {/* Per plan table */}
          <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 space-y-4">
            <h2 className="font-semibold">{t.perPlan}</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-zinc-200 dark:border-zinc-700">
                    {[t.plan, t.speed, t.subs, t.committed, t.avg, t.peak, t.oversub].map(h => (
                      <th key={h} className="text-left py-2 px-3 text-[10px] uppercase tracking-wide text-zinc-400 font-medium">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {plans.map(plan => {
                    const planCommitted = plan.speed * plan.subscribers
                    const planAvg = planCommitted * (avgUtil / 100)
                    const planPeak = planAvg * peakFactor
                    const planOversub = planCommitted / (planPeak * 1.2)
                    return (
                      <tr key={plan.id} className="border-b border-zinc-100 dark:border-zinc-800 last:border-0 hover:bg-zinc-50 dark:hover:bg-zinc-800/30 transition-colors">
                        <td className="py-2.5 px-3 font-semibold">{plan.name}</td>
                        <td className="py-2.5 px-3 tabular-nums">{plan.speed} Mbps</td>
                        <td className="py-2.5 px-3 tabular-nums">{plan.subscribers.toLocaleString()}</td>
                        <td className="py-2.5 px-3 tabular-nums">{fmtBw(planCommitted)}</td>
                        <td className="py-2.5 px-3 tabular-nums text-emerald-600 dark:text-emerald-400">{fmtBw(planAvg)}</td>
                        <td className="py-2.5 px-3 tabular-nums text-emerald-600 dark:text-emerald-400">{fmtBw(planPeak)}</td>
                        <td className="py-2.5 px-3 tabular-nums">{planOversub.toFixed(1)}:1</td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>

      <footer className="border-t border-zinc-200 dark:border-zinc-800 px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between text-xs text-zinc-400">
          <span>{t.builtBy} <a href="https://github.com/gmowses" className="text-zinc-600 dark:text-zinc-300 hover:text-emerald-500 transition-colors">Gabriel Mowses</a></span>
          <span>MIT License</span>
        </div>
      </footer>
    </div>
  )
}
