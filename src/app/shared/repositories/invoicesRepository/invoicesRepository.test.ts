import { Client, OperationMethods } from 'api/gen/client'
import { InvoiceRepositoryImpl } from './invoicesRepository'

const getInvoiceRepository = (methodOverrides?: Partial<OperationMethods>) => {
  return new InvoiceRepositoryImpl({
    getInvoice: jest.fn(),
    putInvoice: jest.fn(),
    deleteInvoice: jest.fn(),
    getInvoices: jest.fn(),
    ...methodOverrides,
  } as Partial<OperationMethods> as Client)
}

describe('Invoices Repository', () => {
  it('should fetch an invoice by ID', async () => {
    // given
    const invoicesRepository = getInvoiceRepository({
      getInvoice: jest.fn().mockResolvedValue({
        status: 200,
        data: {
          id: '12345',
          customer_id: 1,
          finalized: false,
          paid: false,
          date: null,
          deadline: null,
          invoice_lines: [],
        },
      }),
    })

    // when
    const invoice = await invoicesRepository.getInvoice('12345')

    // then
    expect(invoice).toBeDefined()
    expect(invoice.id).toBe('12345')
  })

  it('should throw an error if fetching an invoice fails', async () => {
    // given
    const invoicesRepository = getInvoiceRepository({
      getInvoice: jest.fn().mockResolvedValue({
        status: 500,
      }),
    })

    // when-then
    await expect(invoicesRepository.getInvoice('12345')).rejects.toThrow(
      'Failed to fetch invoice with ID 12345'
    )
  })

  it('should create an invoice', async () => {
    // given
    const invoicesRepository = getInvoiceRepository({
      postInvoices: jest.fn().mockResolvedValue({
        status: 200,
        data: {
          id: '12345',
          customer_id: 1337,
          finalized: false,
          paid: false,
          date: null,
          deadline: null,
          invoice_lines: [],
        },
      }),
    })

    // when
    const invoice = await invoicesRepository.createInvoice(1337)

    // then
    expect(invoice).toBeDefined()
    expect(invoice.id).toBe('12345')
  })

  it('should throw an error if creating an invoice fails', async () => {
    // given
    const invoicesRepository = getInvoiceRepository({
      postInvoices: jest.fn().mockResolvedValue({
        status: 500,
      }),
    })

    // when-then
    await expect(invoicesRepository.createInvoice(1337)).rejects.toThrow(
      'Failed to create invoice'
    )
  })

  it('should fetch all invoices', async () => {
    // given
    const invoicesRepository = getInvoiceRepository({
      getInvoices: jest.fn().mockResolvedValue({
        status: 200,
        data: {
          invoices: [
            {
              id: '12345',
              customer_id: 1,
              finalized: false,
              paid: false,
              date: null,
              deadline: null,
              invoice_lines: [],
            },
            {
              id: '67890',
              customer_id: 2,
              finalized: true,
              paid: true,
              date: '2025-06-07',
              deadline: '2025-06-14',
              invoice_lines: [],
            },
          ],
        },
      }),
    })

    // when
    const invoices = await invoicesRepository.getInvoices()

    // then
    expect(invoices).toBeDefined()
    expect(invoices.length).toBe(2)
    expect(invoices[0].id).toBe('12345')
    expect(invoices[1].id).toBe('67890')
  })

  it('should throw an error if fetching invoices fails', async () => {
    // given
    const invoicesRepository = getInvoiceRepository({
      getInvoices: jest.fn().mockResolvedValue({
        status: 500,
      }),
    })

    // when-then
    await expect(invoicesRepository.getInvoices()).rejects.toThrow(
      'Failed to fetch invoices'
    )
  })

  it('should update an invoice', async () => {
    // given
    const invoicesRepository = getInvoiceRepository({
      putInvoice: jest.fn().mockResolvedValue({
        status: 200,
        data: {
          id: '12345',
          customer_id: 1,
          finalized: false,
          paid: false,
          date: '2023-10-01',
          deadline: '2023-10-15',
          invoice_lines: [],
        },
      }),
    })

    const updateData = {
      id: 12345,
      customer_id: 1,
      finalized: false,
      paid: false,
      date: '2023-10-01',
      deadline: '2023-10-15',
      invoice_lines_attributes: [],
    }

    // when
    const updatedInvoice = await invoicesRepository.updateInvoice(
      '12345',
      updateData
    )

    // then
    expect(updatedInvoice).toBeDefined()
    expect(updatedInvoice.id).toBe('12345')
  })

  it('should throw an error if updating an invoice fails', async () => {
    // given
    const invoicesRepository = getInvoiceRepository({
      putInvoice: jest.fn().mockResolvedValue({
        status: 500,
      }),
    })

    const updateData = {
      id: 12345,
      customer_id: 1,
      finalized: false,
      paid: false,
      date: '2023-10-01',
      deadline: '2023-10-15',
      invoice_lines_attributes: [],
    }

    // when-then
    await expect(
      invoicesRepository.updateInvoice('12345', updateData)
    ).rejects.toThrow('Failed to update invoice with ID 12345')
  })

  it('should delete an invoice', async () => {
    // given
    const invoicesRepository = getInvoiceRepository({
      deleteInvoice: jest.fn().mockResolvedValue({
        status: 204,
      }),
    })

    // when
    const result = await invoicesRepository.deleteInvoice('12345')

    // then
    expect(result).toBe(true)
  })

  it('should throw an error if deleting an invoice fails', async () => {
    // given
    const invoicesRepository = getInvoiceRepository({
      deleteInvoice: jest.fn().mockResolvedValue({
        status: 500,
      }),
    })

    // when-then
    await expect(invoicesRepository.deleteInvoice('12345')).rejects.toThrow(
      'Failed to delete invoice with ID 12345'
    )
  })
})
