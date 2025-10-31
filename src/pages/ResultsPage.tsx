import { useState } from 'react'
import { ArrowLeft, TrendingUp, Calendar, PieChart, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react'

interface Stock {
  ticker: string
  percentage: number
  logo_link: string
}

interface PortfolioData {
  weights: Record<string, number>
  expected_annual_return: number
  annual_volatility: number
  sharpe_ratio: number
}

interface RiskRanges {
  min_volatility: number
  max_volatility: number
  sharpe_ratio_volatility: number
  last_available_date: string
}

interface ResultsPageProps {
  selectedIndustries: string[]
  riskLevel: number
  stocks: Stock[]
  portfolioData: PortfolioData
  lastAvailableDate: string
  globalRiskRanges: RiskRanges | null
  onBack: () => void
  onNext: () => void
  onNavigate?: (page: 'results' | 'historical' | 'projection') => void
}

export default function ResultsPage({ selectedIndustries, riskLevel, stocks, portfolioData, globalRiskRanges, lastAvailableDate,onBack, onNext, onNavigate }: ResultsPageProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(false)
  
  const maxVisibleCards = 5
  const showCarousel = stocks.length > maxVisibleCards
  const maxIndex = stocks.length - maxVisibleCards

  const nextSlide = () => {
    if (isTransitioning || currentIndex >= maxIndex) return
    setIsTransitioning(true)
    setCurrentIndex(prev => Math.min(prev + 1, maxIndex))
    setTimeout(() => setIsTransitioning(false), 500)
  }

  const prevSlide = () => {
    if (isTransitioning || currentIndex <= 0) return
    setIsTransitioning(true)
    setCurrentIndex(prev => Math.max(prev - 1, 0))
    setTimeout(() => setIsTransitioning(false), 500)
  }

  const goToIndex = (index: number) => {
    if (isTransitioning) return
    setIsTransitioning(true)
    setCurrentIndex(index)
    setTimeout(() => setIsTransitioning(false), 500)
  }

  const currentDate = new Date().toLocaleDateString('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  })


  const currentRiskLevelText = (() => {
    if (!globalRiskRanges) return 'Moderado'

    const range = globalRiskRanges.max_volatility - globalRiskRanges.min_volatility
    const conservativeThreshold = globalRiskRanges.min_volatility + (range * 0.25)
    const moderateThreshold = globalRiskRanges.min_volatility + (range * 0.50)

    if (portfolioData.annual_volatility < conservativeThreshold) return 'Conservador'
    if (portfolioData.annual_volatility < moderateThreshold) return 'Moderado'
    return 'Agresivo'
  })()

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
          <div className="flex items-center justify-between w-full">
            {/* Left side */}
            <div className="flex items-center gap-3">
              <Calendar className="w-6 h-6 text-[#1A936F]" />
              <h2 className="text-3xl font-bold text-[#114B5F]">
                Portafolio Recomendado
              </h2>
            </div>

            {/* Right side */}
            <p className="text-gray-600 flex items-center gap-2">
              <span className="font-medium">Con datos hasta la fecha:</span>
              <span className="px-3 py-1 bg-gradient-to-r from-[#1A936F]/10 to-[#88D498]/10
                              rounded-lg text-[#114B5F] font-semibold border border-[#88D498]/30">
                {lastAvailableDate}
              </span>
            </p>
          </div>
        </div>


          <div className="relative mb-8">
            {showCarousel && (
              <>
                <button
                  onClick={prevSlide}
                  disabled={currentIndex === 0 || isTransitioning}
                  className={`absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10
                           bg-white/90 hover:bg-white p-3 rounded-full shadow-xl
                           border border-gray-200 hover:border-[#88D498]
                           transition-all duration-300 hover:scale-110
                           ${currentIndex === 0 ? 'opacity-40 cursor-not-allowed' : ''}`}
                  aria-label="Anterior"
                >
                  <ChevronLeft className="w-6 h-6 text-[#114B5F]" />
                </button>

                <button
                  onClick={nextSlide}
                  disabled={currentIndex >= maxIndex || isTransitioning}
                  className={`absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10
                           bg-white/90 hover:bg-white p-3 rounded-full shadow-xl
                           border border-gray-200 hover:border-[#88D498]
                           transition-all duration-300 hover:scale-110
                           ${currentIndex >= maxIndex ? 'opacity-40 cursor-not-allowed' : ''}`}
                  aria-label="Siguiente"
                >
                  <ChevronRight className="w-6 h-6 text-[#114B5F]" />
                </button>
              </>
            )}

            <div className={`overflow-hidden ${stocks.length <= maxVisibleCards ? "flex justify-center items-center gap-6" : ""}`}>
              <div
                className={`transition-transform duration-500 ease-out ${
                  stocks.length <= maxVisibleCards
                    ? 'flex justify-center items-center gap-6' // ✅ Center items if fewer
                    : 'grid grid-cols-5 gap-6'    // ✅ Carousel layout if more
                } my-2`}
                style={
                  stocks.length > maxVisibleCards
                    ? {
                        transform: `translateX(-${currentIndex * (100 / maxVisibleCards)}%)`,
                        gridTemplateColumns: `repeat(${stocks.length}, minmax(0, 1fr))`,
                        width: `${(stocks.length / maxVisibleCards) * 100}%`
                      }
                    : {
                      width: '90%'
                    }
                }
              >
                {stocks.map((stock, index) => (
                  <div
                    key={stock.ticker}
                    className="group relative w-full" style={ stocks.length <=  maxVisibleCards ? { maxWidth: '250px' } : {} }
                  >
                    <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20
                                  hover:shadow-2xl hover:border-[#88D498]/50 transition-all duration-300
                                  transform hover:-translate-y-2 p-6"
                                  >
                      <div className="flex flex-col items-center">
                        <div className="relative mb-4">
                          <div className="absolute inset-0 bg-gradient-to-br from-[#1A936F] to-[#88D498]
                                        rounded-2xl blur-xl opacity-30 group-hover:opacity-50 transition-opacity"></div>
                          <div className="relative w-24 h-24 rounded-2xl flex items-center justify-center shadow-lg overflow-hidden">
                            <img
                              src={stock.logo_link}
                              alt={`${stock.ticker} logo`}
                              className="w-20 h-20 object-contain"
                              onError={(e) => {
                                e.currentTarget.style.display = 'none'
                                e.currentTarget.parentElement!.innerHTML = `<span class="text-3xl font-bold text-[#114B5F]">${stock.ticker}</span>`
                              }}
                            />
                          </div>
                        </div>

                        <h3 className="text-2xl font-bold text-[#114B5F] mb-1">
                          {stock.ticker}
                        </h3>

                        <div className="w-full pt-4 border-t border-gray-200">
                          <div className="flex items-baseline justify-center gap-1">
                            <span className="text-4xl font-bold bg-gradient-to-r from-[#1A936F] to-[#88D498]
                                           bg-clip-text text-transparent">
                              {stock.percentage.toFixed(2)}
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
            </div>

            {showCarousel && (
                <div className="flex justify-center gap-2 mt-6">
                {Array.from({ length: (Math.ceil(maxIndex / 2)  + 1) }).map((_, idx) => (
                  <button
                  key={idx}
                  onClick={() => goToIndex(idx)}
                  disabled={isTransitioning}
                  className={`h-2.5 rounded-full transition-all duration-300 ${
                    idx === currentIndex
                    ? 'bg-[#1A936F] w-8'
                    : 'bg-white/50 hover:bg-white/80 w-2.5'
                  }`}
                  aria-label={`Ir a posición ${idx + 1}`}
                  />
                ))}
                </div>
            )}
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
                        style={{ width: `${(portfolioData.annual_volatility) * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-2xl font-bold text-[#114B5F] min-w-[80px] text-right">
                      {(portfolioData.annual_volatility * 100).toFixed(2)}%
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
                  <span className="text-2xl font-bold">{stocks.length}</span>
                </div>
                <div className="flex justify-between items-center pb-3 border-b border-white/20">
                  <span className="text-white/90">Diversificación</span>
                  <span className="text-2xl font-bold">{selectedIndustries.length} sectores</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-white/90">Perfil de riesgo</span>
                  <span className="text-lg font-bold">
                    {currentRiskLevelText}
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
                     transition-all duration-300 overflow-hidden relative"
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