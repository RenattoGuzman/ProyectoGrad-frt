import { useState } from 'react'
import { TrendingUp, ArrowLeft, Target, Shield, Zap } from 'lucide-react'

interface RiskSelectionPageProps {
  selectedIndustries: string[]
  onSubmit: (riskLevel: number) => void
  onBack: () => void
}

export default function RiskSelectionPage({ selectedIndustries, onSubmit, onBack }: RiskSelectionPageProps) {
  const [riskLevel, setRiskLevel] = useState<number>(17)

  const getRiskProfile = () => {
    if (riskLevel < 10) return { name: 'Conservador', color: '#1A936F', icon: Shield }
    if (riskLevel < 20) return { name: 'Moderado', color: '#F59E0B', icon: Target }
    return { name: 'Agresivo', color: '#EF4444', icon: Zap }
  }

  const getRiskDescription = () => {
    if (riskLevel < 10) return 'Mayor estabilidad con retornos predecibles y menor volatilidad'
    if (riskLevel < 20) return 'Balance perfecto entre estabilidad y potencial de crecimiento'
    return 'Mayor potencial de retorno con volatilidad más alta'
  }

  const profile = getRiskProfile()
  const RiskIcon = profile.icon

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#114B5F] via-[#0d3d4d] to-[#1A936F] flex items-center justify-center">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjAzKSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-40"></div>

      <div className="relative w-full max-w-4xl px-6 py-12">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-3 mb-6 px-6 py-3 bg-white/10 backdrop-blur-sm rounded-full border border-white/20">
            <TrendingUp className="w-6 h-6 text-[#88D498]" />
            <span className="text-white font-semibold text-lg">Portfolio Manager</span>
          </div>

          <h1 className="text-5xl md:text-6xl font-bold text-white mb-4 tracking-tight">
            Define tu tolerancia
          </h1>
          <p className="text-xl text-white/80 max-w-2xl mx-auto">
            Ajusta el nivel de riesgo que estás dispuesto a asumir en tu inversión
          </p>
        </div>

        <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-8 md:p-12 border border-white/20">
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
                  <span className="text-7xl font-bold transition-colors duration-500" style={{ color: profile.color }}>
                    {riskLevel}
                  </span>
                  <span className="text-3xl font-semibold transition-colors duration-500" style={{ color: profile.color }}>
                    %
                  </span>
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

            <p className="text-gray-600 text-center text-lg max-w-md">
              {getRiskDescription()}
            </p>
          </div>

          <div className="space-y-8 mb-10">
            <div className="relative">
              <input
                type="range"
                min="5"
                max="30"
                value={riskLevel}
                onChange={(e) => setRiskLevel(Number(e.target.value))}
                className="w-full h-4 rounded-full appearance-none cursor-pointer slider"
                style={{
                  background: `linear-gradient(to right,
                    #1A936F 0%,
                    #1A936F 16.67%,
                    #F59E0B 16.67%,
                    #F59E0B 50%,
                    #EF4444 50%,
                    #EF4444 ${((riskLevel - 5) / 25) * 100}%,
                    #e5e7eb ${((riskLevel - 5) / 25) * 100}%,
                    #e5e7eb 100%)`
                }}
              />
            </div>

            <div className="flex justify-between items-start">
              <div className="text-center flex-1">
                <div className="w-3 h-3 bg-[#1A936F] rounded-full mx-auto mb-2"></div>
                <p className="text-xs font-semibold text-gray-500 mb-1">Conservador</p>
                <p className="text-lg font-bold text-[#1A936F]">5%</p>
              </div>
              <div className="text-center flex-1">
                <div className="w-3 h-3 bg-[#F59E0B] rounded-full mx-auto mb-2"></div>
                <p className="text-xs font-semibold text-gray-500 mb-1">Moderado</p>
                <p className="text-lg font-bold text-[#F59E0B]">10-19%</p>
              </div>
              <div className="text-center flex-1">
                <div className="w-3 h-3 bg-[#EF4444] rounded-full mx-auto mb-2"></div>
                <p className="text-xs font-semibold text-gray-500 mb-1">Agresivo</p>
                <p className="text-lg font-bold text-[#EF4444]">20-30%</p>
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
              onClick={() => onSubmit(riskLevel)}
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
