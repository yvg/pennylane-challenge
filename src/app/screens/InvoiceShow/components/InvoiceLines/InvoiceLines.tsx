import ProductAutocomplete from "app/shared/components/ProductAutocomplete"
import { useInvoicelinesBehaviour } from "./InvoiceLines.behaviour"

import './InvoiceLines.css'

export const Invoicelines = () => {
  const {
    states: { invoiceLines, displayInvoiceLines, disabled },
    handlers: { onClickDeleteButton, onChangeQuantity, onChangeProduct },
  } = useInvoicelinesBehaviour()
  return (
    <div>
      {displayInvoiceLines &&
        // Not convinced this is tabular data… but for simplicity I'll use table as it has been used in the list.
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
              <td><ProductAutocomplete disabled={disabled} onChange={(product) => product && onChangeProduct(line.id, product.id)} value={line.product} /></td>
              <td><input placeholder="0" disabled={disabled} defaultValue={line.quantity} onChange={(event) => onChangeQuantity(line.id, event.target.value)} size={3} type="number" pattern="\d+" /></td>
              <td>{line.unit}</td>
              <td>{line.product.unit_price_without_tax}</td>
              <td>{line.vat_rate.toString()}%</td>
              <td>{line.product.unit_price}</td>
              <td>{line.price}</td>
              <th><button disabled={disabled} onClick={() => onClickDeleteButton(line.id)}>Delete</button></th>
            </tr>
          ))}
          </tbody>
        </table>
      }
      <button disabled={disabled} onClick={() => console.log('Add item')}>Add item</button>
    </div>
  )
}
