import { InvoiceShowViewModel } from './InvoiceShow.ViewModel'
import { InvoiceRepositoryImpl } from 'app/shared/repositories/invoicesRepository/invoicesRepository'

export const getInvoiceShowViewModel = (): InvoiceShowViewModel => {
  return new InvoiceShowViewModel(new InvoiceRepositoryImpl())
}
