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
  Tabs, 
  Tab,  
  Button,
  Container, 
} from '@mui/material';
import EventIcon from '@mui/icons-material/Event';
import NewspaperIcon from '@mui/icons-material/Newspaper';
import PersonIcon from '@mui/icons-material/Person';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder'; 
import AssignmentIcon from '@mui/icons-material/Assignment'; 
import MedicalServicesIcon from '@mui/icons-material/MedicalServices'; 
import InfoIcon from '@mui/icons-material/Info';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';

import { HeaderContext } from '../../context/HeaderContext'; 


const mockNews = [
  { id: 1, title: 'Tarde de Bingo este Viernes', date: '2025-07-25' },
  { id: 2, title: 'Visita del Coro Local', date: '2025-08-02' },
];

const mockEvents = [
  { id: 1, title: 'Celebración Cumpleaños de Julio', date: '2025-07-30', time: '15:00' },
];

const mockCaregiver = {
  name: 'Ana García',
  photoUrl: '/path/to/ana-garcia.jpg',
};

const mockAlerts = [
  { id: 1, severity: 'info', title: 'Recordatorio Cita Médica', message: 'Mañana a las 10:00 AM con el Dr. López.', timestamp: 'Hace 2 horas' },
  { id: 2, severity: 'warning', title: 'Cambio Leve de Apetito', message: 'Se observó menor ingesta en la comida de hoy.', timestamp: 'Hace 5 horas' },
];


const mockHealthStatus = {
  summaryNote: "Doña Elena ha tenido un día tranquilo. Participó en la actividad matutina con buen ánimo. El apetito fue normal en el almuerzo, aunque bebió un poco menos de lo usual por la tarde. Sin quejas de dolor.",
  indicators: {
    mood: { label: 'Ánimo', value: 'Bueno', severity: 'success' },
    appetite: { label: 'Apetito', value: 'Normal', severity: 'success' },
    sleep: { label: 'Sueño (noche anterior)', value: 'Adecuado', severity: 'success' },
    hydration: { label: 'Hidratación', value: 'Algo bajo', severity: 'warning' },
  },
  vitals: {
    bloodPressure: { label: 'Presión Arterial', value: '130/80 mmHg', status: 'Estable' },
    temperature: { label: 'Temperatura', value: '36.5°C', status: 'Normal' },
    heartRate: { label: 'Frecuencia Cardíaca', value: '75 bpm', status: 'Normal' },
    lastCheck: 'Hoy, 09:00 AM'
  }
};

const mockCarePlan = {
  summary: "Mantener nivel actual de movilidad con asistencia en traslados largos. Fomentar la participación social. Dieta baja en sodio. Seguimiento de la presión arterial.",
  objectives: [
    "Prevenir caídas.",
    "Mantener la función cognitiva mediante actividades.",
    "Asegurar una nutrición e hidratación adecuadas.",
  ],
  specificNeeds: [
    { label: 'Dieta', detail: 'Baja en sodio, sin azúcares añadidos.' },
    { label: 'Movilidad', detail: 'Usa andador. Necesita supervisión en escaleras.' },
    { label: 'Asistencia', detail: 'Para la ducha semanal y vestido.' },
  ],
  allergies: [
    { name: 'Penicilina', severity: 'Alta' },
    { name: 'Látex', severity: 'Moderada' },
  ]
};

const mockMedication = {
  lastUpdated: '2025-07-24',
  meds: [
    { id: 'med1', name: 'Losartán 50mg', purpose: 'Presión arterial', schedule: '1 al día (mañana)', status: 'Administrado hoy 8:00 AM', administered: true },
    { id: 'med2', name: 'Aspirina 100mg', purpose: 'Prevención cardiovascular', schedule: '1 al día (mediodía)', status: 'Administrado hoy 1:00 PM', administered: true },
    { id: 'med3', name: 'Calcio + Vit D', purpose: 'Salud ósea', schedule: '1 al día (cena)', status: 'Pendiente hoy', administered: false },
    { id: 'med4', name: 'Paracetamol 500mg', purpose: 'Dolor leve', schedule: 'Según necesidad', status: 'No administrado hoy', administered: null }, 
  ]
};




