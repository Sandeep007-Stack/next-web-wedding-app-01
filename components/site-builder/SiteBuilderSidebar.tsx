"use client";

import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  List,
  ListItem,
  IconButton,
  Chip,
  Menu,
  MenuItem,
  TextField,
  Tooltip,
} from '@mui/material';
import {
  Add as AddIcon,
  DragIndicator as DragIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  MoreVert as MoreIcon,
  ContentCopy as DuplicateIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
} from '@mui/icons-material';
import { useState, useRef } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useSiteBuilderStore } from '@/store/siteBuilderStore';
import { SectionKind } from '@/types/site-builder';

const sectionKinds: { kind: SectionKind; label: string; description: string }[] = [
  { kind: 'Hero', label: 'Hero', description: 'Main banner section' },
  { kind: 'Story', label: 'Story', description: 'Tell your story' },
  { kind: 'Events', label: 'Events', description: 'Display events' },
  { kind: 'Gallery', label: 'Gallery', description: 'Photo gallery' },
  { kind: 'FAQ', label: 'FAQ', description: 'Frequently asked questions' },
  { kind: 'Contact', label: 'Contact', description: 'Contact information' },
  { kind: 'Footer', label: 'Footer', description: 'Page footer' },
];

interface SortableSectionItemProps {
  section: any;
  isSelected: boolean;
  onSelect: () => void;
  onToggleVisibility: () => void;
  onDuplicate: () => void;
  onDelete: () => void;
  onRename: (name: string) => void;
}

