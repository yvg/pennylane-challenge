import { getAxiosClient } from 'api'
import { config } from 'app/config'
import { Invoice } from 'types'

type UpdateInvoiceData = {
  id: number
  customer_id: number
  finalized: boolean
  paid: boolean
  date: string | null
  deadline: string | null
  // TODO: type the structure of invoice_lines_attributes
  invoice_lines_attributes?: []
}

export type InvoiceRepository = {
  getInvoice(id: string): Promise<Invoice>
  updateInvoice(id: string, data: UpdateInvoiceData): Promise<Invoice>
}

export class InvoiceRepositoryImpl implements InvoiceRepository {
  private apiClient

  constructor() {
    // TODO: Make this injectable to allow testing outside React env.
    this.apiClient = getAxiosClient(config.apiUrl, config.apiToken)
  }

  // TODO: Type Invoice internally, don't rely on networks types
  async getInvoice(id: string): Promise<Invoice> {
    const response = await this.apiClient.getInvoice(id)
    if (response.status !== 200) {
      throw new Error(
        `Failed to fetch invoice with ID ${id}: ${response.statusText}`
      )
    }
    return response.data
  }

  async updateInvoice(id: string, data: UpdateInvoiceData): Promise<Invoice> {
    const response = await this.apiClient.putInvoice(id, { invoice: data })
    if (response.status !== 200) {
      throw new Error(
        `Failed to update invoice with ID ${id}: ${response.statusText}`
      )
    }
    return response.data
  }
}
