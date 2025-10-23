import React, { useState, useEffect } from 'react';
import { Calendar, Dumbbell, Heart, Clock, CheckCircle, PlayCircle, Bell, TrendingUp, Flame, Award, MessageCircle, AlertCircle, Zap } from 'lucide-react';

const PsychologicalFitnessApp = () => {
  const [currentDay, setCurrentDay] = useState(new Date().getDay());
  const [todayChoice, setTodayChoice] = useState(null); // 'athlete' or 'sedentary'
  const [completedDays, setCompletedDays] = useState({});
  const [reminderTime, setReminderTime] = useState('06:30');
  const [showReminder, setShowReminder] = useState(false);
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [activeTab, setActiveTab] = useState('battle'); // 'battle', 'truth', 'cost', 'emergency'
  const [userProfile, setUserProfile] = useState({
    name: 'Usuario',
    weight: 76,
    pastWeight: 55,
    objective: 'Recuperar forma',
    yearsAgo: 3
  });
  const [temptations, setTemptations] = useState([]);
  const [newTemptation, setNewTemptation] = useState('');
  const [lastDecision, setLastDecision] = useState(null);
  const [streak, setStreak] = useState(0);
  const [negotiationsWon, setNegotiationsWon] = useState(0);

  const weekRoutine = [
    { day: 0, name: 'Domingo', type: 'rest', title: 'Descanso', calories: 0 },
    { day: 1, name: 'Lunes', type: 'strength', title: 'Fuerza - Pecho y Brazos', calories: 250 },
    { day: 2, name: 'Martes', type: 'cardio', title: 'Cardio - Mirador', calories: 670 },
    { day: 3, name: 'Miércoles', type: 'strength', title: 'Fuerza - Espalda y Hombros', calories: 250 },
    { day: 4, name: 'Jueves', type: 'cardio', title: 'Cardio - Estadio', calories: 500 },
    { day: 5, name: 'Viernes', type: 'strength', title: 'Fuerza - Piernas', calories: 250 },
    { day: 6, name: 'Sábado', type: 'cardio', title: 'Cardio - Mirador', calories: 500 }
  ];

  const costOfTemptations = {
    'Doritos (1 bolsa)': { calories: 150, minExercise: 30, cost: 'Un día completo de progreso' },
    'Refresco (1 litro)': { calories: 140, minExercise: 25, cost: 'Medio entrenamiento' },
    'Redes (2 horas)': { calories: 0, minExercise: 120, cost: '2 entrenamientos no hechos' },
    'Netflix (3 horas)': { calories: 0, minExercise: 180, cost: '3 días de progreso' },
    'Comida chatarra': { calories: 500, minExercise: 120, cost: '2 días de dieta limpia' }
  };

  const addTemptation = () => {
    if (newTemptation.trim()) {
      setTemptations([...temptations, { text: newTemptation, date: new Date().toLocaleDateString(), resisted: false }]);
      setNewTemptation('');
    }
  };

  const recordDecision = (choice) => {
    setTodayChoice(choice);
    setLastDecision(choice);
    if (choice === 'athlete') {
      setStreak(streak + 1);
      setCompletedDays({...completedDays, [currentDay]: true});
    }
  };

  const logFailure = () => {
    setTemptations([...temptations, { text: 'Cedí a la tentación hoy', date: new Date().toLocaleDateString(), resisted: false, failed: true }]);
  };

  const logNegotiationWon = () => {
    setNegotiationsWon(negotiationsWon + 1);
    setTemptations([...temptations, { text: '✅ GANÉ una negociación conmigo mismo', date: new Date().toLocaleDateString(), resisted: true }]);
  };

  const styles = {
    container: { minHeight: '100vh', background: 'linear-gradient(to bottom right, #111827, #1e3a8a, #111827)', color: 'white', padding: '1rem' },
    maxWidth: { maxWidth: '90rem', margin: '0 auto' },
    header: { textAlign: 'center', marginBottom: '2rem', paddingTop: '1.5rem' },
    title: { fontSize: '1.75rem', fontWeight: 'bold', marginBottom: '0.5rem' },
    battle: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' },
    battleCard: { borderRadius: '0.5rem', padding: '1.5rem', textAlign: 'center', cursor: 'pointer', transition: 'transform 0.2s' },
    battleCardAthlete: { background: 'linear-gradient(to bottom, #166534, #15803d)', border: '3px solid #4ade80' },
    battleCardSedentary: { background: 'linear-gradient(to bottom, #7c2d12, #92400e)', border: '3px solid #fb923c' },
    battleImage: { fontSize: '3rem', marginBottom: '1rem' },
    decisionButton: { padding: '1rem', borderRadius: '0.5rem', border: 'none', fontWeight: 'bold', cursor: 'pointer', marginTop: '1rem', transition: 'all 0.2s' },
    athleteButton: { background: '#4ade80', color: 'black' },
    tabContainer: { display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', borderBottom: '2px solid #374151', overflowX: 'auto' },
    tabButton: { padding: '1rem', border: 'none', background: 'none', color: '#d1d5db', cursor: 'pointer', fontSize: '1rem', borderBottom: '3px solid transparent' },
    tabButtonActive: { color: '#facc15', borderBottomColor: '#facc15' },
    contentBox: { background: '#1f2937', borderRadius: '0.5rem', padding: '1.5rem', marginBottom: '1rem' },
    sectionTitle: { fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' },
    truthInput: { width: '100%', background: '#374151', border: '2px solid #475569', borderRadius: '0.375rem', padding: '1rem', color: 'white', marginBottom: '0.5rem', fontFamily: 'inherit' },
    button: { background: '#facc15', color: 'black', border: 'none', borderRadius: '0.375rem', padding: '0.75rem 1rem', fontWeight: '600', cursor: 'pointer' },
    dangerButton: { background: '#ef4444', color: 'white' },
    successButton: { background: '#4ade80', color: 'black' },
    cost: { background: '#7c2d12', borderLeft: '4px solid #fb923c', padding: '1rem', borderRadius: '0.375rem', marginBottom: '1rem' },
    letter: { background: '#1e3a8a', borderLeft: '4px solid #3b82f6', padding: '1.5rem', borderRadius: '0.375rem', marginBottom: '1rem', fontStyle: 'italic', lineHeight: '1.8' }
  };

  return (
    <div style={styles.container}>
      <style>{`
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.7; } }
        @keyframes bounce { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
        button { transition: all 0.2s; }
        button:hover { transform: translateY(-2px); }
      `}</style>

      <div style={styles.maxWidth}>
        {/* Header */}
        <div style={styles.header}>
          <h1 style={styles.title}>🧠 La Batalla Interna</h1>
          <p style={{ color: '#d1d5db', fontSize: '1rem' }}>Tú vs. Tú Mismo - {userProfile.name}</p>
          <p style={{ color: '#9ca3af', fontSize: '0.875rem', marginTop: '0.5rem' }}>Hace {userProfile.yearsAgo} años pesabas {userProfile.pastWeight}kg. Hoy: {userProfile.weight}kg.</p>
        </div>

        {/* Stats Bar */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
          <div style={{ background: '#166534', borderRadius: '0.5rem', padding: '1rem', textAlign: 'center' }}>
            <p style={{ fontSize: '0.875rem', color: '#d1d5db', margin: 0 }}>Racha Actual</p>
            <p style={{ fontSize: '2rem', fontWeight: 'bold', margin: '0.5rem 0 0 0' }}>{streak} 🔥</p>
          </div>
          <div style={{ background: '#1e40af', borderRadius: '0.5rem', padding: '1rem', textAlign: 'center' }}>
            <p style={{ fontSize: '0.875rem', color: '#d1d5db', margin: 0 }}>Negociaciones Ganadas</p>
            <p style={{ fontSize: '2rem', fontWeight: 'bold', margin: '0.5rem 0 0 0' }}>{negotiationsWon} 💪</p>
          </div>
          <div style={{ background: '#7c2d12', borderRadius: '0.5rem', padding: '1rem', textAlign: 'center' }}>
            <p style={{ fontSize: '0.875rem', color: '#d1d5db', margin: 0 }}>Última Decisión</p>
            <p style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: '0.5rem 0 0 0' }}>
              {lastDecision === 'athlete' ? '✅ Atleta' : lastDecision === 'sedentary' ? '❌ Sedentario' : '❓ Hoy'}
            </p>
          </div>
        </div>

        {/* Tabs */}
        <div style={styles.tabContainer}>
          <button 
            style={{...styles.tabButton, ...(activeTab === 'battle' && styles.tabButtonActive)}} 
            onClick={() => setActiveTab('battle')}
          >
            ⚔️ La Batalla
          </button>
          <button 
            style={{...styles.tabButton, ...(activeTab === 'truth' && styles.tabButtonActive)}} 
            onClick={() => setActiveTab('truth')}
          >
            🎯 Mi Verdad
          </button>
          <button 
            style={{...styles.tabButton, ...(activeTab === 'cost' && styles.tabButtonActive)}} 
            onClick={() => setActiveTab('cost')}
          >
            💸 El Costo
          </button>
          <button 
            style={{...styles.tabButton, ...(activeTab === 'emergency' && styles.tabButtonActive)}} 
            onClick={() => setActiveTab('emergency')}
          >
            🆘 Protocolo
          </button>
        </div>

        {/* TAB 1: LA BATALLA - The Internal Conflict */}
        {activeTab === 'battle' && (
          <div>
            <h2 style={{...styles.sectionTitle, marginTop: '2rem'}}>¿QUIÉN ERES HOY?</h2>
            
            <div style={styles.battle}>
              {/* PASADO */}
              <div style={{...styles.contentBox, textAlign: 'center', borderTop: '4px solid #4ade80'}}>
                <p style={{ fontSize: '2rem', margin: 0 }}>🏃‍♂️</p>
                <h3 style={{ fontWeight: 'bold', margin: '0.5rem 0' }}>HACE {userProfile.yearsAgo} AÑOS</h3>
                <p style={{ color: '#d1d5db', fontSize: '0.875rem', marginBottom: '1rem' }}>Atlético • Disciplinado • {userProfile.pastWeight}kg</p>
                <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#4ade80' }}>✓</p>
              </div>

              {/* HOY - DECISION POINT */}
              <div style={{...styles.contentBox, textAlign: 'center', borderTop: '4px solid #facc15', background: 'linear-gradient(to bottom, #1f2937, #2d2517)'}}>
                <p style={{ fontSize: '3rem', margin: 0, animation: 'pulse 2s infinite' }}>❓</p>
                <h3 style={{ fontWeight: 'bold', margin: '0.5rem 0', color: '#facc15' }}>HOY • AHORA</h3>
                <p style={{ color: '#d1d5db', fontSize: '0.875rem', marginBottom: '1rem' }}>{userProfile.weight}kg • Decide</p>
                <p style={{ fontSize: '0.875rem', color: '#fbbf24', marginBottom: '1rem', fontStyle: 'italic' }}"¿Qué versión de ti eres hoy?"</p>
              </div>

              {/* FUTURO */}
              <div style={{...styles.contentBox, textAlign: 'center', borderTop: '4px solid #3b82f6'}}>
                <p style={{ fontSize: '2rem', margin: 0 }}>🎯</p>
                <h3 style={{ fontWeight: 'bold', margin: '0.5rem 0' }}>EN 3 MESES</h3>
                <p style={{ color: '#d1d5db', fontSize: '0.875rem', marginBottom: '1rem' }}>Recuperado • Fuerte • Definido</p>
                <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#3b82f6' }}>→</p>
              </div>
            </div>

            {/* Decision Buttons */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginTop: '2rem' }}>
              <button
                style={{...styles.decisionButton, ...styles.athleteButton}}
                onClick={() => recordDecision('athlete')}
              >
                ✅ HOY SÍ SOY ATLETA<br/>
                <span style={{ fontSize: '0.875rem' }}>Elijo mi mejor versión</span>
              </button>
              <button
                style={{...styles.decisionButton, background: '#ef4444', color: 'white'}}
                onClick={() => recordDecision('sedentary')}
              >
                ❌ HOY SOY SEDENTARIO<br/>
                <span style={{ fontSize: '0.875rem' }}>Acepto las consecuencias</span>
              </button>
            </div>

            {/* Letter from Past Self */}
            <div style={{...styles.contentBox, marginTop: '2rem'}}>
              <h3 style={styles.sectionTitle}>📮 Tu Versión Atlética Te Habla:</h3>
              <div style={styles.letter}>
                <p>
                  "Hola. Soy la versión de ti que solía levantarse a las 6:30 AM sin dudar.<br/><br/>
                  Sé que cuesta. Sé que es más fácil quedarse acostado.<br/>
                  Pero escúchame: eso que sientes ahora (pesadez, desgana) no es verdad tuya.<br/>
                  Es solo la voz del placer instantáneo tratando de ganar.<br/><br/>
                  Hace {userProfile.yearsAgo} años YO pesaba {userProfile.pastWeight}kg y TÚ ERAS YO.<br/>
                  Ese poder sigue adentro. No se fue. Solo lo olvidaste.<br/><br/>
                  Hoy no te pido que cambies todo.<br/>
                  Solo te pido que hagas UNA cosa: la más difícil.<br/>
                  Solo hoy. Una sola vez más.<br/><br/>
                  ¿Recuerdas cómo se sentía ganar?"
                </p>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: MI VERDAD - Honest Registry */}
        {activeTab === 'truth' && (
          <div>
            <h3 style={{...styles.sectionTitle, marginTop: '2rem'}}>🎯 REGISTRA TU VERDAD HOY</h3>
            <p style={{ color: '#d1d5db', marginBottom: '1.5rem' }}>Sin juicio. Solo la realidad. Esto te ayuda a ver patrones.</p>

            <div style={styles.contentBox}>
              <p style={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>¿Qué comiste que NO debías?</p>
              <input style={styles.truthInput} type="text" placeholder="Ej: 1 bolsa de Doritos" />

              <p style={{ fontWeight: 'bold', marginBottom: '0.5rem', marginTop: '1rem' }}>¿Cuántas horas en redes/TV?</p>
              <input style={styles.truthInput} type="number" placeholder="Ej: 3" />

              <p style={{ fontWeight: 'bold', marginBottom: '0.5rem', marginTop: '1rem' }}>¿Ejercitaste? ¿Cuánto?</p>
              <input style={styles.truthInput} type="text" placeholder="Ej: 0 min, 30 min de cuerda, etc" />

              <p style={{ fontWeight: 'bold', marginBottom: '0.5rem', marginTop: '1rem' }}>¿Cómo te SIENTES? (1-10)</p>
              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                {[1,2,3,4,5,6,7,8,9,10].map(n => (
                  <button key={n} style={{ padding: '0.5rem 0.75rem', background: '#374151', border: 'none', borderRadius: '0.375rem', color: 'white', cursor: 'pointer' }}>
                    {n}
                  </button>
                ))}
              </div>

              <button style={{...styles.button, marginTop: '1.5rem', width: '100%'}}>
                💾 REGISTRAR MI VERDAD
              </button>
            </div>

            {/* Temptations Log */}
            <div style={{...styles.contentBox, marginTop: '2rem'}}>
              <h3 style={styles.sectionTitle}>📋 TENTACIONES REGISTRADAS</h3>
              <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
                <input 
                  style={{...styles.truthInput, margin: 0}} 
                  type="text" 
                  placeholder="Ej: Quería comer chocolate pero no lo hice"
                  value={newTemptation}
                  onChange={(e) => setNewTemptation(e.target.value)}
                />
                <button style={{...styles.button, whiteSpace: 'nowrap'}} onClick={addTemptation}>Agregar</button>
              </div>

              <div style={{ display: 'grid', gap: '0.5rem' }}>
                {temptations.map((t, idx) => (
                  <div key={idx} style={{...styles.cost, background: t.resisted ? '#166534' : t.failed ? '#7c2d12' : '#1e40af'}}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                      <div>
                        <p style={{ margin: 0, fontWeight: 'bold' }}>{t.text}</p>
                        <p style={{ fontSize: '0.875rem', color: '#d1d5db', margin: '0.5rem 0 0 0' }}>{t.date}</p>
                      </div>
                      <span style={{ fontSize: '1.5rem' }}>
                        {t.resisted ? '✅' : t.failed ? '❌' : '📝'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: EL COSTO - Cost Calculator */}
        {activeTab === 'cost' && (
          <div>
            <h3 style={{...styles.sectionTitle, marginTop: '2rem'}}>💸 CALCULA EL COSTO REAL</h3>
            <p style={{ color: '#d1d5db', marginBottom: '1.5rem' }}>Cada placer instantáneo tiene un precio en tu futuro.</p>

            {Object.entries(costOfTemptations).map(([tempt, cost]) => (
              <div key={tempt} style={styles.cost}>
                <h4 style={{ margin: '0 0 0.75rem 0', fontSize: '1.125rem' }}>🚫 {tempt}</h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem' }}>
                  <div>
                    <p style={{ fontSize: '0.875rem', color: '#d1d5db', margin: 0 }}>Calorías:</p>
                    <p style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: '0.25rem 0 0 0' }}>+{cost.calories}</p>
                  </div>
                  <div>
                    <p style={{ fontSize: '0.875rem', color: '#d1d5db', margin: 0 }}>Ejercicio Equivalente:</p>
                    <p style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: '0.25rem 0 0 0' }}>{cost.minExercise} min</p>
                  </div>
                  <div>
                    <p style={{ fontSize: '0.875rem', color: '#d1d5db', margin: 0 }}>Costo Real:</p>
                    <p style={{ fontSize: '1rem', fontWeight: 'bold', margin: '0.25rem 0 0 0', color: '#fbbf24' }}>{cost.cost}</p>
                  </div>
                </div>
              </div>
            ))}

            {/* Visual Comparison */}
            <div style={{...styles.contentBox, marginTop: '2rem'}}>
              <h3 style={styles.sectionTitle}>⚖️ LA ECUACIÓN</h3>
              <div style={{ fontSize: '1rem', lineHeight: '2', color: '#d1d5db' }}>
                <p>1 bolsa de Doritos = 30 min de cuerda</p>
                <p>2 horas en TikTok = 1 entrenamientos completamente perdido</p>
                <p>1 mes comiendo mal = 3 meses de dieta limpia</p>
                <p style={{ marginTop: '1rem', color: '#fbbf24', fontWeight: 'bold' }}>
                  ¿Vale {5} minutos de placer vs. {6} meses de trabajo perdido?
                </p>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: PROTOCOLO DE EMERGENCIA - Emergency Protocol */}
        {activeTab === 'emergency' && (
          <div>
            <h3 style={{...styles.sectionTitle, marginTop: '2rem'}}>🆘 CAÍSTE. AHORA QUÉ?</h3>
            <p style={{ color: '#d1d5db', marginBottom: '1.5rem' }}>Esto es NORMAL. El cambio no es lineal. La pregunta es: ¿qué haces DESPUÉS?</p>

            <div style={{...styles.contentBox, background: 'linear-gradient(to bottom, #7c2d12, #1f2937)', borderLeft: '4px solid #ef4444'}}>
              <h4 style={{ color: '#fbbf24', fontSize: '1.125rem', marginBottom: '1rem' }}>❌ LO QUE NO HAGAS:</h4>
              <div style={{ display: 'grid', gap: '0.5rem', color: '#d1d5db' }}>
                <p>✗ NO digas "ya fracasé, reinicio mañana"</p>
                <p>✗ NO te sientas culpable</p>
                <p>✗ NO ignores lo que pasó</p>
                <p>✗ NO uses esto como excusa para fallar de nuevo</p>
              </div>
            </div>

            <div style={{...styles.contentBox, marginTop: '1.5rem', background: 'linear-gradient(to bottom, #166534, #1f2937)', borderLeft: '4px solid #4ade80'}}>
              <h4 style={{ color: '#4ade80', fontSize: '1.125rem', marginBottom: '1rem' }}>✅ PROTOCOLO DE 5 MINUTOS:</h4>
              <div style={{ display: 'grid', gap: '1rem' }}>
                <div>
                  <p style={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>1️⃣ ¿QUÉ PASÓ?</p>
                  <input style={styles.truthInput} type="text" placeholder="Describe exactamente qué hiciste" />
                </div>
                <div>
                  <p style={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>2️⃣ ¿QUÉ NECESITABAS REALMENTE?</p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                    {['Comodidad', 'Distracción', 'Escape', 'Diversión', 'Alivio'].map(opt => (
                      <button key={opt} style={{ padding: '0.5rem 1rem', background: '#374151', border: '2px solid #475569', borderRadius: '0.375rem', color: '#d1d5db', cursor: 'pointer' }}>
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <p style={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>3️⃣ ¿QUÉ HACES DIFERENTE MAÑANA?</p>
                  <input style={styles.truthInput} type="text" placeholder="Plan concreto para evitarlo de nuevo" />
                </div>
              </div>

              <button style={{...styles.button, ...styles.successButton, marginTop: '1rem', width: '100%'}} onClick={logFailure}>
                📝 REGISTRAR Y CONTINUAR (NO reiniciar)
              </button>
            </div>

            {/* The Most Important */}
            <div style={{...styles.contentBox, marginTop: '2rem', borderTop: '4px solid #3b82f6', background: 'linear-gradient(to bottom, #1e3a8a, #1f2937)'}}>
              <h4 style={{ color: '#93c5fd', fontSize: '1.125rem', marginBottom: '1rem' }}>🧠 LO MÁS IMPORTANTE:</h4>
              <div style={{ fontSize: '1rem', lineHeight: '1.8', color: '#d1d5db' }}>
                <p>
                  "Un error no es un fracaso.<br/>
                  Un fracaso es dejar que UN ERROR se convierta en DOS.<br/>
                  Dos errores se convierten en una semana.<br/>
                  Una semana se convierte en tu nueva vida."
                </p>
                <p style={{ marginTop: '1rem', color: '#93c5fd', fontWeight: 'bold' }}>
                  Hoy fallaste. Mañana NO. Eso es todo lo que necesitas.
                </p>
              </div>
            </div>

            {/* Victory Log */}
            <div style={{...styles.contentBox, marginTop: '2rem', borderLeft: '4px solid #4ade80'}}>
              <h4 style={{ color: '#4ade80', fontSize: '1.125rem', marginBottom: '1rem' }}>🏆 VICTORIA: NEGOCIOS QUE GANASTE CONTIGO MISMO</h4>
              <p style={{ color: '#d1d5db', marginBottom: '1rem' }}>Cada vez que resististe una tentación = GRAN VICTORIA</p>
              <button style={{...styles.button, ...styles.successButton, width: '100%'}} onClick={logNegotiationWon}>
                ✅ HOY GANÉ UNA NEGOCIACIÓN CONMIGO MISMO
              </button>
            </div>
          </div>
        )}

        {/* Footer */}
        <div style={{...styles.contentBox, marginTop: '3rem', background: '#2d2517', borderTop: '4px solid #facc15'}}>
          <h3 style={{...styles.sectionTitle, color: '#fbbf24'}}>💭 RECUERDA:</h3>
          <p style={{ color: '#d1d5db', lineHeight: '1.8', margin: 0 }}>
            "No se trata de ser perfecto. Se trata de ganar más batallas de las que pierdes.<br/>
            Cada día que eliges ser atleta, recuperas un pedazo de ti que creías perdido.<br/>
            Y ese tú del pasado... todavía está aquí. Solo esperando que lo despiertes."
          </p>
        </div>
      </div>
    </div>
  );
};

export default PsychologicalFitnessApp;
