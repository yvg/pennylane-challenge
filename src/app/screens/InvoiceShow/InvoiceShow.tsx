import { useEffect } from 'react'
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

  useEffect(() => {
    if (id) {
      invoiceViewModel.fetchInvoice(id)
    }
  }, [id, invoiceViewModel])

  return (
    <ViewModelContextProvider viewModelFactory={() => invoiceViewModel}>
      <div>
        <div className="invoice-header">
          <CustomerInformation />
          <InvoiceActions />
        </div>
        <StatusInformation />
        <Invoicelines />
      </div>
    </ViewModelContextProvider>
  )
}
