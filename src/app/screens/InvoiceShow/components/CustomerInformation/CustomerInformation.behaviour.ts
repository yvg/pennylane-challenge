import { useEffect, useState, useSyncExternalStore } from 'react'
import { Customer, Invoice } from 'types'
import { useViewModel } from '../../viewModel/InvoiceShow.ViewModelProvider'

type UseCustomerInformationBehaviourReturnType = {
  states: {
    customer: Invoice['customer'] | null
    disabled: boolean
  }
  handlers: {
    onChangeCustomer: (customer: Customer | null) => void
  }
}

export const useCustomerInformationBehaviour =
  (): UseCustomerInformationBehaviourReturnType => {
    const [customer, setCustomer] = useState<Invoice['customer'] | null>(null)
    const [disabled, setDisabled] = useState(false)
    const viewModel = useViewModel()

    const invoice = useSyncExternalStore(
      (callback) => viewModel.subscribeInvoice(callback),
      () => viewModel.getInvoice()
    )

    useEffect(() => {
      if (invoice) {
        setCustomer(invoice.customer)
        setDisabled(invoice.finalized)
      }
    }, [invoice])

    const onChangeCustomer = (customer: Customer | null) => {
      if (customer) {
        const customerId = customer.id
        viewModel.setCustomerId(customerId)
      }
    }

    return {
      states: {
        customer,
        disabled,
      },
      handlers: {
        onChangeCustomer,
      },
    }
  }
