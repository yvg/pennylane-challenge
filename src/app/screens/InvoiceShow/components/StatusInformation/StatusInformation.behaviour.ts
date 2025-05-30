import { useEffect, useState, useSyncExternalStore } from 'react'
import { useViewModel } from '../../viewModel/InvoiceShow.ViewModelProvider'

type Status = {
  finalized: boolean
  paid: boolean
  date: string | null
  deadline: string | null
  invoice_id: string
}

export const useStatusInformationBehaviour = () => {
  const viewModel = useViewModel()

  const [status, setStatus] = useState<Status | null>(null)

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

  const onChangePaid = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newPaid = event.target.checked
    viewModel.setPaid(newPaid)
  }

  return {
    states: {
      status,
    },
    handlers: {
      onChangeDate,
      onChangeDeadline,
      onChangePaid,
    },
  }
}
