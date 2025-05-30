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
}

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
        // TODO: lines
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
}
