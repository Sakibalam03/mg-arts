export interface NavSubItem {
  title: string
  to: string
  description?: string
}

export interface NavSection {
  title?: string
  items: NavSubItem[]
}

export interface NavItem {
  text: string
  to?: string
  sections?: NavSection[]
}
