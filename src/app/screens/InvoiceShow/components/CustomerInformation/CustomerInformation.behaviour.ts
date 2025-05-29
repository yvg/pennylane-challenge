import { useEffect, useState, useSyncExternalStore } from 'react'
import { Invoice } from 'types'
import { useViewModel } from '../../viewModel/InvoiceShow.ViewModelProvider'

type UseCustomerInformationBehaviourReturnType = {
  states: {
    customer?: Invoice['customer']
    editable: boolean
  }
  handlers: {
    onClickEditCustomer: () => void
  }
}

export const useCustomerInformationBehaviour =
  (): UseCustomerInformationBehaviourReturnType => {
    // TODO: properly type the state
    const [customer, setCustomer] = useState<Invoice['customer']>()
    const [editable, setEditable] = useState(false)

    const viewModel = useViewModel()

    const invoice = useSyncExternalStore(
      (callback) => viewModel.subscribeInvoice(callback),
      () => viewModel.getInvoice()
    )

    useEffect(() => {
      console.log('invoice changed:', invoice)
      if (invoice) {
        setCustomer(invoice.customer)
        setEditable(!invoice.finalized)
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
        editable,
      },
      handlers: {
        onClickEditCustomer,
      },
    }
  }
