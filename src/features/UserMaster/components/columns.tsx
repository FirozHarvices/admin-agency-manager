"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Agency } from "../types"
import { Button } from "../../../components/ui/button"
import { ArrowUpDown, MoreHorizontal } from "lucide-react"

// Helper function to convert storage from MB to GB
const convertMbToGb = (mb: number) => `${(mb / 1024).toFixed(2)} GB`;

export const columns: ColumnDef<Agency>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={(e) => {
          e.stopPropagation(); // Prevent row from expanding when sorting
          column.toggleSorting(column.getIsSorted() === "asc");
        }}
      >
        User Name
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => <div className="font-medium">{row.original.name}</div>,
  },
  {
    accessorKey: "phone",
    header: "Phone Number",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "user_role",
    header: "User Role",
  },
  {
    accessorKey: "storage",
    header: "Storage Limit",
    cell: info => convertMbToGb(info.getValue() as number),
  },
  {
    id: "actions",
    cell: ({ row }) => (
      <div className="flex justify-end">
        <Button 
          variant="ghost" 
          className="h-8 w-8 p-0"
          onClick={(e) => {
            e.stopPropagation(); // Prevent row from expanding when clicking the menu
            alert(`Opening menu for ${row.original.name}`);
          }}
        >
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </div>
    ),
  },
];