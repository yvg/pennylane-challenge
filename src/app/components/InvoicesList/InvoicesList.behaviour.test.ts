import { act, renderHook, waitFor } from '@testing-library/react'

import { useInvoicesListBehaviour } from './InvoicesList.behaviour'

import { useApi } from 'api'

jest.mock('api')

const mockedUsedApi = useApi as jest.Mock

const getMockedInvoicesListResponse = () => ({
  data: {
    invoices: [
      { id: 1, name: 'Invoice 1' },
      { id: 2, name: 'Invoice 2' },
    ],
  },
})

const getMockedInvoicesListAfterSuccessfulDeletion = () => ({
  data: {
    invoices: [{ id: 2, name: 'Invoice 2' }],
  },
})

const waitForInitialState = async (result: any) => {
  await waitFor(() => {
    expect(result.current.states.invoicesList).toEqual([
      { id: 1, name: 'Invoice 1' },
      { id: 2, name: 'Invoice 2' },
    ])
  })
}

const getMockedDeleteInvoiceResponse = () => {}

describe('useInvoicesListBehaviour', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should fetch invoices on mount', async () => {
    // Given
    mockedUsedApi.mockReturnValueOnce({
      getInvoices: jest.fn().mockResolvedValue(getMockedInvoicesListResponse()),
    })

    // When
    const { result } = renderHook(() => useInvoicesListBehaviour())

    // Then
    await waitForInitialState(result)
  })

  it('should refetch and re-render on successful invoice deletion', async () => {
    // Given
    const getMockedDeleteInvoice = jest
      .fn()
      .mockResolvedValue(getMockedDeleteInvoiceResponse())

    mockedUsedApi
      .mockReturnValueOnce({
        getInvoices: jest
          .fn()
          .mockResolvedValue(getMockedInvoicesListResponse()),
        deleteInvoice: getMockedDeleteInvoice,
      })
      .mockReturnValueOnce({
        getInvoices: jest
          .fn()
          .mockResolvedValue(getMockedInvoicesListAfterSuccessfulDeletion()),
        deleteInvoice: getMockedDeleteInvoice,
      })

    // When
    const { result } = renderHook(() => useInvoicesListBehaviour())
    await waitForInitialState(result)

    await result.current.handlers.onClickDelete(1)({
      preventDefault: () => undefined,
    } as React.MouseEvent<HTMLButtonElement>)

    // Then
    await waitFor(() => {
      expect(result.current.states.invoicesList).toEqual([
        { id: 2, name: 'Invoice 2' },
      ])
    })
    expect(getMockedDeleteInvoice).toHaveBeenCalledTimes(1)
  })

  it('should fail gracefully on unsuccesful invoice deletion', async () => {
    // Given
    const getMockedDeleteInvoice = jest.fn().mockRejectedValue({})

    mockedUsedApi
      .mockReturnValueOnce({
        getInvoices: jest
          .fn()
          .mockResolvedValue(getMockedInvoicesListResponse()),
        deleteInvoice: getMockedDeleteInvoice,
      })
      .mockReturnValueOnce({
        getInvoices: jest
          .fn()
          .mockResolvedValue(getMockedInvoicesListAfterSuccessfulDeletion()),
        deleteInvoice: getMockedDeleteInvoice,
      })

    // When
    const { result } = renderHook(() => useInvoicesListBehaviour())
    await waitForInitialState(result)

    act(() => {
      result.current.handlers.onClickDelete(1)({
        preventDefault: () => undefined,
      } as React.MouseEvent<HTMLButtonElement>)
    })

    // Then
    expect(getMockedDeleteInvoice).toHaveBeenCalledTimes(1)
    expect(result.current.states.invoicesList).toEqual([
      { id: 1, name: 'Invoice 1' },
      { id: 2, name: 'Invoice 2' },
    ])
  })
})
