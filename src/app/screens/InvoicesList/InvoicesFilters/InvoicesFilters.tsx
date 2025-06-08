import CustomerAutocomplete from "app/shared/components/CustomerAutocomplete"
import { useInvoicesFiltersBehaviour } from "./InvoicesFilters.behaviour"

import "./InvoicesFilters.css"

export const InvoicesFilters = () => {
  const {
    states: { customerToFilter, filterStartDate },
    handlers: { onSearchCustomer, onDateFilter, onStatusFilter },
    refs: { startDateFilterRef, endDateFilterRef }
  } = useInvoicesFiltersBehaviour()

  return (
    <div className="InvoiceList-filter">
      <div className="InvoiceList-filter-customer">
        <CustomerAutocomplete
          onChange={onSearchCustomer}
          value={customerToFilter}
          placeholder="All customers"
          />
          {customerToFilter && (
            <button onClick={() => onSearchCustomer(null)} type="button">
              Clear
            </button>
          )}
      </div>
      <div className="InvoiceList-filter-status">
        <select onChange={onStatusFilter} defaultValue="all" title="Filter by status">
          <option value="all">All statuses</option>
          <option value="draft">Draft</option>
          <option value="finalized">Finalized</option>
          <option value="paid">Paid</option>
          <option value="overdue">Overdue</option>
        </select>
      </div>
      <div className="InvoiceList-filter-date">
        <input type="date" placeholder="From" ref={startDateFilterRef} onChange={onDateFilter} />
        <input type="date" placeholder="To" min={filterStartDate} ref={endDateFilterRef} onChange={onDateFilter} />
      </div>
    </div>
  )
}
