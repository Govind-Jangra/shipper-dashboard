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
      const response = await fetch(`https://price-predictor-32xw.onrender.com/calculate`, {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error('Failed to fetch data from the API')
      }

      const result = await response.json()
      setApiResult(result) 
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
