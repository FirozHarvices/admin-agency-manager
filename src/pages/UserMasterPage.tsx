import React, { useState, useMemo } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  createColumnHelper,
} from '@tanstack/react-table';
import { ChevronDown, ChevronRight, Users, Phone, Mail, HardDrive, Globe } from 'lucide-react';

// Types
interface Customer {
  id: string;
  name: string;
  website: string;
  status: 'Active' | 'Inactive';
}

interface Agency {
  id: string;
  name: string;
  phone: string;
  email: string;
  user_role: string;
  storage: number;
  customers: Customer[];
}

// Dummy data
const dummyAgencies: Agency[] = [
  {
    id: 'agency-1',
    name: 'Pixel Perfect Inc.',
    phone: '+1 202-555-0175',
    email: 'contact@pixelperfect.io',
    user_role: 'Agency',
    storage: 51200, // 50 GB
    customers: [
      { id: 'cust-1a', name: 'Global Mart', website: 'globalmart.com', status: 'Active' },
      { id: 'cust-1b', name: 'Sunrise Cafe', website: 'sunrisecafe.net', status: 'Active' },
      { id: 'cust-1c', name: 'Urban Gear', website: 'urbangear.co', status: 'Inactive' },
    ],
  },
  {
    id: 'agency-2',
    name: 'Data Driven Digital',
    phone: '+44 20 7946 0958',
    email: 'info@datadriven.co',
    user_role: 'Agency',
    storage: 20480, // 20 GB
    customers: [
      { id: 'cust-2a', name: 'Legal Eagle', website: 'legaleagle-assoc.com', status: 'Active' },
    ],
  },
  {
    id: 'agency-3',
    name: 'Innovate Solutions',
    phone: '+1 310-555-0182',
    email: 'hello@innovate.tech',
    user_role: 'Agency',
    storage: 102400, // 100 GB
    customers: [],
  },
];

const columnHelper = createColumnHelper();

const AgencyTable = () => {
  const [expandedAgencies, setExpandedAgencies] = useState(new Set());

  const toggleAgency = (agencyId) => {
    setExpandedAgencies(prev => {
      const newSet = new Set(prev);
      if (newSet.has(agencyId)) {
        newSet.delete(agencyId);
      } else {
        newSet.add(agencyId);
      }
      return newSet;
    });
  };

  const expandAll = () => {
    setExpandedAgencies(new Set(dummyAgencies.filter(a => a.customers.length > 0).map(a => a.id)));
  };

  const collapseAll = () => {
    setExpandedAgencies(new Set());
  };

  const columns = useMemo(() => [
    columnHelper.accessor('name', {
      header: 'Agency Name',
      cell: ({ getValue, row }) => {
        const value = getValue();
        const isExpanded = expandedAgencies.has(row.original.id);
        const hasCustomers = row.original.customers.length > 0;
        
        return (
          <div className="flex items-center gap-3">
            {hasCustomers ? (
              <div className="flex items-center">
                {isExpanded ? (
                  <ChevronDown size={16} className="text-gray-600" />
                ) : (
                  <ChevronRight size={16} className="text-gray-600" />
                )}
              </div>
            ) : (
              <div className="w-4"></div>
            )}
            <Users size={18} className="text-blue-600" />
            <span className="font-semibold text-gray-900">{value}</span>
          </div>
        );
      },
    }),
    columnHelper.accessor('phone', {
      header: 'Phone',
      cell: ({ getValue }) => {
        const value = getValue();
        return (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Phone size={14} className="text-gray-400" />
            {value}
          </div>
        );
      },
    }),
    columnHelper.accessor('email', {
      header: 'Email',
      cell: ({ getValue }) => {
        const value = getValue();
        return (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Mail size={14} className="text-gray-400" />
            {value}
          </div>
        );
      },
    }),
    columnHelper.accessor('storage', {
      header: 'Storage',
      cell: ({ getValue }) => {
        const value = getValue();
        const storageGB = value / 1024;
        return (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <HardDrive size={14} className="text-gray-400" />
            {storageGB} GB
          </div>
        );
      },
    }),
    columnHelper.accessor('customers', {
      header: 'Customers',
      cell: ({ getValue }) => {
        const customers = getValue();
        const count = customers.length;
        const statusColor = count > 0 ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-600';
        return (
          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${statusColor}`}>
            {count} customer{count !== 1 ? 's' : ''}
          </span>
        );
      },
    }),
  ], [expandedAgencies]);

  const table = useReactTable({
    data: dummyAgencies,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Agency Management Dashboard</h1>
        <p className="text-gray-600">Manage agencies and their customer relationships</p>
      </div>

      <div className="mb-4 flex gap-4 items-center justify-between">
        <div className="flex items-center gap-4">
          <h2 className="text-lg font-semibold text-gray-800">
            Total Agencies: {dummyAgencies.length}
          </h2>
          <div className="text-sm text-gray-600">
            Total Customers: {dummyAgencies.reduce((sum, agency) => sum + agency.customers.length, 0)}
          </div>
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={expandAll}
            className="px-4 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
          >
            Expand All
          </button>
          <button
            onClick={collapseAll}
            className="px-4 py-2 bg-gray-600 text-white text-sm rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors"
          >
            Collapse All
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              {table.getHeaderGroups().map(headerGroup => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map(header => (
                    <th
                      key={header.id}
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {table.getRowModel().rows.map(row => (
                <React.Fragment key={row.id}>
                  {/* Agency Row */}
                  <tr
                    onClick={() => row.original.customers.length > 0 && toggleAgency(row.original.id)}
                    className={`transition-colors ${
                      row.original.customers.length > 0 
                        ? 'hover:bg-blue-50 cursor-pointer' 
                        : 'hover:bg-gray-50'
                    }`}
                  >
                    {row.getVisibleCells().map(cell => (
                      <td
                        key={cell.id}
                        className="px-6 py-4 whitespace-nowrap text-sm"
                      >
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                  
                  {/* Customer Rows - Show only when agency is expanded */}
                  {expandedAgencies.has(row.original.id) && row.original.customers.map((customer, index) => (
                    <tr key={customer.id} className="bg-slate-50 border-l-4 border-blue-300">
                      <td className="px-6 py-3 whitespace-nowrap text-sm">
                        <div className="flex items-center gap-3 ml-8">
                          <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                          <span className="text-gray-700 font-medium">{customer.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-500">
                        -
                      </td>
                      <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-500">
                        -
                      </td>
                      <td className="px-6 py-3 whitespace-nowrap text-sm">
                        <div className="flex items-center gap-2 text-gray-600">
                          <Globe size={14} className="text-gray-400" />
                          <a 
                            href={`https://${customer.website}`} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800 underline"
                          >
                            {customer.website}
                          </a>
                        </div>
                      </td>
                      <td className="px-6 py-3 whitespace-nowrap text-sm">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          customer.status === 'Active' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {customer.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-6 bg-gray-50 rounded-lg p-4">
        <h3 className="text-sm font-medium text-gray-700 mb-3">How to use:</h3>
        <div className="text-sm text-gray-600 space-y-1">
          <div className="flex items-center gap-2">
            <ChevronRight size={14} />
            <span>Click on agency rows to expand/collapse customer details</span>
          </div>
          <div className="flex items-center gap-2">
            <Users size={14} />
            <span>Agencies with customers show chevron icons and are clickable</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
            <span>Customer rows appear directly below their agency when expanded</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgencyTable;