import { useCustomerInformationBehaviour } from "./CustomerInformation.behaviour"

export const CustomerInformation = () => {
  const {
    states: { customer, editable },
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
      {editable && <button onClick={onClickEditCustomer}>Edit customer</button>}
    </div>
  )
}
