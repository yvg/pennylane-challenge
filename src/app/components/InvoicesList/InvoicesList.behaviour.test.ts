import { renderHook, waitFor } from '@testing-library/react'

import { useInvoicesListBehaviour } from './InvoicesList.behaviour'

jest.mock('api', () => ({
  useApi: () => ({
    getInvoices: jest.fn().mockResolvedValue({
      data: {
        invoices: [
          { id: 1, name: 'Invoice 1' },
          { id: 2, name: 'Invoice 2' },
        ],
      },
    }),
    deleteInvoice: jest.fn().mockResolvedValue({}),
  }),
}))

describe('useInvoicesListBehaviour', () => {
  it('should fetch invoices on mount', async () => {
    const { result } = renderHook(() => useInvoicesListBehaviour())

    // Use waitFor to wait for the state to update
    await waitFor(() => {
      expect(result.current.states.invoicesList).toEqual([
        { id: 1, name: 'Invoice 1' },
        { id: 2, name: 'Invoice 2' },
      ])
    })
  })
})
