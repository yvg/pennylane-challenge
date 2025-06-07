import CustomerAutocomplete from "app/shared/components/CustomerAutocomplete"
import { useInvoicesFiltersBehaviour } from "./InvoicesFilters.behaviour"

import "./InvoicesFilters.css"

export const InvoicesFilters = () => {
  const {
    states: { customerToFilter, filterStartDate },
    handlers: { onSearchCustomer, onDateFilter },
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
        <div className="InvoiceList-filter-date">
          <input type="date" placeholder="From" ref={startDateFilterRef} onChange={onDateFilter} />
          <input type="date" placeholder="To" min={filterStartDate} ref={endDateFilterRef} onChange={onDateFilter} />
        </div>
      </div>
  )
}
