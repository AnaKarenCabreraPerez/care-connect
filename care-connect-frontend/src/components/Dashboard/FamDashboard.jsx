import React, { useState, useEffect, useContext } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Paper,
  Avatar,
  Chip,
  Alert,
  AlertTitle,
} from '@mui/material';
import EventIcon from '@mui/icons-material/Event';
import NewspaperIcon from '@mui/icons-material/Newspaper';
import PersonIcon from '@mui/icons-material/Person';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import { HeaderContext } from '../../context/HeaderContext'; 

// Datos de Ejemplo 
const mockNews = [
  { id: 1, title: 'Tarde de Bingo este Viernes', date: '2025-05-25' },
  { id: 2, title: 'Visita del Coro Local', date: '2025-06-02' },
  { id: 3, title: 'Nuevo Menú Semanal Disponible', date: '2025-06-22' },
];

const mockEvents = [
  { id: 1, title: 'Celebración Cumpleaños de Julio', date: '2025-05-30', time: '15:00' },
  { id: 2, title: 'Taller de Jardinería', date: '2025-06-05', time: '10:00' },
];

const mockCaregiver = {
  name: 'Ana García',
  photoUrl: '/path/to/ana-garcia.jpg', 
};

const mockAlerts = [
  { id: 1, severity: 'info', title: 'Recordatorio Cita Médica', message: 'Mañana a las 10:00 AM con el Dr. López.', timestamp: 'Hace 2 horas' },
  { id: 2, severity: 'warning', title: 'Cambio Leve de Apetito', message: 'Se observó menor ingesta en la comida de hoy.', timestamp: 'Hace 5 horas' },
  // { id: 3, severity: 'success', title: 'Participación en Actividad', message: 'Disfrutó mucho el taller de música hoy.', timestamp: 'Hace 1 día'},
  // { id: 4, severity: 'error', title: 'Incidente Menor', message: 'Se reportó una caída sin consecuencias.', timestamp: 'Hace 3 días'},
];
// Fin Datos de Ejemplo


const FamDashboard = () => {
  const { setHeaderTitle, setHeaderRoute } = useContext(HeaderContext); 

  // Datos del estado 
  const [news, setNews] = useState(mockNews);
  const [events, setEvents] = useState(mockEvents);
  const [caregiver, setCaregiver] = useState(mockCaregiver);
  const [alerts, setAlerts] = useState(mockAlerts);

  useEffect(() => {
    setHeaderTitle("Panel Familiar");
    setHeaderRoute("Inicio / Residente: Ricardo Mauricio");
  }, [setHeaderTitle, setHeaderRoute]);

  return (
    <div className="flex flex-col w-full h-full gap-5 px-4 py-6 bg-transparent">
      <Grid container spacing={3}>

        {/* Sección Noticias y Eventos */}
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 2, height: '100%', backgroundColor: '#f8f9fa' }}>
            <Typography variant="h6" gutterBottom sx={{ color: '#1e3b55', fontWeight: 'bold' }}>
              Noticias y Eventos del Asilo
            </Typography>
            <Divider sx={{ mb: 2 }} />

            <Typography variant="subtitle1" gutterBottom sx={{ color: '#283945', fontWeight: 'medium' }}>
              Próximos Eventos
            </Typography>
            <List dense>
              {events.map((event) => (
                <ListItem key={event.id}>
                  <ListItemIcon sx={{ minWidth: '40px' }}>
                    <EventIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText primary={event.title} secondary={`${event.date} - ${event.time}`} />
                </ListItem>
              ))}
            </List>

            <Divider sx={{ my: 2 }} />

            <Typography variant="subtitle1" gutterBottom sx={{ color: '#283945', fontWeight: 'medium' }}>
              Últimas Noticias
            </Typography>
            <List dense>
              {news.map((newsItem) => (
                <ListItem key={newsItem.id}>
                  <ListItemIcon sx={{ minWidth: '40px' }}>
                    <NewspaperIcon sx={{ color: '#6c757d' }}/>
                  </ListItemIcon>
                  <ListItemText primary={newsItem.title} secondary={newsItem.date} />
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>

        {/* Sección Cuidador y Alertas */}
        <Grid item xs={12} md={6}>
          <Grid container direction="column" spacing={3}>

            {/* Card Cuidador */}
            <Grid item xs={12}>
              <Card elevation={3} sx={{ backgroundColor: '#e9ecef' }}>
                <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                   <Avatar sx={{ bgcolor: '#1e3b55', width: 56, height: 56 }} src={caregiver.photoUrl}>
                     { !caregiver.photoUrl && caregiver.name.split(' ').map(n => n[0]).join('') }
                   </Avatar>
                  <Box>
                    <Typography variant="subtitle1" sx={{ color: '#495057' }}>
                      Cuidador Asignado
                    </Typography>
                    <Typography variant="h6" sx={{ color: '#1e3b55', fontWeight: 'bold' }}>
                      {caregiver.name}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            {/* Panel de Alertas */}
            <Grid item xs={12}>
              <Paper elevation={3} sx={{ p: 2, backgroundColor: '#f8f9fa' }}>
                <Typography variant="h6" gutterBottom sx={{ color: '#1e3b55', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: 1 }}>
                   <NotificationsActiveIcon /> Panel de Alertas Recientes
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <Box sx={{ maxHeight: '300px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {alerts.length > 0 ? (
                    alerts.map((alert) => (
                      <Alert key={alert.id} severity={alert.severity} variant="outlined">
                        <AlertTitle>{alert.title}</AlertTitle>
                        {alert.message} - <Typography variant="caption" sx={{ fontStyle: 'italic' }}>{alert.timestamp}</Typography>
                      </Alert>
                    ))
                  ) : (
                     <Typography sx={{ textAlign: 'center', color: '#6c757d', mt: 2 }}>
                       No hay alertas recientes para mostrar.
                     </Typography>
                  )}
                </Box>
              </Paper>
            </Grid>

          </Grid> { /* Cuidador y Alertas */ }
        </Grid> { /* Columna Derecha */ }

      </Grid> { /* Container Principal */ }
    </div>
  );
};

export default FamDashboard;