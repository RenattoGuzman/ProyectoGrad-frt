import { useState } from 'react'
import { TrendingUp, Plus, X, BarChart3, ArrowLeft } from 'lucide-react'

interface Stock {
  ticker: string
  name: string
  percentage: number
}

interface HistoricalPageProps {
  initialStocks: Stock[]
  onBack: () => void
  onNavigate?: (page: 'results' | 'historical' | 'projection') => void
}

export default function HistoricalPage({ initialStocks, onBack, onNavigate }: HistoricalPageProps) {
  const [stocks, setStocks] = useState<Stock[]>(initialStocks)
  const [startDate, setStartDate] = useState<string>('2024-01-01')
  const [endDate, setEndDate] = useState<string>('2025-01-01')
  const [newTicker, setNewTicker] = useState<string>('')
  const [newPercentage, setNewPercentage] = useState<string>('')

  const handleAddStock = () => {
    if (!newTicker || !newPercentage) {
      alert('Por favor ingrese ticker y porcentaje')
      return
    }

    const percentage = parseFloat(newPercentage)
    if (isNaN(percentage) || percentage <= 0 || percentage > 100) {
      alert('Por favor ingrese un porcentaje válido entre 1 y 100')
      return
    }

    const totalPercentage = stocks.reduce((sum, s) => sum + s.percentage, 0) + percentage
    if (totalPercentage > 100) {
      alert('El total de porcentajes no puede exceder 100%')
      return
    }

    setStocks([...stocks, {
      ticker: newTicker.toUpperCase(),
      name: newTicker.toUpperCase(),
      percentage: percentage
    }])
    setNewTicker('')
    setNewPercentage('')
  }

  const handleRemoveStock = (ticker: string) => {
    setStocks(stocks.filter(s => s.ticker !== ticker))
  }

  const handlePercentageChange = (ticker: string, newPercentage: string) => {
    const percentage = parseFloat(newPercentage)
    if (isNaN(percentage)) return

    setStocks(stocks.map(s =>
      s.ticker === ticker ? { ...s, percentage } : s
    ))
  }

  const generateHistoricalData = () => {
    const start = new Date(startDate)
    const end = new Date(endDate)
    const daysDiff = Math.floor((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))

    if (daysDiff <= 0) return []

    const points = Math.min(daysDiff, 100)
    const data = []
    const initialValue = 10000

    for (let i = 0; i <= points; i++) {
      const progress = i / points
      const volatility = Math.sin(i * 0.3) * 0.05
      const trend = 0.12 * progress
      const value = initialValue * (1 + trend + volatility)

      const currentDate = new Date(start.getTime() + (daysDiff * progress * 24 * 60 * 60 * 1000))

      data.push({
        date: currentDate.toLocaleDateString('es-ES', { month: 'short', year: '2-digit' }),
        value: Math.round(value)
      })
    }

    return data
  }

  const historicalData = generateHistoricalData()
  const totalPercentage = stocks.reduce((sum, s) => sum + s.percentage, 0)

  const initialValue = historicalData[0]?.value || 10000
  const finalValue = historicalData[historicalData.length - 1]?.value || 10000
  const totalReturn = finalValue - initialValue
  const returnPercentage = ((totalReturn / initialValue) * 100).toFixed(2)

  const maxValue = Math.max(...historicalData.map(d => d.value), initialValue)
  const minValue = Math.min(...historicalData.map(d => d.value), initialValue)

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#114B5F] via-[#0d3d4d] to-[#1A936F]">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjAzKSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-40"></div>

      <div className="relative">
        <div className="bg-white/5 backdrop-blur-sm border-b border-white/10 py-8 px-6">
          <div className="mx-auto relative flex items-center justify-center gap-3">
            <button
              onClick={onBack}
              className="absolute left-0 hover:bg-white/10 p-2.5 rounded-xl transition-all
                       border border-white/20 hover:border-white/40 group"
              aria-label="Volver"
            >
              <ArrowLeft className="w-6 h-6 text-white group-hover:text-[#88D498] transition-colors" />
            </button>
            {/* NavBar on the right */}
            <div className="absolute right-0 flex items-center gap-2">
              <button
                onClick={() => onNavigate?.('results')}
                className="px-3 py-1 rounded-lg text-sm font-medium text-white/80 hover:bg-white/10"
              >
                Resultados
              </button>
              <button
                onClick={() => onNavigate?.('projection')}
                className="px-3 py-1 rounded-lg text-sm font-medium text-white/80 hover:bg-white/10"
              >
                Proyección
              </button>
              <button
                onClick={() => onNavigate?.('historical')}
                className="px-3 py-1 rounded-lg text-sm font-semibold bg-white/5 text-white/90 border border-white/10 hover:bg-white/10"
                aria-current="page"
              >
                Histórico
              </button>
            </div>
            <BarChart3 className="w-8 h-8 text-[#88D498]" />
            <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
              Análisis Retrospectivo
            </h1>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="text-center mb-8">
            <p className="text-xl text-white/80">
              Analiza el rendimiento histórico y personaliza tu portafolio
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-6 mb-8">
            <div className="lg:col-span-2 bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-white/20">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-[#114B5F]">Rendimiento Histórico</h3>
                <div className="flex gap-4">
                  <div>
                    <label className="text-xs text-gray-600 font-medium block mb-1">Desde</label>
                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="px-3 py-2 border-2 border-gray-300 rounded-lg text-sm focus:border-[#1A936F] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-600 font-medium block mb-1">Hasta</label>
                    <input
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="px-3 py-2 border-2 border-gray-300 rounded-lg text-sm focus:border-[#1A936F] focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {historicalData.length > 0 ? (
                <>
                  <div className="relative h-80 mb-6">
                    <svg width="100%" height="100%" viewBox="0 0 800 300" preserveAspectRatio="xMidYMid meet">
                      <defs>
                        <linearGradient id="histLineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" style={{ stopColor: '#1A936F', stopOpacity: 1 }} />
                          <stop offset="100%" style={{ stopColor: '#88D498', stopOpacity: 1 }} />
                        </linearGradient>
                        <linearGradient id="histAreaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                          <stop offset="0%" style={{ stopColor: '#88D498', stopOpacity: 0.3 }} />
                          <stop offset="100%" style={{ stopColor: '#88D498', stopOpacity: 0 }} />
                        </linearGradient>
                      </defs>

                      <line x1="60" y1="250" x2="760" y2="250" stroke="#e5e7eb" strokeWidth="2" />
                      <line x1="60" y1="30" x2="60" y2="250" stroke="#e5e7eb" strokeWidth="2" />

                      {historicalData.filter((_, i) => i % Math.ceil(historicalData.length / 8) === 0).map((point, index) => {
                        const actualIndex = index * Math.ceil(historicalData.length / 8)
                        const x = 60 + (actualIndex * 700 / (historicalData.length - 1))
                        return (
                          <g key={index}>
                            <line x1={x} y1="250" x2={x} y2="255" stroke="#9ca3af" strokeWidth="1" />
                            <text x={x} y="270" textAnchor="middle" fill="#6b7280" fontSize="11">
                              {point.date}
                            </text>
                          </g>
                        )
                      })}

                      <path
                        d={historicalData.map((point, index) => {
                          const x = 60 + (index * 700 / (historicalData.length - 1))
                          const normalizedValue = (point.value - minValue) / (maxValue - minValue)
                          const y = 250 - (normalizedValue * 200)
                          return `${index === 0 ? 'M' : 'L'} ${x} ${y}`
                        }).join(' ')}
                        fill="none"
                        stroke="url(#histLineGradient)"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />

                      <path
                        d={
                          historicalData.map((point, index) => {
                            const x = 60 + (index * 700 / (historicalData.length - 1))
                            const normalizedValue = (point.value - minValue) / (maxValue - minValue)
                            const y = 250 - (normalizedValue * 200)
                            return `${index === 0 ? 'M' : 'L'} ${x} ${y}`
                          }).join(' ') + ' L 760 250 L 60 250 Z'
                        }
                        fill="url(#histAreaGradient)"
                      />

                      <circle
                        cx={60}
                        cy={250 - ((initialValue - minValue) / (maxValue - minValue) * 200)}
                        r="6"
                        fill="white"
                        stroke="#1A936F"
                        strokeWidth="3"
                      />
                      <circle
                        cx={760}
                        cy={250 - ((finalValue - minValue) / (maxValue - minValue) * 200)}
                        r="6"
                        fill="white"
                        stroke="#1A936F"
                        strokeWidth="3"
                      />
                    </svg>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="p-4 bg-gradient-to-br from-gray-50 to-white rounded-xl border border-gray-200">
                      <p className="text-sm text-gray-600 mb-1">Inversión Inicial</p>
                      <p className="text-2xl font-bold text-[#114B5F]">${initialValue.toLocaleString()}</p>
                    </div>
                    <div className="p-4 bg-gradient-to-br from-[#1A936F] to-[#88D498] rounded-xl text-white">
                      <p className="text-sm text-white/90 mb-1">Retorno Total</p>
                      <p className="text-2xl font-bold">${totalReturn.toLocaleString()}</p>
                      <p className="text-sm font-semibold">+{returnPercentage}%</p>
                    </div>
                    <div className="p-4 bg-gradient-to-br from-gray-50 to-white rounded-xl border border-gray-200">
                      <p className="text-sm text-gray-600 mb-1">Valor Final</p>
                      <p className="text-2xl font-bold text-[#114B5F]">${finalValue.toLocaleString()}</p>
                    </div>
                  </div>
                </>
              ) : (
                <div className="h-80 flex items-center justify-center text-gray-400">
                  <p>Seleccione un rango de fechas válido</p>
                </div>
              )}
            </div>

            <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-white/20">
              <h3 className="text-xl font-bold text-[#114B5F] mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-[#1A936F]" />
                Portafolio Personalizado
              </h3>

              <div className="space-y-3 mb-4 max-h-60 overflow-y-auto">
                {stocks.map(stock => (
                  <div key={stock.ticker} className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="flex-1">
                      <p className="font-bold text-[#114B5F] text-sm">{stock.ticker}</p>
                    </div>
                    <input
                      type="number"
                      value={stock.percentage}
                      onChange={(e) => handlePercentageChange(stock.ticker, e.target.value)}
                      className="w-16 px-2 py-1 text-sm border-2 border-gray-300 rounded-lg text-center focus:border-[#1A936F] focus:outline-none"
                      min="0"
                      max="100"
                    />
                    <span className="text-sm text-gray-600">%</span>
                    <button
                      onClick={() => handleRemoveStock(stock.ticker)}
                      className="p-1 hover:bg-red-100 rounded-lg transition-colors"
                    >
                      <X className="w-4 h-4 text-red-500" />
                    </button>
                  </div>
                ))}
              </div>

              <div className="mb-4 p-3 bg-gradient-to-r from-[#1A936F]/10 to-[#88D498]/10 rounded-lg border border-[#88D498]/30">
                <p className="text-sm text-gray-600">Total asignado</p>
                <p className={`text-2xl font-bold ${totalPercentage === 100 ? 'text-[#1A936F]' : totalPercentage > 100 ? 'text-red-500' : 'text-gray-700'}`}>
                  {totalPercentage.toFixed(1)}%
                </p>
              </div>

              <div className="border-t border-gray-200 pt-4">
                <p className="text-sm font-semibold text-gray-700 mb-3">Agregar Acción</p>
                <div className="space-y-2">
                  <input
                    type="text"
                    value={newTicker}
                    onChange={(e) => setNewTicker(e.target.value.toUpperCase())}
                    placeholder="Ticker (ej: TSLA)"
                    className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg text-sm focus:border-[#1A936F] focus:outline-none"
                  />
                  <div className="flex gap-2">
                    <input
                      type="number"
                      value={newPercentage}
                      onChange={(e) => setNewPercentage(e.target.value)}
                      placeholder="%"
                      className="flex-1 px-3 py-2 border-2 border-gray-300 rounded-lg text-sm focus:border-[#1A936F] focus:outline-none"
                      min="0"
                      max="100"
                    />
                    <button
                      onClick={handleAddStock}
                      className="px-4 py-2 bg-gradient-to-r from-[#1A936F] to-[#88D498] text-white rounded-lg hover:shadow-lg transition-all font-medium text-sm flex items-center gap-1"
                    >
                      <Plus className="w-4 h-4" />
                      Agregar
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
