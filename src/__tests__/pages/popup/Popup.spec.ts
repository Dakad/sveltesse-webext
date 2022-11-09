import { render, screen } from '@tests/setup'
import Popup from '~/pages/popup/Popup.svelte'

describe('Popup', () => {
  it('shows the heading text', async () => {
    render(Popup, {})
    const heading = screen.getByText('This is the popup page')
    expect(heading).toBeInTheDocument()
  })
})
