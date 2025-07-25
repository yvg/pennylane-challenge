import { useEffect, useState, useSyncExternalStore } from 'react'
import { useViewModel } from '../../viewModel/InvoiceShow.ViewModelProvider'
import { useNavigate } from 'react-router-dom'

type UseInvoiceActionsBehaviourReturnType = {
  states: {
    isDisabled: boolean
    isFinalized: boolean
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
    const navigate = useNavigate()
    const [isDisabled, setIsDisabled] = useState<boolean>(false)
    const [isFinalized, setIsFinalized] = useState<boolean>(false)
    const [isPaid, setIsPaid] = useState<boolean>(false)

    const viewModel = useViewModel()
    const invoice = useSyncExternalStore(
      (callback) => viewModel.subscribeInvoice(callback),
      () => viewModel.getInvoice()
    )

    useEffect(() => {
      if (invoice) {
        setIsDisabled(invoice.finalized)
        setIsPaid(invoice.paid)
        setIsFinalized(invoice.finalized)
      }
    }, [invoice])

    const onClickMarkAsPaid = () => {
      viewModel.setPaid(!invoice?.paid)
    }

    const onClickDelete = () => {
      if (
        window.confirm(
          "Are you sure you want to delete this invoice? This action can't be undone."
        )
      ) {
        viewModel
          .deleteInvoice()
          .then(() => {
            navigate('/')
          })
          .catch(() => {
            alert('Something went wrong while deleting the invoice')
          })
      }
    }
    const onClickFinalize = () => {
      if (
        window.confirm(
          "Are you sure you want to mark this invoice as final? This action can't be undone."
        )
      ) {
        viewModel.setFinalized()
      }
    }

    return {
      states: {
        isDisabled,
        isFinalized,
        isPaid,
      },
      handlers: {
        onClickMarkAsPaid,
        onClickDelete,
        onClickFinalize,
      },
    }
  }
