import { useApi } from 'api'
import { set } from 'lodash'
import {
  ChangeEventHandler,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react'
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
    onSearchCustomer: (customer: Customer | null) => void
    onDateFilter: ChangeEventHandler<HTMLInputElement>
  }
  states: {
    invoicesList: Invoice[]
    isCreateButtonDisabled: boolean
    customerToFilter: Customer | null
    customerToAdd: Customer | null
    filterStartDate: string
    filterEndDate: string
  }
  refs: {
    dialogRef: React.RefObject<HTMLDialogElement>
    startDateFilterRef: React.RefObject<HTMLInputElement>
    endDateFilterRef: React.RefObject<HTMLInputElement>
  }
}

export const useInvoicesListBehaviour =
  (): UseInvoicesListBehaviourReturnType => {
    const api = useApi()
    const navigate = useNavigate()
    const [isCreateButtonDisabled, setIsCreateButtonDisabled] = useState(true)
    const [customerToAdd, setCustomerToAdd] = useState<Customer | null>(null)
    const [customerToFilter, setCustomerToFilter] = useState<Customer | null>(
      null
    )
    const [invoicesList, setInvoicesList] = useState<Invoice[]>([])
    const dialogRef = useRef<HTMLDialogElement>(null)
    const startDateFilterRef = useRef<HTMLInputElement>(null)
    const endDateFilterRef = useRef<HTMLInputElement>(null)
    const [filterStartDate, setFilterStartDate] = useState<string>('')
    const [filterEndDate, setFilterEndDate] = useState<string>('')

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
      if (customerToFilter) {
        api
          .getInvoices({
            filter: `[{"field":"customer_id","operator":"eq","value":${customerToFilter.id}}]`,
          })
          .then((response) => {
            setInvoicesList(response.data.invoices)
          })
      } else {
        fetchInvoices()
      }
    }, [customerToFilter, api, fetchInvoices])

    const onSearchCustomer = useCallback((customer: Customer | null) => {
      setCustomerToFilter(customer)
    }, [])

    const onDateFilter = useCallback(
      (event: React.ChangeEvent<HTMLInputElement>) => {
        console.log('##', invoicesList)
        if (event.target.value === '') {
          console.log('Resetting date filter')
          fetchInvoices()
          return false
        }
        if (startDateFilterRef.current && endDateFilterRef.current) {
          const startDate = startDateFilterRef.current.value
          const endDate = endDateFilterRef.current.value

          setFilterStartDate(startDate)
          setFilterEndDate(endDate)

          if (startDate && endDate) {
            const filteredInvoices = invoicesList.filter((invoice) => {
              const invoiceDate = new Date(invoice.date || '')
              return (
                invoiceDate >= new Date(startDate) &&
                invoiceDate <= new Date(endDate)
              )
            })
            setInvoicesList(filteredInvoices)
          }
        }
      },
      [invoicesList, fetchInvoices, startDateFilterRef, endDateFilterRef]
    )

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
        onSearchCustomer,
        onDateFilter,
      },
      states: {
        invoicesList,
        isCreateButtonDisabled,
        customerToFilter,
        customerToAdd,
        filterEndDate,
        filterStartDate,
      },
      refs: {
        dialogRef,
        endDateFilterRef,
        startDateFilterRef,
      },
    }
  }
