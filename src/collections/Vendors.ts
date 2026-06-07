import type { CollectionConfig, Access } from 'payload'

const isAdmin: Access = ({ req }) => (req.user as any)?.role === 'admin'

export const Vendors: CollectionConfig = {
  slug: 'vendors',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'tradeType', 'city', 'status', 'createdAt'],
  },
  access: {
    create: () => true,
    read: isAdmin,
    update: isAdmin,
    delete: isAdmin,
  },
  fields: [
    { name: 'name', type: 'text', required: true },
    { name: 'phone', type: 'text', required: true },
    { name: 'email', type: 'email', required: true },
    {
      name: 'tradeType',
      type: 'select',
      options: [
        { label: 'Plumber', value: 'plumber' },
        { label: 'Electrician', value: 'electrician' },
        { label: 'Carpenter', value: 'carpenter' },
        { label: 'Civil', value: 'civil' },
        { label: 'Other', value: 'other' },
      ],
      required: true,
    },
    { name: 'city', type: 'text', required: true, index: true },
    { name: 'licenseFile', type: 'text', label: 'License File (S3 Key)' },
    {
      name: 'extraFields',
      type: 'json',
      label: 'Dynamic Fields',
      admin: {
        description: 'Stores dynamic attributes from vendorFieldSchema entries',
      },
    },
    {
      name: 'status',
      type: 'select',
      options: [
        { label: 'Pending', value: 'pending' },
        { label: 'Approved', value: 'approved' },
        { label: 'Rejected', value: 'rejected' },
      ],
      defaultValue: 'pending',
      required: true,
    },
  ],
}
