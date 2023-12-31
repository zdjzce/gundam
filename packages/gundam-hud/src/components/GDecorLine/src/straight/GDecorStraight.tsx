import { defineComponent, computed } from 'vue'
import { decorStraightProps, props } from '../DecorLine'
import type { StraightLineStyle } from '../instance'
import StraightPin from './StraightPin'

const decorLineStraight: Record<StraightLineStyle, any> = {
  pin: StraightPin,
  calibration: null,
}

const GDecorStraight = defineComponent({
  props: decorStraightProps,
  setup(props, { slots }) {
    const Straight = computed(
      () => decorLineStraight[props.properties?.lineStyle || 'pin'],
    )

    return () => {
      return <Straight.value {...props}></Straight.value>
    }
  },
})

export default GDecorStraight
