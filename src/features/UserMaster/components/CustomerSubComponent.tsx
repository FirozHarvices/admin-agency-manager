import React from 'react';
import { Customer } from '../types';
import { Badge } from '../../../components/ui/badge'; // Ensure you have this component

interface CustomerSubComponentProps {
  customers: Customer[];
}

export const CustomerSubComponent: React.FC<CustomerSubComponentProps> = ({ customers }) => {
  if (!customers || customers.length === 0) {
    return <div className="p-4 text-center text-sm text-gray-500 bg-muted/50">No customers found for this agency.</div>;
  }

  return (
    <div className="p-4 bg-muted/50">
      <h4 className="font-semibold mb-3 text-sm">Customers</h4>
      <ul className="space-y-2">
        {customers.map((customer) => (
          <li key={customer.id} className="flex justify-between items-center text-sm">
            <span>{customer.name} ({customer.website})</span>
            <Badge variant={customer.status === 'Active' ? 'default' : 'destructive'}>{customer.status}</Badge>
          </li>
        ))}
      </ul>
    </div>
  );
};