import { Button } from '@/components/ui/Button';
import { Dialog } from '@/components/ui/Dialog';
import { RadioGroup } from '@/components/ui/RadioGroup';
import { Slider } from '@/components/ui/Slider';
import { Toggle } from '@/components/ui/Toggle';
import { useAccessibility } from '@/modules/accessibility/useAccessibility';
import type {
  DensityPreference,
  InstructionLengthPreference,
  LanguagePreference,
  MotionPreference,
  OptionsPerActivityPreference,
  TextScalePreference,
  ThemePreference,
} from '@/modules/accessibility/types';

interface AccessibilityPanelProps {
  open: boolean;
  onClose: () => void;
}

export function AccessibilityPanel({ open, onClose }: AccessibilityPanelProps) {
  const {
    preferences,
    setPreference,
    resetPreferences,
    quietModeActive,
    toggleQuietMode,
    say,
  } = useAccessibility();

  return (
    <Dialog open={open} onClose={onClose} title="Ajustes de accesibilidad">
      <div className="a11y-panel">
        <section
          className="a11y-panel__preset"
          aria-labelledby="quiet-mode-heading"
        >
          <h3 id="quiet-mode-heading" className="a11y-panel__preset-title">
            Modo Tranquilo
          </h3>
          <p className="ui-field-help">
            Menos movimiento, sin sonido, menos opciones a la vez y confirmación
            antes de cambiar de pantalla. Puedes desactivarlo y recuperar tus
            ajustes anteriores.
          </p>
          <Button
            variant={quietModeActive ? 'secondary' : 'primary'}
            onClick={() => {
              const activating = !quietModeActive;
              toggleQuietMode();
              say(
                activating
                  ? 'Modo tranquilo activado.'
                  : 'Modo tranquilo desactivado. Se restauraron tus ajustes anteriores.',
              );
            }}
            aria-pressed={quietModeActive}
          >
            {quietModeActive
              ? 'Desactivar Modo Tranquilo'
              : 'Activar Modo Tranquilo'}
          </Button>
        </section>

        <section className="a11y-panel__section" aria-labelledby="section-ver">
          <h3 id="section-ver">Ver</h3>
          <RadioGroup<ThemePreference>
            legend="Apariencia"
            name="theme"
            value={preferences.theme}
            description="Cambia colores de fondo y texto. Alto contraste es el más nítido."
            options={[
              { value: 'light', label: 'Clara' },
              { value: 'dark', label: 'Oscura' },
              { value: 'high-contrast', label: 'Alto contraste' },
            ]}
            onChange={(value) => {
              setPreference('theme', value);
              say(`Apariencia: ${themeLabel(value)}`);
            }}
          />
          <RadioGroup<TextScalePreference>
            legend="Tamaño del texto"
            name="textScale"
            value={preferences.textScale}
            description="El texto crece en toda la aplicación, no solo en esta pantalla."
            options={[
              { value: 100, label: 'Normal' },
              { value: 125, label: 'Grande' },
              { value: 150, label: 'Muy grande' },
              { value: 200, label: 'Máximo' },
            ]}
            onChange={(value) => {
              setPreference('textScale', value);
              say(`Tamaño del texto: ${value} por ciento`);
            }}
          />
        </section>

        <section
          className="a11y-panel__section"
          aria-labelledby="section-escuchar"
        >
          <h3 id="section-escuchar">Escuchar</h3>
          <Toggle
            label="Sonido"
            description="Ruidos cortos de la interfaz, como al acertar. No lee el texto en voz alta."
            checked={preferences.sound}
            onChange={(checked) => {
              setPreference('sound', checked);
              say(checked ? 'Sonido activado.' : 'Sonido desactivado.');
            }}
          />
          <Toggle
            label="Voz"
            description="Leer en voz alta lo que dice la aplicación. Está apagada hasta que tú la pidas."
            checked={preferences.speech}
            onChange={(checked) => {
              setPreference('speech', checked);
              say(checked ? 'Voz activada.' : 'Voz desactivada.');
            }}
          />
          <Slider
            label="Velocidad de la voz"
            description="Qué tan rápido hablará la voz cuando esté disponible."
            min={0.6}
            max={1.2}
            step={0.2}
            value={preferences.speechRate}
            valueText={`${preferences.speechRate} veces`}
            disabled={!preferences.speech}
            onChange={(value) => {
              const rate = snapSpeechRate(value);
              setPreference('speechRate', rate);
              say(`Velocidad de la voz: ${rate}`);
            }}
          />
        </section>

        <section className="a11y-panel__section" aria-labelledby="section-leer">
          <h3 id="section-leer">Leer</h3>
          <Toggle
            label="Subtítulos"
            description="Muestra abajo el texto de lo que la aplicación dice, aunque no haya audio."
            checked={preferences.captions}
            onChange={(checked) => {
              setPreference('captions', checked);
              say(
                checked ? 'Subtítulos activados.' : 'Subtítulos desactivados.',
              );
            }}
          />
          <Toggle
            label="Braille en pantalla"
            description="Muestra puntos Braille junto a las letras cuando haya contenido."
            checked={preferences.braille}
            onChange={(checked) => {
              setPreference('braille', checked);
              say(
                checked
                  ? 'Braille en pantalla activado.'
                  : 'Braille en pantalla desactivado.',
              );
            }}
          />
          <Toggle
            label="Lengua de señas"
            description="Mostrar un video de señas cuando exista para esa actividad."
            checked={preferences.signLanguage}
            onChange={(checked) => {
              setPreference('signLanguage', checked);
              say(
                checked
                  ? 'Lengua de señas activada.'
                  : 'Lengua de señas desactivada.',
              );
            }}
          />
        </section>

        <section
          className="a11y-panel__section"
          aria-labelledby="section-moverse"
        >
          <h3 id="section-moverse">Moverse</h3>
          <RadioGroup<MotionPreference>
            legend="Movimiento"
            name="motion"
            value={preferences.motion}
            description="Las animaciones pueden marear. Puedes reducirlas o apagarlas."
            options={[
              { value: 'full', label: 'Con animación' },
              { value: 'reduced', label: 'Poca animación' },
              { value: 'none', label: 'Sin animación' },
            ]}
            onChange={(value) => {
              setPreference('motion', value);
              say(`Movimiento: ${motionLabel(value)}`);
            }}
          />
        </section>

        <section
          className="a11y-panel__section"
          aria-labelledby="section-ritmo"
        >
          <h3 id="section-ritmo">Ritmo</h3>
          <RadioGroup<DensityPreference>
            legend="Espacio en pantalla"
            name="density"
            value={preferences.density}
            description="Calmado deja más aire entre botones y textos."
            options={[
              { value: 'standard', label: 'Estándar' },
              { value: 'calm', label: 'Calmado' },
            ]}
            onChange={(value) => {
              setPreference('density', value);
              say(
                value === 'calm'
                  ? 'Espacio en pantalla: calmado.'
                  : 'Espacio en pantalla: estándar.',
              );
            }}
          />
          <RadioGroup<InstructionLengthPreference>
            legend="Instrucciones"
            name="instructionLength"
            value={preferences.instructionLength}
            description="Cortas van al grano. Completas explican con más detalle."
            options={[
              { value: 'short', label: 'Cortas' },
              { value: 'full', label: 'Completas' },
            ]}
            onChange={(value) => {
              setPreference('instructionLength', value);
              say(
                value === 'short'
                  ? 'Instrucciones cortas.'
                  : 'Instrucciones completas.',
              );
            }}
          />
          <RadioGroup<OptionsPerActivityPreference>
            legend="Opciones por actividad"
            name="optionsPerActivity"
            value={preferences.optionsPerActivity}
            description="Cuántas respuestas verás a la vez. Menos opciones, menos carga."
            options={[
              { value: 2, label: '2' },
              { value: 3, label: '3' },
              { value: 4, label: '4' },
            ]}
            onChange={(value) => {
              setPreference('optionsPerActivity', value);
              say(`Opciones por actividad: ${value}`);
            }}
          />
          <Toggle
            label="Confirmar al cambiar de pantalla"
            description="Pregunta antes de salir de una actividad, para no perder el avance."
            checked={preferences.confirmNavigation}
            onChange={(checked) => {
              setPreference('confirmNavigation', checked);
              say(
                checked
                  ? 'Confirmación al cambiar de pantalla activada.'
                  : 'Confirmación al cambiar de pantalla desactivada.',
              );
            }}
          />
        </section>

        <section
          className="a11y-panel__section"
          aria-labelledby="section-idioma"
        >
          <h3 id="section-idioma">Idioma</h3>
          <RadioGroup<LanguagePreference>
            legend="Idioma de la interfaz"
            name="language"
            value={preferences.language}
            description="Se guarda ahora. Los textos en quechua llegarán en una fase posterior."
            options={[
              { value: 'es', label: 'Español' },
              { value: 'qu', label: 'Quechua' },
            ]}
            onChange={(value) => {
              setPreference('language', value);
              say(
                value === 'qu'
                  ? 'Idioma guardado: quechua.'
                  : 'Idioma guardado: español.',
              );
            }}
          />
        </section>

        <div className="a11y-panel__footer">
          <Button
            variant="ghost"
            onClick={() => {
              resetPreferences();
              say('Se restablecieron los ajustes de accesibilidad.');
            }}
          >
            Restablecer todo
          </Button>
        </div>
      </div>
    </Dialog>
  );
}

function themeLabel(theme: ThemePreference): string {
  if (theme === 'high-contrast') return 'alto contraste';
  if (theme === 'dark') return 'oscura';
  return 'clara';
}

function motionLabel(motion: MotionPreference): string {
  if (motion === 'none') return 'sin animación';
  if (motion === 'reduced') return 'poca animación';
  return 'con animación';
}

function snapSpeechRate(value: number): 0.6 | 0.8 | 1.0 | 1.2 {
  const allowed = [0.6, 0.8, 1.0, 1.2] as const;
  const nearest = allowed.reduce((best, current) =>
    Math.abs(current - value) < Math.abs(best - value) ? current : best,
  );
  return nearest;
}
