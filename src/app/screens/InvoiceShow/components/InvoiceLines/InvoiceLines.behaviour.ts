import { useEffect, useState, useSyncExternalStore } from 'react'
import { useViewModel } from '../../viewModel/InvoiceShow.ViewModelProvider'
import { Invoice } from 'types'

type InvoiceLines = Invoice['invoice_lines']

type UseInvoicelinesBehaviourReturnType = {
  states: {
    invoiceLines: InvoiceLines
  }
  handlers: {
    onClickDeleteButton: (invoiceLineId: number) => void
  }
}

export const useInvoicelinesBehaviour =
  (): UseInvoicelinesBehaviourReturnType => {
    const [invoiceLines, setInvoiceLines] = useState<InvoiceLines>([])
    const viewModel = useViewModel()

    const invoice = useSyncExternalStore(
      (callback) => viewModel.subscribeInvoice(callback),
      () => viewModel.getInvoice()
    )

    useEffect(() => {
      if (invoice) {
        setInvoiceLines(invoice.invoice_lines)
      }
    }, [invoice])

    const onClickDeleteButton = (invoiceLineId: number) => {
      viewModel.deleteInvoiceLine(invoiceLineId)
    }

    return {
      states: {
        invoiceLines,
      },
      handlers: {
        onClickDeleteButton,
      },
    }
  }
