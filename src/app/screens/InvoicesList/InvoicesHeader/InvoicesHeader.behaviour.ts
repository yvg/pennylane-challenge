import { useState, useRef, useCallback } from 'react'
import { useViewModel } from '../viewModel/InvoicesList2.ViewModelProvider'
import { Customer } from 'types'
import { useNavigate } from 'react-router-dom'

export type UseInvoicesHeaderReturnType = {
  states: {
    isCreateButtonDisabled: boolean
    customerToAdd: Customer | null
  }
  handlers: {
    toggleCustomerDialog: () => void
    onChangeCustomer: (customer: Customer | null) => void
    onClickAdd: () => Promise<void>
  }
  refs: {
    dialogRef: React.RefObject<HTMLDialogElement>
  }
}

export const useInvoicesHeader = (): UseInvoicesHeaderReturnType => {
  const navigate = useNavigate()

  const dialogRef = useRef<HTMLDialogElement>(null)
  const [customerToAdd, setCustomerToAdd] = useState<Customer | null>(null)
  const viewModel = useViewModel()

  const toggleCustomerDialog = useCallback(() => {
    if (dialogRef.current) {
      if (dialogRef.current.open) {
        dialogRef.current.close()
      } else {
        dialogRef.current.showModal()
      }
    }
  }, [dialogRef])

  const onChangeCustomer = (customer: Customer | null) => {
    setCustomerToAdd(customer || null)
  }

  const onClickAdd = async () => {
    if (customerToAdd !== null) {
      viewModel.createInvoice(customerToAdd.id).then((invoice) => {
        navigate(`/invoice/${invoice.id}`)
      })
      toggleCustomerDialog()
      setCustomerToAdd(null)
    }
  }

  return {
    states: {
      isCreateButtonDisabled: !customerToAdd,
      customerToAdd,
    },
    handlers: {
      toggleCustomerDialog,
      onChangeCustomer,
      onClickAdd,
    },
    refs: {
      dialogRef,
    },
  }
}
