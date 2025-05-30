import type { InvoiceRepository } from 'app/shared/repositories/invoicesRepository/invoicesRepository'
import { InvoiceShowViewModel } from './InvoiceShow.ViewModel'

type Invoice = Awaited<ReturnType<InvoiceRepository['getInvoice']>> | null
type Unit = 'hour' | 'day' | 'piece'
type VatRate = '0' | '5.5' | '10' | '20'

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
  // TODO: This only works because methods relying on it are not async, but it should be mocked.
  updateInvoice: jest.fn(),
})

const getViewModel = (
  getInvoiceResponseOverrides?: Partial<Invoice>
): InvoiceShowViewModel => {
  return new InvoiceShowViewModel(
    getMockedInvoiceRepository(getInvoiceResponseOverrides)
  )
}

const buildInvoiceLines = () => ({
  invoice_lines: [
    {
      id: 1,
      invoice_id: 12345,
      product_id: 101,
      quantity: 2,
      label: 'Product A',
      unit: 'piece' as Unit,
      price: '10.00',
      vat_rate: '20' as VatRate,
      tax: '20',
      product: {
        id: 67,
        label: 'Tesla Model S',
        vat_rate: '20' as VatRate,
        // TODO: fix hack
        unit: 'piece' as Unit,
        unit_price: '1980',
        unit_price_without_tax: '1800',
        unit_tax: '180',
      },
    },
    {
      id: 2,
      invoice_id: 12345,
      product_id: 102,
      quantity: 1,
      label: 'Product B',
      unit: 'piece' as Unit,
      price: '20.00',
      vat_rate: '20' as VatRate,
      tax: '20',
      product: {
        id: 68,
        label: 'Tesla Model X',
        vat_rate: '20' as VatRate,
        // TODO: fix hack
        unit: 'piece' as Unit,
        unit_price: '2500',
        unit_price_without_tax: '2300',
        unit_tax: '200',
      },
    },
  ],
})

describe('InvoiceShowViewModel', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should populate the invoice when fetching', async () => {
    // given
    const viewModel = getViewModel()

    // when
    expect(viewModel.getInvoice()).toBeNull()
    await viewModel.fetchInvoice('12345')

    // then
    const resultingInvoice = viewModel.getInvoice()
    expect(resultingInvoice).toBeDefined()
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

  it('should delete an invoice line', async () => {
    // given
    const viewModel = getViewModel(buildInvoiceLines())

    // when
    await viewModel.fetchInvoice('12345')
    // TODO: use await
    viewModel.deleteInvoiceLine(1)

    // then
    const resultingInvoice = viewModel.getInvoice()
    expect(resultingInvoice?.invoice_lines).toHaveLength(1)
    expect(resultingInvoice?.invoice_lines[0].id).toBe(2)
  })
})
