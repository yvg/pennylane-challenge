import { useEffect, useState, useSyncExternalStore } from 'react'
import { Invoice } from 'types'
import { useViewModel } from '../viewModel/InvoicesList.ViewModelProvider'

type InvoiceWithStatus = Invoice & {
  status: string
}

type UseInvoicesListBehaviourReturnType = {
  handlers: {
    onClickDelete: (id: number) => void
    onClickSortByStatus: () => void
  }
  states: {
    invoicesList: InvoiceWithStatus[]
  }
}

export const useInvoicesListBehaviour =
  (): UseInvoicesListBehaviourReturnType => {
    const viewModel = useViewModel()

    const [invoicesList, setInvoicesList] = useState<InvoiceWithStatus[]>([])

    const invoices = useSyncExternalStore(
      (callback) => viewModel.subscribeInvoices(callback),
      () => viewModel.getInvoices()
    )

    const onClickDelete = (id: number) => {
      viewModel.deleteInvoice(id.toString())
    }

    useEffect(() => {
      const invoicesWithStatus = invoices.map((invoice) => {
        const isOverdue =
          invoice.deadline &&
          new Date(invoice.deadline).setHours(0, 0, 0, 0) <
            new Date().setHours(0, 0, 0, 0) &&
          !invoice.paid &&
          !invoice.finalized

        return {
          ...invoice,
          status: isOverdue
            ? 'overdue'
            : invoice.finalized
            ? 'finalized'
            : invoice.paid
            ? 'paid'
            : 'draft',
        }
      })
      setInvoicesList(invoicesWithStatus)
    }, [invoices])

    const onClickSortByStatus = () => {
      const sortedInvoices = [...invoicesList].sort((a, b) => {
        const statusOrder: Record<
          'overdue' | 'finalized' | 'paid' | 'draft',
          number
        > = {
          overdue: 1,
          finalized: 2,
          paid: 3,
          draft: 4,
        }
        return (
          statusOrder[a.status as keyof typeof statusOrder] -
            statusOrder[b.status as keyof typeof statusOrder] ||
          (a.date ?? '').localeCompare(b.date ?? '')
        )
      })
      setInvoicesList(sortedInvoices)
    }

    return {
      handlers: {
        onClickDelete,
        onClickSortByStatus,
      },
      states: {
        invoicesList,
      },
    }
  }
