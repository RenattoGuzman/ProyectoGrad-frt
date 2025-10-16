import { useState } from 'react'
import { TrendingUp, CheckCircle2 } from 'lucide-react'

const INDUSTRIES = [
  'Tecnología',
  'Petróleo',
  'Automotriz',
  'Salud',
  'Telecomunicaciones',
  'Alimentación',
  'Ingeniería'
]

interface SelectionPageProps {
  onSubmit: (industries: string[], riskLevel: number) => void
}

export default function SelectionPage({ onSubmit }: SelectionPageProps) {
  const [selectedIndustries, setSelectedIndustries] = useState<string[]>([])
  const [riskLevel, setRiskLevel] = useState<number>(5)

  const toggleIndustry = (industry: string) => {
    setSelectedIndustries(prev =>
      prev.includes(industry)
        ? prev.filter(i => i !== industry)
        : [...prev, industry]
    )
  }

  const handleSubmit = () => {
    if (selectedIndustries.length === 0) {
      alert('Por favor seleccione al menos una industria')
      return
    }
    onSubmit(selectedIndustries, riskLevel)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#114B5F] via-[#0d3d4d] to-[#1A936F]">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjAzKSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-40"></div>

      <div className="relative">
        <div className="bg-white/5 backdrop-blur-sm border-b border-white/10 py-8 px-6">
          <div className="max-w-6xl mx-auto flex items-center justify-center gap-3">
            <TrendingUp className="w-8 h-8 text-[#88D498]" />
            <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
              Portfolio Manager
            </h1>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="grid lg:grid-cols-2 gap-8 mb-12">
            <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-8 border border-white/20">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-1 h-8 bg-gradient-to-b from-[#1A936F] to-[#88D498] rounded-full"></div>
                <h2 className="text-2xl font-bold text-[#114B5F]">
                  Industrias de Inversión
                </h2>
              </div>

              <p className="text-gray-600 mb-6 text-sm">
                Seleccione las industrias en las que desea diversificar su portafolio
              </p>

              <div className="space-y-3">
                {INDUSTRIES.map(industry => {
                  const isSelected = selectedIndustries.includes(industry)
                  return (
                    <button
                      key={industry}
                      onClick={() => toggleIndustry(industry)}
                      className={`w-full flex items-center justify-between p-4 rounded-xl
                                transition-all duration-200 group border-2
                                ${isSelected
                                  ? 'bg-gradient-to-r from-[#1A936F] to-[#88D498] border-[#1A936F] shadow-lg shadow-[#1A936F]/20'
                                  : 'bg-white border-gray-200 hover:border-[#88D498] hover:shadow-md'
                                }`}
                    >
                      <span className={`font-medium text-lg transition-colors
                                      ${isSelected ? 'text-white' : 'text-gray-700 group-hover:text-[#114B5F]'}`}>
                        {industry}
                      </span>
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center
                                     transition-all duration-200
                                     ${isSelected
                                       ? 'bg-white border-white'
                                       : 'border-gray-300 group-hover:border-[#88D498]'
                                     }`}>
                        {isSelected && <CheckCircle2 className="w-5 h-5 text-[#1A936F]" />}
                      </div>
                    </button>
                  )
                })}
              </div>

              {selectedIndustries.length > 0 && (
                <div className="mt-6 p-4 bg-gradient-to-r from-[#1A936F]/10 to-[#88D498]/10 rounded-lg border border-[#88D498]/30">
                  <p className="text-sm text-[#114B5F] font-medium">
                    {selectedIndustries.length} {selectedIndustries.length === 1 ? 'industria seleccionada' : 'industrias seleccionadas'}
                  </p>
                </div>
              )}
            </div>

            <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-8 border border-white/20">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-1 h-8 bg-gradient-to-b from-[#1A936F] to-[#88D498] rounded-full"></div>
                <h2 className="text-2xl font-bold text-[#114B5F]">
                  Nivel de Riesgo
                </h2>
              </div>

              <p className="text-gray-600 mb-12 text-sm">
                Ajuste el nivel de riesgo tolerado para las predicciones del portafolio
              </p>

              <div className="space-y-8">
                <div className="flex items-center justify-center">
                  <div className="relative">
                    <div className="w-40 h-40 rounded-full bg-gradient-to-br from-[#1A936F] to-[#88D498]
                                  flex items-center justify-center shadow-2xl shadow-[#1A936F]/30">
                      <div className="w-32 h-32 rounded-full bg-white flex flex-col items-center justify-center">
                        <span className="text-5xl font-bold text-[#114B5F]">
                          {riskLevel}
                        </span>
                        <span className="text-2xl font-semibold text-[#1A936F]">%</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="relative">
                    <input
                      type="range"
                      min="5"
                      max="30"
                      value={riskLevel}
                      onChange={(e) => setRiskLevel(Number(e.target.value))}
                      className="w-full h-3 rounded-full appearance-none cursor-pointer slider"
                      style={{
                        background: `linear-gradient(to right, #1A936F 0%, #88D498 ${((riskLevel - 5) / 25) * 100}%, #e5e7eb ${((riskLevel - 5) / 25) * 100}%, #e5e7eb 100%)`
                      }}
                    />
                  </div>

                  <div className="flex justify-between items-center">
                    <div className="text-center">
                      <p className="text-sm font-semibold text-gray-500">Mínimo</p>
                      <p className="text-lg font-bold text-[#114B5F]">5%</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-semibold text-gray-500">Máximo</p>
                      <p className="text-lg font-bold text-[#114B5F]">30%</p>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg border border-blue-200/50">
                  <p className="text-sm text-gray-700">
                    <span className="font-semibold">
                      {riskLevel < 10 ? 'Riesgo Conservador' : riskLevel < 20 ? 'Riesgo Moderado' : 'Riesgo Agresivo'}
                    </span>
                    {riskLevel < 10 && ' - Mayor estabilidad, menores retornos esperados'}
                    {riskLevel >= 10 && riskLevel < 20 && ' - Balance entre estabilidad y crecimiento'}
                    {riskLevel >= 20 && ' - Mayor potencial de retorno, mayor volatilidad'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-center">
            <button
              onClick={handleSubmit}
              disabled={selectedIndustries.length === 0}
              className="group relative px-12 py-4 bg-gradient-to-r from-[#1A936F] to-[#88D498]
                       text-white font-bold text-xl rounded-xl shadow-2xl
                       hover:shadow-[#1A936F]/50 transform hover:scale-105
                       transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed
                       disabled:transform-none overflow-hidden"
            >
              <span className="relative z-10 flex items-center gap-2">
                Generar Portafolio
                <TrendingUp className="w-5 h-5" />
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-[#88D498] to-[#1A936F]
                            opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
            </button>
          </div>
        </div>
      </div>

      <style>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          width: 28px;
          height: 28px;
          border-radius: 50%;
          background: linear-gradient(135deg, #1A936F, #88D498);
          cursor: pointer;
          box-shadow: 0 4px 12px rgba(26, 147, 111, 0.4);
          border: 3px solid white;
        }

        .slider::-moz-range-thumb {
          width: 28px;
          height: 28px;
          border-radius: 50%;
          background: linear-gradient(135deg, #1A936F, #88D498);
          cursor: pointer;
          border: 3px solid white;
          box-shadow: 0 4px 12px rgba(26, 147, 111, 0.4);
        }

        .slider::-webkit-slider-thumb:hover {
          transform: scale(1.1);
          box-shadow: 0 6px 16px rgba(26, 147, 111, 0.5);
        }
      `}</style>
    </div>
  )
}
