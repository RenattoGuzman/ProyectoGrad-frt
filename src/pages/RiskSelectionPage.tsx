import { useState, useEffect } from 'react'
import { TrendingUp, ArrowLeft, Target, Shield, Zap, Sparkles, Settings } from 'lucide-react'
import LoadingPage from './LoadingPage'
import { API_LINK } from '../variables'


interface RiskSelectionPageProps {
  selectedIndustries: string[]
  onSubmit: (riskLevel: number, mode: 'auto' | 'manual') => void
  onBack: () => void
  setLastAvailableDate: (date: string) => void
  setRiskGlobalRanges: (ranges: RiskRanges) => void
}

interface RiskRanges {
  min_volatility: number
  max_volatility: number
  sharpe_ratio_volatility: number
  last_available_date: string
}

export default function RiskSelectionPage({ selectedIndustries, onSubmit, onBack, setLastAvailableDate, setRiskGlobalRanges }: RiskSelectionPageProps) {
  const [riskMode, setRiskMode] = useState<'auto' | 'manual'>('auto')
  const [riskLevel, setRiskLevel] = useState<number>(0)
  const [riskRanges, setRiskRanges] = useState<RiskRanges | null>(null)
  const [loading, setLoading] = useState(true)

  const industriesEnglish = {
    'Servicios Financieros': 'Financial Services',
    'Tecnología': 'Technology',
    'Consumo esencial': 'Consumer Defensive',
    'Consumo discrecional': 'Consumer Cyclical',
    'Servicios de comunicación': 'Communication Services',
    'Salud': 'Healthcare',
    'Industriales': 'Industrials',
    'Bienes Raíces': 'Real Estate',
  }

  useEffect(() => {
    const fetchRiskRanges = async () => {
      try {
        setLoading(true)
        const englishIndustries = selectedIndustries.map(
          industry => industriesEnglish[industry as keyof typeof industriesEnglish]
        )
        
        const queryParams = englishIndustries
          .map(industry => `industries=${encodeURIComponent(industry)}`)
          .join('&')
        
        const response = await fetch(`${API_LINK}/portfolio/risk-ranges?${queryParams}`)
        const data: RiskRanges = await response.json()
        
        setRiskRanges(data)
        setRiskGlobalRanges(data)
        // Set initial risk level to sharpe ratio volatility for auto mode
        setRiskLevel(data.sharpe_ratio_volatility)
        setLastAvailableDate(data.last_available_date)
      } catch (error) {
        console.error('Error fetching risk ranges:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchRiskRanges()
  }, [selectedIndustries])

  const handleModeChange = (mode: 'auto' | 'manual') => {
    setRiskMode(mode)
    if (mode === 'auto' && riskRanges) {
      setRiskLevel(riskRanges.sharpe_ratio_volatility)
    }
  }

  const getRiskProfile = () => {
    if (!riskRanges) return { name: 'Moderado', color: '#F59E0B', icon: Target }
    
    const range = riskRanges.max_volatility - riskRanges.min_volatility
    const conservativeThreshold = riskRanges.min_volatility + (range * 0.25)
    const moderateThreshold = riskRanges.min_volatility + (range * 0.50)
    
    if (riskLevel < conservativeThreshold) return { name: 'Conservador', color: '#1A936F', icon: Shield }
    if (riskLevel < moderateThreshold) return { name: 'Moderado', color: '#F59E0B', icon: Target }
    return { name: 'Agresivo', color: '#EF4444', icon: Zap }
  }

  const getRiskDescription = () => {
    if (!riskRanges) return 'Cargando información...'
    
    const range = riskRanges.max_volatility - riskRanges.min_volatility
    const conservativeThreshold = riskRanges.min_volatility + (range * 0.25)
    const moderateThreshold = riskRanges.min_volatility + (range * 0.50)
    
    if (riskLevel < conservativeThreshold) return 'Mayor estabilidad con retornos predecibles y menor volatilidad'
    if (riskLevel < moderateThreshold) return 'Balance perfecto entre estabilidad y potencial de crecimiento'
    return 'Mayor potencial de retorno con volatilidad más alta'
  }

  const formatPercentage = (value: number) => {
    return (value * 100).toFixed(2)
  }

  const isAtMin = () => riskRanges && Math.abs(riskLevel - riskRanges.min_volatility) < 0.001
  const isAtMax = () => riskRanges && Math.abs(riskLevel - riskRanges.max_volatility) < 0.001

  const getDisplayValue = () => {
    if (isAtMin()) return 'MIN'
    if (isAtMax()) return 'MAX'
    return formatPercentage(riskLevel)
  }

  const getSubmitRiskValue = () => {
    if (isAtMin()) return -1000
    if (isAtMax()) return 1000
    return riskLevel
  }

  const getSliderBackground = () => {
    if (!riskRanges) return '#e5e7eb'
    
    const range = riskRanges.max_volatility - riskRanges.min_volatility
    const conservativeEnd = 25
    const moderateEnd = 50
    const currentPosition = ((riskLevel - riskRanges.min_volatility) / range) * 100
    
    return `linear-gradient(to right,
      #1A936F 0%,
      #1A936F ${conservativeEnd}%,
      #F59E0B ${conservativeEnd}%,
      #F59E0B ${moderateEnd}%,
      #EF4444 ${moderateEnd}%,
      #EF4444 ${currentPosition}%,
      #e5e7eb ${currentPosition}%,
      #e5e7eb 100%)`
  }

  const profile = getRiskProfile()
  const RiskIcon = profile.icon

  if (loading || !riskRanges) {
    return (
      <LoadingPage message='Calculando niveles de riesgo...' />
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#114B5F] via-[#0d3d4d] to-[#1A936F] flex items-center justify-center">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjAzKSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-40"></div>

      <div className="relative w-full max-w-4xl px-6 py-12">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-3 mb-6 px-6 py-3 bg-white/10 backdrop-blur-sm rounded-full border border-white/20">
            <TrendingUp className="w-6 h-6 text-[#88D498]" />
            <span className="text-white font-semibold text-lg">Recomendación de Portafolios</span>
          </div>

          <h1 className="text-5xl md:text-6xl font-bold text-white mb-4 tracking-tight">
            Define tu tolerancia
          </h1>
          <p className="text-xl text-white/80 max-w-2xl mx-auto">
            Ajusta el nivel de riesgo que estás dispuesto a asumir en tu inversión
          </p>
        </div>

        <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-8 md:p-12 border border-white/20">
          {/* Tab Selector */}
          <div className="flex gap-3 mb-10 p-2 bg-gray-100 rounded-2xl">
            <button
              onClick={() => handleModeChange('auto')}
              className={`flex-1 flex items-center justify-center gap-2 px-6 py-4 rounded-xl font-semibold text-lg transition-all duration-300 ${
                riskMode === 'auto'
                  ? 'bg-gradient-to-r from-[#1A936F] to-[#88D498] text-white shadow-lg'
                  : 'bg-transparent text-gray-600 hover:bg-gray-200'
              }`}
            >
              <Sparkles className="w-5 h-5" />
              Riesgo optimizado
            </button>
            <button
              onClick={() => handleModeChange('manual')}
              className={`flex-1 flex items-center justify-center gap-2 px-6 py-4 rounded-xl font-semibold text-lg transition-all duration-300 ${
                riskMode === 'manual'
                  ? 'bg-gradient-to-r from-[#1A936F] to-[#88D498] text-white shadow-lg'
                  : 'bg-transparent text-gray-600 hover:bg-gray-200'
              }`}
            >
              <Settings className="w-5 h-5" />
              Riesgo manual
            </button>
          </div>

          <div className="flex flex-col items-center mb-12">
            <div className="relative mb-8">
              <div
                className="absolute inset-0 rounded-full blur-3xl opacity-40 transition-all duration-500"
                style={{ backgroundColor: profile.color }}
              ></div>
              <div
                className="relative w-56 h-56 rounded-full flex items-center justify-center shadow-2xl transition-all duration-500"
                style={{
                  background: `linear-gradient(135deg, ${profile.color}, ${profile.color}dd)`,
                  boxShadow: `0 20px 60px ${profile.color}40`
                }}
              >
                <div className="w-44 h-44 rounded-full bg-white flex flex-col items-center justify-center">
                  <span className={`font-bold transition-colors duration-500 ${isAtMin() || isAtMax() ? 'text-5xl' : 'text-6xl'}`} style={{ color: profile.color }}>
                    {getDisplayValue()}
                  </span>
                  {!isAtMin() && !isAtMax() && (
                    <span className="text-2xl font-semibold transition-colors duration-500" style={{ color: profile.color }}>
                      %
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 mb-4">
              <RiskIcon
                className="w-8 h-8 transition-colors duration-500"
                style={{ color: profile.color }}
              />
              <h2
                className="text-4xl font-bold transition-colors duration-500"
                style={{ color: profile.color }}
              >
                {profile.name}
              </h2>
            </div>

            <p className="text-gray-600 text-center text-lg">
              {getRiskDescription()}
            </p>
          </div>

          <div className="space-y-8 mb-10">
            <div className="relative">
              <input
                type="range"
                min={riskRanges.min_volatility}
                max={riskRanges.max_volatility}
                step={0.001}
                value={riskLevel}
                onChange={(e) => setRiskLevel(Number(e.target.value))}
                disabled={riskMode === 'auto'}
                className="w-full h-4 rounded-full appearance-none slider"
                style={{
                  background: getSliderBackground(),
                  cursor: riskMode === 'auto' ? 'not-allowed' : 'pointer',
                  opacity: riskMode === 'auto' ? 0.6 : 1
                }}
              />
            </div>

            <div className="flex justify-between items-start">
              <div className="text-center flex-1">
                <div className="w-3 h-3 bg-[#1A936F] rounded-full mx-auto mb-2"></div>
                <p className="text-xs font-semibold text-gray-500 mb-1">Conservador</p>
                <p className="text-lg font-bold text-[#1A936F]">{formatPercentage(riskRanges.min_volatility)}%</p>
              </div>
              <div className="text-center flex-1">
                <div className="w-3 h-3 bg-[#F59E0B] rounded-full mx-auto mb-2"></div>
                <p className="text-xs font-semibold text-gray-500 mb-1">Moderado</p>
                <p className="text-lg font-bold text-[#F59E0B]">
                  {formatPercentage(riskRanges.min_volatility + (riskRanges.max_volatility - riskRanges.min_volatility) * 0.25)}-
                  {formatPercentage(riskRanges.min_volatility + (riskRanges.max_volatility - riskRanges.min_volatility) * 0.50)}%
                </p>
              </div>
              <div className="text-center flex-1">
                <div className="w-3 h-3 bg-[#EF4444] rounded-full mx-auto mb-2"></div>
                <p className="text-xs font-semibold text-gray-500 mb-1">Agresivo</p>
                <p className="text-lg font-bold text-[#EF4444]">{formatPercentage(riskRanges.max_volatility)}%</p>
              </div>
            </div>
          </div>

          <div className="mb-8 p-5 bg-gradient-to-r from-[#1A936F]/10 to-[#88D498]/10 rounded-2xl border-2 border-[#88D498]/30">
            <p className="text-sm font-medium text-gray-600 mb-2">Sectores seleccionados</p>
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

          <div className="flex gap-4">
            <button
              onClick={onBack}
              className="px-8 py-5 bg-white border-2 border-gray-300 text-gray-700
                       font-bold text-xl rounded-2xl hover:border-gray-400 hover:shadow-lg
                       transition-all duration-200 flex items-center gap-2"
            >
              <ArrowLeft className="w-5 h-5" />
              Atrás
            </button>

            <button
              onClick={() => onSubmit(getSubmitRiskValue(), riskMode)}
              className="group relative flex-1 px-8 py-5 bg-gradient-to-r from-[#1A936F] to-[#88D498]
                       text-white font-bold text-2xl rounded-2xl shadow-2xl
                       hover:shadow-[#1A936F]/50 transform hover:scale-105
                       transition-all duration-300 overflow-hidden"
            >
              <span className="relative z-10 flex items-center justify-center gap-3">
                Generar Portafolio
                <TrendingUp className="w-6 h-6" />
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-[#88D498] to-[#1A936F]
                            opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </button>
          </div>
        </div>

        <div className="text-center mt-8">
          <p className="text-white/60 text-sm">Paso 2 de 2</p>
        </div>
      </div>

      <style>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: ${profile.color};
          cursor: pointer;
          box-shadow: 0 4px 16px ${profile.color}60;
          border: 4px solid white;
          transition: all 0.3s ease;
        }

        .slider::-moz-range-thumb {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: ${profile.color};
          cursor: pointer;
          border: 4px solid white;
          box-shadow: 0 4px 16px ${profile.color}60;
          transition: all 0.3s ease;
        }

        .slider::-webkit-slider-thumb:hover {
          transform: scale(1.15);
          box-shadow: 0 6px 20px ${profile.color}80;
        }

        .slider::-moz-range-thumb:hover {
          transform: scale(1.15);
          box-shadow: 0 6px 20px ${profile.color}80;
        }
      `}</style>
    </div>
  )
}