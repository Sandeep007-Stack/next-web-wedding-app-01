"use client";

import {
  Box,
  Button,
  Chip,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Stack,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import {
  Add as AddIcon,
  DragIndicator as DragIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  MoreVert as MoreIcon,
  Edit as EditIcon,
  ContentCopy as DuplicateIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import { useState } from 'react';
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

import { useSiteBuilderStore } from '@/store/siteBuilderStore';
import { sectionKinds } from '@/lib/section-registry';
import { SiteSection } from '@/types/site-builder';

interface SortableSectionItemProps {
  section: SiteSection;
  isSelected: boolean;
  onSelect: () => void;
  onToggleVisibility: () => void;
  onRename: (name: string) => void;
  onDuplicate: () => void;
  onDelete: () => void;
}

function SortableSectionItem({
  section,
  isSelected,
  onSelect,
  onToggleVisibility,
  onRename,
  onDuplicate,
  onDelete,
}: SortableSectionItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(section.name);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: section.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const handleDoubleClick = () => {
    setIsEditing(true);
    setEditName(section.name);
  };

  const handleRename = () => {
    if (editName.trim()) {
      onRename(editName.trim());
    }
    setIsEditing(false);
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      handleRename();
    } else if (event.key === 'Escape') {
      setIsEditing(false);
      setEditName(section.name);
    }
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleDuplicate = () => {
    onDuplicate();
    handleMenuClose();
  };

  const handleDelete = () => {
    onDelete();
    handleMenuClose();
  };

  return (
    <ListItem
      ref={setNodeRef}
      style={style}
      sx={{
        p: 0,
        mb: 1,
        borderRadius: 2,
        border: isSelected ? 2 : 1,
        borderColor: isSelected ? 'primary.main' : 'divider',
        bgcolor: isSelected ? 'primary.50' : 'background.paper',
        '&:hover': {
          bgcolor: isSelected ? 'primary.100' : 'action.hover',
        },
      }}
    >
      <ListItemButton
        onClick={onSelect}
        onDoubleClick={handleDoubleClick}
        selected={isSelected}
        sx={{ borderRadius: 2 }}
      >
        <ListItemIcon sx={{ minWidth: 32 }}>
          <IconButton
            size="small"
            {...attributes}
            {...listeners}
            aria-label="Drag to reorder"
            sx={{ cursor: 'grab', '&:active': { cursor: 'grabbing' } }}
          >
            <DragIcon fontSize="small" />
          </IconButton>
        </ListItemIcon>

        <ListItemText
          primary={
            isEditing ? (
              <TextField
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                onBlur={handleRename}
                onKeyDown={handleKeyDown}
                size="small"
                autoFocus
                fullWidth
                variant="standard"
                sx={{ '& .MuiInput-underline:before': { borderBottom: 'none' } }}
              />
            ) : (
              <Typography variant="body2" fontWeight={isSelected ? 600 : 400}>
                {section.name}
              </Typography>
            )
          }
          secondary={
            <Chip
              label={section.kind}
              size="small"
              variant="outlined"
              sx={{ mt: 0.5, fontSize: '0.75rem', height: 20 }}
            />
          }
        />

        <Stack direction="row" spacing={0.5} alignItems="center">
          <IconButton
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              onToggleVisibility();
            }}
            aria-label={section.visible ? 'Hide section' : 'Show section'}
          >
            {section.visible ? <VisibilityIcon fontSize="small" /> : <VisibilityOffIcon fontSize="small" />}
          </IconButton>

          <IconButton
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              handleMenuOpen(e);
            }}
            aria-label="More options"
          >
            <MoreIcon fontSize="small" />
          </IconButton>
        </Stack>
      </ListItemButton>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <MenuItem onClick={() => setIsEditing(true)}>
          <ListItemIcon>
            <EditIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Rename</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleDuplicate}>
          <ListItemIcon>
            <DuplicateIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Duplicate</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleDelete} sx={{ color: 'error.main' }}>
          <ListItemIcon>
            <DeleteIcon fontSize="small" color="error" />
          </ListItemIcon>
          <ListItemText>Delete</ListItemText>
        </MenuItem>
      </Menu>
    </ListItem>
  );
}

interface SiteBuilderSidebarProps {
  collapsible?: boolean;
  mobile?: boolean;
}

