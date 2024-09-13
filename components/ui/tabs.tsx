"use client";

import React from "react";
import { Tab } from "@headlessui/react";
import clsx from "clsx";

interface TabsProps {
  value: number;
  onValueChange: (value: string) => void;
  className?: string;
  children: React.ReactNode;
}

interface TabsListProps {
  className?: string;
  children: React.ReactNode;
}

interface TabsTriggerProps {
  value: string;
  className?: string;
  children: React.ReactNode;
}

export const Tabs: React.FC<TabsProps> = ({ value, onValueChange, className, children }) => {
  return (
    <Tab.Group
      selectedIndex={value}
      onChange={(index: number) => onValueChange(index === 0 ? "overview" : index === 1 ? "future-projections" : "rate-analysis")}
    >
      <div className={className}>{children}</div>
    </Tab.Group>
  );
};

export const TabsList: React.FC<TabsListProps> = ({ className, children }) => {
  return (
    <Tab.List className={clsx("flex space-x-4", className)}>
      {children}
    </Tab.List>
  );
};

export const TabsTrigger: React.FC<TabsTriggerProps> = ({ value, className, children }) => {
  return (
    <Tab>
      {({ selected }) => (
        <button
          className={clsx(
            "py-2 px-4 rounded-md font-medium transition",
            selected ? "bg-blue-500 text-white" : "bg-gray-700 text-gray-300 hover:bg-gray-600",
            className
          )}
        >
          {children}
        </button>
      )}
    </Tab>
  );
};
