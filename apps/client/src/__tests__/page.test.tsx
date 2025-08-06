import { render, screen } from '@testing-library/react'

jest.mock('@/components/DocumentsList/DocumentListPage', () => () => (
  <div>Mocked DocumentListPage</div>
))

import Home from '../app/page'

describe('Home Page', () => {
  it('renders the DocumentListPage component', async () => {
    const element = await Home() 
    render(element)             
    expect(screen.getByText('Mocked DocumentListPage')).toBeInTheDocument()
  })
})
