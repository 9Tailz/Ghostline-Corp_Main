import { render, screen } from '@testing-library/react'
import HomePage from '../app/page'

describe('HomePage', () => {
  it('renders loading state initially', () => {
    render(<HomePage />)
    expect(screen.getByText(/loading/i)).toBeInTheDocument()
  })
})