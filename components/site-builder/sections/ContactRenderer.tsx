"use client";

import {
  Box,
  Typography,
  Container,
  Grid,
  Card,
  CardContent,
  TextField,
  Button,
  Stack,
} from '@mui/material';
import { SiteSection } from '@/types/site-builder';

interface ContactRendererProps {
  section: SiteSection;
}

export function ContactRenderer({ section }: ContactRendererProps) {
  const { title, email, phone, address, showForm } = section.data;

  return (
    <Box sx={{ py: 8, bgcolor: 'background.default' }} data-testid={`contact-section-${section.id}`}>
      <Container maxWidth="lg">
        <Typography variant="h2" component="h2" textAlign="center" gutterBottom>
          {title || 'Contact Us'}
        </Typography>
        
        <Grid container spacing={4} sx={{ mt: 2 }}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Get in Touch
                </Typography>
                {email && (
                  <Typography gutterBottom>
                    Email: {email}
                  </Typography>
                )}
                {phone && (
                  <Typography gutterBottom>
                    Phone: {phone}
                  </Typography>
                )}
                {address && (
                  <Typography>
                    Address: {address}
                  </Typography>
                )}
              </CardContent>
            </Card>
          </Grid>
          
          {showForm && (
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Send Message
                  </Typography>
                  <Stack spacing={2}>
                    <TextField label="Name" fullWidth />
                    <TextField label="Email" type="email" fullWidth />
                    <TextField label="Message" multiline rows={4} fullWidth />
                    <Button variant="contained">Send Message</Button>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          )}
        </Grid>
      </Container>
    </Box>
  );
}