import { Link } from 'react-router-dom'
import { useInvoicesListBehaviour } from './InvoicesList.behaviour'
import CustomerAutocomplete from 'app/shared/components/CustomerAutocomplete'

import './InvoicesList.css'

export const InvoicesList = (): React.ReactElement => {

  const {
    states: { invoicesList, isCreateButtonDisabled, customerToAdd },
    handlers: { onClickDelete, onClickAdd, onChangeCustomer, toggleCustomerDialog },
    refs: { dialogRef }
  } = useInvoicesListBehaviour()

  return (
    <div>
      <div className={'invoiceList-header'}>
        <h1>Invoices</h1>
        <div>
          {/* Using a ref to allow the usage of CSS backdrop we get from showModal method on dialog element */}
          <dialog id="invoice-creation-dialog" ref={dialogRef}>
            <p>Select a customer to create an invoice for.</p>
            <CustomerAutocomplete onChange={onChangeCustomer} value={customerToAdd} />
            <div className="invoice-creation-dialog-buttons">
              <button onClick={toggleCustomerDialog}>Cancel</button>
              <button onClick={onClickAdd} disabled={isCreateButtonDisabled}>
                Create Invoice
              </button>
            </div>
          </dialog>
          <button onClick={toggleCustomerDialog}>Create Invoice</button>
        </div>
      </div>
      {/* I'm not sure this should be considered tabular data…? */}
      <table className="table table-bordered table-striped">
        <thead>
          <tr>
            {/* Ideally this should be in a locale file */}
            <th>Date</th>
            <th>Deadline</th>
            <th>Number</th>
            <th>Customer</th>
            <th>Total</th>
            <th>Finalized</th>
            <th>Paid</th>
          </tr>
        </thead>
        <tbody>
          {invoicesList.map((invoice) => (
            <tr key={invoice.id}>
              <td>{invoice.date}</td>
              <td>{invoice.deadline}</td>
              <td><Link to={`/invoice/${invoice.id}`}>{invoice.id}</Link></td>
              <td>
                {invoice.customer?.first_name} {invoice.customer?.last_name}
              </td>
              <td>{invoice.total}</td>
              <td>{invoice.finalized ? 'Yes' : 'No'}</td>
              <td>{invoice.paid ? 'Yes' : 'No'}</td>
              <td><button onClick={onClickDelete(invoice.id)} disabled={invoice.finalized}>Delete</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
