import { getAxiosClient } from 'api'
import { InvoicesList2ViewModel } from './InvoicesList.ViewModel'
import { InvoiceRepositoryImpl } from 'app/shared/repositories/invoicesRepository/invoicesRepository'
import { config } from 'app/config'

export const getInvoicesList2ViewModel = (): InvoicesList2ViewModel => {
  return new InvoicesList2ViewModel(
    new InvoiceRepositoryImpl(getAxiosClient(config.apiUrl, config.apiToken))
  )
}
