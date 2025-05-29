import React, { FC, PropsWithChildren, useContext, useState } from 'react'
import { InvoiceShowViewModel } from './InvoiceShow.ViewModel'

const ViewModelContext = React.createContext<
  { viewModel: InvoiceShowViewModel } | undefined
>(undefined)

type Props = {
  viewModelFactory: () => InvoiceShowViewModel
}
export const ViewModelContextProvider: FC<PropsWithChildren<Props>> = ({
  children,
  viewModelFactory,
}) => {
  const [viewModel] = useState(viewModelFactory)

  return (
    <ViewModelContext.Provider value={{ viewModel }}>
      {children}
    </ViewModelContext.Provider>
  )
}

export const useViewModel = (): InvoiceShowViewModel => {
  const context = useContext(ViewModelContext)
  if (context === undefined) {
    throw new Error(
      'useViewModel must be used within a ViewModelContextProvider'
    )
  }

  const { viewModel } = context
  return viewModel
}
