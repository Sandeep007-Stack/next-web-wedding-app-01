"use client";

import {
  AppBar,
  Box,
  Button,
  Divider,
  IconButton,
  Stack,
  Toolbar,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import {
  Undo as UndoIcon,
  Redo as RedoIcon,
  Save as SaveIcon,
  Refresh as ResetIcon,
} from '@mui/icons-material';
import { useState } from 'react';
import { useSiteBuilderStore } from '@/store/siteBuilderStore';
import { ConfirmDialog } from './ConfirmDialog';

export function SiteBuilderToolbar() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const [showResetDialog, setShowResetDialog] = useState(false);
  
  const lastSaved = useSiteBuilderStore((s) => s.lastSaved);
  const canUndo = useSiteBuilderStore((s) => s.canUndo());
  const canRedo = useSiteBuilderStore((s) => s.canRedo());
  const undo = useSiteBuilderStore((s) => s.undo);
  const redo = useSiteBuilderStore((s) => s.redo);
  const save = useSiteBuilderStore((s) => s.save);
  const reset = useSiteBuilderStore((s) => s.reset);

  const handleSave = () => {
    save();
  };

  const handleReset = () => {
    reset();
    setShowResetDialog(false);
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if ((event.metaKey || event.ctrlKey) && event.key === 'z' && !event.shiftKey) {
      event.preventDefault();
      if (canUndo) undo();
    } else if ((event.metaKey || event.ctrlKey) && (event.key === 'y' || (event.key === 'z' && event.shiftKey))) {
      event.preventDefault();
      if (canRedo) redo();
    } else if ((event.metaKey || event.ctrlKey) && event.key === 's') {
      event.preventDefault();
      handleSave();
    }
  };

  return (
    <>
      <AppBar 
        position="sticky" 
        elevation={1}
        sx={{ 
          bgcolor: 'background.paper',
          color: 'text.primary',
          borderBottom: '1px solid',
          borderColor: 'divider',
        }}
        onKeyDown={handleKeyDown}
      >
        <Toolbar sx={{ minHeight: 64 }}>
          <Typography 
            variant="h6" 
            fontWeight={700}
            sx={{ 
              flexGrow: isMobile ? 0 : 1,
              mr: isMobile ? 2 : 0,
            }}
          >
            Site Builder
          </Typography>

          <Stack 
            direction="row" 
            spacing={1} 
            alignItems="center"
            sx={{ ml: 'auto' }}
          >
            <IconButton
              onClick={undo}
              disabled={!canUndo}
              aria-label="Undo"
              data-testid="undo-button"
            >
              <UndoIcon />
            </IconButton>
            
            <IconButton
              onClick={redo}
              disabled={!canRedo}
              aria-label="Redo"
              data-testid="redo-button"
            >
              <RedoIcon />
            </IconButton>

            <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />

            <Button
              startIcon={<SaveIcon />}
              onClick={handleSave}
              variant="contained"
              size="small"
              data-testid="save-button"
            >
              Save
            </Button>

            <Button
              startIcon={<ResetIcon />}
              onClick={() => setShowResetDialog(true)}
              variant="outlined"
              color="error"
              size="small"
              data-testid="reset-button"
            >
              Reset
            </Button>
          </Stack>

          {lastSaved && (
            <Typography 
              variant="caption" 
              color="text.secondary"
              sx={{ ml: 2 }}
              data-testid="last-saved"
            >
              Last saved • {lastSaved}
            </Typography>
          )}
        </Toolbar>
      </AppBar>

      <ConfirmDialog
        open={showResetDialog}
        onClose={() => setShowResetDialog(false)}
        onConfirm={handleReset}
        title="Reset Site Builder"
        description="This will reset all sections and theme settings. This action cannot be undone."
        confirmText="Reset"
        confirmColor="error"
      />
    </>
  );
}