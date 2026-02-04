"use client"
import { useEffect, useState } from "react"
import PortfolioModal from "./PortfolioModal"

interface PortfolioItem {
  id: string
  title: string
  description: string
  projectImage?: string
  hours: number
  rate: number
  cost: number
  startDate: string
  endDate?: string
}

export default function PortfolioSection() {
  const [portfolio, setPortfolio] = useState<PortfolioItem[]>([])

  const fetchPortfolio = async () => {
    const res = await fetch("/api/portfolio")
    const data = await res.json()
    setPortfolio(data)
  }

  useEffect(() => {
    fetchPortfolio()
  }, [])

  return (
    <div className="mt-8 w-full">
      <h2 className="text-xl font-semibold mb-4">Portfolio</h2>
      <div className="flex flex-col gap-4">
        {portfolio.map((p) => (
          <div key={p.id} className="border p-4 rounded-lg hover:shadow-md transition">
            {p.projectImage && (
              <img src={p.projectImage} alt={p.title} className="w-full h-48 object-cover rounded mb-2" />
            )}
            <h3 className="text-lg font-semibold">{p.title}</h3>
            <p>{p.description}</p>
            <p>Hours: {p.hours}</p>
            <p>Rate: ${p.rate}</p>
            <p>Project Cost: ${p.cost}</p>
            <p>
              Duration: {new Date(p.startDate).toLocaleDateString()} -{" "}
              {p.endDate ? new Date(p.endDate).toLocaleDateString() : "Present"}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-4">
        <PortfolioModal onAdd={fetchPortfolio} />
      </div>
    </div>
  )
}