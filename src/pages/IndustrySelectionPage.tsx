import { useState } from "react";
import {
  TrendingUp,
  CheckCircle2,
  ArrowRight,
  Lightbulb,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
const INDUSTRIES = [
  "Servicios Financieros",
  "Tecnología",
  "Consumo esencial",
  "Consumo discrecional",
  "Servicios de comunicación",
  "Salud",
  "Industriales",
  "Bienes Raíces",
];

// Map display name -> stored value (id/key). Use getIndustryValue(name) to retrieve the stored value.
const INDUSTRY_VALUES: Record<string, string> = {
  "Servicios Financieros": "Financial Services",
  "Consumo esencial": "Consumer Defensive",
  "Consumo discrecional": "Consumer Cyclical",
  Industriales: "Industrials",
  Tecnología: "Technology",
  Salud: "Healthcare",
  "Bienes Raíces": "Real Estate",
  Telecomunicaciones: "Communication Services",
};

const TUTORIAL_STEPS = [
  {
    title: "Paso 1: Selección de Industrias",
    description:
      "Selecciona las industrias en las que te gustaría invertir. Puedes elegir una o varias según tus intereses y estrategia de inversión.",
    gif: "/Pantalla1.gif",
  },
  {
    title: "Paso 2: Configuración de Riesgo",
    description:
      "Define tu nivel de riesgo. El riesgo representa tu tolerancia a la volatilidad y posibles pérdidas. Se recomienda elegir la opción de riesgo optimizado.",
    gif: "/Pantalla2.gif",
  },
  {
    title: "Paso 3: Resultados de Portafolio",
    description:
      "Revisa el detalle de tu portafolio recomendado, incluyendo los activos seleccionados y la cantidad asignada a cada uno.",
    gif: "/Pantalla3.gif",
  },
  {
    title: "Paso 4: Proyección de Crecimiento",
    description:
      "Visualiza la proyección de crecimiento de tu portafolio a lo largo del tiempo, basada en simulaciones de Montecarlo.",
    gif: "/Pantalla4.gif",
  },
  {
    title: "Paso 5: Rendimiento Histórico",
    description:
      "Visualiza el rendimiento histórico de tu portafolio para entender su comportamiento pasado. Puedes eliminar o agregar activos según tus preferencias.",
    gif: "/Pantalla5.gif",
  },
  {
    title: "Antes de terminar el tutorial...",
    description:
      "Recuerda que esta es una herramienta para ayudar en la toma de decisiones de inversión, haciendo énfasis en el riesgo y la diversificación. No olvides siempre hacer tu propia investigación y considerar tus objetivos financieros personales.",
    gif: "/icon.svg",
},
];

const getIndustryValue = (name: string) => INDUSTRY_VALUES[name] ?? name;

interface IndustrySelectionPageProps {
  onNext: (industries: string[]) => void;
}

export default function IndustrySelectionPage({
  onNext,
}: IndustrySelectionPageProps) {
  const [selectedIndustries, setSelectedIndustries] = useState<string[]>([]);
  const [showTutorial, setShowTutorial] = useState(false);
  const [tutorialStep, setTutorialStep] = useState(0);

  const currentStep = TUTORIAL_STEPS[tutorialStep];

  const gifSrc = `${currentStep.gif}?t=${tutorialStep}`;

  const toggleIndustry = (industry: string) => {
    setSelectedIndustries((prev) =>
      prev.includes(industry)
        ? prev.filter((i) => i !== industry)
        : [...prev, industry]
    );
  };

  const handleNext = () => {
    if (selectedIndustries.length === 0) {
      alert("Por favor seleccione al menos una industria");
      return;
    }
    onNext(selectedIndustries);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#114B5F] via-[#0d3d4d] to-[#1A936F] flex items-center justify-center">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjAzKSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-40"></div>

      <div className="relative w-full max-w-4xl px-6 py-10">
        <button
          onClick={() => {
            setShowTutorial(true)
            setTutorialStep(0)
          }}
          className="group absolute top-6 left-0 flex items-center gap-2 px-4 py-4
                    bg-gradient-to-r from-[#275768] to-[#275465] rounded-xl shadow-lg
                    hover:shadow-xl transition-all duration-300 
                    hover:px-6 z-20 bg-white/10 backdrop-blur-sm border border-white/20 text-white/20  hover:text-white"
          title="Tutorial"
        >
          <Lightbulb className="w-8 h-8  transition-all" />
          <span className="text-sm font-semibold max-w-0 overflow-hidden 
                          group-hover:max-w-xs transition-all duration-300 whitespace-nowrap">
            Tutorial
          </span>
        </button>        
        
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-3 mb-6 px-6 py-3 bg-white/10 backdrop-blur-sm rounded-full border border-white/20">
            <TrendingUp className="w-6 h-6 text-[#88D498]" />
            <span className="text-white font-semibold text-lg">
              Recomendación de Portafolios
            </span>
          </div>

          <h1 className="text-5xl md:text-5xl font-bold text-white mb-4 tracking-tight">
            ¿Dónde invertir?
          </h1>
          <p className="text-xl text-white/80 max-w-2xl mx-auto">
            Selecciona las industrias que te interesan para construir tu
            portafolio ideal
          </p>
        </div>

        <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-8 md:p-10 border border-white/20">
          {/* Select all */}
          {/* <div className="flex justify-start mb-4 mt-0">
            <button
              onClick={() => {
                if (selectedIndustries.length === INDUSTRIES.length) {
                  setSelectedIndustries([])
                } else {
                  setSelectedIndustries([...INDUSTRIES])
                }
              }}
              className="px-6 py-3 text-lg font-semibold text-[#1A936F] hover:text-[#18b284] 
                        bg-[#1A936F]/10 hover:bg-[#1A936F]/20 rounded-xl transition-all duration-200
                        border border-[#1A936F]/30 hover:border-[#88D498]/50"
            >
              {selectedIndustries.length === INDUSTRIES.length ? 'Deseleccionar todas' : 'Seleccionar todas'}
            </button>
          </div> */}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-x-8 gap-y-5 mb-8">
            {INDUSTRIES.map((industry, index) => {
              const isSelected = selectedIndustries.includes(industry);
              return (
                <button
                  key={industry}
                  onClick={() => toggleIndustry(industry)}
                  style={{ animationDelay: `${index * 50}ms` }}
                  className={`relative flex items-center justify-between p-6 rounded-2xl
                            transition-all duration-300 group border-2 overflow-hidden
                            ${
                              isSelected
                                ? "bg-gradient-to-r from-[#1A936F] to-[#88D498] border-[#1A936F] shadow-xl shadow-[#1A936F]/30 scale-105"
                                : "bg-white border-gray-200 hover:border-[#88D498] hover:shadow-lg hover:scale-102"
                            }`}
                >
                  {isSelected && (
                    <div className="absolute inset-0 bg-gradient-to-r from-[#88D498]/20 to-transparent"></div>
                  )}

                  <span
                    className={`relative font-semibold text-xl transition-colors z-10
                                  ${
                                    isSelected
                                      ? "text-white"
                                      : "text-gray-700 group-hover:text-[#114B5F]"
                                  }`}
                  >
                    {industry}
                  </span>

                  <div
                    className={`relative z-10 w-8 h-8 rounded-full border-2 flex items-center justify-center
                                 transition-all duration-300
                                 ${
                                   isSelected
                                     ? "bg-white border-white scale-110"
                                     : "border-gray-300 group-hover:border-[#88D498] group-hover:scale-110"
                                 }`}
                  >
                    {isSelected && (
                      <CheckCircle2
                        className="w-6 h-6 text-[#1A936F]"
                        strokeWidth={3}
                      />
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {/* {selectedIndustries.length > 0 && (
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
          )} */}

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
            <div
              className="absolute inset-0 bg-gradient-to-r from-[#88D498] to-[#1A936F]
                          opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            ></div>
          </button>
        </div>

        <div className="text-center mt-8">
          <p className="text-white/60 text-sm">Paso 1</p>
        </div>
      </div>
      {/* Modal de Tutorial */}
      {showTutorial && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden animate-fadeIn">
            {/* Header */}
            <div className="bg-gradient-to-r from-[#1A936F] to-[#88D498] p-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Lightbulb className="w-8 h-8 text-white" />
                <h2 className="text-2xl font-bold text-white">Tutorial</h2>
              </div>
              <button
                onClick={() => setShowTutorial(false)}
                className="p-2 hover:bg-white/20 rounded-full transition-colors"
              >
                <X className="w-6 h-6 text-white" />
              </button>
            </div>

            {/* Contenido */}
            <div className="p-8">
              <div className="mb-6">
                <h3 className="text-2xl font-bold text-[#114B5F] mb-3">
                  {TUTORIAL_STEPS[tutorialStep].title}
                </h3>
                <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                  <div
                    className="bg-gradient-to-r from-[#1A936F] to-[#88D498] h-2 rounded-full transition-all duration-300"
                    style={{
                      width: `${
                        ((tutorialStep + 1) / TUTORIAL_STEPS.length) * 100
                      }%`,
                    }}
                  />
                </div>
              </div>

              {/* GIF */}
              <div
                className="mb-6 rounded-2xl overflow-hidden bg-gray-100 flex items-center justify-center"
                style={{ height: tutorialStep === 5 ? "200px" : "300px ", 
                        backgroundColor: tutorialStep === 5 ? "transparent" : "rgb(243 244 246 / var(--tw-bg-opacity, 1))" 
                }}
              >
                <img
                  key={gifSrc} 
                  src={gifSrc}
                  alt={TUTORIAL_STEPS[tutorialStep].title}
                  className={`${tutorialStep === 5 ? "w-44 h-44" : "w-full h-full object-cover"}`}
                />
              </div>

              {/* Descripción */}
              <p className="text-lg text-gray-700 leading-relaxed mb-8"
                  style={
                    {
                      height: tutorialStep === 5 ? "150px" : ""
                    }
                  }
              >
                {TUTORIAL_STEPS[tutorialStep].description}
              </p>

              {/* Navegación */}
              <div className="flex items-center justify-between">
                <button
                  onClick={() => setTutorialStep((prev) => prev - 1)}
                  disabled={tutorialStep === 0}
                  className="flex items-center gap-2 px-6 py-3 rounded-xl font-semibold
                     bg-gray-100 text-gray-700 hover:bg-gray-200
                     disabled:opacity-40 disabled:cursor-not-allowed
                     transition-all duration-200"
                >
                  <ChevronLeft className="w-5 h-5" />
                  Atrás
                </button>

                <span className="text-sm font-medium text-gray-500">
                  {tutorialStep + 1} de {TUTORIAL_STEPS.length}
                </span>

                {tutorialStep < TUTORIAL_STEPS.length - 1 ? (
                  <button
                    onClick={() => setTutorialStep((prev) => prev + 1)}
                    className="flex items-center gap-2 px-6 py-3 rounded-xl font-semibold
                       bg-gradient-to-r from-[#1A936F] to-[#88D498] text-white
                       hover:shadow-lg hover:scale-105
                       transition-all duration-200"
                  >
                    Siguiente
                    <ChevronRight className="w-5 h-5" />
                  </button>
                ) : (
                  <button
                    onClick={() => setShowTutorial(false)}
                    className="px-6 py-3 rounded-xl font-semibold
                       bg-gradient-to-r from-[#1A936F] to-[#88D498] text-white
                       hover:shadow-lg hover:scale-105
                       transition-all duration-200"
                  >
                    Terminar Tutorial
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
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
  );
}
