import { useApi } from 'api'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Customer, Invoice } from 'types'

type UseInvoicesListBehaviourReturnType = {
  handlers: {
    onClickDelete: (
      id: number
    ) => (event: React.MouseEvent<HTMLButtonElement>) => void
    onClickAdd: () => void
    onChangeCustomer: (customer: Invoice['customer'] | null) => void
    toggleCustomerDialog: () => void
  }
  states: {
    invoicesList: Invoice[]
    isCreateButtonDisabled: boolean
    customerToAdd: Customer | null
  }
  refs: {
    dialogRef: React.RefObject<HTMLDialogElement>
  }
}

export const useInvoicesListBehaviour =
  (): UseInvoicesListBehaviourReturnType => {
    const api = useApi()
    const navigate = useNavigate()
    const [isCreateButtonDisabled, setIsCreateButtonDisabled] = useState(true)
    const [customerToAdd, setCustomerToAdd] = useState<Customer | null>(null)
    const dialogRef = useRef<HTMLDialogElement>(null)

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
        if (
          window.confirm(
            "Are you sure you want to delete this invoice? This action can't be undone."
          )
        ) {
          deleteInvoice(id)
        }
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

    const toggleCustomerDialog = useCallback(() => {
      if (dialogRef.current) {
        if (dialogRef.current.open) {
          dialogRef.current.close()
        } else {
          dialogRef.current.showModal()
        }
      }
    }, [dialogRef])

    useEffect(() => {
      fetchInvoices()
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return {
      handlers: {
        onClickDelete,
        onClickAdd,
        onChangeCustomer,
        toggleCustomerDialog,
      },
      states: {
        invoicesList,
        isCreateButtonDisabled,
        customerToAdd,
      },
      refs: {
        dialogRef,
      },
    }
  }
