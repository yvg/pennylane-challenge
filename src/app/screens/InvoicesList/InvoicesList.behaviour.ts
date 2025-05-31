import { useApi } from 'api'
import { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Customer, Invoice } from 'types'

type UseInvoicesListBehaviourReturnType = {
  handlers: {
    onClickDelete: (
      id: number
    ) => (event: React.MouseEvent<HTMLButtonElement>) => void
    onClickAdd: () => void
    onChangeCustomer: (customer: Invoice['customer'] | null) => void
  }
  states: {
    invoicesList: Invoice[]
    isCreateButtonDisabled: boolean
    customerToAdd: Customer | null
  }
}

export const useInvoicesListBehaviour =
  (): UseInvoicesListBehaviourReturnType => {
    const api = useApi()
    const navigate = useNavigate()
    const [isCreateButtonDisabled, setIsCreateButtonDisabled] = useState(true)
    const [customerToAdd, setCustomerToAdd] = useState<Customer | null>(null)

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

    const onClickAdd = useCallback(() => {
      if (customerToAdd) {
        api
          .postInvoices(null, {
            invoice: {
              customer_id: customerToAdd.id,
            },
          })
          .then((response) => {
            navigate(`/invoice/${response.data.id}`)
          })
      }
      // Navigate to the add invoice page
    }, [navigate, api, customerToAdd])

    const onChangeCustomer = useCallback(
      (customer: Invoice['customer'] | null) => {
        if (customer) {
          setCustomerToAdd(customer)
          setIsCreateButtonDisabled(false)
        }
      },
      [setCustomerToAdd, setIsCreateButtonDisabled]
    )

    useEffect(() => {
      fetchInvoices()
    }, [])

    return {
      handlers: {
        onClickDelete,
        onClickAdd,
        onChangeCustomer,
      },

      states: {
        invoicesList,
        isCreateButtonDisabled,
        customerToAdd,
      },
    }
  }
