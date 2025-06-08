import CustomerAutocomplete from "app/shared/components/CustomerAutocomplete"
import { useCustomerInformationBehaviour } from "./CustomerInformation.behaviour"

import "./CustomerInformation.css"

export const CustomerInformation = () => {
  const {
    states: { customer, disabled },
    handlers: { onChangeCustomer },
  } = useCustomerInformationBehaviour()

  if (!customer) {
    return null
  }

  return (
    <div className="customer-information">
      <div>
        <h4>Customer</h4>
        <CustomerAutocomplete disabled={disabled} value={customer} onChange={onChangeCustomer} />
      </div>
      <div>
        <h4>Address</h4>
        <p>{customer.address}</p>
        <p>{customer.zip_code}</p>
        <p>{customer.city}</p>
        <p>{customer.country}</p>
      </div>
    </div>
  )
}
