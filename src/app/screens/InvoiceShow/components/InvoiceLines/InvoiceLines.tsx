import { useInvoicelinesBehaviour } from "./InvoiceLines.behaviour"

import './InvoiceLines.css'

export const Invoicelines = () => {
  const {
    states: { invoiceLines },
    handlers: { onClickDeleteButton },
  } = useInvoicelinesBehaviour()
  return (
    <div>
      <table className="table table-bordered table-striped">
        <thead>
        <tr>
          <th>Label</th>
          <th>Quantity</th>
          <th>Unit</th>
          <th>Purchase Price</th>
          <th>VAT</th>
          <th>Unit Price</th>
          <th>Amount</th>
          <th></th>
        </tr>
        </thead>
        <tbody>
        {invoiceLines.map((line) => (
          <tr key={line.id}>
            <td>{line.label}</td>
            <td>{line.quantity}</td>
            <td>{line.unit}</td>
            <td>{line.product.unit_price_without_tax}</td>
            <td>{line.vat_rate.toString()}%</td>
            <td>{line.product.unit_price}</td>
            <td>{line.price}</td>
            <th><button onClick={() => onClickDeleteButton(line.id)}>Delete</button></th>
          </tr>
        ))}
        </tbody>
      </table>
      <button onClick={() => console.log('Add item')}>Add item</button>
    </div>
  )
}
