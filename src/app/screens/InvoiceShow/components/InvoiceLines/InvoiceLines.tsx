import ProductAutocomplete from "app/shared/components/ProductAutocomplete"
import { useInvoicelinesBehaviour } from "./InvoiceLines.behaviour"

import './InvoiceLines.css'

export const Invoicelines = () => {
  const {
    states: { invoiceLines, displayInvoiceLines, disabled, newLine, productToAdd, totalAmount },
    handlers: { onClickDeleteButton, onChangeQuantity, onChangeProduct, onChangeAddProduct },
  } = useInvoicelinesBehaviour()
  return (
    <div>

        {/* Not convinced this is tabular data… but for simplicity I'll use table as it has been used in the list. */}
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
          {displayInvoiceLines &&
          <tbody>
          {invoiceLines.map((line) => (
            <tr key={line.id}>
              <td><ProductAutocomplete disabled={disabled} onChange={(product) => product && onChangeProduct(line.id, product.id)} value={line.product} /></td>
              <td><input min={1} placeholder="0" disabled={disabled} defaultValue={line.quantity} onChange={(event) => onChangeQuantity(line.id, event.target.value)} size={3} type="number" pattern="\d+" /></td>
              <td>{line.unit}</td>
              <td>{line.product.unit_price_without_tax}</td>
              <td>{line.vat_rate.toString()}%</td>
              <td>{line.product.unit_price}</td>
              <td>{line.price}</td>
              <td><button disabled={disabled} onClick={() => onClickDeleteButton(line.id)}>Delete</button></td>
            </tr>
          ))}
          </tbody>
          }
          {!displayInvoiceLines && (
            <tbody>
              <tr>
                <td colSpan={8}>Search products to add to the invoice</td>
              </tr>
            </tbody>
          )}
          <tfoot>
          <tr>
            <td><ProductAutocomplete disabled={disabled} onChange={onChangeAddProduct} value={productToAdd} /></td>
            <td>{newLine.quantity && <input placeholder="0" disabled={disabled} defaultValue={newLine.quantity} size={3} type="number" pattern="\d+" />}</td>
            <td>{newLine.unit}</td>
            <td>{newLine.purchasePrice}</td>
            <td>{newLine.vatRate}</td>
            <td>{newLine.unitPrice}</td>
            <td>{newLine.amount}</td>
            <td></td>
          </tr>
          <tr>
            <td colSpan={6} className="total-label">Total:</td>
            <td><strong>{totalAmount}</strong></td>
            <td></td>
          </tr>
          </tfoot>
        </table>
    </div>
  )
}
