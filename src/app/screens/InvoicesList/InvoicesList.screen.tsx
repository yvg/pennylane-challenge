import { useEffect, useState } from 'react'
import { ViewModelContextProvider } from './viewModel/InvoicesList.ViewModelProvider'
import { InvoicesHeader } from './InvoicesHeader/InvoicesHeader'
import { InvoicesFilters } from './InvoicesFilters/InvoicesFilters'
import { InvoicesList } from './InvoicesList/InvoicesList'
import { getInvoicesList2ViewModel } from './viewModel/InvoicesList.ViewModel.provider'

import './InvoicesList.screen.css'

export const InvoicesListScreen = () => {
  const invoicesViewModel = getInvoicesList2ViewModel()
  const [isLoading, setIsLoading] = useState<boolean>(true)

  useEffect(() => {
    invoicesViewModel.fetchInvoices().then(() => {
      setIsLoading(false)
    })
  }, [invoicesViewModel])

  if (isLoading) {
    return <div>Loading…</div>
  }

  return (
    <ViewModelContextProvider viewModelFactory={() => invoicesViewModel}>
      <div className="invoices-list-top">
        <InvoicesHeader />
        <InvoicesFilters />
      </div>
      <InvoicesList />
    </ViewModelContextProvider>
  )
}
