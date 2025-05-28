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

  useEffect(() => {
    fetchInvoices()
  }, [fetchInvoices])

  return {
    handlers: {},

    states: {
      invoicesList,
    },
  }
}
