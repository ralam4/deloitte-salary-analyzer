import { Analytics } from '@vercel/analytics/react'
import DeloitteSalaryAnalyzer from './components/DeloitteSalaryAnalyzer'

export default function App() {
  return (
    <>
      <DeloitteSalaryAnalyzer />
      <Analytics />
    </>
  )
}
