import { useState } from "react";
import {
  ArrowLeft,
  TrendingUp,
  ArrowRight,
  Calendar,
  DollarSign,
} from "lucide-react";

interface Stock {
  ticker: string;
  name: string;
  percentage: number;
}

interface ProjectionPageProps {
  selectedIndustries: string[];
  riskLevel: number;
  stocks: Stock[];
  onNext: () => void;
  onBack: () => void;
  onNavigate?: (page: "results" | "historical" | "projection") => void;
}

export default function ProjectionPage({
  riskLevel,
  stocks,
  onNext,
  onBack,
  onNavigate,
}: ProjectionPageProps) {
  const [investmentAmount, setInvestmentAmount] = useState<string>("10000");

  const generateProjectionData = () => {
    const amount = parseFloat(investmentAmount) || 10000;
    const baseReturn = riskLevel < 10 ? 0.06 : riskLevel < 20 ? 0.1 : 0.15;
    const volatility = riskLevel / 100;

    const data = [];
    for (let month = 0; month <= 12; month++) {
      const timeProgress = month / 12;
      const randomFactor = Math.sin(month * 1.5) * volatility * 0.5 + 1;
      const value = amount * (1 + baseReturn * timeProgress * randomFactor);
      data.push({
        month,
        value: Math.round(value),
        label: month === 0 ? "Hoy" : `${month}m`,
      });
    }
    return data;
  };

  const projectionData = generateProjectionData();
  const initialValue = projectionData[0].value;
  const finalValue = projectionData[12].value;
  const totalReturn = finalValue - initialValue;
  const returnPercentage = ((totalReturn / initialValue) * 100).toFixed(2);

  const maxValue = Math.max(...projectionData.map((d) => d.value));
  const minValue = Math.min(...projectionData.map((d) => d.value));

  const expectedMonthlyReturn = (finalValue / 12 - initialValue / 12).toFixed(
    2
  );

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
                className="px-3 py-1 rounded-lg text-sm font-semibold bg-white/5 text-white/90 border border-white/10 hover:bg-white/10"
              >
                Proyección
              </button>
              <button
                onClick={() => onNavigate?.('historical')}
                className="px-3 py-1 rounded-lg text-sm font-medium text-white/80 hover:bg-white/10"
                aria-current="page"
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

        <div className="max-w-6xl mx-auto px-6 py-12">
          <div className="text-center mb-8">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Proyección de Crecimiento
            </h2>
            <p className="text-xl text-white/80">
              Visualiza el rendimiento esperado de tu portafolio a 12 meses
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-6 mb-8">
            <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-white/20">
              <div className="flex items-center gap-3 mb-3">
                <DollarSign className="w-5 h-5 text-[#1A936F]" />
                <p className="text-sm font-semibold text-gray-500">
                  Inversión Inicial
                </p>
              </div>
              <div className="mb-4">
                <input
                  type="number"
                  value={investmentAmount}
                  onChange={(e) => setInvestmentAmount(e.target.value)}
                  className="w-full text-3xl font-bold text-[#114B5F] bg-transparent border-b-2 border-[#88D498] focus:outline-none focus:border-[#1A936F] transition-colors"
                  placeholder="10000"
                />
                <p className="text-sm text-gray-500 mt-1">USD</p>
              </div>
            </div>

            <div className="bg-gradient-to-br from-[#1A936F] to-[#88D498] rounded-2xl shadow-xl p-6 border border-white/20 text-white">
              <div className="flex items-center gap-3 mb-3">
                <TrendingUp className="w-5 h-5" />
                <p className="text-sm font-semibold text-white/90">
                  Retorno Proyectado
                </p>
              </div>
              <p className="text-4xl font-bold mb-1">
                ${totalReturn.toLocaleString()}
              </p>
              <p className="text-lg font-semibold text-white/90">
                +{returnPercentage}%
              </p>
            </div>

            <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-white/20">
              <div className="flex items-center gap-3 mb-3">
                <Calendar className="w-5 h-5 text-[#1A936F]" />
                <p className="text-sm font-semibold text-gray-500">
                  Valor Final (12 meses)
                </p>
              </div>
              <p className="text-4xl font-bold text-[#114B5F] mb-1">
                ${finalValue.toLocaleString()}
              </p>
              <p className="text-sm text-gray-600">
                ~${expectedMonthlyReturn}/mes
              </p>
            </div>
          </div>

          <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-white/20 mb-8">
            <h3 className="text-2xl font-bold text-[#114B5F] mb-6">
              Proyección a 12 Meses
            </h3>

            <div className="relative h-80">
              <svg
                width="100%"
                height="100%"
                viewBox="0 0 800 300"
                preserveAspectRatio="xMidYMid meet"
              >
                <defs>
                  <linearGradient
                    id="lineGradient"
                    x1="0%"
                    y1="0%"
                    x2="100%"
                    y2="0%"
                  >
                    <stop
                      offset="0%"
                      style={{ stopColor: "#1A936F", stopOpacity: 1 }}
                    />
                    <stop
                      offset="100%"
                      style={{ stopColor: "#88D498", stopOpacity: 1 }}
                    />
                  </linearGradient>
                  <linearGradient
                    id="areaGradient"
                    x1="0%"
                    y1="0%"
                    x2="0%"
                    y2="100%"
                  >
                    <stop
                      offset="0%"
                      style={{ stopColor: "#88D498", stopOpacity: 0.3 }}
                    />
                    <stop
                      offset="100%"
                      style={{ stopColor: "#88D498", stopOpacity: 0 }}
                    />
                  </linearGradient>
                </defs>

                <line
                  x1="60"
                  y1="250"
                  x2="760"
                  y2="250"
                  stroke="#e5e7eb"
                  strokeWidth="2"
                />
                <line
                  x1="60"
                  y1="30"
                  x2="60"
                  y2="250"
                  stroke="#e5e7eb"
                  strokeWidth="2"
                />

                {projectionData.map((point, index) => {
                  const x = 60 + (index * 700) / 12;
                  return (
                    <g key={index}>
                      <line
                        x1={x}
                        y1="250"
                        x2={x}
                        y2="255"
                        stroke="#9ca3af"
                        strokeWidth="1"
                      />
                      <text
                        x={x}
                        y="270"
                        textAnchor="middle"
                        fill="#6b7280"
                        fontSize="12"
                      >
                        {point.label}
                      </text>
                    </g>
                  );
                })}

                <path
                  d={projectionData
                    .map((point, index) => {
                      const x = 60 + (index * 700) / 12;
                      const normalizedValue =
                        (point.value - minValue) / (maxValue - minValue);
                      const y = 250 - normalizedValue * 200;
                      return `${index === 0 ? "M" : "L"} ${x} ${y}`;
                    })
                    .join(" ")}
                  fill="none"
                  stroke="url(#lineGradient)"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />

                <path
                  d={
                    projectionData
                      .map((point, index) => {
                        const x = 60 + (index * 700) / 12;
                        const normalizedValue =
                          (point.value - minValue) / (maxValue - minValue);
                        const y = 250 - normalizedValue * 200;
                        return `${index === 0 ? "M" : "L"} ${x} ${y}`;
                      })
                      .join(" ") + " L 760 250 L 60 250 Z"
                  }
                  fill="url(#areaGradient)"
                />

                {projectionData
                  .filter((_, i) => i % 3 === 0)
                  .map((point, index) => {
                    const actualIndex = index * 3;
                    const x = 60 + (actualIndex * 700) / 12;
                    const normalizedValue =
                      (point.value - minValue) / (maxValue - minValue);
                    const y = 250 - normalizedValue * 200;
                    return (
                      <g key={actualIndex}>
                        <circle
                          cx={x}
                          cy={y}
                          r="5"
                          fill="white"
                          stroke="#1A936F"
                          strokeWidth="3"
                        />
                        <text
                          x={x}
                          y={y - 15}
                          textAnchor="middle"
                          fill="#114B5F"
                          fontSize="13"
                          fontWeight="600"
                        >
                          ${(point.value / 1000).toFixed(1)}k
                        </text>
                      </g>
                    );
                  })}
              </svg>
            </div>

            <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl border border-blue-200/50">
              <p className="text-sm text-gray-700">
                <span className="font-semibold">Nota:</span> Esta proyección es
                estimativa y se basa en datos históricos. Los resultados reales
                pueden variar según las condiciones del mercado.
              </p>
            </div>
          </div>

          <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-white/20 mb-8">
            <h3 className="text-xl font-bold text-[#114B5F] mb-4">
              Composición del Portafolio
            </h3>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {stocks.map((stock) => (
                <div
                  key={stock.ticker}
                  className="p-4 bg-gradient-to-br from-gray-50 to-white rounded-xl border border-gray-200"
                >
                  <p className="text-lg font-bold text-[#114B5F]">
                    {stock.ticker}
                  </p>
                  <p className="text-sm text-gray-600 mb-2">{stock.name}</p>
                  <p className="text-2xl font-bold text-[#1A936F]">
                    {stock.percentage}%
                  </p>
                </div>
              ))}
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
              Ver Análisis Retrospectivo
              <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
            </span>
            <div
              className="absolute inset-0 bg-gradient-to-r from-[#88D498] to-[#1A936F]
                          opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            ></div>
          </button>
        </div>
      </div>
    </div>
  );
}
