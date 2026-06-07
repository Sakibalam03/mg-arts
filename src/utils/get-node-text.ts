import { ReactNode } from 'react'

export default function getNodeText(node: ReactNode): string {
  if (node == null) return ''
  switch (typeof node) {
    case 'string':
    case 'number':
      return node.toString()
    case 'boolean':
      return ''
    case 'object': {
      if (node instanceof Array) return node.map(getNodeText).join(' ').trim()
      if ('props' in (node as any)) return getNodeText((node as any).props.children)
    }
    default:
      return ''
  }
}
