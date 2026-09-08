import { Button } from '@/components/ui/Button';
import { Dialog } from '@/components/ui/Dialog';
import { RadioGroup } from '@/components/ui/RadioGroup';
import { Slider } from '@/components/ui/Slider';
import { Toggle } from '@/components/ui/Toggle';
import { isQuechuaValidated } from '@/i18n/config';
import { useTranslation } from '@/i18n/useTranslation';
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
  const { t } = useTranslation('settings');
  const { t: tCommon } = useTranslation('common');

  return (
    <Dialog open={open} onClose={onClose} title={t('title')}>
      <div className="a11y-panel">
        <section
          className="a11y-panel__preset"
          aria-labelledby="quiet-mode-heading"
        >
          <h3 id="quiet-mode-heading" className="a11y-panel__preset-title">
            {t('quietTitle')}
          </h3>
          <p className="ui-field-help">{t('quietHelp')}</p>
          <Button
            variant={quietModeActive ? 'secondary' : 'primary'}
            onClick={() => {
              const activating = !quietModeActive;
              toggleQuietMode();
              say(activating ? t('quietEnabled') : t('quietDisabled'));
            }}
            aria-pressed={quietModeActive}
          >
            {quietModeActive ? t('quietOn') : t('quietOff')}
          </Button>
        </section>

        <section className="a11y-panel__section" aria-labelledby="section-ver">
          <h3 id="section-ver">{t('sectionView')}</h3>
          <RadioGroup<ThemePreference>
            legend={t('themeLegend')}
            name="theme"
            value={preferences.theme}
            description={t('themeHelp')}
            options={[
              { value: 'light', label: t('themeLight') },
              { value: 'dark', label: t('themeDark') },
              { value: 'high-contrast', label: t('themeHigh') },
            ]}
            onChange={(value) => {
              setPreference('theme', value);
              say(t('themeChanged', { value: themeLabel(value, t) }));
            }}
          />
          <RadioGroup<TextScalePreference>
            legend={t('textScaleLegend')}
            name="textScale"
            value={preferences.textScale}
            description={t('textScaleHelp')}
            options={[
              { value: 100, label: t('textScale100') },
              { value: 125, label: t('textScale125') },
              { value: 150, label: t('textScale150') },
              { value: 200, label: t('textScale200') },
            ]}
            onChange={(value) => {
              setPreference('textScale', value);
              say(t('textScaleChanged', { value }));
            }}
          />
        </section>

        <section
          className="a11y-panel__section"
          aria-labelledby="section-escuchar"
        >
          <h3 id="section-escuchar">{t('sectionHear')}</h3>
          <Toggle
            label={t('sound')}
            description={t('soundHelp')}
            checked={preferences.sound}
            onChange={(checked) => {
              setPreference('sound', checked);
              say(checked ? t('soundOn') : t('soundOff'));
            }}
          />
          <Toggle
            label={t('speech')}
            description={t('speechHelp')}
            checked={preferences.speech}
            onChange={(checked) => {
              setPreference('speech', checked);
              say(checked ? t('speechOn') : t('speechOff'));
            }}
          />
          <Slider
            label={t('speechRate')}
            description={t('speechRateHelp')}
            min={0.6}
            max={1.2}
            step={0.2}
            value={preferences.speechRate}
            valueText={t('speechRateValue', { value: preferences.speechRate })}
            disabled={!preferences.speech}
            onChange={(value) => {
              const rate = snapSpeechRate(value);
              setPreference('speechRate', rate);
              say(t('speechRateChanged', { value: rate }));
            }}
          />
        </section>

        <section className="a11y-panel__section" aria-labelledby="section-leer">
          <h3 id="section-leer">{t('sectionRead')}</h3>
          <Toggle
            label={t('captions')}
            description={t('captionsHelp')}
            checked={preferences.captions}
            onChange={(checked) => {
              setPreference('captions', checked);
              say(checked ? t('captionsOn') : t('captionsOff'));
            }}
          />
          <Toggle
            label={t('braille')}
            description={t('brailleHelp')}
            checked={preferences.braille}
            onChange={(checked) => {
              setPreference('braille', checked);
              say(checked ? t('brailleOn') : t('brailleOff'));
            }}
          />
          <Toggle
            label={t('signs')}
            description={t('signsHelp')}
            checked={preferences.signLanguage}
            onChange={(checked) => {
              setPreference('signLanguage', checked);
              say(checked ? t('signsOn') : t('signsOff'));
            }}
          />
        </section>

        <section
          className="a11y-panel__section"
          aria-labelledby="section-moverse"
        >
          <h3 id="section-moverse">{t('sectionMove')}</h3>
          <RadioGroup<MotionPreference>
            legend={t('motionLegend')}
            name="motion"
            value={preferences.motion}
            description={t('motionHelp')}
            options={[
              { value: 'full', label: t('motionFull') },
              { value: 'reduced', label: t('motionReduced') },
              { value: 'none', label: t('motionNone') },
            ]}
            onChange={(value) => {
              setPreference('motion', value);
              say(t('motionChanged', { value: motionLabel(value, t) }));
            }}
          />
        </section>

        <section
          className="a11y-panel__section"
          aria-labelledby="section-ritmo"
        >
          <h3 id="section-ritmo">{t('sectionPace')}</h3>
          <RadioGroup<DensityPreference>
            legend={t('densityLegend')}
            name="density"
            value={preferences.density}
            description={t('densityHelp')}
            options={[
              { value: 'standard', label: t('densityStandard') },
              { value: 'calm', label: t('densityCalm') },
            ]}
            onChange={(value) => {
              setPreference('density', value);
              say(
                value === 'calm'
                  ? t('densityCalmMsg')
                  : t('densityStandardMsg'),
              );
            }}
          />
          <RadioGroup<InstructionLengthPreference>
            legend={t('instructionsLegend')}
            name="instructionLength"
            value={preferences.instructionLength}
            description={t('instructionsHelp')}
            options={[
              { value: 'short', label: t('instructionsShort') },
              { value: 'full', label: t('instructionsFull') },
            ]}
            onChange={(value) => {
              setPreference('instructionLength', value);
              say(
                value === 'short'
                  ? t('instructionsShortMsg')
                  : t('instructionsFullMsg'),
              );
            }}
          />
          <RadioGroup<OptionsPerActivityPreference>
            legend={t('optionsLegend')}
            name="optionsPerActivity"
            value={preferences.optionsPerActivity}
            description={t('optionsHelp')}
            options={[
              { value: 2, label: '2' },
              { value: 3, label: '3' },
              { value: 4, label: '4' },
            ]}
            onChange={(value) => {
              setPreference('optionsPerActivity', value);
              say(t('optionsChanged', { value }));
            }}
          />
          <Toggle
            label={t('confirmNav')}
            description={t('confirmNavHelp')}
            checked={preferences.confirmNavigation}
            onChange={(checked) => {
              setPreference('confirmNavigation', checked);
              say(checked ? t('confirmNavOn') : t('confirmNavOff'));
            }}
          />
        </section>

        <section
          className="a11y-panel__section"
          aria-labelledby="section-idioma"
        >
          <h3 id="section-idioma">{t('sectionLanguage')}</h3>
          <RadioGroup<LanguagePreference>
            legend={t('languageLegend')}
            name="language"
            value={preferences.language}
            description={t('languageHelp')}
            options={[
              { value: 'es', label: t('languageEs') },
              { value: 'qu', label: t('languageQu') },
            ]}
            onChange={(value) => {
              setPreference('language', value);
              if (value === 'qu' && !isQuechuaValidated()) {
                say(tCommon('quechuaWarning'), 'assertive');
                return;
              }
              say(value === 'qu' ? t('languageSavedQu') : t('languageSavedEs'));
            }}
          />
        </section>

        <div className="a11y-panel__footer">
          <Button
            variant="ghost"
            onClick={() => {
              resetPreferences();
              say(t('resetDone'));
            }}
          >
            {t('reset')}
          </Button>
        </div>
      </div>
    </Dialog>
  );
}

function themeLabel(
  theme: ThemePreference,
  t: ReturnType<typeof useTranslation<'settings'>>['t'],
): string {
  if (theme === 'high-contrast') return t('themeHighValue');
  if (theme === 'dark') return t('themeDarkValue');
  return t('themeLightValue');
}

function motionLabel(
  motion: MotionPreference,
  t: ReturnType<typeof useTranslation<'settings'>>['t'],
): string {
  if (motion === 'none') return t('motionNoneValue');
  if (motion === 'reduced') return t('motionReducedValue');
  return t('motionFullValue');
}

function snapSpeechRate(value: number): 0.6 | 0.8 | 1.0 | 1.2 {
  const allowed = [0.6, 0.8, 1.0, 1.2] as const;
  const nearest = allowed.reduce((best, current) =>
    Math.abs(current - value) < Math.abs(best - value) ? current : best,
  );
  return nearest;
}
