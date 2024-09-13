'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import FirstDesign from "@/components/firstDesign/page"
import SecondDesign from "@/components/secondDesign/page"
import ThirdDesign from "@/components/thirdDesign/page"

export function RfpRateIncreaseTool() {
  const [selectedCarrier, setSelectedCarrier] = useState('')
  const [selectedDesign, setSelectedDesign] = useState('')
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [apiResult, setApiResult] = useState<any>()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSelectedFile(e.target.files[0])
    }
  }

  const handleSubmit = async () => {
    if (!selectedCarrier || !selectedFile || !selectedDesign) {
      alert("Please select carrier, file, and design.")
      return
    }

    const formData = new FormData()
    formData.append('carrier', selectedCarrier)
    formData.append('file', selectedFile)

    setIsLoading(true)
    setError(null)

    try {
      await new Promise((resolve) => setTimeout(resolve, 5000))
    //   const response = await fetch(`https://price-predictor-32xw.onrender.com/calculate`, {
    //     method: 'POST',
    //     body: formData,
    //   })

    //   if (!response.ok) {
    //     throw new Error('Failed to fetch data from the API')
    //   }

    //   const result = await response.json()
      setApiResult({
        "totals": {
            "Base Rate": 2284623.3,
            "Total Charge": 1431504.84,
            "DAS": 20771,
            "EDAS": 14806,
            "Delivery and Returns": 0,
            "Fuel Surcharge": 198766.34
        },
        "futureTotals": {
            "Base Rate": {
                "2025": 2421700.7,
                "2026": 2571846.14,
                "2027": 2736444.29,
                "2028": 2914313.17
            },
            "Total Charge": {
                "2025": 1518826.64,
                "2026": 1614512.72,
                "2027": 1717841.53,
                "2028": 1831219.07
            },
            "Fuel Surcharge": {
                "2025": 211089.85,
                "2026": 224599.6,
                "2027": 239198.57,
                "2028": 255224.87
            },
            "DAS": {
                "2025": 22058.8,
                "2026": 23448.5,
                "2027": 24972.65,
                "2028": 26620.84
            },
            "EDAS": {
                "2025": 15709.17,
                "2026": 16698.85,
                "2027": 17767.58,
                "2028": 18922.47
            },
            "Delivery and Returns": {
                "2025": 0,
                "2026": 0,
                "2027": 0,
                "2028": 0
            }
        },
        "carrierRateOfIncrease": {
            "2025": {
                "Base Rate": 6,
                "Total Charge": 6.1,
                "DAS": 6.2,
                "EDAS": 6.1,
                "Delivery and Returns": 6,
                "Fuel Surcharge": 6.2,
                "GRI": 5.9,
                "Signature Required": 6,
                "Return": 6.1,
                "residential_surcharge": 6.3,
                "additional_handling": 6.2
            },
            "2026": {
                "Base Rate": 6.2,
                "Total Charge": 6.3,
                "DAS": 6.3,
                "EDAS": 6.3,
                "Delivery and Returns": 6.2,
                "Fuel Surcharge": 6.4,
                "GRI": 6.1,
                "Signature Required": 6.2,
                "Return": 6.3,
                "residential_surcharge": 6.5,
                "additional_handling": 6.4
            },
            "2027": {
                "Base Rate": 6.4,
                "Total Charge": 6.4,
                "DAS": 6.5,
                "EDAS": 6.4,
                "Delivery and Returns": 6.3,
                "Fuel Surcharge": 6.5,
                "GRI": 6.2,
                "Signature Required": 6.3,
                "Return": 6.4,
                "residential_surcharge": 6.6,
                "additional_handling": 6.5
            },
            "2028": {
                "Base Rate": 6.5,
                "Total Charge": 6.6,
                "DAS": 6.6,
                "EDAS": 6.5,
                "Delivery and Returns": 6.4,
                "Fuel Surcharge": 6.7,
                "GRI": 6.3,
                "Signature Required": 6.4,
                "Return": 6.5,
                "residential_surcharge": 6.8,
                "additional_handling": 6.7
            }
        }
    }) 
    } catch (error: any) {
      setError(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  const renderDesign = () => {
    if (!apiResult) return null

    switch (selectedDesign) {
      case 'design1':
        return <FirstDesign data={apiResult} />
      case 'design2':
        return <SecondDesign data={apiResult} />
      case 'design3':
        return <ThirdDesign data={apiResult} />
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-4">
    <h1 className="text-3xl font-bold mb-8">RFP Rate Increase Tool</h1>
    
    {!apiResult ? (
      // Show the form only when data is not available
      <>
        <div className="bg-gray-800 p-6 rounded-lg w-full max-w-md">
          <h2 className="text-xl font-semibold mb-4">Upload PLD File</h2>
          <div className="border-2 border-dashed border-gray-600 rounded-lg p-4 flex justify-center">
            <label className="cursor-pointer bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded">
              <span className="mr-2">📁</span> Select PLD File
              <input 
                type="file" 
                onChange={handleFileChange} 
                className="hidden"
              />
            </label>
            {selectedFile && <p className="mt-2">{selectedFile.name || ""}</p>}
          </div>
        </div>

        <div className="mt-6 w-full max-w-md">
          <select 
            value={selectedCarrier} 
            onChange={(e) => setSelectedCarrier(e.target.value)}
            className="w-full mb-4 bg-gray-700 border-gray-600 text-white p-2 rounded"
          >
            <option value="">Select Carrier</option>
            <option value="UPS">UPS</option>
            <option value="FedEx">FedEx</option>
          </select>

          <div className="flex justify-between mb-4 gap-2">
            {['design1', 'design2', 'design3'].map((design) => (
              <button 
                key={design}
                onClick={() => setSelectedDesign(design)}
                className={`flex-1 px-4 py-2 rounded ${
                  selectedDesign === design 
                    ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                    : 'bg-gray-700 hover:bg-gray-600 text-gray-300 border border-gray-600'
                }`}
              >
                Design {design.slice(-1)}
              </button>
            ))}
          </div>

          <button 
            onClick={handleSubmit}
            className="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
          >
            {isLoading ? 'Processing...' : 'Process'}
          </button>
        </div>

        {error && <p className="text-red-500 mt-4">{error}</p>}
      </>
    ) : (
      // Show the design component when data is available
      <div className="mt-8 w-full h-screen">
        {renderDesign()}
      </div>
    )}
    </div>

  )
}
