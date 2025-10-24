import React, { useState, useEffect } from 'react';
import { Calendar, Dumbbell, Heart, Clock, CheckCircle, PlayCircle, Bell, TrendingUp, Flame, Award, MessageCircle, AlertCircle, Brain } from 'lucide-react';

const ExerciseApp = () => {
  const [currentDay, setCurrentDay] = useState(new Date().getDay());
  const [completedDays, setCompletedDays] = useState(() => {
    const saved = localStorage.getItem('completedDays');
    return saved ? JSON.parse(saved) : {};
  });
  const [reminderTime, setReminderTime] = useState(() => {
    return localStorage.getItem('reminderTime') || '06:30';
  });
  const [showReminder, setShowReminder] = useState(false);
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [stats, setStats] = useState({
    weekCompletions: 0,
    totalCalories: 0,
    totalWorkouts: 0
  });
  const [activeSection, setActiveSection] = useState('routine'); // 'routine' or 'psychology'
  
  // Psychology states
  const [todayChoice, setTodayChoice] = useState(() => {
    const saved = localStorage.getItem('todayChoice');
    return saved || null;
  });
  const [temptations, setTemptations] = useState(() => {
    const saved = localStorage.getItem('temptations');
    return saved ? JSON.parse(saved) : [];
  });
  const [streak, setStreak] = useState(() => {
    const saved = localStorage.getItem('streak');
    return saved ? parseInt(saved) : 0;
  });
  const [negotiationsWon, setNegotiationsWon] = useState(() => {
    const saved = localStorage.getItem('negotiationsWon');
    return saved ? parseInt(saved) : 0;
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
      { name: 'Sentadillas Goblet', weight: '8 kg', sets: '3x15', video: 'https://www.youtube.com/embed/MeIiIdhvXT4' },
      { name: 'Zancadas', weight: '4-6 kg c/u', sets: '3x10 c/pierna', video: 'https://www.youtube.com/embed/QOVaHwm-Q6U' }
    ]
  };

  const weekRoutine = [
    { day: 0, name: 'Domingo', type: 'rest', title: 'Descanso', activities: ['Caminata ligera opcional'], color: 'bg-green-500', muscleGroup: null, calories: 0 },
    { day: 1, name: 'Lunes', type: 'strength', title: 'Fuerza - Pecho y Brazos', activities: ['App Ejercicios en Casa - 30-40 min', 'Ejercicios con mancuernas'], muscleGroup: 'pecho', color: 'bg-blue-500', calories: 250 },
    { day: 2, name: 'Martes', type: 'cardio', title: 'Cardio', activities: ['Saltar cuerda: 15-20 min', 'Mirador: 5.6 km'], color: 'bg-red-500', muscleGroup: null, calories: 670 },
    { day: 3, name: 'Miércoles', type: 'strength', title: 'Fuerza - Espalda y Hombros', activities: ['App Ejercicios en Casa - 30-40 min', 'Ejercicios con mancuernas'], muscleGroup: 'espalda', color: 'bg-blue-500', calories: 250 },
    { day: 4, name: 'Jueves', type: 'cardio', title: 'Cardio', activities: ['Saltar cuerda: 15-20 min', 'Estadio: 30-45 min'], color: 'bg-red-500', muscleGroup: null, calories: 500 },
    { day: 5, name: 'Viernes', type: 'strength', title: 'Fuerza - Piernas', activities: ['App Ejercicios en Casa - 30-40 min', 'Ejercicios con mancuernas'], muscleGroup: 'piernas', color: 'bg-blue-500', calories: 250 },
    { day: 6, name: 'Sábado', type: 'cardio', title: 'Cardio', activities: ['Saltar cuerda: 15-20 min', 'Mirador o estadio: 30-45 min'], color: 'bg-red-500', muscleGroup: null, calories: 500 }
  ];

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem('completedDays', JSON.stringify(completedDays));
  }, [completedDays]);

  useEffect(() => {
    localStorage.setItem('reminderTime', reminderTime);
  }, [reminderTime]);

  useEffect(() => {
    localStorage.setItem('todayChoice', todayChoice || '');
  }, [todayChoice]);

  useEffect(() => {
    localStorage.setItem('temptations', JSON.stringify(temptations));
  }, [temptations]);

  useEffect(() => {
    localStorage.setItem('streak', streak.toString());
  }, [streak]);

  useEffect(() => {
    localStorage.setItem('negotiationsWon', negotiationsWon.toString());
  }, [negotiationsWon]);

  useEffect(() => {
    const checkReminder = () => {
      const now = new Date();
      const [hours, minutes] = reminderTime.split(':');
      const reminderDate = new Date();
      reminderDate.setHours(parseInt(hours), parseInt(minutes), 0);
      
      if (Math.abs(now - reminderDate) < 60000 && !completedDays[currentDay]) {
        setShowReminder(true);
        if ('Notification' in window && Notification.permission === 'granted') {
          new Notification('¡Hora de entrenar!', {
            body: `${weekRoutine[currentDay].title}`,
            icon: '💪',
            badge: '💪'
          });
        }
      }
    };
    const interval = setInterval(checkReminder, 60000);
    return () => clearInterval(interval);
  }, [reminderTime, currentDay, completedDays]);

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
    if ('Notification' in window) {
      if (Notification.permission === 'default') {
        Notification.requestPermission().then(permission => {
          if (permission === 'granted') {
            alert('✅ Notificaciones activadas. Te avisaremos a las ' + reminderTime);
          }
        });
      } else if (Notification.permission === 'granted') {
        alert('✅ Las notificaciones ya están activadas');
      } else {
        alert('❌ Las notificaciones están bloqueadas. Actívalas en la configuración de tu navegador.');
      }
    } else {
      alert('❌ Tu navegador no soporta notificaciones');
    }
  };

  const toggleDayComplete = (day) => {
    setCompletedDays(prev => ({ ...prev, [day]: !prev[day] }));
  };

  const recordDecision = (choice) => {
    setTodayChoice(choice);
    if (choice === 'athlete') {
      setStreak(streak + 1);
      setCompletedDays({...completedDays, [currentDay]: true});
    }
  };

  const logNegotiationWon = () => {
    setNegotiationsWon(negotiationsWon + 1);
    const newTemp = { text: '✅ GANÉ una negociación', date: new Date().toLocaleDateString(), resisted: true };
    setTemptations([...temptations, newTemp]);
  };

  const styles = {
    container: { minHeight: '100vh', background: 'linear-gradient(to bottom right, #111827, #1e3a8a, #111827)', color: 'white', padding: '1rem' },
    maxWidth: { maxWidth: '90rem', margin: '0 auto' },
    header: { textAlign: 'center', marginBottom: '2rem', paddingTop: '1.5rem' },
    title: { fontSize: '2rem', fontWeight: 'bold', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem' },
    subtitle: { color: '#d1d5db', fontSize: '1rem' },
    tabButton: { padding: '1rem 2rem', border: 'none', background: 'none', color: '#d1d5db', cursor: 'pointer', fontSize: '1rem', borderBottom: '3px solid transparent', fontWeight: '600' },
    tabButtonActive: { color: '#facc15', borderBottomColor: '#facc15' },
    statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1.5rem' },
    statCard: { background: 'linear-gradient(to bottom right, #1e40af, #1e3a8a)', borderRadius: '0.5rem', padding: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' },
    statValue: { fontSize: '1.875rem', fontWeight: 'bold' },
    reminderBox: { background: '#1f2937', borderRadius: '0.5rem', padding: '1rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' },
    input: { background: '#374151', border: 'none', borderRadius: '0.375rem', padding: '0.5rem 0.75rem', color: 'white', fontSize: '1rem' },
    button: { background: '#eab308', color: 'black', border: 'none', borderRadius: '0.375rem', padding: '0.5rem 1rem', fontWeight: '600', cursor: 'pointer' },
    weekGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem', marginBottom: '2rem' },
    dayCard: { borderRadius: '0.5rem', padding: '1rem', cursor: 'pointer', border: '2px solid transparent', transition: 'transform 0.2s' },
    mainContent: { background: '#1f2937', borderRadius: '0.5rem', padding: '1.5rem', marginBottom: '1.5rem' },
    contentTitle: { fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' },
    exerciseGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' },
    exerciseCard: { background: '#374151', borderRadius: '0.5rem', padding: '1rem' },
    videoButton: { width: '100%', background: '#ef4444', color: 'white', border: 'none', borderRadius: '0.375rem', padding: '0.5rem', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginTop: '1rem' },
    modal: { position: 'fixed', inset: 0, background: 'rgba(0, 0, 0, 0.9)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem', zIndex: 50 },
    modalContent: { background: '#1f2937', borderRadius: '0.5rem', padding: '1.5rem', maxWidth: '56rem', width: '100%' },
    closeButton: { background: 'none', border: 'none', color: 'white', fontSize: '1.875rem', cursor: 'pointer' },
    reminderAlert: { position: 'fixed', top: '1rem', right: '1rem', background: '#eab308', color: 'black', borderRadius: '0.5rem', padding: '1rem', display: 'flex', alignItems: 'center', gap: '0.75rem', zIndex: 50, animation: 'bounce 1s infinite' },
    contentBox: { background: '#1f2937', borderRadius: '0.5rem', padding: '1.5rem', marginBottom: '1rem' }
  };

  return (
    <div style={styles.container}>
      <style>{`
        @keyframes bounce { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
        body { margin: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif; }
        button { transition: all 0.2s; }
        button:hover { transform: translateY(-2px); }
      `}</style>

      <div style={styles.maxWidth}>
        <div style={styles.header}>
          <h1 style={styles.title}>
            <Dumbbell size={40} />
            Mi Rutina Semanal
          </h1>
          <p style={styles.subtitle}>Peso: 76 kg | Objetivo: Definición</p>
        </div>

        {/* Main Navigation Tabs */}
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', borderBottom: '2px solid #374151', justifyContent: 'center' }}>
          <button 
            style={{...styles.tabButton, ...(activeSection === 'routine' && styles.tabButtonActive)}} 
            onClick={() => setActiveSection('routine')}
          >
            📅 Mi Rutina
          </button>
          <button 
            style={{...styles.tabButton, ...(activeSection === 'psychology' && styles.tabButtonActive)}} 
            onClick={() => setActiveSection('psychology')}
          >
            🧠 La Batalla Interna
          </button>
        </div>

        {/* SECTION 1: ROUTINE (Original) */}
        {activeSection === 'routine' && (
          <>
            <div style={styles.statsGrid}>
              <div style={styles.statCard}>
                <div>
                  <p style={{color: '#d1d5db', fontSize: '0.875rem'}}>Entrenamientos</p>
                  <p style={styles.statValue}>{stats.weekCompletions}/6</p>
                </div>
                <CheckCircle size={40} style={{opacity: 0.5}} />
              </div>

              <div style={{...styles.statCard, background: 'linear-gradient(to bottom right, #b45309, #92400e)'}}>
                <div>
                  <p style={{color: '#d1d5db', fontSize: '0.875rem'}}>Calorías</p>
                  <p style={styles.statValue}>{stats.totalCalories}</p>
                </div>
                <Flame size={40} style={{opacity: 0.5}} />
              </div>

              <div style={{...styles.statCard, background: 'linear-gradient(to bottom right, #15803d, #166534)'}}>
                <div>
                  <p style={{color: '#d1d5db', fontSize: '0.875rem'}}>Promedio</p>
                  <p style={styles.statValue}>{stats.weekCompletions > 0 ? Math.round(stats.totalCalories / stats.weekCompletions) : 0}</p>
                </div>
                <TrendingUp size={40} style={{opacity: 0.5}} />
              </div>

              <div style={{...styles.statCard, background: 'linear-gradient(to bottom right, #6b21a8, #581c87)'}}>
                <div>
                  <p style={{color: '#d1d5db', fontSize: '0.875rem'}}>Total</p>
                  <p style={styles.statValue}>{stats.totalWorkouts}</p>
                </div>
                <Award size={40} style={{opacity: 0.5}} />
              </div>
            </div>

            <div style={styles.reminderBox}>
              <div style={{display: 'flex', alignItems: 'center', gap: '0.75rem'}}>
                <Bell size={24} style={{color: '#facc15'}} />
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
                      <Flame size={16} style={{color: '#fb923c'}} />
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
                      <Flame size={20} style={{color: '#fb923c'}} />
                      <span style={{fontSize: '0.875rem'}}>Quemarás ~{weekRoutine[currentDay].calories} calorías</span>
                    </div>
                  </div>

                  <h3 style={{...styles.contentTitle, fontSize: '1.25rem', color: '#93c5fd'}}>
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
                  <Heart size={48} style={{color: '#f87171', marginBottom: '1rem'}} />
                  <h3 style={{fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem'}}>Sesión de Cardio</h3>
                  <div style={{display: 'grid', gap: '1rem', marginBottom: '1rem'}}>
                    <div style={{background: '#1f2937', borderRadius: '0.375rem', padding: '1rem'}}>
                      <p style={{fontSize: '1.125rem', fontWeight: '600', marginBottom: '0.25rem'}}>🔥 Parte 1: Saltar la Cuerda</p>
                      <p style={{color: '#d1d5db'}}>Duración: 15-20 minutos</p>
                    </div>
                    <div style={{background: '#1f2937', borderRadius: '0.375rem', padding: '1rem'}}>
                      <p style={{fontSize: '1.125rem', fontWeight: '600', marginBottom: '0.25rem'}}>🏃 Parte 2: {currentDay === 2 ? 'Mirador Bello Amanecer' : 'Mirador o Estadio'}</p>
                      <p style={{color: '#d1d5db'}}>{currentDay === 2 ? 'Distancia: 5.6 km (ida y vuelta)' : 'Duración: 30-45 minutos'}</p>
                      {currentDay === 2 && <p style={{fontSize: '0.875rem', color: '#9ca3af', marginTop: '0.5rem'}}>Salida: 6:30 AM</p>}
                    </div>
                  </div>
                  <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(180, 83, 9, 0.5)', borderRadius: '0.375rem', padding: '0.75rem'}}>
                    <Flame size={20} style={{color: '#fb923c'}} />
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

            <div style={{background: 'rgba(217, 119, 6, 0.3)', border: '2px solid #eab308', borderRadius: '0.5rem', padding: '1.5rem'}}>
              <h3 style={{fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem', color: '#fbbf24'}}>⚡ Recordatorios</h3>
              <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.75rem'}}>
                <p style={{margin: 0}}>❌ Eliminar refrescos</p>
                <p style={{margin: 0}}>💧 2-3 litros de agua</p>
                <p style={{margin: 0}}>🍗 Proteína alta</p>
                <p style={{margin: 0}}>😴 7-8 horas de sueño</p>
              </div>
            </div>
          </>
        )}

        {/* SECTION 2: PSYCHOLOGY */}
        {activeSection === 'psychology' && (
          <>
            <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem', marginBottom: '2rem'}}>
              <div style={{background: '#166534', borderRadius: '0.5rem', padding: '1rem', textAlign: 'center'}}>
                <p style={{fontSize: '0.875rem', color: '#d1d5db', margin: 0}}>Racha</p>
                <p style={{fontSize: '2rem', fontWeight: 'bold', margin: '0.5rem 0 0 0'}}>{streak} 🔥</p>
              </div>
              <div style={{background: '#1e40af', borderRadius: '0.5rem', padding: '1rem', textAlign: 'center'}}>
                <p style={{fontSize: '0.875rem', color: '#d1d5db', margin: 0}}>Victorias</p>
                <p style={{fontSize: '2rem', fontWeight: 'bold', margin: '0.5rem 0 0 0'}}>{negotiationsWon} 💪</p>
              </div>
              <div style={{background: '#7c2d12', borderRadius: '0.5rem', padding: '1rem', textAlign: 'center'}}>
                <p style={{fontSize: '0.875rem', color: '#d1d5db', margin: 0}}>Hoy Soy</p>
                <p style={{fontSize: '1.5rem', fontWeight: 'bold', margin: '0.5rem 0 0 0'}}>
                  {todayChoice === 'athlete' ? '✅ Atleta' : todayChoice === 'sedentary' ? '❌ Sedentario' : '❓'}
                </p>
              </div>
            </div>

            <div style={styles.contentBox}>
              <h3 style={{fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
                <Brain size={28} />
                ¿Quién Eres Hoy?
              </h3>
              <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem'}}>
                <div style={{textAlign: 'center', padding: '1.5rem', background: 'linear-gradient(to bottom, #166534, #15803d)', borderRadius: '0.5rem', border: '3px solid #4ade80'}}>
                  <p style={{fontSize: '2rem', margin: 0}}>🏃‍♂️</p>
                  <h4 style={{fontWeight: 'bold', margin: '0.5rem 0'}}>HACE 3 AÑOS</h4>
                  <p style={{color: '#d1d5db', fontSize: '0.875rem', margin: 0}}>Atlético • 55kg</p>
                </div>
                <div style={{textAlign: 'center', padding: '1.5rem', background: 'linear-gradient(to bottom, #1f2937, #2d2517)', borderRadius: '0.5rem', border: '3px solid #facc15'}}>
                  <p style={{fontSize: '3rem', margin: 0}}>❓</p>
                  <h4 style={{fontWeight: 'bold', margin: '0.5rem 0', color: '#facc15'}}>HOY</h4>
                  <p style={{color: '#fbbf24', fontSize: '0.875rem', margin: 0, fontStyle: 'italic'}}>¿Qué decides?</p>
                </div>
                <div style={{textAlign: 'center', padding: '1.5rem', background: 'linear-gradient(to bottom, #1e3a8a, #1e40af)', borderRadius: '0.5rem', border: '3px solid #3b82f6'}}>
                  <p style={{fontSize: '2rem', margin: 0}}>🎯</p>
                  <h4 style={{fontWeight: 'bold', margin: '0.5rem 0'}}>EN 3 MESES</h4>
                  <p style={{color: '#d1d5db', fontSize: '0.875rem', margin: 0}}>Definido • Fuerte</p>
                </div>
              </div>

              <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem'}}>
                <button
                  style={{padding: '1rem', borderRadius: '0.5rem', border: 'none', fontWeight: 'bold', cursor: 'pointer', background: '#4ade80', color: 'black'}}
                  onClick={() => recordDecision('athlete')}
                >
                  ✅ HOY SOY ATLETA
                </button>
                <button
                  style={{padding: '1rem', borderRadius: '0.5rem', border: 'none', fontWeight: 'bold', cursor: 'pointer', background: '#ef4444', color: 'white'}}
                  onClick={() => recordDecision('sedentary')}
                >
                  ❌ HOY SOY SEDENTARIO
                </button>
              </div>
            </div>

            <div style={styles.contentBox}>
              <h3 style={{fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem'}}>📮 Tu Versión Atlética Te Habla:</h3>
              <div style={{background: '#1e3a8a', borderLeft: '4px solid #3b82f6', padding: '1.5rem', borderRadius: '0.375rem', fontStyle: 'italic', lineHeight: '1.8'}}>
                <p style={{margin: 0, marginBottom: '1rem'}}>
                  Hola. Soy la versión de ti que solía levantarse a las 6:30 AM sin dudar.
                </p>
                <p style={{margin: 0, marginBottom: '1rem'}}>
                  Sé que cuesta. Sé que es más fácil quedarse acostado. Pero ese poder sigue adentro. No se fue.
                </p>
                <p style={{margin: 0, marginBottom: '1rem'}}>
                  Hace 3 años pesabas 55kg y TÚ ERAS YO. Ese poder sigue adentro.
                </p>
                <p style={{margin: 0, color: '#93c5fd', fontWeight: 'bold'}}>
                  Solo te pido que hagas UNA cosa hoy: la más difícil. ¿Recuerdas cómo se sentía ganar?
                </p>
              </div>
            </div>

            <div style={styles.contentBox}>
              <h3 style={{fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem'}}>💸 El Costo Real</h3>
              <div style={{background: '#7c2d12', borderLeft: '4px solid #fb923c', padding: '1rem', borderRadius: '0.375rem', marginBottom: '0.5rem'}}>
                <h4 style={{margin: '0 0 0.5rem 0'}}>🚫 Doritos (1 bolsa)</h4>
                <p style={{fontSize: '0.875rem', color: '#d1d5db', margin: 0}}>= 30 min de ejercicio = 1 día de progreso perdido</p>
              </div>
              <div style={{background: '#7c2d12', borderLeft: '4px solid #fb923c', padding: '1rem', borderRadius: '0.375rem', marginBottom: '0.5rem'}}>
                <h4 style={{margin: '0 0 0.5rem 0'}}>🚫 Refresco (1 litro)</h4>
                <p style={{fontSize: '0.875rem', color: '#d1d5db', margin: 0}}>= 25 min de ejercicio = Medio entrenamiento</p>
              </div>
              <div style={{background: '#7c2d12', borderLeft: '4px solid #fb923c', padding: '1rem', borderRadius: '0.375rem'}}>
                <h4 style={{margin: '0 0 0.5rem 0'}}>🚫 Redes (2 horas)</h4>
                <p style={{fontSize: '0.875rem', color: '#d1d5db', margin: 0}}>= 2 entrenamientos no hechos = 2 días perdidos</p>
              </div>
            </div>

            <div style={styles.contentBox}>
              <h3 style={{fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem'}}>🏆 Registro de Victorias</h3>
              <p style={{color: '#d1d5db', marginBottom: '1rem'}}>Cada vez que resistes una tentación = GRAN VICTORIA</p>
              <button 
                style={{...styles.button, background: '#4ade80', width: '100%', padding: '0.75rem'}} 
                onClick={logNegotiationWon}
              >
                ✅ HOY GANÉ UNA NEGOCIACIÓN CONMIGO MISMO
              </button>

              <div style={{marginTop: '1.5rem', display: 'grid', gap: '0.5rem'}}>
                {temptations.slice(-5).reverse().map((t, idx) => (
                  <div key={idx} style={{background: t.resisted ? '#166534' : '#1e40af', padding: '1rem', borderRadius: '0.375rem'}}>
                    <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                      <div>
                        <p style={{margin: 0, fontWeight: 'bold'}}>{t.text}</p>
                        <p style={{fontSize: '0.875rem', color: '#d1d5db', margin: '0.25rem 0 0 0'}}>{t.date}</p>
                      </div>
                      <span style={{fontSize: '1.5rem'}}>{t.resisted ? '✅' : '📝'}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div style={{background: '#2d2517', border: '4px solid #facc15', borderRadius: '0.5rem', padding: '1.5rem'}}>
              <h3 style={{fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem', color: '#fbbf24'}}>💭 RECUERDA:</h3>
              <p style={{color: '#d1d5db', lineHeight: '1.8', margin: 0}}>
                No se trata de ser perfecto. Se trata de ganar más batallas de las que pierdes.
                Cada día que eliges ser atleta, recuperas un pedazo de ti que creías perdido.
                Y ese tú del pasado... todavía está aquí. Solo esperando que lo despiertes.
              </p>
            </div>
          </>
        )}

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
            <button onClick={() => setShowReminder(false)} style={{background: 'none', border: 'none', fontSize: '1.25rem', fontWeight: 'bold', cursor: 'pointer'}}>✕</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExerciseApp;
