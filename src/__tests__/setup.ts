// NOTE: jest-dom adds handy assertions to Jest and it is recommended, but not required.
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/svelte'

globalThis.chrome = { runtime: { id: `webext-${new Date().getTime()}` } }

export {
  render,
  screen,
}
