import LINKS from './links'

export default {
  header: [
    {
      text: 'Services',
      sections: [
        {
          title: 'Execution Works',
          items: [
            {
              title: 'Civil Works',
              to: LINKS.serviceCivil,
              description: 'Structural, flooring & tiling',
            },
            {
              title: 'Electrical',
              to: LINKS.serviceElectrical,
              description: 'Full wiring & fixtures',
            },
            {
              title: 'Plumbing',
              to: LINKS.servicePlumbing,
              description: 'Supply, drainage & fixtures',
            },
            {
              title: 'Carpentry',
              to: LINKS.serviceCarpentry,
              description: 'Custom furniture & woodwork',
            },
          ],
        },
        {
          title: 'Project Types',
          items: [
            {
              title: 'Residential',
              to: LINKS.serviceResidential,
              description: 'Apartments & villas',
            },
            {
              title: 'Commercial',
              to: LINKS.serviceCommercial,
              description: 'Offices & retail spaces',
            },
            {
              title: 'Hospitality',
              to: LINKS.serviceHospitality,
              description: 'Hotels & restaurants',
            },
          ],
        },
      ],
    },
    {
      text: 'PMC',
      sections: [
        {
          title: 'For Architects',
          items: [
            {
              title: 'Project Management',
              to: LINKS.pmcProjectManagement,
              description: 'End-to-end execution partner',
            },
            {
              title: 'Site Supervision',
              to: LINKS.pmcSupervision,
              description: 'Daily on-site oversight',
            },
            {
              title: 'Quality Control',
              to: LINKS.pmcQuality,
              description: 'Standards & compliance',
            },
          ],
        },
        {
          title: 'For Clients',
          items: [
            {
              title: 'Full Turnkey',
              to: LINKS.pmcTurnkey,
              description: 'Complete project handover',
            },
            {
              title: 'Renovation',
              to: LINKS.pmcRenovation,
              description: 'Partial upgrades & remodels',
            },
            {
              title: 'Consultation',
              to: LINKS.pmcConsultation,
              description: 'Scope, planning & BOQ',
            },
          ],
        },
      ],
    },
    {
      text: 'Rates',
      to: LINKS.rates,
    },
    {
      text: 'Projects',
      to: LINKS.projects,
    },
    {
      text: 'About',
      sections: [
        {
          title: 'Company',
          items: [
            {
              title: 'Our Story',
              to: LINKS.aboutStory,
              description: 'The MG Arts journey',
            },
            {
              title: 'Team',
              to: LINKS.aboutTeam,
              description: 'Our expert crew',
            },
            {
              title: 'Authorized Brands',
              to: LINKS.aboutBrands,
              description: 'Our brand partners',
            },
          ],
        },
        {
          title: 'Connect',
          items: [
            {
              title: 'Contact Us',
              to: LINKS.contact,
              description: 'Get in touch',
            },
            {
              title: 'Vendor Registration',
              to: LINKS.vendorRegister,
              description: 'Join our contractor network',
            },
            {
              title: 'Client Portal',
              to: LINKS.auth,
              description: 'Login to your dashboard',
            },
          ],
        },
      ],
    },
  ],
  footer: [
    {
      heading: 'Company',
      items: [
        { text: 'About', to: LINKS.about },
        { text: 'Services', to: LINKS.services },
        { text: 'Rates', to: LINKS.rates },
        { text: 'Projects', to: LINKS.projects },
        { text: 'PMC', to: LINKS.pmc },
      ],
    },
    {
      heading: 'Connect',
      items: [
        { text: 'Contact Us', to: LINKS.contact },
        { text: 'Client Login', to: LINKS.auth },
        { text: 'Vendor Registration', to: LINKS.vendorRegister },
      ],
    },
    {
      heading: 'Social',
      items: [
        { text: 'Instagram', to: LINKS.instagram },
        { text: 'LinkedIn', to: LINKS.linkedin },
        { text: 'Facebook', to: LINKS.facebook },
        { text: 'YouTube', to: LINKS.youtube },
      ],
    },
  ],
}