const HealthStatusSection = ({ data }) => (
  <Container maxWidth="md" sx={{ py: 2 }}> 
    <Typography variant="h6" gutterBottom sx={{ color: '#1e3b55', fontWeight: 'bold' }}>
      Estado de Salud General
    </Typography>
    <Divider sx={{ mb: 2 }} />

    <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'medium', color: '#283945' }}>Resumen Reciente del Personal:</Typography>
    <Paper elevation={1} sx={{ p: 2, mb: 3, bgcolor: '#f8f9fa' }}>
      <Typography variant="body2">{data.summaryNote}</Typography>
    </Paper>

    <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'medium', color: '#283945' }}>Indicadores Clave:</Typography>
    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 3 }}>
      {Object.values(data.indicators).map(indicator => (
        <Chip
          key={indicator.label}
          label={`${indicator.label}: ${indicator.value}`}
          color={indicator.severity} 
          variant="outlined"
        />
      ))}
    </Box>

    <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'medium', color: '#283945' }}>Últimos Signos Vitales (Referencia):</Typography>
    <List dense disablePadding>
        {Object.values(data.vitals).filter(v => v.label).map(vital => (
            <ListItem key={vital.label} disableGutters>
                <ListItemText primary={vital.label} secondary={`${vital.value} - ${vital.status}`} />
            </ListItem>
        ))}
         <ListItem disableGutters>
             <ListItemText secondary={`Última comprobación: ${data.vitals.lastCheck}`} />
         </ListItem>
    </List>
     <Typography variant="caption" display="block" color="text.secondary" sx={{ mt: 1 }}>
       Nota: Esta es información de referencia simplificada. Consulte al personal para detalles.
     </Typography>
  </Container>
);

const CarePlanSection = ({ data }) => (
  <Container maxWidth="md" sx={{ py: 2 }}>
    <Typography variant="h6" gutterBottom sx={{ color: '#1e3b55', fontWeight: 'bold' }}>
      Plan de Cuidados
    </Typography>
    <Divider sx={{ mb: 2 }} />

    <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'medium', color: '#283945' }}>Resumen:</Typography>
    <Typography variant="body2" sx={{ mb: 2 }}>{data.summary}</Typography>

    <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'medium', color: '#283945' }}>Objetivos Principales:</Typography>
    <List dense sx={{ mb: 2 }}>
      {data.objectives.map((obj, index) => (
        <ListItem key={index} disablePadding>
            <ListItemIcon sx={{ minWidth: 30 }}><InfoIcon fontSize="small" color="action" /></ListItemIcon>
          <ListItemText primary={obj} />
        </ListItem>
      ))}
    </List>

    <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'medium', color: '#283945' }}>Necesidades Específicas:</Typography>
     <List dense sx={{ mb: 2 }}>
      {data.specificNeeds.map((need) => (
        <ListItem key={need.label} disablePadding>
            <ListItemText primary={<strong>{need.label}:</strong>} secondary={need.detail} sx={{ margin: 0 }}/>
        </ListItem>
      ))}
    </List>


    <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'medium', color: '#283945' }}>Alergias Importantes:</Typography>
    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
      {data.allergies.map((allergy) => (
        <Chip
          key={allergy.name}
          icon={<WarningAmberIcon />}
          label={`${allergy.name} (${allergy.severity})`}
          color="warning"
          variant="outlined"
        />
      ))}
       {data.allergies.length === 0 && <Typography variant="body2" color="text.secondary">No hay alergias registradas.</Typography>}
    </Box>
  </Container>
);

const MedicationSection = ({ data }) => (
  <Container maxWidth="md" sx={{ py: 2 }}>
    <Typography variant="h6" gutterBottom sx={{ color: '#1e3b55', fontWeight: 'bold' }}>
      Medicación Actual
    </Typography>
    <Typography variant="caption" display="block" color="text.secondary" sx={{mb: 1}}>
        Última revisión de la lista: {data.lastUpdated}
    </Typography>
    <Divider sx={{ mb: 2 }} />

    <List disablePadding>
      {data.meds.map((med) => (
        <React.Fragment key={med.id}>
          <ListItem alignItems="flex-start" disableGutters>
            <ListItemIcon sx={{ mt: 1, minWidth: 40 }}>
              {med.administered === true ? (
                 <CheckCircleOutlineIcon color="success" />
              ) : med.administered === false ? (
                 <RadioButtonUncheckedIcon color="disabled" />
              ) : (
                 <InfoIcon color="action" fontSize='small'/> 
              )}
            </ListItemIcon>
            <ListItemText
              primary={<Typography variant="subtitle1" sx={{ fontWeight: 'medium' }}>{med.name}</Typography>}
              secondary={
                <>
                  <Typography component="span" variant="body2" color="text.primary">
                    {med.purpose}
                  </Typography>
                  {" — "} {med.schedule}
                  <Typography component="span" variant="caption" display="block" sx={{ fontStyle: 'italic', mt: 0.5 }}>
                     {med.status}
                  </Typography>
                </>
              }
            />
          </ListItem>
          <Divider variant="inset" component="li" />
        </React.Fragment>
      ))}
    </List>
     <Typography variant="caption" display="block" color="text.secondary" sx={{ mt: 2 }}>
       Nota: Esta lista es informativa. Consulte al personal para detalles sobre dosis y administración.
     </Typography>
  </Container>
);



