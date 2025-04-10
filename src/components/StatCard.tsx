
import React from 'react';
import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  description?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
}

const StatCard = ({ title, value, icon: Icon, description, trend, className }: StatCardProps) => {
  return (
    <div className={cn('fitness-stat-card flex flex-col p-5 rounded-xl transition-all duration-300 hover:translate-y-[-5px]', className)}>
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-sm font-medium text-gray-400">{title}</h3>
        <div className="p-2 bg-fitness-muted/40 rounded-lg shadow-inner">
          <Icon className="h-5 w-5 text-fitness-primary" />
        </div>
      </div>
      
      <div className="flex flex-col">
        <div className="text-2xl font-bold mb-1 bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-300">{value}</div>
        
        {description && (
          <p className="text-sm text-gray-400">{description}</p>
        )}
        
        {trend && (
          <div className={`flex items-center mt-3 text-sm ${trend.isPositive ? 'text-green-500' : 'text-red-500'}`}>
            <span className="flex items-center">
              {trend.isPositive ? (
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                </svg>
              ) : (
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              )}
              {Math.abs(trend.value)}% from last week
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default StatCard;
