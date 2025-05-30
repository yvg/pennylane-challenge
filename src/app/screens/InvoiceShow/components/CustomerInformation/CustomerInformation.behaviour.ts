import { useEffect, useState, useSyncExternalStore } from 'react'
import { Invoice } from 'types'
import { useViewModel } from '../../viewModel/InvoiceShow.ViewModelProvider'

type UseCustomerInformationBehaviourReturnType = {
  states: {
    customer?: Invoice['customer']
    disabled: boolean
  }
  handlers: {
    onClickEditCustomer: () => void
  }
}

export const useCustomerInformationBehaviour =
  (): UseCustomerInformationBehaviourReturnType => {
    // TODO: properly type the state
    const [customer, setCustomer] = useState<Invoice['customer']>()
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

    const onClickEditCustomer = () => {
      if (invoice?.customer_id === 84) {
        viewModel.setCustomerId(143)
      } else {
        viewModel.setCustomerId(84)
      }
    }

    return {
      states: {
        customer,
        disabled,
      },
      handlers: {
        onClickEditCustomer,
      },
    }
  }
