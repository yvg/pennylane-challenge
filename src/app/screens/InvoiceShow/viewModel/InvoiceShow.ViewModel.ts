import { BehaviorSubject } from 'rxjs'

import type { InvoiceRepository } from 'app/shared/repositories/invoicesRepository/invoicesRepository'

type Invoice = Awaited<ReturnType<InvoiceRepository['getInvoice']>> | null

export type OnStoreChange = () => void
export type Unsubscribe = () => void

interface IInvoiceShowViewModel {
  fetchInvoice(id: string): Promise<void>
  getInvoice(): Invoice | null
  subscribeInvoice(onStoreChange: OnStoreChange): Unsubscribe
  setCustomerId(customerId: number): void
  setDate(date: string | null): void
  setDeadline(deadline: string | null): void
  setPaid(paid: boolean): void
  updateInvoice(): Promise<void>
  deleteInvoiceLine(lineId: number): Promise<void>
  setInvoiceLineQuantity(lineId: number, quantity: number): Promise<void>
}

// TODO: Why is the compiler not complaining about missing interface fields?
export class InvoiceShowViewModel implements IInvoiceShowViewModel {
  private invoice = new BehaviorSubject<Invoice | null>(null)

  constructor(private invoiceRepository: InvoiceRepository) {}

  private updateInvoicePartially(updateField: Partial<Invoice>): void {
    const invoice = this.getInvoice()
    if (invoice) {
      this.setInvoice({
        ...invoice,
        ...updateField,
      })
      this.updateInvoice()
    }
  }

  private setInvoice(invoice: Invoice): void {
    console.log('set invoice', invoice)
    this.invoice.next(invoice)
  }

  public getInvoice(): Invoice | null {
    return this.invoice.getValue()
  }

  public subscribeInvoice(onStoreChange: OnStoreChange): Unsubscribe {
    const subscription = this.invoice.subscribe(onStoreChange)
    return () => {
      subscription.unsubscribe()
    }
  }

  async fetchInvoice(id: string) {
    const invoice = await this.invoiceRepository.getInvoice(id)
    this.setInvoice(invoice)
  }

  async updateInvoice() {
    const updatedInvoice = this.getInvoice()
    if (!updatedInvoice || !updatedInvoice.customer_id) {
      throw new Error('No invoice to update')
    }
    const updatedInvoiceFromNetwork =
      await this.invoiceRepository.updateInvoice(updatedInvoice.id.toString(), {
        id: updatedInvoice.id,
        customer_id: updatedInvoice.customer_id,
        finalized: updatedInvoice.finalized,
        paid: updatedInvoice.paid,
        date: updatedInvoice.date,
        deadline: updatedInvoice.deadline,
        // TODO: Handle invoice lines here?
        invoice_lines_attributes: [],
      })
    this.setInvoice(updatedInvoiceFromNetwork)
  }

  public setCustomerId(customerId: number): void {
    this.updateInvoicePartially({ customer_id: customerId })
  }

  public setDate(date: string | null): void {
    this.updateInvoicePartially({ date })
  }

  public setDeadline(deadline: string | null): void {
    this.updateInvoicePartially({ deadline })
  }

  public setPaid(paid: boolean): void {
    this.updateInvoicePartially({ paid })
  }

  public setFinalized(): void {
    this.updateInvoicePartially({ finalized: true })
  }

  async deleteInvoiceLine(lineId: number): Promise<void> {
    const invoice = this.getInvoice()
    // Ideally this should be part of a service pattern, but for simplicity of the exercice, let's handle it here.
    // TODO: check customer_id typing
    if (invoice && invoice.customer_id) {
      this.setInvoice({
        ...invoice,
        invoice_lines: invoice.invoice_lines.filter(
          (line) => line.id !== lineId
        ),
      })
      const updatedInvoiceFromNetwork =
        await this.invoiceRepository.updateInvoice(invoice.id.toString(), {
          id: invoice.id,
          customer_id: invoice.customer_id,
          finalized: invoice.finalized,
          paid: invoice.paid,
          date: invoice.date,
          deadline: invoice.deadline,
          invoice_lines_attributes: invoice.invoice_lines.map((line) => ({
            id: line.id,
            _destroy: line.id === lineId,
            product_id: line.product_id,
            quantity: line.quantity,
          })),
        })
      this.setInvoice(updatedInvoiceFromNetwork)
    }
  }

  async setInvoiceLineQuantity(
    lineId: number,
    quantity: number
  ): Promise<void> {
    const invoice = this.getInvoice()
    // TODO: check customer_id typing
    if (invoice && invoice.customer_id) {
      const updatedLines = invoice.invoice_lines.map((line) =>
        line.id === lineId ? { ...line, quantity } : line
      )
      this.setInvoice({ ...invoice, invoice_lines: updatedLines })
      const updatedInvoiceFromNetwork =
        await this.invoiceRepository.updateInvoice(invoice.id.toString(), {
          id: invoice.id,
          customer_id: invoice.customer_id,
          finalized: invoice.finalized,
          paid: invoice.paid,
          date: invoice.date,
          deadline: invoice.deadline,
          invoice_lines_attributes: updatedLines.map((line) => ({
            id: line.id,
            _destroy: false, // Not deleting, just updating
            product_id: line.product_id,
            quantity: line.quantity,
          })),
        })
      this.setInvoice(updatedInvoiceFromNetwork)
    }
  }
}
