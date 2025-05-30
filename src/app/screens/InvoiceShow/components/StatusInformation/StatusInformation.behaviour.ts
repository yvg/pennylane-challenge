import { useEffect, useState, useSyncExternalStore } from 'react'
import { useViewModel } from '../../viewModel/InvoiceShow.ViewModelProvider'

type Status = {
  finalized: boolean
  paid: boolean
  date: string | null
  deadline: string | null
  invoice_id: string
}

type UseStatusInformationBehaviourReturnType = {
  states: {
    status: Status | null
    disabled: boolean
  }
  handlers: {
    onChangeDate: (event: React.ChangeEvent<HTMLInputElement>) => void
    onChangeDeadline: (event: React.ChangeEvent<HTMLInputElement>) => void
  }
}

export const useStatusInformationBehaviour =
  (): UseStatusInformationBehaviourReturnType => {
    const viewModel = useViewModel()

    const [status, setStatus] = useState<Status | null>(null)
    const [disabled, setDisabled] = useState<boolean>(false)

    const invoice = useSyncExternalStore(
      (callback) => viewModel.subscribeInvoice(callback),
      () => viewModel.getInvoice()
    )

    useEffect(() => {
      if (invoice) {
        setStatus({
          finalized: invoice.finalized,
          paid: invoice.paid,
          date: invoice.date,
          deadline: invoice.deadline,
          invoice_id: invoice.id.toString(),
        })
        setDisabled(invoice.finalized)
      }
    }, [invoice])

    const onChangeDate = (event: React.ChangeEvent<HTMLInputElement>) => {
      const newDate = event.target.value
      viewModel.setDate(newDate)
    }

    const onChangeDeadline = (event: React.ChangeEvent<HTMLInputElement>) => {
      const newDeadline = event.target.value
      viewModel.setDeadline(newDeadline)
    }

    return {
      states: {
        status,
        disabled,
      },
      handlers: {
        onChangeDate,
        onChangeDeadline,
      },
    }
  }
