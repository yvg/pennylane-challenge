import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import { InvoiceActions } from './InvoiceActions'
import { useInvoiceActionsBehaviour } from './InvoiceActions.behaviour'

jest.mock('./InvoiceActions.behaviour', () => ({
  useInvoiceActionsBehaviour: jest.fn(),
}))

const handlers = {
  onClickMarkAsPaid: jest.fn(),
  onClickDelete: jest.fn(),
  onClickFinalize: jest.fn(),
}

const buildHandlersAndStates = (overrideStates?: Partial<ReturnType<typeof useInvoiceActionsBehaviour>['states']>) => ({
  states: {
    isDisabled: false,
    isFinalized: false,
    isPaid: false,
    ...overrideStates,
  },
  handlers,
})

describe('InvoiceActions', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it ('renders button to mark as paid if it is not paid', () => {
    (useInvoiceActionsBehaviour as jest.Mock).mockReturnValue(buildHandlersAndStates({
      isPaid: false
    }))

    render(<InvoiceActions />)

    expect(screen.getByRole('button', { name: /paid/i })).toHaveTextContent('Mark as Paid')
  })

  it ('renders button to mark as unpaid if it is paid', () => {
    (useInvoiceActionsBehaviour as jest.Mock).mockReturnValue(buildHandlersAndStates({
      isPaid: true
    }))

    render(<InvoiceActions />)

    expect(screen.getByRole('button', { name: /unpaid/i })).toHaveTextContent('Mark as Unpaid')
  })

  it ('renders button to delete invoice', () => {
    (useInvoiceActionsBehaviour as jest.Mock).mockReturnValue(buildHandlersAndStates())

    render(<InvoiceActions />)

    expect(screen.getByRole('button', { name: /delete/i })).toBeInTheDocument()
  })

  it ('renders button to mark as finalized if it is not finalized', () => {
    (useInvoiceActionsBehaviour as jest.Mock).mockReturnValue(buildHandlersAndStates({
      isFinalized: false
    }))

    render(<InvoiceActions />)

    expect(screen.getByRole('button', { name: /finalized/i })).toHaveTextContent('Mark as Finalized')
  })

  it ('renders button as finalized if it is finalized', () => {
    (useInvoiceActionsBehaviour as jest.Mock).mockReturnValue(buildHandlersAndStates({
      isFinalized: true
    }))

    render(<InvoiceActions />)

    expect(screen.getByRole('button', { name: /finalized/i })).toHaveTextContent('Finalized')
  })

  it('renders buttons as disabled when isDisabled is true', () => {
    (useInvoiceActionsBehaviour as jest.Mock).mockReturnValue(buildHandlersAndStates({
      isDisabled: true
    }))

    render(<InvoiceActions />)

    expect(screen.getByRole('button', { name: /paid/i })).toBeDisabled()
    expect(screen.getByRole('button', { name: /delete/i })).toBeDisabled()
    expect(screen.getByRole('button', { name: /finalized/i })).toBeDisabled()
  })

  it('calls onClickMarkAsPaid when mark as paid button is clicked', () => {
    (useInvoiceActionsBehaviour as jest.Mock).mockReturnValue(buildHandlersAndStates())

    render(<InvoiceActions />)

    screen.getByRole('button', { name: /paid/i }).click()
    expect(handlers.onClickMarkAsPaid).toHaveBeenCalled()
  })

  it('calls onClickDelete when delete button is clicked', () => {
    (useInvoiceActionsBehaviour as jest.Mock).mockReturnValue(buildHandlersAndStates())

    render(<InvoiceActions />)

    screen.getByRole('button', { name: /delete/i }).click()
    expect(handlers.onClickDelete).toHaveBeenCalled()
  })

  it('calls onClickFinalize when finalize button is clicked', () => {
    (useInvoiceActionsBehaviour as jest.Mock).mockReturnValue(buildHandlersAndStates())

    render(<InvoiceActions />)

    screen.getByRole('button', { name: /finalized/i }).click()
    expect(handlers.onClickFinalize).toHaveBeenCalled()
  })
})
