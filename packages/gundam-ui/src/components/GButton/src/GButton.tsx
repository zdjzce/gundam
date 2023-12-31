import { defineComponent, computed } from 'vue'
import { generateClasses, useClasses } from '@gundam/util/hooks/classes'
import { props } from './button'

const CLButton = defineComponent({
  name: 'CLButton',
  props,
  setup(props, { slots }) {
    const Tag = computed(() => {
      return props?.tag === 'link' ? 'a' : 'button'
    })

    const classes = generateClasses('button', props, [
      'type',
      'size',
      'loading',
    ])

    return () => (
      <Tag.value class={classes.value}>{slots?.default?.()}</Tag.value>
    )
  },
})
export default CLButton