const FamDashboard = () => {
  const { setHeaderTitle, setHeaderRoute } = useContext(HeaderContext);
  const [selectedSection, setSelectedSection] = useState('health'); 
  const [news] = useState(mockNews);
  const [events] = useState(mockEvents);
  const [caregiver] = useState(mockCaregiver);
  const [alerts] = useState(mockAlerts);
  const [healthStatus] = useState(mockHealthStatus);
  const [carePlan] = useState(mockCarePlan);
  const [medication] = useState(mockMedication);

  useEffect(() => {
    setHeaderTitle("Panel Familiar");
    setHeaderRoute("Inicio / Residente: Elena Pérez"); 
  }, [setHeaderTitle, setHeaderRoute]);

  const handleSectionChange = (event, newValue) => {
    setSelectedSection(newValue);
  };

  return (
    <div className="flex flex-col w-full h-full gap-5 px-4 py-6 bg-transparent">
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
            <Grid container direction="column" spacing={3}>
                <Grid item>
                    <Paper elevation={2} sx={{ p: 2, backgroundColor: '#f8f9fa' }}>
                        <Typography variant="h6" gutterBottom sx={{ color: '#1e3b55', fontWeight: 'bold' }}>
                        Noticias y Eventos del Asilo
                        </Typography>
                        <Divider sx={{ mb: 2 }} />
                         <Typography variant="subtitle1" gutterBottom sx={{ color: '#283945', fontWeight: 'medium' }}>Próximos Eventos</Typography>
                         <List dense>
                            {events.map((event) => (
                                <ListItem key={event.id} disablePadding>
                                <ListItemIcon sx={{ minWidth: '40px' }}><EventIcon color="primary" /></ListItemIcon>
                                <ListItemText primary={event.title} secondary={`${event.date} - ${event.time}`} />
                                </ListItem>
                            ))}
                         </List>
                         <Divider sx={{ my: 2 }} />
                         <Typography variant="subtitle1" gutterBottom sx={{ color: '#283945', fontWeight: 'medium' }}>Últimas Noticias</Typography>
                         <List dense>
                            {news.map((newsItem) => (
                                <ListItem key={newsItem.id} disablePadding>
                                <ListItemIcon sx={{ minWidth: '40px' }}><NewspaperIcon sx={{ color: '#6c757d' }}/></ListItemIcon>
                                <ListItemText primary={newsItem.title} secondary={newsItem.date} />
                                </ListItem>
                            ))}
                        </List>
                    </Paper>
                </Grid>
                <Grid item>
                    <Paper elevation={2} sx={{ backgroundColor: '#ffffff' }}> 
                         <Box sx={{ borderBottom: 1, borderColor: 'divider', bgcolor: '#e9ecef' }}>
                            <Tabs
                                value={selectedSection}
                                onChange={handleSectionChange}
                                aria-label="Secciones de información del residente"
                                variant="fullWidth" 
                                indicatorColor="primary"
                                textColor="primary"
                             >
                                <Tab icon={<FavoriteBorderIcon />} iconPosition="start" label="Salud General" value="health" sx={{ textTransform: 'none', fontWeight: 'medium' }}/>
                                <Tab icon={<AssignmentIcon />} iconPosition="start" label="Plan Cuidados" value="carePlan" sx={{ textTransform: 'none', fontWeight: 'medium' }} />
                                <Tab icon={<MedicalServicesIcon />} iconPosition="start" label="Medicación" value="medication" sx={{ textTransform: 'none', fontWeight: 'medium' }} />
                            </Tabs>
                         </Box>


                        {selectedSection === 'health' && <HealthStatusSection data={healthStatus} />}
                        {selectedSection === 'carePlan' && <CarePlanSection data={carePlan} />}
                        {selectedSection === 'medication' && <MedicationSection data={medication} />}
                    </Paper>
                </Grid>
          </Grid>
        </Grid>


        <Grid item xs={12} md={6}>
          <Grid container direction="column" spacing={3}>

            <Grid item>
              <Card elevation={2} sx={{ backgroundColor: '#e9ecef' }}>
                <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>

                   <Avatar sx={{ bgcolor: '#1e3b55', width: 56, height: 56 }} src={caregiver.photoUrl}>
                     { !caregiver.photoUrl && caregiver.name.split(' ').map(n => n[0]).join('') }
                   </Avatar>
                  <Box>
                    <Typography variant="subtitle1" sx={{ color: '#495057' }}>Cuidador Asignado</Typography>
                    <Typography variant="h6" sx={{ color: '#1e3b55', fontWeight: 'bold' }}>{caregiver.name}</Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>


            <Grid item>
              <Paper elevation={2} sx={{ p: 2, backgroundColor: '#f8f9fa' }}>
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
                     <Typography sx={{ textAlign: 'center', color: '#6c757d', mt: 2 }}>No hay alertas recientes.</Typography>
                  )}
                </Box>
              </Paper>
            </Grid>
          </Grid>
        </Grid>

      </Grid>
    </div>
  );
};

export default FamDashboard;