import { useApi } from 'api'
import { useCallback, useEffect, useState } from 'react'
import { Invoice } from 'types'

export const useInvoicesListBehaviour = () => {
  const api = useApi()

  const [invoicesList, setInvoicesList] = useState<Invoice[]>([])

  const fetchInvoices = useCallback(async () => {
    const { data } = await api.getInvoices()
    setInvoicesList(data.invoices)
  }, [api])

  const deleteInvoice = useCallback(
    async (id: number) => {
      api
        .deleteInvoice(id)
        .then(fetchInvoices)
        .catch((error) => {
          // A no-op error handler
          // Ideally, we would show a message to the user
        })
    },
    [api, fetchInvoices]
  )

  const onClickDelete = useCallback(
    (id: number) => (event: React.MouseEvent<HTMLButtonElement>) => {
      event.preventDefault()
      deleteInvoice(id)
    },
    [deleteInvoice]
  )

  useEffect(() => {
    fetchInvoices()
  }, [])

  return {
    handlers: {
      onClickDelete,
    },

    states: {
      invoicesList,
    },
  }
}
