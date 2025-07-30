import React from 'react';
import { Customer } from '../types';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../../components/ui/table';
import { Badge } from 'lucide-react';

interface CustomerSubTableProps {
  customers: Customer[];
}

export const CustomerSubTable: React.FC<CustomerSubTableProps> = ({ customers }) => {
  if (!customers || customers.length === 0) {
    return <div className="p-4 text-center text-sm text-gray-500">No customers found for this agency.</div>;
  }

  return (
    <div className="p-4 bg-gray-50">
        <h4 className="font-semibold mb-2">Customers</h4>
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Customer Name</TableHead>
                    <TableHead>Website</TableHead>
                    <TableHead>Status</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {customers.map((customer) => (
                    <TableRow key={customer.id}>
                        <TableCell>{customer.name}</TableCell>
                        <TableCell>{customer.website}</TableCell>
                        <TableCell>
                           <Badge variant={customer.status === 'Active' ? 'default' : 'destructive'}>
                             {customer.status}
                           </Badge>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    </div>
  );
};