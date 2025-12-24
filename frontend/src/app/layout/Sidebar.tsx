import { NavLink, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  Users,
  Truck,
  Star,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
} from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/shared/hooks/useRedux';
import { logout } from '@/domains/auth/authSlice';
import { useState } from 'react';

const navItems = [
  { path: '/analytics', icon: LayoutDashboard, label: 'Dashboard', exact: true },
  { path: '/analytics/orders', icon: ShoppingCart, label: 'Orders' },
  { path: '/analytics/products', icon: Package, label: 'Products' },
  { path: '/analytics/sellers', icon: Users, label: 'Sellers' },
  { path: '/analytics/logistics', icon: Truck, label: 'Logistics' },
  { path: '/analytics/reviews', icon: Star, label: 'Reviews' },
];

const bottomItems = [
  { path: '/settings', icon: Settings, label: 'Settings' },
];

export const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);

  const handleLogout = () => {
    dispatch(logout());
  };

  const isActive = (path: string, exact?: boolean) => {
    if (exact) return location.pathname === path;
    return location.pathname.startsWith(path);
  };

  return (
    <aside
      className={cn(
        'fixed left-0 top-0 h-screen bg-sidebar border-r border-sidebar-border flex flex-col transition-all duration-300 z-50',
        collapsed ? 'w-16' : 'w-64'
      )}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 h-16 border-b border-sidebar-border">
        <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-info">
          <TrendingUp className="w-5 h-5 text-primary-foreground" />
        </div>
        {!collapsed && (
          <div className="animate-fade-in">
            <h1 className="font-bold text-foreground">Olist Analytics</h1>
            <p className="text-xs text-muted-foreground">E-Commerce Dashboard</p>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 px-2 space-y-1 overflow-y-auto">
        <div className="mb-4">
          {!collapsed && (
            <p className="px-3 mb-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Analytics
            </p>
          )}
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.exact}
              className={({ isActive: active }) =>
                cn(
                  'sidebar-link',
                  collapsed && 'justify-center px-2',
                  (active || isActive(item.path, item.exact)) && 'active'
                )
              }
            >
              <item.icon className={cn('h-5 w-5 shrink-0', collapsed && 'mr-0')} />
              {!collapsed && <span>{item.label}</span>}
            </NavLink>
          ))}
        </div>
      </nav>

      {/* Bottom Section */}
      <div className="py-4 px-2 border-t border-sidebar-border space-y-1">
        {bottomItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive: active }) =>
              cn(
                'sidebar-link',
                collapsed && 'justify-center px-2',
                active && 'active'
              )
            }
          >
            <item.icon className={cn('h-5 w-5 shrink-0', collapsed && 'mr-0')} />
            {!collapsed && <span>{item.label}</span>}
          </NavLink>
        ))}

        <button
          onClick={handleLogout}
          className={cn(
            'sidebar-link w-full text-destructive hover:bg-destructive/10 hover:text-destructive',
            collapsed && 'justify-center px-2'
          )}
        >
          <LogOut className={cn('h-5 w-5 shrink-0', collapsed && 'mr-0')} />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>

      {/* User Info */}
      {!collapsed && user && (
        <div className="px-4 py-3 border-t border-sidebar-border">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-medium text-sm">
              {user.name[0].toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">{user.name}</p>
              <p className="text-xs text-muted-foreground truncate">{user.email}</p>
            </div>
          </div>
        </div>
      )}

      {/* Collapse Button */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-20 w-6 h-6 rounded-full bg-secondary border border-border flex items-center justify-center hover:bg-accent transition-colors"
      >
        {collapsed ? (
          <ChevronRight className="h-3 w-3" />
        ) : (
          <ChevronLeft className="h-3 w-3" />
        )}
      </button>
    </aside>
  );
};
