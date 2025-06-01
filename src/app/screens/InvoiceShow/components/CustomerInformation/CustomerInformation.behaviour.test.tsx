import { renderHook, act } from '@testing-library/react';
import { useCustomerInformationBehaviour } from './CustomerInformation.behaviour';
import { useViewModel } from '../../viewModel/InvoiceShow.ViewModelProvider';

jest.mock('../../viewModel/InvoiceShow.ViewModelProvider', () => ({
  useViewModel: jest.fn(),
}));

describe('useCustomerInformationBehaviour', () => {
  const mockSubscribeInvoice = jest.fn();
  const mockGetInvoice = jest.fn();
  const mockSetCustomerId = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    (useViewModel as jest.Mock).mockReturnValue({
      subscribeInvoice: mockSubscribeInvoice,
      getInvoice: mockGetInvoice,
      setCustomerId: mockSetCustomerId,
    });
  });

  it('should set disabled to true when invoice is finalized', () => {
    // given
    mockGetInvoice.mockReturnValue({ customer: null, finalized: true });

    // when
    const { result } = renderHook(() => useCustomerInformationBehaviour());

    // then
    expect(result.current.states.disabled).toBe(true);
  });

  it('should set disabled to false when invoice is not finalized', () => {
    // given
    mockGetInvoice.mockReturnValue({ customer: null, finalized: false });

    // when
    const { result } = renderHook(() => useCustomerInformationBehaviour());

    // then
    expect(result.current.states.disabled).toBe(false);
  });

  it('should expose customer when invoice has a customer', () => {
    // given
    const mockCustomer = {
      id: 1,
      first_name: 'John',
      last_name: 'Doe',
      address: '123 Main St',
      zip_code: '12345',
      city: 'Metropolis',
      country: 'Freedonia',
      country_code: 'FD'
    };
    mockGetInvoice.mockReturnValue({ customer: mockCustomer });

    // when
    const { result } = renderHook(() => useCustomerInformationBehaviour());

    // then
    expect(result.current.states.customer?.address).toEqual('123 Main St');
    expect(result.current.states.customer?.zip_code).toEqual('12345');
    expect(result.current.states.customer?.city).toEqual('Metropolis');
    expect(result.current.states.customer?.country).toEqual('Freedonia');
    expect(result.current.states.customer?.first_name).toEqual('John');
    expect(result.current.states.customer?.last_name).toEqual('Doe');
  });

  it('should call setCustomerId when onChangeCustomer is called with a customer', () => {
    // given
    const mockCustomer = {
      id: 1,
      first_name: 'John',
      last_name: 'Doe',
      address: '123 Main St',
      zip_code: '12345',
      city: 'Metropolis',
      country: 'Freedonia',
      country_code: 'FD'
    };
    const { result } = renderHook(() => useCustomerInformationBehaviour());

    // when
    act(() => {
      result.current.handlers.onChangeCustomer(mockCustomer);
    });

    // then
    expect(mockSetCustomerId).toHaveBeenCalledWith(1);
  });

});
