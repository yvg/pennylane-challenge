import type { InvoiceRepository } from 'app/shared/repositories/invoicesRepository/invoicesRepository'
import { InvoiceShowViewModel } from './InvoiceShow.ViewModel'
import { get } from 'lodash'

type Invoice = Awaited<ReturnType<InvoiceRepository['getInvoice']>> | null

const getMockedInvoiceRepositoryResponse = (
  overrides?: Partial<Invoice>
): Invoice => ({
  id: 12345,
  customer_id: 1,
  finalized: false,
  paid: true,
  date: null,
  deadline: null,
  total: '0',
  tax: '20',
  invoice_lines: [],
  ...overrides,
})

const getMockedInvoiceRepository = (
  getInvoiceResponseOverrides?: Partial<Invoice>
): InvoiceRepository => ({
  getInvoice: jest
    .fn()
    .mockResolvedValue(
      getMockedInvoiceRepositoryResponse(getInvoiceResponseOverrides)
    ),
  updateInvoice: jest.fn(),
})

const getViewModel = (
  getInvoiceResponseOverrides?: Partial<Invoice>
): InvoiceShowViewModel => {
  return new InvoiceShowViewModel(
    getMockedInvoiceRepository(getInvoiceResponseOverrides)
  )
}

describe('InvoiceShowViewModel', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should populate the invoice when fetching', async () => {
    // given
    const viewModel = getViewModel()

    // when
    await viewModel.fetchInvoice('12345')

    // then
    const resultingInvoice = viewModel.getInvoice()
    expect(resultingInvoice?.id).toBe(12345)
    expect(resultingInvoice?.customer_id).toBe(1)
    expect(resultingInvoice?.finalized).toBe(false)
    expect(resultingInvoice?.paid).toBe(true)
    expect(resultingInvoice?.date).toBeNull()
    expect(resultingInvoice?.deadline).toBeNull()
    expect(resultingInvoice?.total).toBe('0')
    expect(resultingInvoice?.tax).toBe('20')
    expect(resultingInvoice?.invoice_lines).toEqual([])
  })

  it('should update the invoice when changing the date', async () => {
    // given
    const viewModel = getViewModel({
      date: '1999-12-31',
    })

    // when
    await viewModel.fetchInvoice('12345')
    viewModel.setDate('2023-10-01')

    // then
    const resultingInvoice = viewModel.getInvoice()
    expect(resultingInvoice?.date).toBe('2023-10-01')
  })

  it('should update the invoice when changing the deadline', async () => {
    // given
    const viewModel = getViewModel({ deadline: '2022-11-15' })

    // when
    await viewModel.fetchInvoice('12345')
    viewModel.setDeadline('2023-10-01')

    // then
    const resultingInvoice = viewModel.getInvoice()
    expect(resultingInvoice?.deadline).toBe('2023-10-01')
  })

  it('should update the invoice when changing the customer ID', async () => {
    // given
    const viewModel = getViewModel({
      customer_id: 999,
    })

    // when
    await viewModel.fetchInvoice('12345')
    viewModel.setCustomerId(143)

    // then
    const resultingInvoice = viewModel.getInvoice()
    expect(resultingInvoice?.customer_id).toBe(143)
  })

  it('should toggle the paid status of the invoice', async () => {
    // given
    const viewModel = getViewModel({
      paid: false,
    })

    // when
    await viewModel.fetchInvoice('12345')
    viewModel.setPaid(true)

    // then
    const revertedInvoice = viewModel.getInvoice()
    expect(revertedInvoice?.paid).toBe(true)
  })
})
