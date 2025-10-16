import { useState } from 'react'
import { TrendingUp, CheckCircle2, ArrowRight } from 'lucide-react'

const INDUSTRIES = [
  'Tecnología',
  'Petróleo',
  'Automotriz',
  'Salud',
  'Telecomunicaciones',
  'Alimentación',
  'Ingeniería'
]

interface IndustrySelectionPageProps {
  onNext: (industries: string[]) => void
}

export default function IndustrySelectionPage({ onNext }: IndustrySelectionPageProps) {
  const [selectedIndustries, setSelectedIndustries] = useState<string[]>([])

  const toggleIndustry = (industry: string) => {
    setSelectedIndustries(prev =>
      prev.includes(industry)
        ? prev.filter(i => i !== industry)
        : [...prev, industry]
    )
  }

  const handleNext = () => {
    if (selectedIndustries.length === 0) {
      alert('Por favor seleccione al menos una industria')
      return
    }
    onNext(selectedIndustries)
  }

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
            ¿Dónde invertir?
          </h1>
          <p className="text-xl text-white/80 max-w-2xl mx-auto">
            Selecciona las industrias que te interesan para construir tu portafolio ideal
          </p>
        </div>

        <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-8 md:p-12 border border-white/20">
          <div className="grid sm:grid-cols-2 gap-4 mb-8">
            {INDUSTRIES.map((industry, index) => {
              const isSelected = selectedIndustries.includes(industry)
              return (
                <button
                  key={industry}
                  onClick={() => toggleIndustry(industry)}
                  style={{ animationDelay: `${index * 50}ms` }}
                  className={`relative flex items-center justify-between p-6 rounded-2xl
                            transition-all duration-300 group border-2 overflow-hidden
                            ${isSelected
                              ? 'bg-gradient-to-r from-[#1A936F] to-[#88D498] border-[#1A936F] shadow-xl shadow-[#1A936F]/30 scale-105'
                              : 'bg-white border-gray-200 hover:border-[#88D498] hover:shadow-lg hover:scale-102'
                            }`}
                >
                  {isSelected && (
                    <div className="absolute inset-0 bg-gradient-to-r from-[#88D498]/20 to-transparent"></div>
                  )}

                  <span className={`relative font-semibold text-xl transition-colors z-10
                                  ${isSelected ? 'text-white' : 'text-gray-700 group-hover:text-[#114B5F]'}`}>
                    {industry}
                  </span>

                  <div className={`relative z-10 w-8 h-8 rounded-full border-2 flex items-center justify-center
                                 transition-all duration-300
                                 ${isSelected
                                   ? 'bg-white border-white scale-110'
                                   : 'border-gray-300 group-hover:border-[#88D498] group-hover:scale-110'
                                 }`}>
                    {isSelected && (
                      <CheckCircle2 className="w-6 h-6 text-[#1A936F]" strokeWidth={3} />
                    )}
                  </div>
                </button>
              )
            })}
          </div>

          {selectedIndustries.length > 0 && (
            <div className="mb-8 p-5 bg-gradient-to-r from-[#1A936F]/10 to-[#88D498]/10 rounded-2xl border-2 border-[#88D498]/30 animate-fadeIn">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Selección actual</p>
                  <p className="text-2xl font-bold text-[#114B5F]">
                    {selectedIndustries.length} {selectedIndustries.length === 1 ? 'industria' : 'industrias'}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2 max-w-md">
                  {selectedIndustries.map(industry => (
                    <span
                      key={industry}
                      className="px-3 py-1 bg-white text-[#114B5F] text-sm font-medium rounded-lg shadow-sm border border-[#88D498]/30"
                    >
                      {industry}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          <button
            onClick={handleNext}
            disabled={selectedIndustries.length === 0}
            className="group relative w-full px-8 py-5 bg-gradient-to-r from-[#1A936F] to-[#88D498]
                     text-white font-bold text-2xl rounded-2xl shadow-2xl
                     hover:shadow-[#1A936F]/50 transform hover:scale-105
                     transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed
                     disabled:transform-none overflow-hidden"
          >
            <span className="relative z-10 flex items-center justify-center gap-3">
              Continuar
              <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-[#88D498] to-[#1A936F]
                          opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </button>
        </div>

        <div className="text-center mt-8">
          <p className="text-white/60 text-sm">Paso 1 de 2</p>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  )
}
