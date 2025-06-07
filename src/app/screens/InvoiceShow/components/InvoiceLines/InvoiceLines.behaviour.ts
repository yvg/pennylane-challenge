import { useEffect, useState, useSyncExternalStore } from 'react'
import { useViewModel } from '../../viewModel/InvoiceShow.ViewModelProvider'
import { Product, Invoice } from 'types'

type InvoiceLines = Invoice['invoice_lines']

type UseInvoicelinesBehaviourReturnType = {
  states: {
    invoiceLines: InvoiceLines
    displayInvoiceLines: boolean
    disabled: boolean
    newLine: {
      unit: string
      quantity: string | null
      purchasePrice: string
      vatRate: string
      unitPrice: string
      amount: string
    }
    productToAdd: Product | null
    totalAmount: string
  }
  handlers: {
    onClickDeleteButton: (invoiceLineId: number) => void
    onChangeQuantity: (invoiceLineId: number, quantity: string) => void
    onChangeProduct: (invoiceLineIneId: number, productId: number) => void
    onChangeAddProduct: (product: Product | null) => void
  }
}

export const useInvoicelinesBehaviour =
  (): UseInvoicelinesBehaviourReturnType => {
    const defaultNewLine = {
      product: '',
      quantity: null,
      unit: '',
      purchasePrice: '',
      vatRate: '',
      unitPrice: '',
      amount: '',
    }
    const [invoiceLines, setInvoiceLines] = useState<InvoiceLines>([])
    const [displayInvoiceLines, setDisplayInvoiceLines] =
      useState<boolean>(false)
    const [disabled, setDisabled] = useState<boolean>(false)
    const [newLine, setNewLine] = useState<{
      product: string
      quantity: string | null
      unit: string
      purchasePrice: string
      vatRate: string
      unitPrice: string
      amount: string
    }>(defaultNewLine)
    const [productToAdd, setProductToAdd] = useState<Product | null>(null)
    const [totalAmount, setTotalAmount] = useState<string>('0.00')

    const viewModel = useViewModel()

    const invoice = useSyncExternalStore(
      (callback) => viewModel.subscribeInvoice(callback),
      () => viewModel.getInvoice()
    )

    useEffect(() => {
      if (invoice) {
        console.log(invoice)
        setInvoiceLines(invoice.invoice_lines)
        setDisplayInvoiceLines(invoice.invoice_lines.length > 0)
        setDisabled(invoice.finalized)
        setTotalAmount(invoice.total ?? '0.00')
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

    const onChangeAddProduct = (product: Product | null) => {
      if (product) {
        setProductToAdd(product)
        setNewLine({
          product: product.label,
          quantity: '1',
          unit: product.unit,
          purchasePrice: product.unit_price_without_tax,
          vatRate: product.vat_rate + '%',
          unitPrice: product.unit_price,
          amount: product.unit_price,
        })
        viewModel.createInvoiceLine(product.id, 1)
        resetNewLine()
      }
    }

    const resetNewLine = () => {
      setProductToAdd(null)
      setNewLine(defaultNewLine)
    }

    return {
      states: {
        invoiceLines,
        displayInvoiceLines,
        disabled,
        newLine,
        productToAdd,
        totalAmount,
      },
      handlers: {
        onChangeProduct,
        onClickDeleteButton,
        onChangeQuantity,
        onChangeAddProduct,
      },
    }
  }
