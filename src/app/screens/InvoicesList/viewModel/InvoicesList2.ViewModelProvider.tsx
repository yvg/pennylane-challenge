import React, { FC, PropsWithChildren, useContext, useState } from 'react'
import { InvoicesList2ViewModel } from './InvoicesList2.ViewModel'

const ViewModelContext = React.createContext<
  { viewModel: InvoicesList2ViewModel } | undefined
>(undefined)

type Props = {
  viewModelFactory: () => InvoicesList2ViewModel
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

export const useViewModel = (): InvoicesList2ViewModel => {
  const context = useContext(ViewModelContext)
  if (context === undefined) {
    throw new Error(
      'useViewModel must be used within a ViewModelContextProvider'
    )
  }

  const { viewModel } = context
  return viewModel
}
