import CustomerAutocomplete from "app/shared/components/CustomerAutocomplete"
import { useCustomerInformationBehaviour } from "./CustomerInformation.behaviour"

export const CustomerInformation = () => {
  const {
    states: { customer, disabled },
    handlers: { onChangeCustomer },
  } = useCustomerInformationBehaviour()

  if (!customer) {
    return null
  }

  return (
    <div>
      <CustomerAutocomplete disabled={disabled} value={customer} onChange={onChangeCustomer} />
      <p>{customer.address}</p>
      <p>{customer.zip_code}</p>
      <p>{customer.city}</p>
      <p>{customer.country}</p>
    </div>
  )
}
