// src/components/ui/Dropdown.tsx
import { Menu, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { cn } from '../../lib/utils';

interface DropdownProps {
  button: React.ReactNode;
  children: React.ReactNode;
}

export const Dropdown = ({ button, children }: DropdownProps) => {
  return (
    <Menu as="div" className="relative inline-block text-left">
      <div>
        <Menu.Button as="div" className="cursor-pointer">
          {button}
        </Menu.Button>
      </div>
      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute right-0 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 z-50 ring-black ring-opacity-5 focus:outline-none">
          <div className="px-1 py-1 ">{children}</div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
};

interface DropdownItemProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}

export const DropdownItem = ({ children, onClick, className }: DropdownItemProps) => {
  return (
    <Menu.Item>
      {({ active }) => (
        <button
          onClick={onClick}
          className={cn(
            'group flex w-full items-center rounded-md px-2 py-2 text-sm',
            active ? 'bg-brand-primary text-white' : 'text-gray-900',
            className
          )}
        >
          {children}
        </button>
      )}
    </Menu.Item>
  );
};