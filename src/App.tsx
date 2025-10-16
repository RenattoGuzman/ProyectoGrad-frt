import { useState } from 'react'
import IndustrySelectionPage from './pages/IndustrySelectionPage'
import RiskSelectionPage from './pages/RiskSelectionPage'
import ResultsPage from './pages/ResultsPage'
import ProjectionPage from './pages/ProjectionPage'
import HistoricalPage from './pages/HistoricalPage'

type Page = 'industries' | 'risk' | 'results' | 'projection' | 'historical'

interface Stock {
  ticker: string
  name: string
  percentage: number
}

const DUMMY_STOCKS: Stock[] = [
  { ticker: 'AAPL', name: 'Apple Inc.', percentage: 25 },
  { ticker: 'MSFT', name: 'Microsoft', percentage: 13 },
  { ticker: 'ALLE', name: 'Allegion', percentage: 23 },
  { ticker: 'NDSN', name: 'Nordson', percentage: 39 }
]

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('industries')
  const [selectedIndustries, setSelectedIndustries] = useState<string[]>([])
  const [riskLevel, setRiskLevel] = useState<number>(5)

  const handleIndustriesNext = (industries: string[]) => {
    setSelectedIndustries(industries)
    setCurrentPage('risk')
  }

  const handleRiskBack = () => {
    setCurrentPage('industries')
  }

  const handleRiskSubmit = (risk: number) => {
    setRiskLevel(risk)
    setCurrentPage('results')
  }

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
        />
      )}
      {currentPage === 'results' && (
        <ResultsPage
          selectedIndustries={selectedIndustries}
          riskLevel={riskLevel}
          onBack={handleResultsBack}
          onNext={handleResultsNext}
          onNavigate={setCurrentPage}
        />
      )}
      {currentPage === 'projection' && (
        <ProjectionPage
          selectedIndustries={selectedIndustries}
          riskLevel={riskLevel}
          stocks={DUMMY_STOCKS}
          onBack={handleProjectionBack}
          onNext={handleProjectionNext}
          onNavigate={setCurrentPage}
        />
      )}
      {currentPage === 'historical' && (
        <HistoricalPage
          initialStocks={DUMMY_STOCKS}
          onBack={handleHistoricalBack}
          onNavigate={setCurrentPage}
        />
      )}
    </div>
  )
}

export default App;
