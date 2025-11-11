import { useState, useMemo } from "react";
import {
  ArrowLeft,
  TrendingUp,
  ArrowRight,
  Calendar,
  DollarSign,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import { ChevronDown, ChevronUp } from "lucide-react";

interface Stock {
  ticker: string;
  percentage: number;
  logo_link: string;
}

interface DayValue {
  day: number;
  value: number;
}

interface MCSimulationData {
  simulation_lines: DayValue[][];
  mean_return_line: DayValue[];
  mode_return_line: DayValue[];
  mean_return: number;
  mode_return: number;
}

interface ProjectionPageProps {
  riskLevel: number;
  stocks: Stock[];
  mcSimulationData: MCSimulationData | null;
  onNext: () => void;
  onBack: () => void;
  onNavigate?: (page: "results" | "historical" | "projection") => void;
}

const formatNumber = (value: number) => {
  // Return formatted number with commas as thousands separators
  return value.toLocaleString(undefined, { maximumFractionDigits: 0 });
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const mean = payload.find((p: any) => p.dataKey === "mean");
    const mode = payload.find((p: any) => p.dataKey === "mode");

    const maxPoint = payload.reduce((max: any, p: any) => {
      if (p.value > max) {
        return p.value;
      }
      return max;
    }, 0);

    const maxPointValue = formatNumber(maxPoint);

    const minPoint = payload.reduce((min: any, p: any) => {
      if (p.value < min || min === 0) {
        return p.value;
      }
      return min;
    }, 0);

    const minPointValue = formatNumber(minPoint);

    return (
      <div className="bg-white p-3 shadow-lg rounded-xl border border-gray-200">
        <p className="font-semibold text-gray-700">Día {label}</p>
        {mean && (
          <p className="text-[#1A936F]">
            Promedio: <strong>${formatNumber(mean.value)}</strong>
          </p>
        )}
        {mode && (
          <p className="text-[#114B5F]">
            Moda: <strong>${formatNumber(mode.value)}</strong>
          </p>
        )}
        {maxPoint > 0 && (
          <p className="text-[#969696]">
            Máximo: <strong>${maxPointValue}</strong>
          </p>
        )}

        {minPoint > 0 && (
          <p className="text-[#969696]">
            Mínimo: <strong>${minPointValue}</strong>
          </p>
        )}
      </div>
    );
  }
  return null;
};

