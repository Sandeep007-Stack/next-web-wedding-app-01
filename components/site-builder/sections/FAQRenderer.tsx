"use client";

import {
  Box,
  Typography,
  Container,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { SiteSection } from '@/types/site-builder';

interface FAQRendererProps {
  section: SiteSection;
}

export function FAQRenderer({ section }: FAQRendererProps) {
  const { title, items } = section.data;

  const faqItems = items || [
    { question: 'Sample question?', answer: 'Sample answer.' }
  ];

  return (
    <Box sx={{ py: 8 }} data-testid={`faq-section-${section.id}`}>
      <Container maxWidth="md">
        <Typography variant="h2" component="h2" textAlign="center" gutterBottom>
          {title || 'Frequently Asked Questions'}
        </Typography>
        
        <Box sx={{ mt: 4 }}>
          {faqItems.map((item: any, index: number) => (
            <Accordion key={index}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="h6">
                  {item.question}
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography>
                  {item.answer}
                </Typography>
              </AccordionDetails>
            </Accordion>
          ))}
        </Box>
      </Container>
    </Box>
  );
}