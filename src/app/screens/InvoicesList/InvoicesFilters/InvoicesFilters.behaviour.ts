import { useCallback, useRef, useState } from 'react'
import { useViewModel } from '../viewModel/InvoicesList2.ViewModelProvider'
import { Customer } from 'types'

type InvoicesFiltersBehaviourReturnType = {
  states: {
    customerToFilter: Customer | null
    filterStartDate: string
  }
  handlers: {
    onSearchCustomer: (customer: Customer | null) => void
    onDateFilter: (e: React.ChangeEvent<HTMLInputElement>) => void
  }
  refs: {
    startDateFilterRef: React.RefObject<HTMLInputElement>
    endDateFilterRef: React.RefObject<HTMLInputElement>
  }
}

export const useInvoicesFiltersBehaviour =
  (): InvoicesFiltersBehaviourReturnType => {
    const viewModel = useViewModel()

    const [customerToFilter, setCustomerToFilter] = useState<Customer | null>(
      null
    )
    const [filterStartDate, setFilterStartDate] = useState<string>('')
    const startDateFilterRef = useRef<HTMLInputElement>(null)
    const endDateFilterRef = useRef<HTMLInputElement>(null)

    const onSearchCustomer = useCallback(
      (customer: Customer | null) => {
        if (customer) {
          viewModel.filterInvoicesByCustomer(customer.id)
          setCustomerToFilter(customer)
        } else {
          viewModel.fetchInvoices()
          setCustomerToFilter(null)
        }
      },
      [viewModel]
    )

    const onDateFilter = useCallback(() => {
      const startDate = startDateFilterRef.current?.value
      const endDate = endDateFilterRef.current?.value
      if (startDate && endDate) {
        setFilterStartDate(startDate)
        viewModel.filterInvoicesByDate(startDate, endDate)
      } else if (!startDate && !endDate) {
        setFilterStartDate('')
        viewModel.fetchInvoices()
      }
    }, [viewModel])

    return {
      states: {
        customerToFilter,
        filterStartDate,
      },
      handlers: {
        onSearchCustomer,
        onDateFilter,
      },
      refs: {
        startDateFilterRef,
        endDateFilterRef,
      },
    }
  }
