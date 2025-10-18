import React, { useState, useEffect } from 'react';
import { Calendar, Dumbbell, Heart, Clock, CheckCircle, PlayCircle, Bell, TrendingUp, Flame, Award } from 'lucide-react';

const ExerciseApp = () => {
  const [currentDay, setCurrentDay] = useState(new Date().getDay());
  const [completedDays, setCompletedDays] = useState({});
  const [reminderTime, setReminderTime] = useState('06:30');
  const [showReminder, setShowReminder] = useState(false);
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [stats, setStats] = useState({
    weekCompletions: 0,
    totalCalories: 0,
    totalWorkouts: 0
  });

  const caloriesBurnedPerActivity = {
    strength: 250,
    cardio: 500,
    mirador: 550,
    cuerda: 120
  };

  const dumbbellExercises = {
    pecho: [
      { name: 'Press de Pecho en el Piso', weight: '6-8 kg c/u', sets: '3x10-12', video: 'https://www.youtube.com/embed/uUGDRwge4F8' },
      { name: 'Aperturas en el Piso', weight: '4-6 kg c/u', sets: '3x12', video: 'https://www.youtube.com/embed/eozdVDA78K0' },
      { name: 'Curl de Bíceps Alterno', weight: '6-8 kg c/u', sets: '3x12', video: 'https://www.youtube.com/embed/sAq_ocpRh_I' }
    ],
    espalda: [
      { name: 'Remo Inclinado', weight: '6-8 kg c/u', sets: '3x12', video: 'https://www.youtube.com/embed/roCP6wCXPqo' },
      { name: 'Press de Hombros de Pie', weight: '6-8 kg c/u', sets: '3x10', video: 'https://www.youtube.com/embed/qEwKCR5JCog' },
      { name: 'Elevaciones Laterales', weight: '2-4 kg c/u', sets: '3x15', video: 'https://www.youtube.com/embed/3VcKaXpzqRo' }
    ],
    piernas: [
      { name: 'Peso Muerto Rumano', weight: 'Barra 20 kg', sets: '3x12', video: 'https://www.youtube.com/embed/2SHsk9AzdjA' },
      { name: 'Sentadillas Goblet', weight: '8 kg (1 mancuerna)', sets: '3x15', video: 'https://www.youtube.com/embed/MeIiIdhvXT4' },
      { name: 'Zancadas', weight: '4-6 kg c/u', sets: '3x10 c/pierna', video: 'https://www.youtube.com/embed/QOVaHwm-Q6U' }
    ]
  };

  const weekRoutine = [
    { day: 0, name: 'Domingo', type: 'rest', title: 'Descanso', activities: ['Caminata ligera opcional', 'Recuperación activa'], muscleGroup: null, calories: 0 },
    { day: 1, name: 'Lunes', type: 'strength', title: 'Fuerza - Pecho y Brazos', activities: ['App Ejercicios en Casa (Pecho/Brazos) - 30-40 min', 'Ejercicios con mancuernas'], muscleGroup: 'pecho', calories: caloriesBurnedPerActivity.strength },
    { day: 2, name: 'Martes', type: 'cardio', title: 'Cardio', activities: ['Saltar la cuerda: 15-20 min', 'Mirador: 2.8 km subida + 2.8 km bajada'], muscleGroup: null, calories: caloriesBurnedPerActivity.cuerda + caloriesBurnedPerActivity.mirador },
    { day: 3, name: 'Miércoles', type: 'strength', title: 'Fuerza - Espalda y Hombros', activities: ['App Ejercicios en Casa (Espalda/Hombros) - 30-40 min', 'Ejercicios con mancuernas'], muscleGroup: 'espalda', calories: caloriesBurnedPerActivity.strength },
    { day: 4, name: 'Jueves', type: 'cardio', title: 'Cardio', activities: ['Saltar la cuerda: 15-20 min', 'Vueltas al estadio o caminata: 30-45 min'], muscleGroup: null, calories: caloriesBurnedPerActivity.cardio },
    { day: 5, name: 'Viernes', type: 'strength', title: 'Fuerza - Piernas', activities: ['App Ejercicios en Casa (Piernas) - 30-40 min', 'Ejercicios con mancuernas'], muscleGroup: 'piernas', calories: caloriesBurnedPerActivity.strength },
    { day: 6, name: 'Sábado', type: 'cardio', title: 'Cardio', activities: ['Saltar la cuerda: 15-20 min', 'Mirador o estadio: 30-45 min'], muscleGroup: null, calories: caloriesBurnedPerActivity.cardio }
  ];

  useEffect(() => {
    let weekCompletions = 0, totalCalories = 0, totalWorkouts = 0;
    for (let i = 0; i < 7; i++) {
      if (completedDays[i]) {
        weekCompletions++;
        totalCalories += weekRoutine[i].calories;
        totalWorkouts++;
      }
    }
    setStats({ weekCompletions, totalCalories, totalWorkouts });
  }, [completedDays]);

  const requestNotificationPermission = () => {
    if (Notification.permission === 'default') Notification.requestPermission();
  };

  const toggleDayComplete = (day) => {
    setCompletedDays(prev => ({ ...prev, [day]: !prev[day] }));
  };

  const styles = {
    container: {
      minHeight: '100vh',
      background: 'linear-gradient(to bottom right, #111827, #1e3a8a, #111827)',
      color: 'white',
      padding: '1rem'
    },
    maxWidth: {
      maxWidth: '90rem',
      margin: '0 auto'
    },
    header: {
      textAlign: 'center',
      marginBottom: '2rem',
      paddingTop: '1.5rem'
    },
    title: {
      fontSize: '2rem',
      fontWeight: 'bold',
      marginBottom: '0.5rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '0.75rem'
    },
    subtitle: {
      color: '#d1d5db',
      fontSize: '1rem'
    },
    statsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
      gap: '1rem',
      marginBottom: '1.5rem'
    },
    statCard: {
      background: 'linear-gradient(to bottom right, #1e40af, #1e3a8a)',
      borderRadius: '0.5rem',
      padding: '1rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between'
    },
    statValue: {
      fontSize: '1.875rem',
      fontWeight: 'bold'
    },
    reminderBox: {
      background: '#1f2937',
      borderRadius: '0.5rem',
      padding: '1rem',
      marginBottom: '1.5rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      flexWrap: 'wrap',
      gap: '1rem'
    },
    input: {
      background: '#374151',
      border: 'none',
      borderRadius: '0.375rem',
      padding: '0.5rem 0.75rem',
      color: 'white',
      fontSize: '1rem'
    },
    button: {
      background: '#eab308',
      color: 'black',
      border: 'none',
      borderRadius: '0.375rem',
      padding: '0.5rem 1rem',
      fontWeight: '600',
      cursor: 'pointer'
    },
    weekGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
      gap: '1rem',
      marginBottom: '2rem'
    },
    dayCard: {
      borderRadius: '0.5rem',
      padding: '1rem',
      cursor: 'pointer',
      border: '2px solid transparent',
      transition: 'transform 0.2s'
    },
    dayCardHover: {
      transform: 'scale(1.05)'
    },
    mainContent: {
      background: '#1f2937',
      borderRadius: '0.5rem',
      padding: '1.5rem',
      marginBottom: '1.5rem'
    },
    contentTitle: {
      fontSize: '1.5rem',
      fontWeight: 'bold',
      marginBottom: '1rem',
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem'
    },
    exerciseGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
      gap: '1rem'
    },
    exerciseCard: {
      background: '#374151',
      borderRadius: '0.5rem',
      padding: '1rem'
    },
    videoButton: {
      width: '100%',
      background: '#ef4444',
      color: 'white',
      border: 'none',
      borderRadius: '0.375rem',
      padding: '0.5rem',
      fontWeight: '600',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '0.5rem',
      marginTop: '1rem'
    },
    modal: {
      position: 'fixed',
      inset: 0,
      background: 'rgba(0, 0, 0, 0.9)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1rem',
      zIndex: 50
    },
    modalContent: {
      background: '#1f2937',
      borderRadius: '0.5rem',
      padding: '1.5rem',
      maxWidth: '56rem',
      width: '100%'
    },
    closeButton: {
      background: 'none',
      border: 'none',
      color: 'white',
      fontSize: '1.875rem',
      cursor: 'pointer'
    },
    reminderAlert: {
      position: 'fixed',
      top: '1rem',
      right: '1rem',
      background: '#eab308',
      color: 'black',
      borderRadius: '0.5rem',
      padding: '1rem',
      display: 'flex',
      alignItems: 'center',
      gap: '0.75rem',
      zIndex: 50,
      animation: 'bounce 1s infinite'
    },
    footer: {
      background: 'rgba(217, 119, 6, 0.3)',
      border: '2px solid #eab308',
      borderRadius: '0.5rem',
      padding: '1.5rem'
    }
  };

  return (
    <div style={styles.container}>
      <style>{`
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        body {
          margin: 0;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
        }
      `}</style>
      <div style={styles.maxWidth}>
        <div style={styles.header}>
          <h1 style={styles.title}>
            <Dumbbell size={40} />
            Mi Rutina Semanal
          </h1>
          <p style={styles.subtitle}>Peso: 76 kg | Objetivo: Definición</p>
        </div>

        <div style={styles.statsGrid}>
          <div style={styles.statCard}>
            <div>
              <p style={{color: '#d1d5db', fontSize: '0.875rem'}}>Entrenamientos</p>
              <p style={styles.statValue}>{stats.weekCompletions}/6</p>
            </div>
            <CheckCircle size={40} opacity={0.5} />
          </div>

          <div style={{...styles.statCard, background: 'linear-gradient(to bottom right, #b45309, #92400e)'}}>
            <div>
              <p style={{color: '#d1d5db', fontSize: '0.875rem'}}>Calorías</p>
              <p style={styles.statValue}>{stats.totalCalories}</p>
            </div>
            <Flame size={40} opacity={0.5} />
          </div>

          <div style={{...styles.statCard, background: 'linear-gradient(to bottom right, #15803d, #166534)'}}>
            <div>
              <p style={{color: '#d1d5db', fontSize: '0.875rem'}}>Promedio/Día</p>
              <p style={styles.statValue}>{stats.weekCompletions > 0 ? Math.round(stats.totalCalories / stats.weekCompletions) : 0}</p>
            </div>
            <TrendingUp size={40} opacity={0.5} />
          </div>

          <div style={{...styles.statCard, background: 'linear-gradient(to bottom right, #6b21a8, #581c87)'}}>
            <div>
              <p style={{color: '#d1d5db', fontSize: '0.875rem'}}>Entrenamientos</p>
              <p style={styles.statValue}>{stats.totalWorkouts}</p>
            </div>
            <Award size={40} opacity={0.5} />
          </div>
        </div>

        <div style={styles.reminderBox}>
          <div style={{display: 'flex', alignItems: 'center', gap: '0.75rem'}}>
            <Bell size={24} color="#facc15" />
            <div>
              <p style={{fontWeight: '600'}}>Recordatorio Diario</p>
              <p style={{fontSize: '0.875rem', color: '#9ca3af'}}>Configura tu hora de entrenamiento</p>
            </div>
          </div>
          <div style={{display: 'flex', alignItems: 'center', gap: '0.75rem'}}>
            <Clock size={20} />
            <input type="time" value={reminderTime} onChange={(e) => setReminderTime(e.target.value)} style={styles.input} />
            <button onClick={requestNotificationPermission} style={styles.button}>Activar</button>
          </div>
        </div>

        <div style={styles.weekGrid}>
          {weekRoutine.map((routine) => (
            <div
              key={routine.day}
              style={{
                ...styles.dayCard,
                background: routine.type === 'strength' ? 'rgba(30, 64, 175, 0.2)' : routine.type === 'cardio' ? 'rgba(220, 38, 38, 0.2)' : 'rgba(34, 197, 94, 0.2)',
                border: currentDay === routine.day ? '2px solid #facc15' : '2px solid transparent',
                boxShadow: currentDay === routine.day ? '0 0 20px rgba(250, 204, 21, 0.5)' : 'none'
              }}
              onClick={() => setCurrentDay(routine.day)}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
            >
              <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '0.75rem'}}>
                <div>
                  <h3 style={{fontWeight: 'bold', fontSize: '1.125rem', margin: 0}}>{routine.name}</h3>
                  <p style={{fontSize: '0.875rem', opacity: 0.8, margin: '0.25rem 0 0 0'}}>{routine.title}</p>
                </div>
                <button
                  onClick={(e) => { e.stopPropagation(); toggleDayComplete(routine.day); }}
                  style={{background: 'none', border: 'none', cursor: 'pointer', color: completedDays[routine.day] ? '#4ade80' : '#9ca3af'}}
                >
                  <CheckCircle size={24} />
                </button>
              </div>
              {routine.calories > 0 && (
                <div style={{background: 'rgba(0, 0, 0, 0.4)', borderRadius: '0.375rem', padding: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.875rem', fontWeight: '600'}}>
                  <Flame size={16} color="#fb923c" />
                  {routine.calories} cal
                </div>
              )}
            </div>
          ))}
        </div>

        <div style={styles.mainContent}>
          <h2 style={styles.contentTitle}>
            <Calendar size={28} />
            {weekRoutine[currentDay].name} - {weekRoutine[currentDay].title}
          </h2>

          {weekRoutine[currentDay].type === 'strength' && (
            <div>
              <div style={{background: 'rgba(30, 58, 138, 0.3)', borderRadius: '0.5rem', padding: '1rem', marginBottom: '1.5rem'}}>
                <h3 style={{fontSize: '1.125rem', fontWeight: 'bold', marginBottom: '0.5rem', color: '#93c5fd'}}>📱 Rutina en la App</h3>
                <p style={{color: '#d1d5db', margin: '0.25rem 0'}}>1. Abre "Ejercicios en Casa"</p>
                <p style={{color: '#d1d5db', margin: '0.25rem 0'}}>2. Selecciona: <span style={{fontWeight: 'bold', color: 'white'}}>{weekRoutine[currentDay].muscleGroup === 'pecho' ? 'Pecho y Brazos' : weekRoutine[currentDay].muscleGroup === 'espalda' ? 'Espalda y Hombros' : 'Piernas'}</span></p>
                <p style={{color: '#d1d5db', margin: '0.25rem 0'}}>3. Nivel: <span style={{fontWeight: 'bold', color: 'white'}}>Moderado</span></p>
                <div style={{marginTop: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(180, 83, 9, 0.5)', borderRadius: '0.375rem', padding: '0.75rem'}}>
                  <Flame size={20} color="#fb923c" />
                  <span style={{fontSize: '0.875rem'}}>Quemarás ~{weekRoutine[currentDay].calories} calorías</span>
                </div>
              </div>

              <h3 style={styles.contentTitle}>
                <Dumbbell size={24} />
                Ejercicios con Mancuernas
              </h3>
              <div style={styles.exerciseGrid}>
                {dumbbellExercises[weekRoutine[currentDay].muscleGroup].map((exercise, idx) => (
                  <div key={idx} style={styles.exerciseCard}>
                    <h4 style={{fontWeight: 'bold', fontSize: '1rem', marginBottom: '0.5rem'}}>{exercise.name}</h4>
                    <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', color: '#93c5fd', marginBottom: '0.25rem'}}>
                      <Dumbbell size={16} />
                      {exercise.weight}
                    </div>
                    <p style={{fontSize: '0.875rem', color: '#d1d5db'}}>Series: <span style={{fontWeight: '600', color: 'white'}}>{exercise.sets}</span></p>
                    <button onClick={() => setSelectedExercise(exercise)} style={styles.videoButton}>
                      <PlayCircle size={20} />
                      Ver Video
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {weekRoutine[currentDay].type === 'cardio' && (
            <div style={{background: '#374151', borderRadius: '0.5rem', padding: '1.5rem'}}>
              <Heart size={48} color="#f87171" style={{marginBottom: '1rem'}} />
              <h3 style={{fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem'}}>Sesión de Cardio</h3>
              <div style={{display: 'grid', gap: '1rem', marginBottom: '1rem'}}>
                <div style={{background: '#1f2937', borderRadius: '0.375rem', padding: '1rem'}}>
                  <p style={{fontSize: '1.125rem', fontWeight: '600', marginBottom: '0.25rem'}}>🔥 Parte 1: Saltar la Cuerda</p>
                  <p style={{color: '#d1d5db'}}>Duración: 15-20 minutos</p>
                </div>
                <div style={{background: '#1f2937', borderRadius: '0.375rem', padding: '1rem'}}>
                  <p style={{fontSize: '1.125rem', fontWeight: '600', marginBottom: '0.25rem'}}>🏃 Parte 2: {currentDay === 2 ? 'Mirador Bello Amanecer' : 'Mirador o Estadio'}</p>
                  <p style={{color: '#d1d5db'}}>{currentDay === 2 ? 'Distancia: 5.6 km' : 'Duración: 30-45 minutos'}</p>
                </div>
              </div>
              <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(180, 83, 9, 0.5)', borderRadius: '0.375rem', padding: '0.75rem'}}>
                <Flame size={20} color="#fb923c" />
                <span style={{fontSize: '0.875rem'}}>Quemarás ~{weekRoutine[currentDay].calories} calorías</span>
              </div>
            </div>
          )}

          {weekRoutine[currentDay].type === 'rest' && (
            <div style={{background: '#374151', borderRadius: '0.5rem', padding: '1.5rem', textAlign: 'center'}}>
              <p style={{fontSize: '3rem', margin: 0}}>😴</p>
              <h3 style={{fontSize: '1.5rem', fontWeight: 'bold', margin: '1rem 0 0.5rem 0'}}>Día de Descanso</h3>
              <p style={{color: '#d1d5db', margin: 0}}>Tu cuerpo necesita recuperarse</p>
            </div>
          )}
        </div>

        {selectedExercise && (
          <div style={styles.modal}>
            <div style={styles.modalContent}>
              <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1rem'}}>
                <div>
                  <h3 style={{fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '0.5rem'}}>{selectedExercise.name}</h3>
                </div>
                <button onClick={() => setSelectedExercise(null)} style={styles.closeButton}>✕</button>
              </div>
              <div style={{aspectRatio: '16/9', width: '100%', background: 'black', borderRadius: '0.375rem', overflow: 'hidden'}}>
                <iframe width="100%" height="100%" src={selectedExercise.video} frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
              </div>
            </div>
          </div>
        )}

        {showReminder && (
          <div style={styles.reminderAlert}>
            <Bell size={24} />
            <div>
              <p style={{fontWeight: 'bold', margin: 0}}>¡Hora de entrenar!</p>
              <p style={{fontSize: '0.875rem', margin: '0.25rem 0 0 0'}}>{weekRoutine[currentDay].title}</p>
            </div>
          </div>
        )}

        <div style={styles.footer}>
          <h3 style={{fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem', color: '#facc15'}}>⚡ Recordatorios Importantes</h3>
          <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.75rem'}}>
            <p style={{margin: 0}}>❌ Eliminar refrescos y reducir Doritos</p>
            <p style={{margin: 0}}>💧 Beber 2-3 litros de agua al día</p>
            <p style={{margin: 0}}>🍗 Mantener proteína alta</p>
            <p style={{margin: 0}}>😴 Dormir 7-8 horas</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExerciseApp;
