import { useEffect, useState, useSyncExternalStore } from 'react'
import { useViewModel } from '../../viewModel/InvoiceShow.ViewModelProvider'

type UseInvoiceActionsBehaviourReturnType = {
  states: {
    isDisabled: boolean
    isPaid: boolean
  }
  handlers: {
    onClickMarkAsPaid: () => void
    onClickDelete: () => void
    onClickFinalize: () => void
  }
}

export const useInvoiceActionsBehaviour =
  (): UseInvoiceActionsBehaviourReturnType => {
    const [isDisabled, setisDisabled] = useState<boolean>(false)
    const [isPaid, setIsPaid] = useState<boolean>(false)

    const viewModel = useViewModel()
    const invoice = useSyncExternalStore(
      (callback) => viewModel.subscribeInvoice(callback),
      () => viewModel.getInvoice()
    )

    useEffect(() => {
      if (invoice) {
        setisDisabled(invoice.finalized)
        setIsPaid(invoice.paid)
      }
    }, [invoice])

    const onClickMarkAsPaid = () => {
      viewModel.setPaid(!invoice?.paid)
    }
    const onClickDelete = () => {
      // viewModel.deleteInvoice()
    }
    const onClickFinalize = () => {
      viewModel.setFinalized()
    }

    return {
      states: {
        isDisabled,
        isPaid,
      },
      handlers: {
        onClickMarkAsPaid,
        onClickDelete,
        onClickFinalize,
      },
    }
  }
