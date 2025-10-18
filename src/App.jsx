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
    { day: 0, name: 'Domingo', type: 'rest', title: 'Descanso', activities: ['Caminata ligera opcional', 'Recuperación activa'], color: 'bg-green-500', muscleGroup: null, calories: 0 },
    { day: 1, name: 'Lunes', type: 'strength', title: 'Fuerza - Pecho y Brazos', activities: ['App Ejercicios en Casa (Pecho/Brazos) - 30-40 min', 'Ejercicios con mancuernas'], muscleGroup: 'pecho', color: 'bg-blue-500', calories: caloriesBurnedPerActivity.strength },
    { day: 2, name: 'Martes', type: 'cardio', title: 'Cardio', activities: ['Saltar la cuerda: 15-20 min', 'Mirador: 2.8 km subida + 2.8 km bajada'], color: 'bg-red-500', muscleGroup: null, calories: caloriesBurnedPerActivity.cuerda + caloriesBurnedPerActivity.mirador },
    { day: 3, name: 'Miércoles', type: 'strength', title: 'Fuerza - Espalda y Hombros', activities: ['App Ejercicios en Casa (Espalda/Hombros) - 30-40 min', 'Ejercicios con mancuernas'], muscleGroup: 'espalda', color: 'bg-blue-500', calories: caloriesBurnedPerActivity.strength },
    { day: 4, name: 'Jueves', type: 'cardio', title: 'Cardio', activities: ['Saltar la cuerda: 15-20 min', 'Vueltas al estadio o caminata: 30-45 min'], color: 'bg-red-500', muscleGroup: null, calories: caloriesBurnedPerActivity.cardio },
    { day: 5, name: 'Viernes', type: 'strength', title: 'Fuerza - Piernas', activities: ['App Ejercicios en Casa (Piernas) - 30-40 min', 'Ejercicios con mancuernas'], muscleGroup: 'piernas', color: 'bg-blue-500', calories: caloriesBurnedPerActivity.strength },
    { day: 6, name: 'Sábado', type: 'cardio', title: 'Cardio', activities: ['Saltar la cuerda: 15-20 min', 'Mirador o estadio: 30-45 min'], color: 'bg-red-500', muscleGroup: null, calories: caloriesBurnedPerActivity.cardio }
  ];

  useEffect(() => {
    const checkReminder = () => {
      const now = new Date();
      const [hours, minutes] = reminderTime.split(':');
      const reminderDate = new Date();
      reminderDate.setHours(parseInt(hours), parseInt(minutes), 0);
      if (Math.abs(now - reminderDate) < 60000 && !completedDays[currentDay]) {
        setShowReminder(true);
        if (Notification.permission === 'granted') {
          new Notification('¡Hora de entrenar!', { body: `${weekRoutine[currentDay].title}`, icon: '💪' });
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
    if (Notification.permission === 'default') Notification.requestPermission();
  };

  const toggleDayComplete = (day) => {
    setCompletedDays(prev => ({ ...prev, [day]: !prev[day] }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 text-white p-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8 pt-6">
          <h1 className="text-4xl font-bold mb-2 flex items-center justify-center gap-3"><Dumbbell className="w-10 h-10" />Mi Rutina Semanal</h1>
          <p className="text-gray-300">Peso: 76 kg | Objetivo: Definición</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div><p className="text-gray-200 text-sm">Entrenamientos</p><p className="text-3xl font-bold">{stats.weekCompletions}/6</p></div>
              <CheckCircle className="w-10 h-10 opacity-50" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-orange-600 to-orange-800 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div><p className="text-gray-200 text-sm">Calorías (Semana)</p><p className="text-3xl font-bold">{stats.totalCalories}</p></div>
              <Flame className="w-10 h-10 opacity-50" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-600 to-green-800 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div><p className="text-gray-200 text-sm">Promedio/Día</p><p className="text-3xl font-bold">{stats.weekCompletions > 0 ? Math.round(stats.totalCalories / stats.weekCompletions) : 0}</p></div>
              <TrendingUp className="w-10 h-10 opacity-50" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-600 to-purple-800 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div><p className="text-gray-200 text-sm">Total Entrenamientos</p><p className="text-3xl font-bold">{stats.totalWorkouts}</p></div>
              <Award className="w-10 h-10 opacity-50" />
            </div>
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-4 mb-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Bell className="w-6 h-6 text-yellow-400" />
            <div><p className="font-semibold">Recordatorio Diario</p><p className="text-sm text-gray-400">Configura tu hora de entrenamiento</p></div>
          </div>
          <div className="flex items-center gap-3">
            <Clock className="w-5 h-5" />
            <input type="time" value={reminderTime} onChange={(e) => setReminderTime(e.target.value)} className="bg-gray-700 rounded px-3 py-2 text-white" />
            <button onClick={requestNotificationPermission} className="bg-yellow-500 hover:bg-yellow-600 px-4 py-2 rounded text-sm font-semibold">Activar</button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {weekRoutine.map((routine) => (
            <div key={routine.day} className={`${routine.color} bg-opacity-20 border-2 ${currentDay === routine.day ? 'border-yellow-400 shadow-lg shadow-yellow-400/50' : 'border-transparent'} rounded-lg p-4 hover:scale-105 transition-transform cursor-pointer`} onClick={() => setCurrentDay(routine.day)}>
              <div className="flex justify-between items-start mb-3">
                <div><h3 className="font-bold text-lg">{routine.name}</h3><p className="text-sm opacity-80">{routine.title}</p></div>
                <button onClick={(e) => { e.stopPropagation(); toggleDayComplete(routine.day); }} className={`${completedDays[routine.day] ? 'text-green-400' : 'text-gray-500'} hover:scale-110 transition-transform`}><CheckCircle className="w-6 h-6" /></button>
              </div>
              <div className="space-y-1 mb-3">{routine.activities.slice(0, 1).map((activity, idx) => (<p key={idx} className="text-sm opacity-90">• {activity}</p>))}</div>
              {routine.calories > 0 && (<div className="bg-black bg-opacity-40 rounded px-2 py-1 flex items-center gap-1"><Flame className="w-4 h-4 text-orange-400" /><span className="text-xs font-semibold">{routine.calories} cal</span></div>)}
            </div>
          ))}
        </div>

        <div className="bg-gray-800 rounded-lg p-6 mb-6">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2"><Calendar className="w-7 h-7" />{weekRoutine[currentDay].name} - {weekRoutine[currentDay].title}</h2>

          {weekRoutine[currentDay].type === 'strength' && (
            <div>
              <div className="bg-blue-900 bg-opacity-30 rounded-lg p-4 mb-6">
                <h3 className="text-lg font-bold mb-2 text-blue-300">📱 Rutina en la App</h3>
                <p className="text-gray-300">1. Abre "Ejercicios en Casa"</p>
                <p className="text-gray-300">2. Selecciona: <span className="font-bold text-white">{weekRoutine[currentDay].muscleGroup === 'pecho' ? 'Pecho y Brazos' : weekRoutine[currentDay].muscleGroup === 'espalda' ? 'Espalda y Hombros' : 'Piernas'}</span></p>
                <p className="text-gray-300">3. Nivel: <span className="font-bold text-white">Moderado</span></p>
                <div className="mt-3 flex items-center gap-2 bg-orange-900 bg-opacity-50 rounded px-3 py-2"><Flame className="w-5 h-5 text-orange-400" /><span className="text-sm">Quemarás ~{weekRoutine[currentDay].calories} calorías</span></div>
              </div>

              <h3 className="text-xl font-bold mb-4 text-blue-400 flex items-center gap-2"><Dumbbell className="w-6 h-6" />Ejercicios con Mancuernas</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {dumbbellExercises[weekRoutine[currentDay].muscleGroup].map((exercise, idx) => (
                  <div key={idx} className="bg-gray-700 rounded-lg p-4 hover:bg-gray-600 transition-colors">
                    <div className="mb-3">
                      <h4 className="font-bold text-lg mb-2">{exercise.name}</h4>
                      <div className="flex items-center gap-2 text-sm text-blue-300 mb-1"><Dumbbell className="w-4 h-4" /><span>{exercise.weight}</span></div>
                      <p className="text-sm text-gray-300">Series y Reps: <span className="font-semibold text-white">{exercise.sets}</span></p>
                    </div>
                    <button onClick={() => setSelectedExercise(exercise)} className="w-full bg-red-500 hover:bg-red-600 py-2 rounded flex items-center justify-center gap-2 font-semibold transition-colors"><PlayCircle className="w-5 h-5" />Ver Video Tutorial</button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {weekRoutine[currentDay].type === 'cardio' && (
            <div className="bg-gray-700 rounded-lg p-6"><Heart className="w-12 h-12 text-red-400 mb-4" /><h3 className="text-xl font-bold mb-4">Sesión de Cardio</h3>
              <div className="space-y-4 mb-4">
                <div className="bg-gray-800 rounded p-4"><p className="text-lg font-semibold mb-1">🔥 Parte 1: Saltar la Cuerda</p><p className="text-gray-300">Duración: 15-20 minutos</p></div>
                <div className="bg-gray-800 rounded p-4"><p className="text-lg font-semibold mb-1">🏃 Parte 2: {currentDay === 2 ? 'Mirador Bello Amanecer' : 'Mirador o Estadio'}</p><p className="text-gray-300">{currentDay === 2 ? 'Distancia: 5.6 km (2.8 km subida + 2.8 km bajada)' : 'Duración: 30-45 minutos'}</p></div>
              </div>
              <div className="flex items-center gap-2 bg-orange-900 bg-opacity-50 rounded px-3 py-2"><Flame className="w-5 h-5 text-orange-400" /><span className="text-sm">Quemarás ~{weekRoutine[currentDay].calories} calorías</span></div>
            </div>
          )}

          {weekRoutine[currentDay].type === 'rest' && (
            <div className="bg-gray-700 rounded-lg p-6 text-center"><p className="text-6xl mb-4">😴</p><h3 className="text-2xl font-bold mb-3">Día de Descanso</h3><p className="text-gray-300 mb-4">Tu cuerpo necesita recuperarse</p></div>
          )}
        </div>

        {selectedExercise && (
          <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center p-4 z-50">
            <div className="bg-gray-800 rounded-lg p-6 max-w-4xl w-full">
              <div className="flex justify-between items-start mb-4">
                <div><h3 className="text-2xl font-bold mb-2">{selectedExercise.name}</h3></div>
                <button onClick={() => setSelectedExercise(null)} className="text-3xl hover:text-red-500">✕</button>
              </div>
              <div className="aspect-video w-full bg-black rounded overflow-hidden">
                <iframe width="100%" height="100%" src={selectedExercise.video} frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
              </div>
            </div>
          </div>
        )}

        {showReminder && (
          <div className="fixed top-4 right-4 bg-yellow-500 text-black rounded-lg p-4 shadow-2xl animate-bounce z-50">
            <div className="flex items-center gap-3">
              <Bell className="w-6 h-6" />
              <div><p className="font-bold">¡Hora de entrenar!</p><p className="text-sm">{weekRoutine[currentDay].title}</p></div>
              <button onClick={() => setShowReminder(false)} className="ml-4 text-xl font-bold">✕</button>
            </div>
          </div>
        )}

        <div className="bg-yellow-900 bg-opacity-30 border-2 border-yellow-500 rounded-lg p-6">
          <h3 className="text-xl font-bold mb-4 text-yellow-400">⚡ Recordatorios Importantes</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <p>❌ Eliminar refrescos y reducir Doritos</p>
            <p>💧 Beber 2-3 litros de agua al día</p>
            <p>🍗 Mantener proteína alta</p>
            <p>😴 Dormir 7-8 horas</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExerciseApp;
