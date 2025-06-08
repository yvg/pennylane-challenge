import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useParams } from 'react-router'

import { CustomerInformation } from 'app/screens/InvoiceShow/components/CustomerInformation/CustomerInformation'
import { ViewModelContextProvider } from './viewModel/InvoiceShow.ViewModelProvider'
import { getInvoiceShowViewModel } from './viewModel/InvoiceShow.ViewModel.provider'
import { StatusInformation } from './components/StatusInformation/StatusInformation'
import { Invoicelines } from './components/InvoiceLines/InvoiceLines'
import { InvoiceActions } from './components/InvoiceActions/InvoiceActions'

import './InvoiceShow.screen.css'


// TODO: Error boundaries should be used here

export const InvoiceShowScreen = () => {
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
    return <div>Loading…</div>
  }

  return (
    <ViewModelContextProvider viewModelFactory={() => invoiceViewModel}>
      <div>
        <header className="invoice-header">
          <Link to="/">⬅ Back to invoices</Link>
          <div className="invoice-header-title">
            <h2>Invoice {id}</h2>
            <InvoiceActions />
          </div>
          <div className="invoice-header-information">
            <CustomerInformation />
          </div>
          <StatusInformation />
        </header>
        <Invoicelines />
      </div>
    </ViewModelContextProvider>
  )
}