function SortableSectionItem({
  section,
  isSelected,
  onSelect,
  onToggleVisibility,
  onDuplicate,
  onDelete,
  onRename,
}: SortableSectionItemProps) {
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
  const [isRenaming, setIsRenaming] = useState(false);
  const [renameValue, setRenameValue] = useState(section.name);

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

  const handleRename = () => {
    onRename(renameValue);
    setIsRenaming(false);
    setMenuAnchor(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleRename();
    } else if (e.key === 'Escape') {
      setIsRenaming(false);
      setRenameValue(section.name);
    }
  };

  return (
    <ListItem
      ref={setNodeRef}
      style={style}
      sx={{
        p: 0,
        mb: 1,
        border: 1,
        borderColor: isSelected ? 'primary.main' : 'divider',
        borderRadius: 2,
        bgcolor: isSelected ? 'primary.50' : 'background.paper',
        cursor: 'pointer',
        '&:hover': {
          bgcolor: isSelected ? 'primary.100' : 'action.hover',
        },
      }}
      onClick={onSelect}
      data-testid={`section-item-${section.id}`}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', p: 1 }}>
        <IconButton
          size="small"
          {...attributes}
          {...listeners}
          sx={{ cursor: 'grab', mr: 1 }}
          aria-label="Drag to reorder"
          data-testid={`drag-handle-${section.id}`}
        >
          <DragIcon />
        </IconButton>

        <IconButton
          size="small"
          onClick={(e) => {
            e.stopPropagation();
            onToggleVisibility();
          }}
          sx={{ mr: 1 }}
          aria-label={section.visible ? 'Hide section' : 'Show section'}
          data-testid={`visibility-toggle-${section.id}`}
        >
          {section.visible ? <VisibilityIcon /> : <VisibilityOffIcon />}
        </IconButton>

        <Box sx={{ flex: 1, minWidth: 0 }}>
          {isRenaming ? (
            <TextField
              value={renameValue}
              onChange={(e) => setRenameValue(e.target.value)}
              onBlur={handleRename}
              onKeyDown={handleKeyDown}
              size="small"
              fullWidth
              autoFocus
              onClick={(e) => e.stopPropagation()}
              data-testid={`rename-input-${section.id}`}
            />
          ) : (
            <>
              <Typography
                variant="body2"
                fontWeight={500}
                sx={{
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
                onDoubleClick={(e) => {
                  e.stopPropagation();
                  setIsRenaming(true);
                }}
              >
                {section.name}
              </Typography>
              <Chip
                label={section.kind}
                size="small"
                variant="outlined"
                sx={{ mt: 0.5, fontSize: '0.75rem', height: 20 }}
              />
            </>
          )}
        </Box>

        <IconButton
          size="small"
          onClick={(e) => {
            e.stopPropagation();
            setMenuAnchor(e.currentTarget);
          }}
          aria-label="Section options"
          data-testid={`section-menu-${section.id}`}
        >
          <MoreIcon />
        </IconButton>
      </Box>

      <Menu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={() => setMenuAnchor(null)}
        onClick={(e) => e.stopPropagation()}
      >
        <MenuItem
          onClick={() => {
            setIsRenaming(true);
            setMenuAnchor(null);
          }}
          data-testid={`rename-option-${section.id}`}
        >
          <EditIcon sx={{ mr: 1 }} />
          Rename
        </MenuItem>
        <MenuItem
          onClick={() => {
            onDuplicate();
            setMenuAnchor(null);
          }}
          data-testid={`duplicate-option-${section.id}`}
        >
          <DuplicateIcon sx={{ mr: 1 }} />
          Duplicate
        </MenuItem>
        <MenuItem
          onClick={() => {
            onDelete();
            setMenuAnchor(null);
          }}
          sx={{ color: 'error.main' }}
          data-testid={`delete-option-${section.id}`}
        >
          <DeleteIcon sx={{ mr: 1 }} />
          Delete
        </MenuItem>
      </Menu>
    </ListItem>
  );
}

export function SiteBuilderSidebar() {
  const [addMenuAnchor, setAddMenuAnchor] = useState<null | HTMLElement>(null);
  const addButtonRef = useRef<HTMLButtonElement>(null);

  const {
    sections,
    selectedSectionId,
    addSection,
    removeSection,
    duplicateSection,
    reorderSections,
    toggleSectionVisibility,
    renameSection,
    selectSection,
  } = useSiteBuilderStore();

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = sections.findIndex((section) => section.id === active.id);
      const newIndex = sections.findIndex((section) => section.id === over.id);
      reorderSections(oldIndex, newIndex);
    }
  };

  const handleAddSection = (kind: SectionKind) => {
    addSection(kind);
    setAddMenuAnchor(null);
  };

  if (sections.length === 0) {
    return (
      <Box sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
          <Typography variant="h6" fontWeight={600}>
            Sections
          </Typography>
          <Button
            ref={addButtonRef}
            startIcon={<AddIcon />}
            variant="contained"
            size="small"
            onClick={(e) => setAddMenuAnchor(e.currentTarget)}
            data-testid="add-section-button"
          >
            Add Section
          </Button>
        </Box>

        <Card sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <CardContent sx={{ textAlign: 'center', py: 6 }}>
            <Typography variant="h6" gutterBottom>
              No sections yet
            </Typography>
            <Typography color="text.secondary" sx={{ mb: 3 }}>
              Add your first section to get started building your site.
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={(e) => setAddMenuAnchor(e.currentTarget)}
              data-testid="add-first-section-button"
            >
              Add first section
            </Button>
          </CardContent>
        </Card>

        <Menu
          anchorEl={addMenuAnchor}
          open={Boolean(addMenuAnchor)}
          onClose={() => setAddMenuAnchor(null)}
          data-testid="add-section-menu"
        >
          {sectionKinds.map((kind) => (
            <MenuItem
              key={kind.kind}
              onClick={() => handleAddSection(kind.kind)}
              data-testid={`add-section-${kind.kind.toLowerCase()}`}
            >
              <Box>
                <Typography variant="body2" fontWeight={500}>
                  {kind.label}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {kind.description}
                </Typography>
              </Box>
            </MenuItem>
          ))}
        </Menu>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 2, height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h6" fontWeight={600}>
          Sections
        </Typography>
        <Button
          ref={addButtonRef}
          startIcon={<AddIcon />}
          variant="outlined"
          size="small"
          onClick={(e) => setAddMenuAnchor(e.currentTarget)}
          data-testid="add-section-button"
        >
          Add Section
        </Button>
      </Box>

      <Box sx={{ flex: 1, overflow: 'auto' }}>
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext items={sections.map(s => s.id)} strategy={verticalListSortingStrategy}>
            <List sx={{ p: 0 }} data-testid="sections-list">
              {sections.map((section) => (
                <SortableSectionItem
                  key={section.id}
                  section={section}
                  isSelected={section.id === selectedSectionId}
                  onSelect={() => selectSection(section.id)}
                  onToggleVisibility={() => toggleSectionVisibility(section.id)}
                  onDuplicate={() => duplicateSection(section.id)}
                  onDelete={() => removeSection(section.id)}
                  onRename={(name) => renameSection(section.id, name)}
                />
              ))}
            </List>
          </SortableContext>
        </DndContext>
      </Box>

      <Menu
        anchorEl={addMenuAnchor}
        open={Boolean(addMenuAnchor)}
        onClose={() => setAddMenuAnchor(null)}
        data-testid="add-section-menu"
      >
        {sectionKinds.map((kind) => (
          <MenuItem
            key={kind.kind}
            onClick={() => handleAddSection(kind.kind)}
            data-testid={`add-section-${kind.kind.toLowerCase()}`}
          >
            <Box>
              <Typography variant="body2" fontWeight={500}>
                {kind.label}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {kind.description}
              </Typography>
            </Box>
          </MenuItem>
        ))}
      </Menu>
    </Box>
  );
}