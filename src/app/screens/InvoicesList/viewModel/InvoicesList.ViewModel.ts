import { BehaviorSubject } from 'rxjs'

import type { InvoiceRepository } from 'app/shared/repositories/invoicesRepository/invoicesRepository'
import type { Invoice } from 'types'

type OnStoreChange = () => void
type Unsubscribe = () => void

interface IInvoicesList2ViewModel {
  fetchInvoices(): Promise<void>
  getInvoices(): Invoice[]
  subscribeInvoices(onStoreChange: OnStoreChange): Unsubscribe
  deleteInvoice(id: string): Promise<void>
  filterInvoicesByCustomer(customerId: number | null): void
  createInvoice(customerId: number): Promise<Invoice>
}

export class InvoicesList2ViewModel implements IInvoicesList2ViewModel {
  private invoices = new BehaviorSubject<Invoice[]>([])

  constructor(private invoiceRepository: InvoiceRepository) {}

  async createInvoice(customerId: number): Promise<Invoice> {
    const invoice = await this.invoiceRepository.createInvoice(customerId)
    return invoice
  }

  async fetchInvoices(): Promise<void> {
    const invoices = await this.invoiceRepository.getInvoices()
    this.invoices.next(invoices)
  }

  public getInvoices(): Invoice[] {
    return this.invoices.value
  }

  public subscribeInvoices(onStoreChange: OnStoreChange): Unsubscribe {
    const subscription = this.invoices.subscribe(onStoreChange)
    return () => subscription.unsubscribe()
  }

  async deleteInvoice(id: string): Promise<void> {
    await this.invoiceRepository.deleteInvoice(id)
    await this.fetchInvoices()
  }

  public filterInvoicesByCustomer(customerId: number): void {
    this.invoiceRepository
      .getInvoicesByCustomerId(customerId)
      .then((invoices) => this.invoices.next(invoices))
      .catch(() => {
        console.error(`Failed to fetch invoices for customer ID ${customerId}`)
      })
  }

  public filterInvoicesByDate(startDate: string, endDate: string) {
    const filteredInvoices = this.invoices.value.filter((invoice) => {
      const invoiceDate = new Date(invoice.date || '')
      const start = new Date(startDate)
      const end = new Date(endDate)
      return invoiceDate >= start && invoiceDate <= end
    })
    this.invoices.next(filteredInvoices)
  }

  /** Filtering on the front-end, the BE filter does not seem to allow it */
  public filterInvoicesByStatus(status: string) {
    this.fetchInvoices().then(() => {
      const filteredInvoices = this.invoices.value.filter((invoice) => {
        const isOverdue =
          invoice.deadline &&
          new Date(invoice.deadline).setHours(0, 0, 0, 0) <
            new Date().setHours(0, 0, 0, 0) &&
          !invoice.paid &&
          !invoice.finalized
        if (status === 'all') return true
        if (status === 'paid') return invoice.paid && !invoice.finalized
        if (status === 'finalized') return invoice.finalized
        if (status === 'draft')
          return !invoice.finalized && !invoice.paid && !isOverdue
        if (status === 'overdue') {
          return isOverdue
        }
        return false
      })
      this.invoices.next(filteredInvoices)
    })
  }
}
