import { useInvoiceActionsBehaviour } from "./InvoiceActions.behaviour"

import './InvoiceActions.css'

export const InvoiceActions = () => {

  const { states: {
    isDisabled,
    isFinalized,
    isPaid
  }, handlers : {
    onClickMarkAsPaid,
    onClickDelete,
    onClickFinalize
  } } = useInvoiceActionsBehaviour()
  return (
    <div className="invoice-actions">
      <button disabled={isDisabled} onClick={onClickMarkAsPaid}>{isPaid ? "Mark as Unpaid" : "Mark as Paid"}</button>
      <button disabled={isDisabled} onClick={onClickDelete}>Delete</button>
      <button disabled={isDisabled} onClick={onClickFinalize}>{isFinalized ? "Finalized" : "Mark as Finalized"}</button>
    </div>
  )
}
