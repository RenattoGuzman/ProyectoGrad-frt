import { useState, useEffect } from 'react'
import IndustrySelectionPage from './pages/IndustrySelectionPage'
import RiskSelectionPage from './pages/RiskSelectionPage'
import ResultsPage from './pages/ResultsPage'
import ProjectionPage from './pages/ProjectionPage'
import HistoricalPage from './pages/HistoricalPage'

import LoadingPage from './pages/LoadingPage'

import { API_LINK } from './variables'

type Page = 'industries' | 'risk' | 'results' | 'projection' | 'historical'

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

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('industries')
  const [selectedIndustries, setSelectedIndustries] = useState<string[]>([])
  const [riskLevel, setRiskLevel] = useState<number>(5)
  const [stocks, setStocks] = useState<Stock[]>([])
  const [portfolioData, setPortfolioData] = useState<PortfolioData | null>(null)
  const [loading, setLoading] = useState(false)
  const [lastAvailableDate, setLastAvailableDate] = useState<string>('')
  const [riskRanges, setRiskRanges] = useState<RiskRanges | null>(null)
  const [mcSimulationData, setMcSimulationData] = useState<MCSimulationData | null>(null)


  const industriesEnglish: Record<string, string> = {
    'Servicios Financieros': 'Financial Services',
    'Tecnología': 'Technology',
    'Consumo esencial': 'Consumer Defensive',
    'Consumo discrecional': 'Consumer Cyclical',
    'Servicios de comunicación': 'Communication Services',
    'Salud': 'Healthcare',
    'Industriales': 'Industrials',
    'Bienes Raíces': 'Real Estate',
  }

  const handleIndustriesNext = (industries: string[]) => {
    setSelectedIndustries(industries)
    setCurrentPage('risk')
  }

  const handleRiskBack = () => {
    setCurrentPage('industries')
  }

  // Translate industries to English
  const englishIndustries = selectedIndustries.map(
    industry => industriesEnglish[industry]
  )
  
  // Build query parameters
  const queryParams = englishIndustries
    .map(industry => `industries=${encodeURIComponent(industry)}`)
    .join('&')

  const handleRiskSubmit = async (risk: number, mode: 'auto' | 'manual') => {
    try {
      setLoading(true)
      
      
      let url: string
      
      if (mode === 'manual') {
        // Call endpoint with risk parameter
        console.log('risk ==>> ', risk);


        if (risk < -500){  
          url = `${API_LINK}/portfolio/min-variance?${queryParams}`
        } else if (risk > 500){
          url = `${API_LINK}/portfolio/max-variance?${queryParams}`
        } else {
          url = `${API_LINK}/portfolio/with-risk?${queryParams}&risk=${risk}`
        }
      } else {
        // Call max-sharpe endpoint
        url = `${API_LINK}/portfolio/max-sharpe?${queryParams}`
      }
      
      const response = await fetch(url)
      const data: PortfolioData = await response.json()
      
      // Store portfolio data
      setPortfolioData(data)
      setRiskLevel(risk)
      
      // Convert weights to stocks array
      const stocksArray: Stock[] = Object.entries(data.weights).map(([ticker, weight]) => ({
        ticker,
        percentage: weight * 100, // Convert to percentage
        logo_link: `https://raw.githubusercontent.com/davidepalazzo/ticker-logos/refs/heads/main/ticker_icons/${ticker}.png`
      }))
      
      setStocks(stocksArray)
      setCurrentPage('results')
      
    } catch (error) {
      console.error('Error fetching portfolio:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
  const fetchSimulation = async () => {
    if (!portfolioData) return // Wait for portfolioData
    setLoading(true)
    try {
      const response = await fetch(`${API_LINK}/simulation`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(portfolioData.weights) // Send weights only
      })

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`)
      }

      const data: MCSimulationData = await response.json()
      setMcSimulationData(data)
      setLoading(false)
      console.log('data ==>> ', data);
    } catch (error) {
      console.error('Error fetching Monte Carlo simulation:', error)
    }
  }

  fetchSimulation()
}, [portfolioData])

  const handleResultsBack = () => {
    setCurrentPage('risk')
  }

  const handleResultsNext = () => {
    setCurrentPage('projection')
  }

  const handleProjectionNext = () => {
    setCurrentPage('historical')
  }

  const handleProjectionBack = () => {
    setCurrentPage('results')
  }

  const handleHistoricalBack = () => {
    setCurrentPage('projection')
  }

  if (loading) {
    return (
      <LoadingPage message='Generando Portafolio...' />
    )
  }

  return (
    <div className="min-h-screen">
      {currentPage === 'industries' && (
        <IndustrySelectionPage onNext={handleIndustriesNext} />
      )}
      {currentPage === 'risk' && (
        <RiskSelectionPage
          selectedIndustries={selectedIndustries}
          onSubmit={handleRiskSubmit}
          onBack={handleRiskBack}
          setLastAvailableDate={setLastAvailableDate}
          setRiskGlobalRanges={setRiskRanges}
        />
      )}
      {currentPage === 'results' && portfolioData && (
        <ResultsPage
          selectedIndustries={selectedIndustries}
          riskLevel={riskLevel}
          stocks={stocks}
          portfolioData={portfolioData}
          lastAvailableDate={lastAvailableDate}
          onBack={handleResultsBack}
          onNext={handleResultsNext}
          onNavigate={setCurrentPage}
          globalRiskRanges={riskRanges}
        />
      )}
      {currentPage === 'projection' && mcSimulationData && (
        <ProjectionPage
          riskLevel={riskLevel}
          stocks={stocks}
          mcSimulationData={mcSimulationData}
          onNext={handleProjectionNext}
          onBack={handleProjectionBack}
          onNavigate={setCurrentPage}
        />
      )}
      {currentPage === 'historical' && portfolioData && (
        <HistoricalPage
          initialStocks={stocks}
          portfolioData={portfolioData}
          onBack={handleHistoricalBack}
          onNavigate={setCurrentPage}
          queryParams={queryParams}
        />
      )}
    </div>
  )
}

export default App