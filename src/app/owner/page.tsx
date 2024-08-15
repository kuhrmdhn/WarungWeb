"use client"
import React, { useEffect } from 'react'
import Summary from './dashboard/Summary'
import SalesReport from './dashboard/SalesReport'
import { ownerRouter } from '@/lib/database/ownerRouter'
import Title from '@/ui/component/SectionTitle/Title'

export default function OwnerDashboard() {
  const { getOwnerData } = ownerRouter
  useEffect(() => {
    getOwnerData()
  }, [getOwnerData])

  return (
    <section className='bg-white min-h-[87svh] h-max w-full px-2 sm:px-5 pt-3 sm:pt-7'>
      <Title>
        Dashboard
      </Title>
      <Summary />
      <SalesReport />
    </section>
  )
}
