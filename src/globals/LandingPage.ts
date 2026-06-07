import type { GlobalConfig, Block } from 'payload'

const HeroBlock: Block = {
  slug: 'hero',
  labels: { singular: 'Hero Section', plural: 'Hero Sections' },
  fields: [
    { name: 'heading', type: 'text', required: true },
    { name: 'subheading', type: 'text' },
    { name: 'ctaText', type: 'text', label: 'CTA Button Text' },
    { name: 'ctaLink', type: 'text', label: 'CTA Button URL' },
    { name: 'backgroundImage', type: 'upload', relationTo: 'media' },
  ],
}

const ValuePropsBlock: Block = {
  slug: 'value-props',
  labels: { singular: 'Value Props Section', plural: 'Value Props Sections' },
  fields: [
    { name: 'heading', type: 'text' },
    {
      name: 'items',
      type: 'array',
      fields: [
        { name: 'title', type: 'text', required: true },
        { name: 'description', type: 'textarea' },
        { name: 'icon', type: 'upload', relationTo: 'media' },
      ],
    },
  ],
}

const RateTeaserBlock: Block = {
  slug: 'rate-teaser',
  labels: { singular: 'Rate Teaser Section', plural: 'Rate Teaser Sections' },
  fields: [
    { name: 'heading', type: 'text' },
    { name: 'description', type: 'textarea' },
    { name: 'ctaText', type: 'text', label: 'View Rates Button Text' },
    { name: 'ctaLink', type: 'text', label: 'View Rates URL' },
  ],
}

const CTABlock: Block = {
  slug: 'cta',
  labels: { singular: 'CTA Section', plural: 'CTA Sections' },
  fields: [
    { name: 'heading', type: 'text', required: true },
    { name: 'description', type: 'textarea' },
    { name: 'buttonText', type: 'text' },
    { name: 'buttonLink', type: 'text' },
  ],
}

export const LandingPage: GlobalConfig = {
  slug: 'landing-page',
  label: 'Landing Page',
  admin: { group: 'Pages' },
  fields: [
    {
      name: 'blocks',
      type: 'blocks',
      blocks: [HeroBlock, ValuePropsBlock, RateTeaserBlock, CTABlock],
      label: 'Page Sections',
    },
  ],
}
