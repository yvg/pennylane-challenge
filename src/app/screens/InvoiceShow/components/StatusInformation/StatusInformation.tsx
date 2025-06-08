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
      <h4>Details</h4>
      <div className="status-information-details">
        <p><label>Date: <input disabled={disabled} type="date" defaultValue={status.date ?? ''} onChange={onChangeDate} /></label></p>
        <p><label>Deadline: <input disabled={disabled} type="date" min={status.date ?? ''} defaultValue={status.deadline ?? ''} onChange={onChangeDeadline} /></label></p>
      </div>
      <p><label>Title: <input disabled={disabled} type="text" value="Lorem Ipsum Dolor Sit Amet" /></label></p>
      <textarea placeholder="Description" disabled={disabled}></textarea>
    </div>
  )
}
