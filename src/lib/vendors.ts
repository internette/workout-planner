import vendors from '../../vendors.config';

// Which vendor-reliant features are on, from vendors.config.ts. Safe in the browser and on the server.

export type Vendor = keyof typeof vendors;

export const vendorOn = (vendor: Vendor): boolean => vendors[vendor] === true;
