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

const buildInvoiceRepositoryResponse = (
  overrides?: Partial<Invoice>
): Invoice => ({
  id: 12345,
  customer_id: 1,
  finalized: false,
  paid: true,
  date: '2023-10-01',
  deadline: '2023-10-15',
  total: '100.00',
  tax: '20.00',
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
      tax: '20.00',
      product: {
        id: 67,
        label: 'Tesla Model S',
        vat_rate: '20' as VatRate,
        unit: 'piece' as Unit,
        unit_price: '1980',
        unit_price_without_tax: '1800',
        unit_tax: '180',
      },
    },
  ],
  ...overrides,
})

const getMockedInvoiceRepositoryToOverrideMethods = ({
  getInvoice,
  updateInvoice,
  deleteInvoice,
}: {
  getInvoice?: InvoiceRepository['getInvoice']
  updateInvoice?: InvoiceRepository['updateInvoice']
  deleteInvoice?: InvoiceRepository['deleteInvoice']
}): InvoiceRepository => ({
  getInvoice:
    getInvoice ??
    jest.fn().mockResolvedValue(getMockedInvoiceRepositoryResponse()),
  // TODO: This only works because methods relying on it are not async, but it should be mocked.
  updateInvoice: updateInvoice ?? jest.fn(),
  deleteInvoice: deleteInvoice ?? jest.fn(),
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
  deleteInvoice: jest.fn(),
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

const getViewModelWithMockedRepositoryResponses = (
  overrides?: Partial<{
    getInvoiceResponse: Partial<Invoice>
    updateInvoiceResponse: Partial<Invoice>
  }>
): InvoiceShowViewModel => {
  return new InvoiceShowViewModel(
    getMockedInvoiceRepositoryToOverrideMethods({
      getInvoice: jest
        .fn()
        .mockResolvedValue(
          buildInvoiceRepositoryResponse(overrides?.getInvoiceResponse)
        ),
      updateInvoice: jest
        .fn()
        .mockResolvedValue(
          buildInvoiceRepositoryResponse(overrides?.updateInvoiceResponse)
        ),
    })
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
    expect(viewModel.getInvoice()).toBeNull()
    await viewModel.fetchInvoice('12345')

    // then
    const resultingInvoice = viewModel.getInvoice()
    expect(resultingInvoice).toBeDefined()
  })

  it('should update the invoice when changing the date', async () => {
    // given
    const viewModel = getViewModelWithMockedRepositoryResponses({
      getInvoiceResponse: { date: '1999-12-31' },
      updateInvoiceResponse: { date: '2023-10-01' },
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
    const viewModel = getViewModelWithMockedRepositoryResponses({
      getInvoiceResponse: { deadline: '1999-12-31' },
      updateInvoiceResponse: { deadline: '2023-10-01' },
    })

    // when
    await viewModel.fetchInvoice('12345')
    viewModel.setDeadline('2023-10-01')

    // then
    const resultingInvoice = viewModel.getInvoice()
    expect(resultingInvoice?.deadline).toBe('2023-10-01')
  })

  it('should update the invoice when changing the customer ID', async () => {
    // given
    const viewModel = getViewModelWithMockedRepositoryResponses({
      getInvoiceResponse: { customer_id: 909 },
      updateInvoiceResponse: { customer_id: 143 },
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
    const viewModel = getViewModelWithMockedRepositoryResponses({
      getInvoiceResponse: { paid: false },
      updateInvoiceResponse: { paid: true },
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
    const viewModel = getViewModelWithMockedRepositoryResponses()

    // when
    await viewModel.fetchInvoice('12345')
    expect(viewModel.getInvoice()?.invoice_lines).toHaveLength(1)
    viewModel.deleteInvoiceLine(1)

    // then
    const resultingInvoice = viewModel.getInvoice()
    expect(resultingInvoice?.invoice_lines).toHaveLength(0)
  })

  it('should finalize the invoice', async () => {
    // given
    const viewModel = getViewModelWithMockedRepositoryResponses({
      getInvoiceResponse: { finalized: false },
      updateInvoiceResponse: { finalized: true },
    })

    // when
    await viewModel.fetchInvoice('12345')
    viewModel.setFinalized()

    // then
    const resultingInvoice = viewModel.getInvoice()
    expect(resultingInvoice?.finalized).toBe(true)
  })

  it('should delete the invoice if it succeeds', async () => {
    // given
    const viewModel = new InvoiceShowViewModel(
      getMockedInvoiceRepositoryToOverrideMethods({
        deleteInvoice: jest.fn().mockResolvedValue(true),
      })
    )

    // when
    await viewModel.fetchInvoice('12345')
    await viewModel.deleteInvoice()

    // then
    expect(viewModel.getInvoice()).toBeNull()
  })

  it('should not delete the invoice if it fails', async () => {
    // given
    const viewModel = new InvoiceShowViewModel(
      getMockedInvoiceRepositoryToOverrideMethods({
        deleteInvoice: jest.fn().mockRejectedValue(new Error('Network error')),
      })
    )

    // when
    await viewModel.fetchInvoice('12345')
    try {
      await viewModel.deleteInvoice()
    } catch (error) {
      // no-op
    }

    // then
    expect(viewModel.getInvoice()).toBeDefined()
  })

  // TODO
  xit('should throw an error when updating a finalized invoice', async () => {
    // given
    const viewModel = getViewModel({
      finalized: true,
    })

    // when
    await viewModel.fetchInvoice('12345')

    // then
    expect(() => {
      viewModel.setDate('2023-10-01')
    }).toThrow('Cannot update a finalized invoice')
  })

  it('should update product ID in invoice line', async () => {
    // given
    const viewModel = getViewModelWithMockedRepositoryResponses({
      getInvoiceResponse: buildInvoiceRepositoryResponse(),
      updateInvoiceResponse: {
        invoice_lines: [
          {
            id: 1,
            invoice_id: 12345,
            product_id: 202,
            quantity: 2,
            label: 'Product A',
            unit: 'piece' as Unit,
            price: '10.00',
            vat_rate: '20' as VatRate,
            tax: '20',
            product: {
              id: 202,
              label: 'Tesla Model S',
              vat_rate: '20' as VatRate,
              unit: 'piece' as Unit,
              unit_price: '1980',
              unit_price_without_tax: '1800',
              unit_tax: '180',
            },
          },
        ],
      },
    })

    // when
    await viewModel.fetchInvoice('12345')
    await viewModel.setInvoiceLineProductId(1, 202)

    // then
    const resultingInvoice = viewModel.getInvoice()
    expect(resultingInvoice?.invoice_lines[0].product_id).toBe(202)
  })

  it('should update quantity in invoice line', async () => {
    // given
    const viewModel = getViewModelWithMockedRepositoryResponses({
      getInvoiceResponse: buildInvoiceRepositoryResponse(),
      updateInvoiceResponse: {
        invoice_lines: [
          {
            id: 1,
            invoice_id: 12345,
            product_id: 202,
            quantity: 1000,
            label: 'Product A',
            unit: 'piece' as Unit,
            price: '10.00',
            vat_rate: '20' as VatRate,
            tax: '20',
            product: {
              id: 202,
              label: 'Tesla Model S',
              vat_rate: '20' as VatRate,
              unit: 'piece' as Unit,
              unit_price: '1980',
              unit_price_without_tax: '1800',
              unit_tax: '180',
            },
          },
        ],
      },
    })

    // when
    await viewModel.fetchInvoice('12345')
    await viewModel.setInvoiceLineQuantity(1, 1000)

    // then
    const resultingInvoice = viewModel.getInvoice()
    expect(resultingInvoice?.invoice_lines[0].quantity).toBe(1000)
  })
})
