import { useStatusInformationBehaviour } from "./StatusInformation.behaviour"

import './StatusInformation.css'

export const StatusInformation = () => {

  const { states: { status }, handlers: {
    onChangeDate,
    onChangeDeadline,
    onChangePaid
  } } = useStatusInformationBehaviour()

  if (!status) {
    return null
  }

  return (
    <div className="status-information">
      <div>
        <p>Invoice ID: <strong>{status.invoice_id}</strong></p>
      </div>
      <div>
        <p><label>Date: <input type="date" defaultValue={status.date ?? ''} onChange={onChangeDate} /></label></p>
        <p><label>Deadline: <input type="date" defaultValue={status.deadline ?? ''} onChange={onChangeDeadline} /></label></p>
      </div>
      <div>
        <p>Finalized: {status.finalized ? 'Yes': 'Nope'}</p>
        <p><label>Paid: <input type="checkbox" defaultChecked={status.paid} onChange={onChangePaid} /></label></p>
      </div>
    </div>
  )
}
