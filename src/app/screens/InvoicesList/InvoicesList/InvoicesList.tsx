import { useInvoicesListBehaviour } from "./InvoicesList.behaviour"
import { Link } from "react-router-dom"

import './InvoicesList.css'

export const InvoicesList = () => {
  const { states: { invoicesList }, handlers: { onClickDelete } } = useInvoicesListBehaviour()
    return (
      <>
        <div className="invoices-list">
          <div className="invoices-list-header">
            <span>Date</span>
            <span>Deadline</span>
            <span>Number</span>
            <span>Status</span>
            <span>Customer</span>
            <span>Total</span>
            <span></span>
          </div>
          {invoicesList.map((invoice) => (
            <Link
              to={`/invoice/${invoice.id}`}
              className="invoices-list-row"
              key={invoice.id}
            >
              <span>{invoice.date}</span>
              <span>{invoice.deadline}</span>
              <span>{invoice.id}</span>
              <span className={`invoices-list-status ${invoice.status}`}>{invoice.status}</span>
              <span>
                {invoice.customer?.first_name} {invoice.customer?.last_name}
              </span>
              <span>{invoice.total}€</span>
              <span>
                <button
                  onClick={event => {
                    event.preventDefault()
                    onClickDelete(invoice.id)
                  }}
                  disabled={invoice.finalized}
                >
                  Delete
                </button>
              </span>
            </Link>
          ))}
        </div>
      </>
    )
}
