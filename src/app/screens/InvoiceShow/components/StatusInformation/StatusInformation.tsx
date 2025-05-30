import { useStatusInformationBehaviour } from "./StatusInformation.behaviour"

import './StatusInformation.css'

export const StatusInformation = () => {

  const { states: { status, disabled }, handlers: {
    onChangeDate,
    onChangeDeadline,
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
        <p><label>Date: <input disabled={disabled} type="date" defaultValue={status.date ?? ''} onChange={onChangeDate} /></label></p>
        <p><label>Deadline: <input disabled={disabled} type="date" defaultValue={status.deadline ?? ''} onChange={onChangeDeadline} /></label></p>
      </div>
      <div>
        <p>Finalized: {status.finalized ? 'Yes': 'Nope'}</p>
      </div>
    </div>
  )
}
