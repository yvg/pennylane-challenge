import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import { CustomerInformation } from './CustomerInformation'
const { useCustomerInformationBehaviour } = require('./CustomerInformation.behaviour')

jest.mock('app/shared/components/CustomerAutocomplete', () => ({
  __esModule: true,
  default: ({ disabled, value, onChange }: any) => (
    <input placeholder="Select" data-testid="customer-autocomplete" value={value?.name} disabled={disabled} onChange={onChange} />
  ),
}))

const mockOnChangeCustomer = jest.fn()
jest.mock('./CustomerInformation.behaviour', () => ({
  useCustomerInformationBehaviour: jest.fn(),
}))

const mockCustomer = {
  id: 1,
  name: 'John Doe',
  address: '123 Main St',
  zip_code: '12345',
  city: 'Metropolis',
  country: 'Freedonia',
}

describe('CustomerInformation', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders nothing if customer is null', () => {
    useCustomerInformationBehaviour.mockReturnValue({
      states: { customer: null, disabled: false },
      handlers: { onChangeCustomer: mockOnChangeCustomer },
    })

    const { container } = render(<CustomerInformation />)
    // eslint-disable-next-line testing-library/no-node-access
    expect(container.firstChild).toBeNull()
  })

  it('renders customer information when provided', () => {
    useCustomerInformationBehaviour.mockReturnValue({
      states: { customer: mockCustomer, disabled: false },
      handlers: { onChangeCustomer: mockOnChangeCustomer },
    })

    render(<CustomerInformation />)

    expect(screen.getByText(mockCustomer.address)).toBeInTheDocument()
    expect(screen.getByText(mockCustomer.zip_code)).toBeInTheDocument()
    expect(screen.getByText(mockCustomer.city)).toBeInTheDocument()
    expect(screen.getByText(mockCustomer.country)).toBeInTheDocument()
  })

  it('renders CustomerAutocomplete with correct props', () => {
    useCustomerInformationBehaviour.mockReturnValue({
      states: { customer: mockCustomer, disabled: false },
      handlers: { onChangeCustomer: mockOnChangeCustomer },
    })

    render(<CustomerInformation />)

    const autocomplete = screen.getByTestId('customer-autocomplete')
    expect(autocomplete).toBeInTheDocument()
    expect(autocomplete).toHaveValue(mockCustomer.name)
  })
})
