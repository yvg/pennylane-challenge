import { useEffect, useState } from 'react'
import { useParams } from 'react-router'

import { CustomerInformation } from 'app/screens/InvoiceShow/components/CustomerInformation/CustomerInformation'
import { ViewModelContextProvider } from './viewModel/InvoiceShow.ViewModelProvider'
import { getInvoiceShowViewModel } from './viewModel/InvoiceShow.ViewModel.provider'
import { StatusInformation } from './components/StatusInformation/StatusInformation'
import { Invoicelines } from './components/InvoiceLines/InvoiceLines'
import { InvoiceActions } from './components/InvoiceActions/InvoiceActions'

import './InvoiceShow.css'

// TODO: Error boundaries should be used here

export const InvoiceShow = () => {
  const invoiceViewModel = getInvoiceShowViewModel()
  const { id } = useParams<{ id: string }>()
  const [isLoading, setIsLoading] = useState<boolean>(true)

  useEffect(() => {
    if (id) {
      invoiceViewModel.fetchInvoice(id).then(() => {
        setIsLoading(false)
      })
    }
  }, [id, invoiceViewModel])

  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <ViewModelContextProvider viewModelFactory={() => invoiceViewModel}>
      <div>
        <header className="invoice-header">
          <div className="invoice-header-actions">
            <InvoiceActions />
          </div>
          <div className="invoice-header-information">
            <div>
              <StatusInformation />
            </div>
            <div>
              <CustomerInformation />
            </div>
          </div>
        </header>
        <Invoicelines />
      </div>
    </ViewModelContextProvider>
  )
}
