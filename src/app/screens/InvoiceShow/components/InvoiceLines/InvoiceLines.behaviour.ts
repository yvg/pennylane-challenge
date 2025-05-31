import { useEffect, useState, useSyncExternalStore } from 'react'
import { useViewModel } from '../../viewModel/InvoiceShow.ViewModelProvider'
import { Product, Invoice } from 'types'

type InvoiceLines = Invoice['invoice_lines']

type UseInvoicelinesBehaviourReturnType = {
  states: {
    invoiceLines: InvoiceLines
    displayInvoiceLines: boolean
    disabled: boolean
  }
  handlers: {
    onClickDeleteButton: (invoiceLineId: number) => void
    onChangeQuantity: (invoiceLineId: number, quantity: string) => void
    onChangeProduct: (invoiceLineIneId: number, product: number) => void
  }
}

export const useInvoicelinesBehaviour =
  (): UseInvoicelinesBehaviourReturnType => {
    const [invoiceLines, setInvoiceLines] = useState<InvoiceLines>([])
    const [displayInvoiceLines, setDisplayInvoiceLines] =
      useState<boolean>(false)
    const [disabled, setDisabled] = useState<boolean>(false)
    const viewModel = useViewModel()

    const invoice = useSyncExternalStore(
      (callback) => viewModel.subscribeInvoice(callback),
      () => viewModel.getInvoice()
    )

    useEffect(() => {
      if (invoice) {
        setInvoiceLines(invoice.invoice_lines)
        setDisplayInvoiceLines(invoice.invoice_lines.length > 0)
        setDisabled(invoice.finalized)
      }
    }, [invoice])

    const onClickDeleteButton = (invoiceLineId: number) => {
      viewModel.deleteInvoiceLine(invoiceLineId)
    }

    const onChangeQuantity = (invoiceLineId: number, quantity: string) => {
      if (quantity.length) {
        viewModel.setInvoiceLineQuantity(invoiceLineId, parseInt(quantity, 10))
      }
    }

    const onChangeProduct = (invoiceLineId: number, productId: number) => {
      viewModel.setInvoiceLineProductId(invoiceLineId, productId)
    }

    return {
      states: {
        invoiceLines,
        displayInvoiceLines,
        disabled,
      },
      handlers: {
        onChangeProduct,
        onClickDeleteButton,
        onChangeQuantity,
      },
    }
  }
