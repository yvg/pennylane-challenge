import { getAxiosClient } from 'api'
import { config } from 'app/config'
import { Invoice } from 'types'

interface InvoiceRepository {}

class InvoiceRepositoryImpl implements InvoiceRepository {
  private apiClient

  constructor() {
    this.apiClient = getAxiosClient(config.apiUrl, config.apiToken)
  }

  async getInvoice(id: string): Promise<Invoice> {
    const response = await this.apiClient.getInvoice(id)
    if (response.status !== 200) {
      throw new Error(
        `Failed to fetch invoice with ID ${id}: ${response.statusText}`
      )
    }
    return response.data
  }
}

export const InvoiceRepositorySingleton = new InvoiceRepositoryImpl()
