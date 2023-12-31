import type { IrregularStyles } from '../instance'

export const toRadians = (degrees: number) => {
  return degrees * (Math.PI / 180)
}

/**
 * const base = 60
 * const angle = 60
 * const topLength = calculateTopLength(base, angle)
 */
export const calculateTopLength = (base: number, angle: number) => {
  const halfBase = base / 2
  const height = halfBase * Math.sin(toRadians(angle))
  const topLength = 2 * Math.sqrt(Math.pow(halfBase, 2) - Math.pow(height, 2))
  return Math.floor(topLength)
}

export type AssignIrregularStyles = IrregularStyles & {
  // 控制梯形高度  且可以控制向外或向里
  trapeZoidalH?: number
  path?: `m ${string} ${string}`
  gap?: number
}

// TODO 现在计算的结果会值会超出参数传入的值，不知道什么情况
export const calculatePath = (style: AssignIrregularStyles) => {
  const {
    width,
    height,
    randomEdge,
    trapeZoidalH = +style.height! * 0.02,
    // trapeZoidalH = 10,
  } = style
  let path: AssignIrregularStyles['path'] = style.path || 'm 0 0'

  const rectangleEdges = [width, height, width, height]

  for (let i = 0; i < 4; i++) {
    const maxCount = randomEdge * 2 + 1
    const maxLength = Math.round(+rectangleEdges[i]! / maxCount)
    let randomMax = 0
    let isTrapezoid = Math.random() < 0.5

    for (let j = 0; j < maxCount; j++) {
      if (!isTrapezoid && randomMax < randomEdge) {
        const topLine = calculateTopLength(maxLength, 60)
        const x = Math.round((maxLength - topLine) / 2)

        // 如果外部边与内部边都采用同样的顺序进行绘制，那么最终的 svg 图形不会取交集部分
        // 一个长方形绘制方向无非就是 顺时针 或 逆时针
        const trapezoidEdges = [
          ` l${x} ${-trapeZoidalH} l${topLine} 0 l${x} ${trapeZoidalH}`, // top
          ` l${trapeZoidalH} ${x}  l0 ${topLine} l${-trapeZoidalH} ${x} `, // right
          ` l${-x} ${trapeZoidalH} l${-topLine} 0 l${-x} ${-trapeZoidalH}`, // bottom
          ` l${-trapeZoidalH} ${-x}  l0 ${-topLine} l${trapeZoidalH} ${-x} `, // left
        ]

        path += trapezoidEdges[i]

        randomMax += 1
        isTrapezoid = true
      } else {
        const directions = [
          { dx: 1, dy: 0 }, // top
          { dx: 0, dy: 1 }, // right
          { dx: -1, dy: 0 }, // bottom
          { dx: 0, dy: -1 }, // left
        ]

        path += ` l${directions[i].dx * maxLength} ${
          directions[i].dy * maxLength
        }`
        isTrapezoid = false
      }
    }
  }

  return path
}

export const generateRandomTrapezoid = (style: AssignIrregularStyles) => {
  const { gap = Math.round((+style.width * 0.025) / 2) } = style

  const insidePath = calculatePath({
    ...style,
    trapeZoidalH: style?.trapeZoidalH || -8,
    path: `m ${gap} ${gap}`,
    width: +style.width - gap * 3,
    height: +style.height! - gap * 2,
    randomEdge: 2,
  })

  return insidePath
}
