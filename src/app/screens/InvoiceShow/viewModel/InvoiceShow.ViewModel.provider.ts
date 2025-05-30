import { getAxiosClient } from 'api'
import { InvoiceShowViewModel } from './InvoiceShow.ViewModel'
import { InvoiceRepositoryImpl } from 'app/shared/repositories/invoicesRepository/invoicesRepository'
import { config } from 'app/config'

export const getInvoiceShowViewModel = (): InvoiceShowViewModel => {
  return new InvoiceShowViewModel(
    new InvoiceRepositoryImpl(getAxiosClient(config.apiUrl, config.apiToken))
  )
}
