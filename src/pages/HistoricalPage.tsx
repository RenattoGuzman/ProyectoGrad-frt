import { useState, useEffect, useMemo } from "react";
import { TrendingUp, ArrowLeft, DollarSign, Percent, Plus, ToggleLeft, ToggleRight } from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

import { API_LINK } from "../variables";

interface Stock {
  ticker: string;
  percentage: number;
  logo_link: string;
}

interface PortfolioData {
  weights: Record<string, number>;
  expected_annual_return: number;
  annual_volatility: number;
  sharpe_ratio: number;
}

interface BacktestingData {
  portfolio_growth: Array<{
    date: string;
    value: number;
  }>;
  final_return: number;
  start_date: string;
  end_date: string;
}

interface HistoricalPageProps {
  initialStocks: Stock[];
  portfolioData: PortfolioData | null;
  onBack: () => void;
  onNavigate?: (page: "results" | "historical" | "projection") => void;
  queryParams: string;
}

export default function HistoricalPage({
  initialStocks,
  portfolioData,
  onBack,
  onNavigate,
  queryParams,
}: HistoricalPageProps) {
  const [stocks, setStocks] = useState<Stock[]>(initialStocks);
  const [startDate, setStartDate] = useState<string>("2024-01-01");
  const [endDate, setEndDate] = useState<string>("2025-01-01");
  const [backtestingData, setBacktestingData] = useState<BacktestingData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [initialInvestment, setInitialInvestment] = useState<number>(10000);
  const [viewMode, setViewMode] = useState<"$" | "%">("$");
  const [autoAdjust, setAutoAdjust] = useState<boolean>(true);

  const [newTicker, setNewTicker] = useState<string>("");
  const [newPercentage, setNewPercentage] = useState<string>("");

  const [stockOptions, setStockOptions] = useState<string[]>([]);

  useEffect(() => {
    const fetchStockOptions = async () => {
      try {
        const response = await fetch(
          `${API_LINK}/stocks-available?${queryParams}`
        );
        const data = await response.json();
        setStockOptions(data.stocks);
      } catch (error) {
        console.error("Error fetching stock options:", error);
      }
    };

    fetchStockOptions();
  }, [queryParams]);

  const fetchBacktestingData = async () => {
    try {
      setLoading(true);
      setError(null);

      const portfolio_weights: Record<string, number> = {};
      stocks.forEach((stock) => {
        portfolio_weights[stock.ticker] = stock.percentage / 100;
      });

      const response = await fetch(`${API_LINK}/backtesting`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          portfolio_weights,
          start_date: startDate,
          end_date: endDate,
        }),
      });

      if (!response.ok) {
        throw new Error("Error al obtener datos históricos");
      }

      const data: BacktestingData = await response.json();
      setBacktestingData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
      console.error("Error fetching backtesting data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (stocks.length > 0 && startDate && endDate) {
      fetchBacktestingData();
    }
  }, [startDate, endDate, stocks]);

  const handleAddStock = () => {
    const ticker = newTicker.trim().toUpperCase();
    const percentage = parseFloat(newPercentage);

    if (!ticker) {
      alert("Por favor seleccione un ticker");
      return;
    }

    if (stocks.some(s => s.ticker === ticker)) {
      alert("Esta acción ya está en el portafolio");
      return;
    }

    if (isNaN(percentage) || percentage <= 0 || percentage > 100) {
      alert("Por favor ingrese un porcentaje válido entre 1 y 100");
      return;
    }

    const newStock = {
      ticker,
      percentage: autoAdjust ? 0 : percentage,
      logo_link: `https://raw.githubusercontent.com/davidepalazzo/ticker-logos/refs/heads/main/ticker_icons/${ticker}.png`,
    };

    const updatedStocks = [...stocks, newStock];

    if (autoAdjust) {
      const equalPercentage = 100 / updatedStocks.length;
      const rebalanced = updatedStocks.map((s) => ({
        ...s,
        percentage: equalPercentage,
      }));
      setStocks(rebalanced);
    } else {
      setStocks(updatedStocks);
    }

    setNewTicker("");
    setNewPercentage("");
  };

  const handleRemoveStock = (ticker: string) => {
    const updatedStocks = stocks.filter((s) => s.ticker !== ticker);
    
    if (autoAdjust && updatedStocks.length > 0) {
      const equalPercentage = 100 / updatedStocks.length;
      const rebalanced = updatedStocks.map((s) => ({
        ...s,
        percentage: equalPercentage,
      }));
      setStocks(rebalanced);
    } else {
      setStocks(updatedStocks);
    }
  };

  const handlePercentageChange = (ticker: string, newPercentage: string) => {
    const percentage = parseFloat(newPercentage);
    if (isNaN(percentage) || percentage < 0) return;

    const clampedPercentage = Math.min(percentage, 100);

    if (autoAdjust) {
      setStocks((prevStocks) => {
        const oldStock = prevStocks.find((s) => s.ticker === ticker);
        if (!oldStock) return prevStocks;

        const difference = clampedPercentage - oldStock.percentage;
        const otherStocks = prevStocks.filter((s) => s.ticker !== ticker);

        if (otherStocks.length === 0) {
          return prevStocks.map((s) =>
            s.ticker === ticker ? { ...s, percentage: clampedPercentage } : s
          );
        }

        const otherTotal = otherStocks.reduce((sum, s) => sum + s.percentage, 0);

        if (otherTotal === 0) {
          const remainingPercentage = 100 - clampedPercentage;
          const evenSplit = remainingPercentage / otherStocks.length;

          return prevStocks.map((s) =>
            s.ticker === ticker
              ? { ...s, percentage: clampedPercentage }
              : { ...s, percentage: evenSplit }
          );
        }

        const updatedStocks = prevStocks.map((s) => {
          if (s.ticker === ticker) {
            return { ...s, percentage: clampedPercentage };
          }

          const proportion = s.percentage / otherTotal;
          const adjustment = difference * proportion;
          const newPercentage = Math.max(0, s.percentage - adjustment);

          return { ...s, percentage: newPercentage };
        });

        return updatedStocks;
      });
    } else {
      setStocks((prevStocks) =>
        prevStocks.map((s) =>
          s.ticker === ticker ? { ...s, percentage: clampedPercentage } : s
        )
      );
    }
  };

  const totalPercentage = stocks.reduce((sum, s) => sum + s.percentage, 0);

  const finalValueUSD = backtestingData
    ? initialInvestment * backtestingData.final_return
    : initialInvestment;

  const totalReturnUSD = finalValueUSD - initialInvestment;

  const returnPercentage = backtestingData
    ? (backtestingData.final_return * 100).toFixed(2)
    : "0.00";

  const profitPercentage = backtestingData
    ? ((backtestingData.final_return - 1) * 100).toFixed(2)
    : "0.00";

  const historicalData = useMemo(() => {
    return (
      backtestingData?.portfolio_growth.map((point) => {
        const d = new Date(point.date);
        const dateLabel = d.toLocaleDateString("es-ES", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        });
        const valueUSD = initialInvestment * point.value;
        const valuePct = point.value * 100;
        return {
          rawDate: point.date,
          dateLabel,
          valueUSD,
          valuePct,
          rawReturn: point.value,
        };
      }) || []
    );
  }, [backtestingData, initialInvestment]);

  const { minValue, maxValue } = useMemo(() => {
    if (historicalData.length === 0) {
      return { minValue: 0, maxValue: initialInvestment * 1.2 };
    }
    if (viewMode === "$") {
      const vals = historicalData.map((d) => d.valueUSD);
      const min = Math.min(...vals);
      const max = Math.max(...vals);
      const padding = (max - min) * 0.1;
      return {
        minValue: Math.max(0, min - padding),
        maxValue: max + padding,
      };
    } else {
      const vals = historicalData.map((d) => d.valuePct);
      const min = Math.min(...vals, 0);
      const max = Math.max(...vals, 0);
      const padding = Math.abs(max - min) * 0.1;
      return {
        minValue: min - padding,
        maxValue: max + padding,
      };
    }
  }, [historicalData, viewMode, initialInvestment]);

  const currencyFormatter = (v: number) =>
    `$${v.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;

  const percentFormatter = (v: number) => `${v.toFixed(2)}%`;

  const CustomTooltip = ({ active, payload }: any) => {
    if (!active || !payload || payload.length === 0) return null;
    const datapoint = payload[0].payload;

    return (
      <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-xl p-4 border border-gray-200">
        <p className="text-sm font-semibold text-gray-700 mb-2">
          {datapoint.dateLabel}
        </p>
        <div className="space-y-1">
          {viewMode === "$" ? (
            <>
              <div className="flex items-center justify-between gap-4">
                <span className="text-sm font-medium text-gray-600">
                  Valor:
                </span>
                <span className="text-sm font-bold text-[#1A936F]">
                  {currencyFormatter(datapoint.valueUSD)}
                </span>
              </div>
              <div className="flex items-center justify-between gap-4">
                <span className="text-sm font-medium text-gray-600">
                  Retorno:
                </span>
                <span className="text-sm font-bold text-[#114B5F]">
                  {percentFormatter(datapoint.rawReturn * 100)}
                </span>
              </div>
            </>
          ) : (
            <div className="flex items-center justify-between gap-4">
              <span className="text-sm font-medium text-gray-600">
                Retorno:
              </span>
              <span className="text-sm font-bold text-[#1A936F]">
                {percentFormatter(datapoint.valuePct)}
              </span>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#114B5F] via-[#0d3d4d] to-[#1A936F]">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjAzKSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-40"></div>

      <div className="relative">
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
                className="px-3 py-1 rounded-lg text-sm font-medium text-white/80 hover:bg-white/10"
              >
                Proyección
              </button>
              <button
                onClick={() => onNavigate?.("historical")}
                className="px-3 py-1 rounded-lg text-sm font-semibold bg-white/5 text-white/90 border border-white/10 hover:bg-white/10"
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

        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="text-center mb-8">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Rendimiento Histórico
            </h2>
            <p className="text-xl text-white/80">
              Analiza el rendimiento histórico y personaliza tu portafolio
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-6 mb-8">
            <div className="lg:col-span-2 bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-white/20">
              <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
                <h3 className="text-2xl font-bold text-[#114B5F]">
                  Rendimiento Histórico
                </h3>
                <div className="flex gap-3 items-end flex-wrap">
                  <div>
                    <label className="text-xs text-gray-600 font-medium block mb-1">
                      Desde
                    </label>
                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="px-3 py-2 border-2 border-gray-300 rounded-lg text-sm focus:border-[#1A936F] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-600 font-medium block mb-1">
                      Hasta
                    </label>
                    <input
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="px-3 py-2 border-2 border-gray-300 rounded-lg text-sm focus:border-[#1A936F] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-600 font-medium block mb-1">
                      Vista
                    </label>
                    <div className="inline-flex rounded-lg bg-gray-100 p-1">
                      <button
                        onClick={() => setViewMode("$")}
                        className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 flex items-center gap-1 ${
                          viewMode === "$"
                            ? "bg-gradient-to-r from-[#1A936F] to-[#88D498] text-white shadow-lg"
                            : "text-gray-600 hover:bg-gray-200"
                        }`}
                      >
                        <DollarSign className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setViewMode("%")}
                        className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 flex items-center gap-1 ${
                          viewMode === "%"
                            ? "bg-gradient-to-r from-[#1A936F] to-[#88D498] text-white shadow-lg"
                            : "text-gray-600 hover:bg-gray-200"
                        }`}
                      >
                        <Percent className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {loading ? (
                <div className="h-96 flex items-center justify-center">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1A936F] mx-auto mb-4"></div>
                    <p className="text-gray-600">
                      Cargando datos históricos...
                    </p>
                  </div>
                </div>
              ) : error ? (
                <div className="h-96 flex items-center justify-center text-red-500">
                  <p>{error}</p>
                </div>
              ) : historicalData.length > 0 ? (
                <>
                  <div className="relative h-96 mb-6">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart
                        data={historicalData}
                        margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                      >
                        <defs>
                          <linearGradient
                            id="colorValue"
                            x1="0"
                            y1="0"
                            x2="0"
                            y2="1"
                          >
                            <stop
                              offset="5%"
                              stopColor="#88D498"
                              stopOpacity={0.4}
                            />
                            <stop
                              offset="95%"
                              stopColor="#88D498"
                              stopOpacity={0}
                            />
                          </linearGradient>
                          <linearGradient
                            id="lineGradient"
                            x1="0"
                            y1="0"
                            x2="1"
                            y2="0"
                          >
                            <stop
                              offset="0%"
                              stopColor="#1A936F"
                              stopOpacity={1}
                            />
                            <stop
                              offset="100%"
                              stopColor="#88D498"
                              stopOpacity={1}
                            />
                          </linearGradient>
                        </defs>

                        <XAxis
                          dataKey="dateLabel"
                          tick={{ fill: "#6b7280", fontSize: 11 }}
                          angle={-45}
                          textAnchor="end"
                          height={80}
                          label={{
                            value: "Fecha",
                            position: "insideBottom",
                            offset: -20,
                            style: {
                              fontSize: "14px",
                              fill: "#114B5F",
                              fontWeight: 600,
                            },
                          }}
                        />

                        <YAxis
                          domain={[minValue, maxValue]}
                          tickFormatter={(v) =>
                            viewMode === "$"
                              ? `$${Math.round(v).toLocaleString()}`
                              : `${v.toFixed(1)}%`
                          }
                          tick={{ fill: "#6b7280", fontSize: 11 }}
                          label={{
                            value:
                              viewMode === "$" ? "Valor (USD)" : "Retorno (%)",
                            angle: -90,
                            position: "insideLeft",
                            style: {
                              fontSize: "14px",
                              fill: "#114B5F",
                              fontWeight: 600,
                              textAnchor: "middle",
                            },
                          }}
                        />

                        <Tooltip content={<CustomTooltip />} />

                        <Area
                          type="monotone"
                          dataKey={viewMode === "$" ? "valueUSD" : "valuePct"}
                          stroke="url(#lineGradient)"
                          strokeWidth={3}
                          fill="url(#colorValue)"
                          dot={false}
                          activeDot={{
                            r: 6,
                            fill: "#1A936F",
                            stroke: "#fff",
                            strokeWidth: 2,
                          }}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="p-4 bg-gradient-to-br from-gray-50 to-white rounded-xl border border-gray-200">
                      <p className="text-sm font-semibold text-gray-500 mb-2">
                        Inversión Inicial
                      </p>
                      <input
                        type="number"
                        value={initialInvestment}
                        onChange={(e) =>
                          setInitialInvestment(Number(e.target.value))
                        }
                        className="w-full text-2xl font-bold text-[#114B5F] bg-transparent border-b-2 border-[#88D498] focus:outline-none focus:border-[#1A936F] transition-colors"
                        disabled={viewMode === "%"}
                        min={0}
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        {viewMode === "%" ? "Deshabilitado en vista %" : "USD"}
                      </p>
                    </div>

                    <div className="p-4 bg-gradient-to-br from-[#1A936F] to-[#88D498] rounded-xl text-white">
                      <p className="text-sm text-white/90 mb-2">
                        Ganancias Totales
                      </p>
                      {viewMode === "$" ? (
                        <>
                          <p className="text-2xl font-bold mb-1">
                            {currencyFormatter(totalReturnUSD)}
                          </p>
                          <p className="text-sm font-semibold">
                            {totalReturnUSD >= 0 ? "+" : ""}
                            {profitPercentage}%
                          </p>
                        </>
                      ) : (
                        <>
                          <p className="text-2xl font-bold mb-1">
                            {returnPercentage}%
                          </p>
                          <p className="text-sm font-semibold">
                            Retorno acumulado
                          </p>
                        </>
                      )}
                    </div>

                    <div className="p-4 bg-gradient-to-br from-gray-50 to-white rounded-xl border border-gray-200">
                      <p className="text-sm font-semibold text-gray-500 mb-2">
                        Valor Final
                      </p>
                      <p className="text-2xl font-bold text-[#114B5F]">
                        {viewMode === "$"
                          ? currencyFormatter(finalValueUSD)
                          : `${returnPercentage}%`}
                      </p>
                    </div>
                  </div>
                </>
              ) : (
                <div className="h-96 flex items-center justify-center text-gray-400">
                  <p>Seleccione un rango de fechas válido</p>
                </div>
              )}
            </div>

            <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-white/20">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-[#114B5F] flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-[#1A936F]" />
                  Portafolio Personalizado
                </h3>
              </div>

              <div className="mb-4 p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {autoAdjust ? (
                      <ToggleRight className="w-5 h-5 text-[#1A936F]" />
                    ) : (
                      <ToggleLeft className="w-5 h-5 text-gray-400" />
                    )}
                    <span className="text-sm font-semibold text-gray-700">
                      Auto-ajustar
                    </span>
                  </div>
                  <button
                    onClick={() => setAutoAdjust(!autoAdjust)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      autoAdjust ? "bg-[#1A936F]" : "bg-gray-300"
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        autoAdjust ? "translate-x-6" : "translate-x-1"
                      }`}
                    />
                  </button>
                </div>
                <p className="text-xs text-gray-600 mt-1">
                  {autoAdjust
                    ? "Los porcentajes se ajustan automáticamente"
                    : "Ajusta los porcentajes manualmente"}
                </p>
              </div>

              <div className="space-y-3 mb-4 max-h-80 overflow-y-auto">
                {stocks.map((stock) => (
                  <div
                    key={stock.ticker}
                    className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg border border-gray-200 hover:border-[#88D498] transition-colors"
                  >
                    <div className="flex-shrink-0">
                      <img
                        src={stock.logo_link}
                        alt={`${stock.ticker} logo`}
                        className="w-10 h-10 object-contain"
                        onError={(e) => {
                          e.currentTarget.style.display = "none";
                        }}
                      />
                    </div>
                    <div className="flex-1">
                      <p className="font-bold text-[#114B5F] text-sm">
                        {stock.ticker}
                      </p>
                    </div>
                    <input
                      type="number"
                      value={stock.percentage.toFixed(1)}
                      onChange={(e) =>
                        handlePercentageChange(stock.ticker, e.target.value)
                      }
                      className="w-20 px-2 py-1 text-sm border-2 border-gray-300 rounded-lg text-center focus:border-[#1A936F] focus:outline-none"
                      min="0"
                      max="100"
                      step="0.1"
                    />
                    <span className="text-sm text-gray-600">%</span>
                    <button
                      onClick={() => handleRemoveStock(stock.ticker)}
                      className="ml-1 text-red-500 hover:text-red-700 transition-colors text-xs font-semibold"
                      title="Eliminar"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>

              <div className="mb-4 p-3 bg-gradient-to-r from-[#1A936F]/10 to-[#88D498]/10 rounded-lg border border-[#88D498]/30">
                <p className="text-sm text-gray-600">Total asignado</p>
                <p
                  className={`text-2xl font-bold ${
                    Math.abs(totalPercentage - 100) < 0.1
                      ? "text-[#1A936F]"
                      : totalPercentage > 100
                      ? "text-red-500"
                      : "text-amber-500"
                  }`}
                >
                  {totalPercentage.toFixed(1)}%
                </p>
                {Math.abs(totalPercentage - 100) >= 0.1 && (
                  <p className="text-xs text-gray-500 mt-1">
                    {totalPercentage > 100 ? "Excede 100%" : "Debe sumar 100%"}
                  </p>
                )}
              </div>

              <div className="border-t border-gray-200 pt-4">
                <p className="text-sm font-semibold text-gray-700 mb-3">
                  Agregar Acción
                </p>
                <div className="space-y-2">
                  <select
                    value={newTicker}
                    onChange={(e) => setNewTicker(e.target.value)}
                    className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg text-sm focus:border-[#1A936F] focus:outline-none"
                  >
                    <option value="">Selecciona un ticker...</option>
                    {stockOptions
                      .filter(ticker => !stocks.some(s => s.ticker === ticker))
                      .map((ticker) => (
                        <option key={ticker} value={ticker}>
                          {ticker}
                        </option>
                      ))}
                  </select>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      value={newPercentage}
                      onChange={(e) => setNewPercentage(e.target.value)}
                      placeholder={autoAdjust ? "%" : "% (requerido)"}
                      className="flex-1 px-3 py-2 border-2 border-gray-300 rounded-lg text-sm focus:border-[#1A936F] focus:outline-none"
                      min="0"
                      max="100"
                    />
                    <button
                      onClick={handleAddStock}
                      disabled={!newTicker || (!autoAdjust && !newPercentage)}
                      className="px-4 py-2 bg-gradient-to-r from-[#1A936F] to-[#88D498] text-white rounded-lg hover:shadow-lg transition-all font-medium text-sm flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Plus className="w-4 h-4" />
                      Agregar
                    </button>
                  </div>
                  {autoAdjust && (
                    <p className="text-xs text-gray-500 italic">
                      En modo auto-ajustar, los porcentajes se distribuyen automáticamente
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}