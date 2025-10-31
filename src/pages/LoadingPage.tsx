import { useEffect, useState } from 'react'
import { TrendingUp, Lightbulb } from 'lucide-react'

interface LoadingPageProps {
  message?: string
}

const TIPS = [
  "Un portafolio balanceado combina estabilidad con potencial de crecimiento",
  "⚡ El modo automático utiliza el Ratio de Sharpe para optimizar tu inversión",
  "Ajusta tu portafolio regularmente según cambien tus objetivos financieros",
  "Invertir consistentemente en el tiempo supera intentar predecir el mercado",
  "El análisis retrospectivo te muestra cómo habría funcionado tu estrategia",
  "Personaliza tu portafolio según tu tolerancia al riesgo y objetivos",
  "El Ratio de Sharpe mide el retorno ajustado por riesgo de la inversión",
]

export default function LoadingPage({ message = "Cargando..." }: LoadingPageProps) {
  const [currentTip, setCurrentTip] = useState(0)

  useEffect(() => {
    // Rotate tips every 4 seconds
    const interval = setInterval(() => {
      setCurrentTip((prev) => (prev + 1) % TIPS.length)
    }, 4000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#114B5F] via-[#0d3d4d] to-[#1A936F] flex items-center justify-center relative overflow-hidden">
      {/* Animated background grid */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjAzKSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-40"></div>

      {/* Floating gradient orbs */}
      <div className="absolute top-20 left-20 w-72 h-72 bg-[#1A936F] rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
      <div className="absolute top-40 right-20 w-72 h-72 bg-[#88D498] rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
      <div className="absolute bottom-20 left-40 w-72 h-72 bg-[#114B5F] rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>

      <div className="relative z-10 flex flex-col items-center justify-center px-6 max-w-2xl">
        {/* Logo/Header */}
        <div className="mb-12 text-center">
          <div className="inline-flex items-center gap-3 mb-4 px-6 py-3 bg-white/10 backdrop-blur-sm rounded-full border border-white/20">
            <TrendingUp className="w-8 h-8 text-[#88D498]" />
            <span className="text-white font-bold text-2xl">Sistema de Recomendación</span>
          </div>
        </div>

        {/* Custom Loader */}
        <div className="mb-8">
          <div className="loader"></div>
        </div>

        {/* Loading Message */}
        <h2 className="text-3xl font-bold text-white mb-12 text-center animate-pulse">
          {message}
        </h2>

        {/* Tips Section */}
        <div className="w-full bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 p-6 shadow-2xl">
          <div className="flex items-start gap-3 mb-4">
            <Lightbulb className="w-6 h-6 text-[#88D498] flex-shrink-0 mt-1 animate-pulse" />
            <div className="flex-1">
              <h3 className="text-lg font-bold text-white mb-2">Sabías que...</h3>
              <p 
                key={currentTip}
                className="text-white/90 text-base leading-relaxed animate-fade-in"
              >
                {TIPS[currentTip]}
              </p>
            </div>
          </div>
          
          {/* Progress dots */}
          <div className="flex justify-center gap-2 mt-6">
            {TIPS.slice(0, 6).map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === currentTip % 6
                  ? 'bg-[#88D498] w-8'
                  : 'bg-white/30'
                }`}
                />
              ))}
          </div>
        </div>

      </div>

      <style>{`
        .loader {
          width: 85px;
          height: 50px;
          --g1:conic-gradient(from  90deg at left   3px top   3px,#0000 90deg,#fff 0);
          --g2:conic-gradient(from -90deg at bottom 3px right 3px,#0000 90deg,#fff 0);
          background: var(--g1),var(--g1),var(--g1), var(--g2),var(--g2),var(--g2);
          background-position: left,center,right;
          background-repeat: no-repeat;
          animation: l10 1s infinite alternate;
        }
        @keyframes l10 {
          0%,
          2%   {background-size:25px 50% ,25px 50% ,25px 50%}
          20%  {background-size:25px 25% ,25px 50% ,25px 50%}
          40%  {background-size:25px 100%,25px 25% ,25px 50%}
          60%  {background-size:25px 50% ,25px 100%,25px 25%}
          80%  {background-size:25px 50% ,25px 50% ,25px 100%}
          98%,
          100% {background-size:25px 50% ,25px 50% ,25px 50%}
        }
      `}</style>
    </div>
  )
}