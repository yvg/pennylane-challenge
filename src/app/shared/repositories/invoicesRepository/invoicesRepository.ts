import { Client } from 'api/gen/client'
import { Invoice } from 'types'

type UpdateInvoiceData = {
  id: number
  customer_id: number
  finalized: boolean
  paid: boolean
  date: string | null
  deadline: string | null
  invoice_lines_attributes: {
    id?: number
    _destroy?: boolean
    product_id?: number
    quantity?: number
  }[]
}

export type InvoiceRepository = {
  getInvoices(): Promise<Invoice[]>
  getInvoicesByCustomerId(customerId: number): Promise<Invoice[]>
  getInvoice(id: string): Promise<Invoice>
  createInvoice(customerId: number): Promise<Invoice>
  updateInvoice(id: string, data: Partial<UpdateInvoiceData>): Promise<Invoice>
  deleteInvoice(id: string): Promise<true>
}

export class InvoiceRepositoryImpl implements InvoiceRepository {
  constructor(private apiClient: Client) {}

  async createInvoice(customerId: number): Promise<Invoice> {
    const response = await this.apiClient.postInvoices(null, {
      invoice: {
        customer_id: customerId,
      },
    })
    if (response.status !== 200) {
      throw new Error('Failed to create invoice')
    }
    return response.data
  }

  async getInvoices(): Promise<Invoice[]> {
    const response = await this.apiClient.getInvoices()
    if (response.status !== 200) {
      throw new Error('Failed to fetch invoices')
    }
    return response.data.invoices || []
  }

  async getInvoicesByCustomerId(customerId: number): Promise<Invoice[]> {
    const response = await this.apiClient.getInvoices({
      filter: `[{"field":"customer_id","operator":"eq","value":${customerId}}]`,
    })
    if (response.status !== 200) {
      throw new Error(`Failed to fetch invoices for customer ID ${customerId}`)
    }
    return response.data.invoices || []
  }

  async getInvoice(id: string): Promise<Invoice> {
    const response = await this.apiClient.getInvoice(id)
    if (response.status !== 200) {
      throw new Error(`Failed to fetch invoice with ID ${id}`)
    }
    return response.data
  }

  async updateInvoice(
    id: string,
    data: Partial<UpdateInvoiceData>
  ): Promise<Invoice> {
    // @ts-ignore
    const response = await this.apiClient.putInvoice(id, { invoice: data })
    if (response.status !== 200) {
      throw new Error(`Failed to update invoice with ID ${id}`)
    }
    return response.data
  }

  async deleteInvoice(id: string): Promise<true> {
    const response = await this.apiClient.deleteInvoice(id)
    if (response.status !== 204) {
      throw new Error(`Failed to delete invoice with ID ${id}`)
    }

    return true
  }
}
