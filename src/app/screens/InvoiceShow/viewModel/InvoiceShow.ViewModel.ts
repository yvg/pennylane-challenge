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
  setFinalized(): void
  deleteInvoice(): Promise<void>
  deleteInvoiceLine(lineId: number): void
  setInvoiceLineQuantity(lineId: number, quantity: number): void
  setInvoiceLineProductId(lineId: number, productId: number): void
  createInvoiceLine(productId: number, quantity: number): void
}

export class InvoiceShowViewModel implements IInvoiceShowViewModel {
  private invoice = new BehaviorSubject<Invoice | null>(null)

  constructor(private invoiceRepository: InvoiceRepository) {}

  private updateInvoiceLineAttributes(
    invoice: Invoice,
    lineId: number,
    attributes: Partial<{ product_id: number; quantity: number }>
  ): void {
    this.throwIfInvoiceIsFinalized(invoice)
    if (invoice && invoice.customer_id) {
      const updatedLines = invoice.invoice_lines.map((line) =>
        line.id === lineId
          ? { ...line, ...attributes, _destroy: false }
          : { ...line, _destroy: false }
      )

      const updatedInvoice = {
        ...invoice,
        customer_id: invoice.customer_id,
        invoice_lines_attributes: updatedLines,
      }

      this.invoiceRepository
        .updateInvoice(invoice.id.toString(), updatedInvoice)
        .then((updatedInvoiceFromNetwork) =>
          this.setInvoice(updatedInvoiceFromNetwork)
        )
        .catch(() => {
          throw new Error('Failed to update invoice line attributes')
        })
    }
  }

  private setInvoice(invoice: Invoice): void {
    this.invoice.next(invoice)
  }

  private throwIfInvoiceIsFinalized(invoice: Invoice | null): void {
    if (invoice && invoice.finalized) {
      throw new Error("Can't modify a finalized invoice")
    }
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

  private updateInvoice(updateField: Partial<Invoice>): void {
    const invoice = this.getInvoice()
    this.throwIfInvoiceIsFinalized(invoice)
    if (!invoice || !invoice.customer_id) {
      throw new Error('No invoice to update')
    }
    this.setInvoice({
      ...invoice,
      ...updateField,
    })
    const updatedInvoice = this.getInvoice()
    if (!updatedInvoice || !updatedInvoice.customer_id) {
      throw new Error('No invoice to update')
    }
    this.invoiceRepository
      .updateInvoice(updatedInvoice.id.toString(), {
        id: updatedInvoice.id,
        customer_id: updatedInvoice.customer_id,
        finalized: updatedInvoice.finalized,
        paid: updatedInvoice.paid,
        date: updatedInvoice.date,
        deadline: updatedInvoice.deadline,
        invoice_lines_attributes: [],
      })
      .then((updatedInvoiceFromNetwork) => {
        this.setInvoice(updatedInvoiceFromNetwork)
      })
      .catch(() => {
        throw new Error('Failed to update invoice')
      })
  }

  public setCustomerId(customerId: number): void {
    this.updateInvoice({ customer_id: customerId })
  }

  public setDate(date: string | null): void {
    this.updateInvoice({ date })
  }

  public setDeadline(deadline: string | null): void {
    this.updateInvoice({ deadline })
  }

  public setPaid(paid: boolean): void {
    this.updateInvoice({ paid })
  }

  public setFinalized(): void {
    this.updateInvoice({ finalized: true })
  }

  public deleteInvoiceLine(lineId: number): void {
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
      this.invoiceRepository
        .updateInvoice(invoice.id.toString(), {
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
        .then((updatedInvoiceFromNetwork) => {
          this.setInvoice(updatedInvoiceFromNetwork)
        })
    }
  }

  public setInvoiceLineQuantity(lineId: number, quantity: number): void {
    this.updateInvoiceLineAttributes(this.getInvoice(), lineId, {
      quantity,
    })
  }

  async deleteInvoice(): Promise<void> {
    const invoice = this.getInvoice()
    this.throwIfInvoiceIsFinalized(invoice)
    if (invoice) {
      const deleted = await this.invoiceRepository.deleteInvoice(
        invoice.id.toString()
      )
      if (deleted) {
        this.setInvoice(null)
      }
    }
  }

  public setInvoiceLineProductId(lineId: number, productId: number): void {
    this.updateInvoiceLineAttributes(this.getInvoice(), lineId, {
      product_id: productId,
    })
  }

  public createInvoiceLine(productId: number, quantity: number): void {
    const invoice = this.getInvoice()
    if (invoice && invoice.customer_id) {
      const newLine = {
        product_id: productId,
        quantity: quantity,
      }
      const updatedInvoice = {
        ...invoice,
        customer_id: invoice.customer_id,
        invoice_lines_attributes: [
          ...invoice.invoice_lines.map((line) => ({
            id: line.id,
            _destroy: false,
            product_id: line.product_id,
            quantity: line.quantity,
          })),
          newLine,
        ],
      }
      this.invoiceRepository
        .updateInvoice(invoice.id.toString(), updatedInvoice)
        .then((updatedInvoiceFromNetwork) => {
          this.setInvoice(updatedInvoiceFromNetwork)
        })
    }
  }
}
