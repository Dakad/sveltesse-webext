import { render, screen } from '@tests/setup'
import Logo from '@components/Logo.svelte'

describe('Logo Component', () => {
  it('should render with Github link', () => {
    render(Logo, {})
    const githubLink = screen.getByTitle('GitHub')
    // expect(githubLink).toHaveAttribute('title', 'GitHub')
    // REF: https://stackoverflow.com/a/70550362
    expect(githubLink.getAttribute('href')).toMatchInlineSnapshot('"https://github.com/antfu/vitesse-webext"')
  })
})
