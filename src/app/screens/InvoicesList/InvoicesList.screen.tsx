import { useEffect, useState } from 'react'
import { ViewModelContextProvider } from './viewModel/InvoicesList2.ViewModelProvider'
import { InvoicesHeader } from './InvoicesHeader/InvoicesHeader'
import { InvoicesFilters } from './InvoicesFilters/InvoicesFilters'
import { InvoicesList } from './InvoicesList/InvoicesList'
import { getInvoicesList2ViewModel } from './viewModel/InvoicesList2.ViewModel.provider'

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
      <div>
        <InvoicesHeader />
        <InvoicesFilters />
        <InvoicesList />
      </div>
    </ViewModelContextProvider>
  )
}
