import { useEffect, useState, useSyncExternalStore } from 'react'
import { useViewModel } from '../../viewModel/InvoiceShow.ViewModelProvider'
import { Invoice } from 'types'

type InvoiceLines = Invoice['invoice_lines']

type UseInvoicelinesBehaviourReturnType = {
  states: {
    invoiceLines: InvoiceLines
    displayInvoiceLines: boolean
    editable: boolean
  }
  handlers: {
    onClickDeleteButton: (invoiceLineId: number) => void
    onChangeQuantity: (invoiceLineId: number, quantity: string) => void
  }
}

export const useInvoicelinesBehaviour =
  (): UseInvoicelinesBehaviourReturnType => {
    const [invoiceLines, setInvoiceLines] = useState<InvoiceLines>([])
    const [displayInvoiceLines, setDisplayInvoiceLines] =
      useState<boolean>(false)
    const [editable, setEditable] = useState<boolean>(false)
    const viewModel = useViewModel()

    const invoice = useSyncExternalStore(
      (callback) => viewModel.subscribeInvoice(callback),
      () => viewModel.getInvoice()
    )

    useEffect(() => {
      if (invoice) {
        setInvoiceLines(invoice.invoice_lines)
        setDisplayInvoiceLines(invoice.invoice_lines.length > 0)
        setEditable(!invoice.finalized)
      }
    }, [invoice])

    const onClickDeleteButton = (invoiceLineId: number) => {
      viewModel.deleteInvoiceLine(invoiceLineId)
    }

    const onChangeQuantity = (invoiceLineId: number, quantity: string) => {
      viewModel.setInvoiceLineQuantity(invoiceLineId, parseInt(quantity, 10))
    }

    return {
      states: {
        invoiceLines,
        displayInvoiceLines,
        editable,
      },
      handlers: {
        onClickDeleteButton,
        onChangeQuantity,
      },
    }
  }
