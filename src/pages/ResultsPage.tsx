import { ArrowLeft, TrendingUp, Calendar, PieChart, ArrowRight } from 'lucide-react'

interface Stock {
  ticker: string
  name: string
  percentage: number
  logo: string
}

const DUMMY_STOCKS: Stock[] = [
  { ticker: 'AAPL', name: 'Apple Inc.', percentage: 25, logo: '🍎' },
  { ticker: 'MSFT', name: 'Microsoft', percentage: 13, logo: '🪟' },
  { ticker: 'ALLE', name: 'Allegion', percentage: 23, logo: '🔒' },
  { ticker: 'NDSN', name: 'Nordson', percentage: 39, logo: '🏭' }
]

interface ResultsPageProps {
  selectedIndustries: string[]
  riskLevel: number
  onBack: () => void
  onNext: () => void
  onNavigate?: (page: 'results' | 'historical' | 'projection') => void
}

export default function ResultsPage({ selectedIndustries, riskLevel, onBack, onNext, onNavigate }: ResultsPageProps) {
  const currentDate = new Date().toLocaleDateString('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  })

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
                className="px-3 py-1 rounded-lg text-sm font-semibold bg-white/5 text-white/90 border border-white/10 hover:bg-white/10"
                aria-current="page"
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
                className="px-3 py-1 rounded-lg text-sm font-medium text-white/80 hover:bg-white/10"
              >
                Histórico
              </button>
            </div>
            <TrendingUp className="w-8 h-8 text-[#88D498]" />
            <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
              Sistema de Recomendación
            </h1>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-8 border border-white/20 mb-8">
            <div className="flex items-center gap-3 mb-6">
              <Calendar className="w-6 h-6 text-[#1A936F]" />
              <h2 className="text-3xl font-bold text-[#114B5F]">
                Portafolio Recomendado
              </h2>
            </div>
            <p className="text-gray-600 flex items-center gap-2">
              <span className="font-medium">Fecha de generación:</span>
              <span className="px-3 py-1 bg-gradient-to-r from-[#1A936F]/10 to-[#88D498]/10
                             rounded-lg text-[#114B5F] font-semibold border border-[#88D498]/30">
                {currentDate}
              </span>
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {DUMMY_STOCKS.map((stock, index) => (
              <div
                key={stock.ticker}
                className="group relative"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20
                              hover:shadow-2xl hover:border-[#88D498]/50 transition-all duration-300
                              transform hover:-translate-y-2 p-6">
                  <div className="flex flex-col items-center">
                    <div className="relative mb-4">
                      <div className="absolute inset-0 bg-gradient-to-br from-[#1A936F] to-[#88D498]
                                    rounded-2xl blur-xl opacity-30 group-hover:opacity-50 transition-opacity"></div>
                      <div className="relative w-24 h-24 bg-gradient-to-br from-[#114B5F] to-[#1A936F]
                                    rounded-2xl flex items-center justify-center shadow-lg">
                        <span className="text-5xl">{stock.logo}</span>
                      </div>
                    </div>

                    <h3 className="text-2xl font-bold text-[#114B5F] mb-1">
                      {stock.ticker}
                    </h3>
                    <p className="text-sm text-gray-600 mb-4">
                      {stock.name}
                    </p>

                    <div className="w-full pt-4 border-t border-gray-200">
                      <div className="flex items-baseline justify-center gap-1">
                        <span className="text-4xl font-bold bg-gradient-to-r from-[#1A936F] to-[#88D498]
                                       bg-clip-text text-transparent">
                          {stock.percentage}
                        </span>
                        <span className="text-2xl font-semibold text-[#1A936F]">%</span>
                      </div>
                      <p className="text-xs text-gray-500 text-center mt-1">del portafolio</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-white/20">
              <div className="flex items-center gap-3 mb-4">
                <PieChart className="w-5 h-5 text-[#1A936F]" />
                <h3 className="text-xl font-bold text-[#114B5F]">Parámetros de Selección</h3>
              </div>
              <div className="space-y-3">
                <div>
                  <p className="text-sm font-semibold text-gray-500 mb-2">Industrias Seleccionadas</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedIndustries.map(industry => (
                      <span
                        key={industry}
                        className="px-3 py-1.5 bg-gradient-to-r from-[#1A936F] to-[#88D498]
                                 text-white text-sm font-medium rounded-lg shadow-sm"
                      >
                        {industry}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="pt-3 border-t border-gray-200">
                  <p className="text-sm font-semibold text-gray-500 mb-2">Nivel de Riesgo</p>
                  <div className="flex items-center gap-3">
                    <div className="flex-1 bg-gray-200 rounded-full h-3 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-[#1A936F] to-[#88D498] rounded-full
                                 transition-all duration-500"
                        style={{ width: `${(riskLevel / 30) * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-2xl font-bold text-[#114B5F] min-w-[60px] text-right">
                      {riskLevel}%
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-[#1A936F] to-[#88D498] rounded-2xl shadow-xl p-6
                          border border-white/20 text-white">
              <h3 className="text-xl font-bold mb-4">Resumen del Portafolio</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center pb-3 border-b border-white/20">
                  <span className="text-white/90">Total de activos</span>
                  <span className="text-2xl font-bold">{DUMMY_STOCKS.length}</span>
                </div>
                <div className="flex justify-between items-center pb-3 border-b border-white/20">
                  <span className="text-white/90">Diversificación</span>
                  <span className="text-2xl font-bold">{selectedIndustries.length} sectores</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-white/90">Perfil de riesgo</span>
                  <span className="text-lg font-bold">
                    {riskLevel < 10 ? 'Conservador' : riskLevel < 20 ? 'Moderado' : 'Agresivo'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={onNext}
            className="group w-full px-8 py-5 bg-gradient-to-r from-[#1A936F] to-[#88D498]
                     text-white font-bold text-2xl rounded-2xl shadow-2xl
                     hover:shadow-[#1A936F]/50 transform hover:scale-105
                     transition-all duration-300 overflow-hidden"
          >
            <span className="relative z-10 flex items-center justify-center gap-3">
              Ver Proyección de Crecimiento
              <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-[#88D498] to-[#1A936F]
                          opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </button>
        </div>
      </div>
    </div>
  )
}
