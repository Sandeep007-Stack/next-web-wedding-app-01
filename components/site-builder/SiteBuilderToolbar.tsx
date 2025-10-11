"use client";

import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Button,
  Divider,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Tooltip,
} from '@mui/material';
import {
  Undo as UndoIcon,
  Redo as RedoIcon,
  Save as SaveIcon,
  RestoreFromTrash as ResetIcon,
  Menu as MenuIcon,
} from '@mui/icons-material';
import { useState } from 'react';
import { useSiteBuilderStore } from '@/store/siteBuilderStore';

interface SiteBuilderToolbarProps {
  onToggleSidebar?: () => void;
}

export function SiteBuilderToolbar({ onToggleSidebar }: SiteBuilderToolbarProps) {
  const [resetDialogOpen, setResetDialogOpen] = useState(false);
  
  const {
    undo,
    redo,
    canUndo,
    canRedo,
    save,
    reset,
    lastSaved,
  } = useSiteBuilderStore();

  const handleSave = () => {
    save();
  };

  const handleReset = () => {
    reset();
    setResetDialogOpen(false);
  };

  const formatLastSaved = (date: Date | null) => {
    if (!date) return '';
    return `Last saved • ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
  };

  return (
    <>
      <AppBar 
        position="static" 
        sx={{ 
          zIndex: (theme) => theme.zIndex.drawer + 1,
          bgcolor: 'background.paper',
          color: 'text.primary',
          boxShadow: 1,
        }}
        data-testid="site-builder-toolbar"
      >
        <Toolbar>
          {onToggleSidebar && (
            <IconButton
              edge="start"
              color="inherit"
              onClick={onToggleSidebar}
              aria-label="Toggle sidebar"
              sx={{ mr: 2 }}
              data-testid="sidebar-toggle"
            >
              <MenuIcon />
            </IconButton>
          )}
          
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Site Builder
          </Typography>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Tooltip title="Undo (Ctrl+Z)">
              <span>
                <IconButton
                  onClick={undo}
                  disabled={!canUndo()}
                  aria-label="Undo"
                  data-testid="undo-button"
                >
                  <UndoIcon />
                </IconButton>
              </span>
            </Tooltip>

            <Tooltip title="Redo (Ctrl+Shift+Z)">
              <span>
                <IconButton
                  onClick={redo}
                  disabled={!canRedo()}
                  aria-label="Redo"
                  data-testid="redo-button"
                >
                  <RedoIcon />
                </IconButton>
              </span>
            </Tooltip>

            <Button
              startIcon={<SaveIcon />}
              variant="contained"
              onClick={handleSave}
              size="small"
              data-testid="save-button"
            >
              Save
            </Button>

            <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />

            <Tooltip title="Reset all changes">
              <Button
                startIcon={<ResetIcon />}
                variant="outlined"
                color="error"
                onClick={() => setResetDialogOpen(true)}
                size="small"
                data-testid="reset-button"
              >
                Reset
              </Button>
            </Tooltip>

            {lastSaved && (
              <Typography 
                variant="body2" 
                color="text.secondary" 
                sx={{ ml: 2, fontSize: '0.875rem' }}
                data-testid="last-saved-indicator"
              >
                {formatLastSaved(lastSaved)}
              </Typography>
            )}
          </Box>
        </Toolbar>
      </AppBar>

      <Dialog
        open={resetDialogOpen}
        onClose={() => setResetDialogOpen(false)}
        aria-labelledby="reset-dialog-title"
        data-testid="reset-dialog"
      >
        <DialogTitle id="reset-dialog-title">
          Reset Site Builder
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to reset all changes? This will remove all sections and reset the theme to defaults. This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setResetDialogOpen(false)} data-testid="reset-cancel">
            Cancel
          </Button>
          <Button onClick={handleReset} color="error" variant="contained" data-testid="reset-confirm">
            Reset
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}