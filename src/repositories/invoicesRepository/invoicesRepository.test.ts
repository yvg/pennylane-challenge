import { InvoiceRepositorySingleton } from './invoicesRepository'

describe('Invoices Repository', () => {
  it('should fetch an invoice with an ID', async () => {
    const invoiceId = '12345'
    const getInvoiceSpy = jest.spyOn(InvoiceRepositorySingleton, 'getInvoice')

    await InvoiceRepositorySingleton.getInvoice(invoiceId)

    expect(getInvoiceSpy).toHaveBeenCalledWith(invoiceId)
  })
})

export {}
