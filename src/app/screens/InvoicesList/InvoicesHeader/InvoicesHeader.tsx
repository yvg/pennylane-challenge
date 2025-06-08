import CustomerAutocomplete from 'app/shared/components/CustomerAutocomplete'
import { useInvoicesHeader } from './InvoicesHeader.behaviour'

import './InvoicesHeader.css'

export const InvoicesHeader = () => {
  const { handlers: { toggleCustomerDialog, onChangeCustomer, onClickAdd }, states: { isCreateButtonDisabled, customerToAdd }, refs : { dialogRef } } = useInvoicesHeader()

  return (
    <header className="invoiceList-header">
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
    </header>
  )
}
