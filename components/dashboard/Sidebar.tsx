"use client";

import Link from 'next/link';
import type { Route } from 'next';
import { usePathname } from 'next/navigation';
import { Drawer, List, ListItemButton, ListItemIcon, ListItemText, Toolbar } from '@mui/material';
import { useLayoutStore } from '@/store/layoutStore';
import EventIcon from '@mui/icons-material/Event';
import SettingsIcon from '@mui/icons-material/Settings';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';

const nav = [
  { href: '/dashboard/events', label: 'Events', icon: <EventIcon /> },
  { href: '/dashboard/rsvps', label: 'RSVPs', icon: <PeopleAltIcon /> },
  { href: '/dashboard/settings', label: 'Settings', icon: <SettingsIcon /> },
];

export function Sidebar() {
  const pathname = usePathname();
  const collapsed = useLayoutStore((s) => s.isSidebarCollapsed);

  const drawerWidth = collapsed ? 72 : 240;

  return (
    <Drawer variant="permanent" sx={{ width: drawerWidth, [`& .MuiDrawer-paper`]: { width: drawerWidth, overflowX: 'hidden' } }}>
      <Toolbar />
      <List>
        {nav.map((item) => (
          <Link key={item.href} href={item.href as Route} style={{ textDecoration: 'none', color: 'inherit' }}>
            <ListItemButton selected={pathname?.startsWith(item.href) ?? false}>
              <ListItemIcon sx={{ minWidth: 0, mr: collapsed ? 0 : 2, justifyContent: 'center' }}>{item.icon}</ListItemIcon>
              {!collapsed && <ListItemText primary={item.label} />}
            </ListItemButton>
          </Link>
        ))}
      </List>
    </Drawer>
  );
}