export default function ProjectionPage({
  riskLevel,
  stocks,
  mcSimulationData,
  onNext,
  onBack,
  onNavigate,
}: ProjectionPageProps) {
  const [investmentAmount, setInvestmentAmount] = useState<string>("10000");

  if (!mcSimulationData) {
    return (
      <div className="min-h-screen flex justify-center items-center text-white">
        Loading simulation...
      </div>
    );
  }

  const [showMonteCarlo, setShowMonteCarlo] = useState(false);
  const [showPortfolio, setShowPortfolio] = useState(false);


  const initialValue = parseFloat(investmentAmount) || 10000;

  // Recharts-friendly data array with investment amount applied
  const chartData = useMemo(() => {
    return mcSimulationData.mean_return_line.map((meanPoint, index) => {
      const point: any = {
        day: meanPoint.day,
      };

      // Add simulation lines for this day
      mcSimulationData.simulation_lines.forEach((line, simIdx) => {
        const simPoint = line[index];
        if (simPoint) {
          point[`sim${simIdx}`] = simPoint.value * initialValue;
        }
      });

      // Add mean and mode for this day
      point.mean = meanPoint.value * initialValue;

      const modePoint = mcSimulationData.mode_return_line[index];
      if (modePoint) {
        point.mode = modePoint.value * initialValue;
      }

      return point;
    });
  }, [mcSimulationData, initialValue]);

  // --- Metrics based on mode_return (corrected) ---
  console.log(
    "mcSimulationData.mode_return ==>> ",
    mcSimulationData.mode_return
  );
  const finalValue = initialValue * (mcSimulationData.mode_return + 1);
  console.log("finalValue ==>> ", finalValue);
  const totalReturn = initialValue * mcSimulationData.mode_return;
  console.log("totalReturn ==>> ", totalReturn);
  const returnPercentage = ((totalReturn / initialValue) * 100).toFixed(2);
  const expectedMonthlyReturn = (totalReturn / 12).toFixed(2);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#114B5F] via-[#0d3d4d] to-[#1A936F]">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjAzKSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-40"></div>

      <div className="relative">
        {/* --- Header --- */}
        <div className="bg-white/5 backdrop-blur-sm border-b border-white/10 py-8 px-6">
          <div className="mx-auto relative flex items-center justify-center gap-3">
            <button
              onClick={onBack}
              className="absolute left-0 hover:bg-white/10 p-2.5 rounded-xl transition-all border border-white/20 hover:border-white/40 group"
              aria-label="Volver"
            >
              <ArrowLeft className="w-6 h-6 text-white group-hover:text-[#88D498] transition-colors" />
            </button>
            <div className="absolute right-0 flex items-center gap-2">
              <button
                onClick={() => onNavigate?.("results")}
                className="px-3 py-1 rounded-lg text-sm font-medium text-white/80 hover:bg-white/10"
              >
                Resultados
              </button>
              <button
                onClick={() => onNavigate?.("projection")}
                className="px-3 py-1 rounded-lg text-sm font-semibold bg-white/5 text-white/90 border border-white/10 hover:bg-white/10"
                aria-current="page"
              >
                Proyección
              </button>
              <button
                onClick={() => onNavigate?.("historical")}
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

        {/* --- Metrics cards --- */}
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
                  Ganancias Proyectadas
                </p>
              </div>
              <p className="text-4xl font-bold mb-1">
                $
                {totalReturn.toLocaleString(undefined, {
                  maximumFractionDigits: 0,
                })}
              </p>
              <p className="text-lg font-semibold text-white/90">
                +{returnPercentage}%
              </p>
            </div>

            <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-white/20">
              <div className="flex items-center gap-3 mb-3">
                <Calendar className="w-5 h-5 text-[#1A936F]" />
                <p className="text-sm font-semibold text-gray-500">
                  Valor Final Proyectado (12 meses)
                </p>
              </div>
              <p className="text-4xl font-bold text-[#114B5F] mb-1">
                $
                {finalValue.toLocaleString(undefined, {
                  maximumFractionDigits: 0,
                })}
              </p>
              <p className="text-sm text-gray-600">
                ~${expectedMonthlyReturn}/mes
              </p>
            </div>
          </div>

    {/* --- Collapsible: Proyección Monte Carlo --- */}
    <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 mb-8 overflow-hidden transition-all">
      <button
        onClick={() => setShowMonteCarlo((prev) => !prev)}
        className="w-full flex justify-between items-center px-8 py-6 text-left"
      >
        <h3 className="text-2xl font-bold text-[#114B5F]">
          Proyección Monte Carlo (252 días)
        </h3>
        {showMonteCarlo ? (
          <ChevronUp className="w-6 h-6 text-[#114B5F]" />
        ) : (
          <ChevronDown className="w-6 h-6 text-[#114B5F]" />
        )}
      </button>

      {showMonteCarlo && (
        <div className="px-8 pb-8">
          <div className="relative h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={chartData}
                margin={{ top: 20, right: 20, bottom: 20, left: 0 }}
              >
                <XAxis
                  dataKey="day"
                  label={{
                    value: "Días",
                    position: "insideBottom",
                    offset: -10,
                  }}
                />
                <YAxis
                  domain={["dataMin", "dataMax"]}
                  tickFormatter={(value) =>
                    `$${Math.round(value).toLocaleString()}`
                  }
                  width="auto"
                  label={{
                    value: "Valor del Portafolio",
                    angle: -90,
                    position: "insideLeft",
                    offset: 10,
                    style: { textAnchor: "middle" },
                  }}
                />
                <Tooltip content={<CustomTooltip />} />

                {/* Simulation lines */}
                {mcSimulationData.simulation_lines.map((_, idx) => (
                  <Line
                    key={idx}
                    type="monotone"
                    dataKey={`sim${idx}`}
                    stroke="#464141"
                    strokeOpacity={0.15}
                    dot={false}
                    isAnimationActive={false}
                  />
                ))}

                {/* Mean line */}
                <Line
                  type="monotone"
                  dataKey="mean"
                  stroke="#1A936F"
                  strokeWidth={3}
                  dot={false}
                  name="Promedio"
                />

                {/* Mode line */}
                <Line
                  type="monotone"
                  dataKey="mode"
                  stroke="#114B5F"
                  strokeWidth={3}
                  dot={false}
                  strokeDasharray="7 7"
                  name="Moda"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>

          {/* --- Portfolio composition --- */}
          {/* --- Collapsible: Composición del Portafolio --- */}
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 mb-8 overflow-hidden transition-all">
            <button
              onClick={() => setShowPortfolio((prev) => !prev)}
              className="w-full flex justify-between items-center px-8 py-6 text-left"
            >
              <h3 className="text-xl font-bold text-[#114B5F]">
                Composición del Portafolio
              </h3>
              {showPortfolio ? (
                <ChevronUp className="w-6 h-6 text-[#114B5F]" />
              ) : (
                <ChevronDown className="w-6 h-6 text-[#114B5F]" />
              )}
            </button>

            {showPortfolio && (
              <div className="px-8 pb-8">
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {stocks.map((stock) => (
                    <div
                      key={stock.ticker}
                      className="p-4 bg-gradient-to-br from-gray-50 to-white rounded-xl border border-gray-200 flex items-center justify-between"
                    >
                      <div className="flex-shrink-0">
                        <img
                          src={stock.logo_link}
                          alt={`${stock.ticker} logo`}
                          className="w-12 h-12 object-contain"
                          onError={(e) => {
                            e.currentTarget.style.display = "none";
                            e.currentTarget.parentElement!.innerHTML = `<span class='text-lg font-bold text-[#114B5F]'>${stock.ticker}</span>`;
                          }}
                        />
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-[#114B5F]">
                          {stock.ticker}
                        </p>
                        <p className="text-2xl font-bold text-[#1A936F]">
                          {stock.percentage.toFixed(2)}%
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <button
            onClick={onNext}
            className="group w-full px-8 py-5 bg-gradient-to-r from-[#1A936F] to-[#88D498] text-white font-bold text-2xl rounded-2xl shadow-2xl hover:shadow-[#1A936F]/50 transform hover:scale-105 transition-all duration-300 overflow-hidden relative"
          >
            <span className="relative z-10 flex items-center justify-center gap-3">
              Ver Rendimiento Histórico
              <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-[#88D498] to-[#1A936F] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </button>
        </div>
      </div>
    </div>
  );
}
