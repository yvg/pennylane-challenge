import { Link } from 'react-router-dom'
import { useInvoicesListBehaviour } from './InvoicesList.behaviour'
import CustomerAutocomplete from 'app/shared/components/CustomerAutocomplete'

import './InvoicesList.css'

export const InvoicesList = (): React.ReactElement => {

  const {
    states: { invoicesList, isCreateButtonDisabled, customerToAdd },
    handlers: { onClickDelete, onClickAdd, onChangeCustomer },
  } = useInvoicesListBehaviour()

  return (
    <div>
      <div className={'invoiceList-header'}>
        <h1>Invoices</h1>
        <div>
          <CustomerAutocomplete onChange={onChangeCustomer} value={customerToAdd} />
          <button disabled={isCreateButtonDisabled} onClick={onClickAdd}>Create Invoice</button>
        </div>
      </div>
      {/* I'm not sure this should be considered tabular data…? */}
      <table className="table table-bordered table-striped">
        <thead>
          <tr>
            {/* Ideally this should be in a locale file */}
            <th>Id</th>
            <th>Customer</th>
            <th>Address</th>
            <th>Customer ID</th>
            <th>Total</th>
            <th>Tax</th>
            <th>Finalized</th>
            <th>Paid</th>
            <th>Date</th>
            <th>Deadline</th>
          </tr>
        </thead>
        <tbody>
          {invoicesList.map((invoice) => (
            <tr key={invoice.id}>
              <td><Link to={`/invoice/${invoice.id}`}>{invoice.id}</Link></td>
              <td>
                {invoice.customer?.first_name} {invoice.customer?.last_name}
              </td>
              <td>
                {invoice.customer?.address}, {invoice.customer?.zip_code}{' '}
                {invoice.customer?.city}
              </td>
              <td>{invoice.customer_id}</td>
              <td>{invoice.total}</td>
              <td>{invoice.tax}</td>
              <td>{invoice.finalized ? 'Yes' : 'No'}</td>
              <td>{invoice.paid ? 'Yes' : 'No'}</td>
              <td>{invoice.date}</td>
              <td>{invoice.deadline}</td>
              <td>{invoice.invoice_lines.length}</td>
              <td><button onClick={onClickDelete(invoice.id)} disabled={invoice.finalized}>Delete</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
