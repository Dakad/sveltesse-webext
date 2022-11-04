import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import Logo from '../Logo.svelte'

describe('Logo Component', () => {
  it('should render', () => {
    const wrapper = mount(Logo)

    expect(wrapper.html()).toBeTruthy()
  })
})
