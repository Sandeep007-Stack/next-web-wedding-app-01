"use client";

import { Box, Toolbar } from '@mui/material';
import { useLayoutStore } from '@/store/layoutStore';
import { Sidebar } from '@/components/dashboard/Sidebar';
import { TopBar } from '@/components/dashboard/TopBar';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const collapsed = useLayoutStore((s) => s.isSidebarCollapsed);
  const drawerWidth = collapsed ? 72 : 240;
  return (
    <Box sx={{ display: 'flex' }}>
      <TopBar />
      <Sidebar />
      <Box component="main" sx={{ flexGrow: 1, p: 3, ml: `${drawerWidth}px` }}>
        <Toolbar />
        {children}
      </Box>
    </Box>
  );
}
