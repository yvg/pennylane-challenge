import { renderHook, act } from '@testing-library/react';
import { useViewModel } from '../../viewModel/InvoiceShow.ViewModelProvider';
import { useInvoiceActionsBehaviour } from './InvoiceActions.behaviour';
import { set } from 'lodash';

jest.mock('../../viewModel/InvoiceShow.ViewModelProvider', () => ({
  useViewModel: jest.fn(),
}));

const mockedUsedNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  useNavigate: () => mockedUsedNavigate,
}));

describe('useInvoiceActionsBehaviour', () => {
  const mockSubscribeInvoice = jest.fn()
  const mockGetInvoice = jest.fn()
  const mockSetPaid = jest.fn()
  const mockDeleteInvoice = jest.fn()
  const mockSetFinalized = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks();

    (useViewModel as jest.Mock).mockReturnValue({
      subscribeInvoice: mockSubscribeInvoice,
      getInvoice: mockGetInvoice,
      setPaid: mockSetPaid,
      deleteInvoice: mockDeleteInvoice,
      setFinalized: mockSetFinalized,
    });
  });

  it('should set isDisabled to true when invoice is finalized', () => {
    // given
    mockGetInvoice.mockReturnValue({ finalized: true });

    // when
    const { result } = renderHook(() => useInvoiceActionsBehaviour());

    // then
    expect(result.current.states.isDisabled).toBe(true);
  });

  it('should set isDisabled to false when invoice is not finalized', () => {
    // given
    mockGetInvoice.mockReturnValue({ finalized: false });

    // when
    const { result } = renderHook(() => useInvoiceActionsBehaviour());

    // then
    expect(result.current.states.isDisabled).toBe(false);
  });

  it('should toggle isPaid to true when calling onClickMarkAsPaid', () => {
    // given
    jest.spyOn(window, 'confirm').mockImplementationOnce(() => true)
    const initialInvoice = { paid: false };
    mockGetInvoice.mockReturnValue(initialInvoice);

    const { result } = renderHook(() => useInvoiceActionsBehaviour());

    // when
    act(() => {
      result.current.handlers.onClickMarkAsPaid();
    });

    // then
    expect(mockSetPaid).toHaveBeenCalledWith(true);
  });

  it('should call deleteInvoice and navigate away', async () => {
    jest.spyOn(window, 'confirm').mockImplementationOnce(() => true)
    // given
    const initialInvoice = { };
    mockGetInvoice.mockReturnValue(initialInvoice);
    mockDeleteInvoice.mockResolvedValue(true);

    const { result } = renderHook(() => useInvoiceActionsBehaviour());

    // when
    await result.current.handlers.onClickDelete();

    // then
    expect(mockDeleteInvoice).toHaveBeenCalled();
    expect(mockedUsedNavigate).toHaveBeenCalledWith('/');
  });

  it('should call setFinalized when onClickFinalize is called', () => {
    // given
    jest.spyOn(window, 'confirm').mockImplementationOnce(() => true)
    const initialInvoice = { finalized: false };
    mockGetInvoice.mockReturnValue(initialInvoice);

    const { result } = renderHook(() => useInvoiceActionsBehaviour());

    // when
    act(() => {
      result.current.handlers.onClickFinalize();
    });

    // then
    expect(mockSetFinalized).toHaveBeenCalledWith();
  });


})
