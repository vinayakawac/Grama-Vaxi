'use client'

import { useState } from 'react'
import { CampAlertForm } from '@/components/camps/CampAlertForm'
import { CampPreviewCard } from '@/components/camps/CampPreviewCard'
import { CampHistoryList } from '@/components/camps/CampHistoryList'

export default function CampsPage() {
  const [refreshTrigger, setRefreshTrigger] = useState(0)
  const [previewValues, setPreviewValues] = useState<{
    village?: string
    date?: string
    time?: string
    message?: string
  }>({})

  const handleSuccess = () => {
    setRefreshTrigger((prev) => prev + 1)
  }

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 gap-8 xl:grid-cols-2">
        {/* Left Column — Create Form + Preview */}
        <div className="space-y-6">
          <CampAlertForm
            onSuccess={handleSuccess}
            onValuesChange={setPreviewValues}
          />
          <CampPreviewCard {...previewValues} />
        </div>

        {/* Right Column — Camp History */}
        <div className="space-y-6">
          <CampHistoryList refreshTrigger={refreshTrigger} />
        </div>
      </div>
    </div>
  )
}
