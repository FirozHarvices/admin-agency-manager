import React, { useState, useMemo } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getExpandedRowModel,
  getGroupedRowModel,
  flexRender,
  createColumnHelper,
} from '@tanstack/react-table';
import { ChevronDown, ChevronRight, Users, Phone, Mail, HardDrive } from 'lucide-react';

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

// Transform data for table
const transformDataForTable = (agencies: Agency[]) => {
  const rows = [];
  
  agencies.forEach(agency => {
    // Add agency row
    rows.push({
      id: agency.id,
      type: 'agency',
      agencyName: agency.name,
      name: agency.name,
      phone: agency.phone,
      email: agency.email,
      storage: agency.storage,
      customerCount: agency.customers.length,
      status: null,
      website: null,
      isAgency: true,
    });
    
    // Add customer rows
    agency.customers.forEach(customer => {
      rows.push({
        id: customer.id,
        type: 'customer',
        agencyName: agency.name,
        name: customer.name,
        phone: null,
        email: null,
        storage: null,
        customerCount: null,
        status: customer.status,
        website: customer.website,
        isAgency: false,
      });
    });
  });
  
  return rows;
};

const columnHelper = createColumnHelper();

const AgencyTable = () => {
  const [grouping, setGrouping] = useState(['agencyName']);
  const [expanded, setExpanded] = useState({});

  const data = useMemo(() => transformDataForTable(dummyAgencies), []);

  const columns = useMemo(() => [
    columnHelper.accessor('name', {
      header: 'Name',
      cell: ({ row, getValue }) => {
        const isGrouped = row.getIsGrouped();
        const canExpand = row.getCanExpand();
        const isExpanded = row.getIsExpanded();
        const value = getValue();
        
        if (isGrouped) {
          return (
            <div className="flex items-center gap-2 font-semibold text-blue-600">
              <button
                onClick={row.getToggleExpandedHandler()}
                className="p-1 hover:bg-gray-100 rounded"
              >
                {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
              </button>
              <Users size={16} />
              {value} ({row.subRows.length} items)
            </div>
          );
        }
        
        if (row.original.isAgency) {
          return (
            <div className="flex items-center gap-2 font-medium text-gray-800 ml-6">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              {value}
            </div>
          );
        }
        
        return (
          <div className="flex items-center gap-2 text-gray-600 ml-10">
            <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
            {value}
          </div>
        );
      },
    }),
    columnHelper.accessor('phone', {
      header: 'Phone',
      cell: ({ getValue, row }) => {
        const value = getValue();
        if (row.getIsGrouped() || !value) return null;
        return (
          <div className="flex items-center gap-2 text-sm">
            <Phone size={14} className="text-gray-400" />
            {value}
          </div>
        );
      },
    }),
    columnHelper.accessor('email', {
      header: 'Email',
      cell: ({ getValue, row }) => {
        const value = getValue();
        if (row.getIsGrouped() || !value) return null;
        return (
          <div className="flex items-center gap-2 text-sm">
            <Mail size={14} className="text-gray-400" />
            {value}
          </div>
        );
      },
    }),
    columnHelper.accessor('website', {
      header: 'Website',
      cell: ({ getValue, row }) => {
        const value = getValue();
        if (row.getIsGrouped() || !value) return null;
        return (
          <a 
            href={`https://${value}`} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-800 underline text-sm"
          >
            {value}
          </a>
        );
      },
    }),
    columnHelper.accessor('storage', {
      header: 'Storage',
      cell: ({ getValue, row }) => {
        const value = getValue();
        if (row.getIsGrouped() || !value) return null;
        const storageGB = value / 1024;
        return (
          <div className="flex items-center gap-2 text-sm">
            <HardDrive size={14} className="text-gray-400" />
            {storageGB} GB
          </div>
        );
      },
    }),
    columnHelper.accessor('customerCount', {
      header: 'Customers',
      cell: ({ getValue, row }) => {
        const value = getValue();
        if (row.getIsGrouped() || value === null) return null;
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            {value} customers
          </span>
        );
      },
    }),
    columnHelper.accessor('status', {
      header: 'Status',
      cell: ({ getValue, row }) => {
        const value = getValue();
        if (row.getIsGrouped() || !value) return null;
        
        const statusColor = value === 'Active' 
          ? 'bg-green-100 text-green-800' 
          : 'bg-red-100 text-red-800';
        
        return (
          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${statusColor}`}>
            {value}
          </span>
        );
      },
    }),
  ], []);

  const table = useReactTable({
    data,
    columns,
    state: {
      grouping,
      expanded,
    },
    onGroupingChange: setGrouping,
    onExpandedChange: setExpanded,
    getCoreRowModel: getCoreRowModel(),
    getGroupedRowModel: getGroupedRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    enableGrouping: true,
  });

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Agency Management Dashboard</h1>
        <p className="text-gray-600">Manage agencies and their customer relationships</p>
      </div>

      <div className="mb-4 flex gap-4 items-center">
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-gray-700">Group by:</label>
          <select
            value={grouping[0] || ''}
            onChange={(e) => setGrouping(e.target.value ? [e.target.value] : [])}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">No Grouping</option>
            <option value="agencyName">Agency</option>
            <option value="status">Status</option>
          </select>
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={() => table.toggleAllRowsExpanded(true)}
            className="px-3 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Expand All
          </button>
          <button
            onClick={() => table.toggleAllRowsExpanded(false)}
            className="px-3 py-2 bg-gray-600 text-white text-sm rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
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
                <tr
                  key={row.id}
                  className={`hover:bg-gray-50 ${
                    row.getIsGrouped() ? 'bg-gray-50' : 
                    row.original.isAgency ? 'bg-blue-50' : ''
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
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-4 text-sm text-gray-600">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <span>Agency</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
            <span>Customer</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgencyTable;