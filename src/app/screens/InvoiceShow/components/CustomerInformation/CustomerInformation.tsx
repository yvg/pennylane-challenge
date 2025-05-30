import { useCustomerInformationBehaviour } from "./CustomerInformation.behaviour"

export const CustomerInformation = () => {
  const {
    states: { customer, disabled },
    handlers: { onClickEditCustomer },
  } = useCustomerInformationBehaviour()

  if (!customer) {
    return null
  }

  return (
    <div>
      <h1>{customer.first_name} {customer?.last_name}</h1>
      <p>{customer.address}</p>
      <p>{customer.zip_code}</p>
      <p>{customer.city}</p>
      <p>{customer.country}</p>
      {!disabled && <button onClick={onClickEditCustomer}>Edit customer</button>}
    </div>
  )
}