export function SiteBuilderSidebar({ collapsible = false, mobile = false }: SiteBuilderSidebarProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const [addMenuAnchor, setAddMenuAnchor] = useState<null | HTMLElement>(null);
  const [activeId, setActiveId] = useState<string | null>(null);

  const sections = useSiteBuilderStore((s) => s.sections);
  const selectedSectionId = useSiteBuilderStore((s) => s.selectedSectionId);
  const addSection = useSiteBuilderStore((s) => s.addSection);
  const selectSection = useSiteBuilderStore((s) => s.selectSection);
  const updateSection = useSiteBuilderStore((s) => s.updateSection);
  const deleteSection = useSiteBuilderStore((s) => s.deleteSection);
  const duplicateSection = useSiteBuilderStore((s) => s.duplicateSection);
  const reorderSections = useSiteBuilderStore((s) => s.reorderSections);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const handleAddSection = (kind: string) => {
    addSection(kind);
    setAddMenuAnchor(null);
  };

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (over && active.id !== over.id) {
      const oldIndex = sections.findIndex((section) => section.id === active.id);
      const newIndex = sections.findIndex((section) => section.id === over.id);
      
      if (oldIndex !== -1 && newIndex !== -1) {
        reorderSections(oldIndex, newIndex);
      }
    }
    
    setActiveId(null);
  };

  const getActiveSection = () => {
    if (!activeId) return null;
    return sections.find((section) => section.id === activeId);
  };

  const sortedSections = [...sections].sort((a, b) => a.order - b.order);

  const sidebarContent = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
          <Typography variant="h6" fontWeight={600}>
            Sections
          </Typography>
          <Button
            startIcon={<AddIcon />}
            onClick={(e) => setAddMenuAnchor(e.currentTarget)}
            variant="contained"
            size="small"
            data-testid="add-section-button"
          >
            Add Section
          </Button>
        </Stack>
      </Box>

      <Box sx={{ flex: 1, overflow: 'auto', p: 2 }}>
        {sections.length === 0 ? (
          <Box
            sx={{
              textAlign: 'center',
              py: 6,
              px: 3,
              border: '2px dashed',
              borderColor: 'divider',
              borderRadius: 2,
              bgcolor: 'background.default',
            }}
          >
            <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
              No sections yet
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Add your first section to get started
            </Typography>
            <Button
              variant="contained"
              onClick={(e) => setAddMenuAnchor(e.currentTarget)}
              data-testid="add-first-section-button"
            >
              Add your first section
            </Button>
          </Box>
        ) : (
            <DndContext
              sensors={sensors}
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
            >
              <SortableContext items={sections.map(s => s.id)} strategy={verticalListSortingStrategy}>
                <List 
                  sx={{ p: 0 }}
                  role="list"
                  aria-label="Sections list"
                >
                  {sortedSections.map((section) => (
                    <SortableSectionItem
                      key={section.id}
                      section={section}
                      isSelected={selectedSectionId === section.id}
                      onSelect={() => selectSection(section.id)}
                      onToggleVisibility={() => updateSection(section.id, { visible: !section.visible })}
                      onRename={(name) => updateSection(section.id, { name })}
                      onDuplicate={() => duplicateSection(section.id)}
                      onDelete={() => deleteSection(section.id)}
                    />
                  ))}
                </List>
              </SortableContext>
            <DragOverlay>
              {activeId ? (
                <Box
                  sx={{
                    p: 2,
                    bgcolor: 'background.paper',
                    borderRadius: 2,
                    boxShadow: 3,
                    transform: 'rotate(5deg)',
                    opacity: 0.9,
                  }}
                >
                  <Typography variant="body2" fontWeight={600}>
                    {getActiveSection()?.name}
                  </Typography>
                </Box>
              ) : null}
            </DragOverlay>
          </DndContext>
        )}
      </Box>

      <Menu
        anchorEl={addMenuAnchor}
        open={Boolean(addMenuAnchor)}
        onClose={() => setAddMenuAnchor(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'left' }}
      >
        {sectionKinds.map((kind) => (
          <MenuItem
            key={kind.value}
            onClick={() => handleAddSection(kind.value)}
            data-testid={`add-section-${kind.value}`}
          >
            <ListItemText
              primary={kind.label}
              secondary={kind.description}
            />
          </MenuItem>
        ))}
      </Menu>
    </Box>
  );

  if (mobile) {
    return sidebarContent;
  }

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: 320,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: 320,
          boxSizing: 'border-box',
          borderRight: 1,
          borderColor: 'divider',
        },
      }}
    >
      {sidebarContent}
    </Drawer>
  );
}