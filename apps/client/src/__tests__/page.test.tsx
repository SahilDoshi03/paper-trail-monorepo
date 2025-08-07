import { render, screen } from '@testing-library/react'

jest.mock('@/components/DocumentsList/DocumentListPage', () => {
  const MockComponent = () => <div>Mocked DocumentListPage</div>
  MockComponent.displayName = 'MockedDocumentListPage'
  return MockComponent
})

import Home from '../app/page'

describe('Home Page', () => {
  it('renders the DocumentListPage component', async () => {
    const element = await Home() 
    render(element)             
    expect(screen.getByText('Mocked DocumentListPage')).toBeInTheDocument()
  })
})
