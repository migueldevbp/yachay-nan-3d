import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Select';
import {
  parseAdvanceCommand,
  VOICE_COMMAND_EVENT,
} from '@/modules/braille-writing';
import { useTranslation } from '@/i18n/useTranslation';

interface PhysicalSlateModeProps {
  instruction: string;
  handsFree: boolean;
  pauseMs: number;
  onHandsFreeChange: (value: boolean) => void;
  onPauseChange: (ms: number) => void;
  onAdvance: () => void;
}

export function PhysicalSlateMode({
  instruction,
  handsFree,
  pauseMs,
  onHandsFreeChange,
  onPauseChange,
  onAdvance,
}: PhysicalSlateModeProps) {
  const { t } = useTranslation('braille');
  const [command, setCommand] = useState('');

  useEffect(() => {
    function onVoice(event: Event) {
      const detail = (event as CustomEvent<string>).detail;
      if (typeof detail === 'string' && parseAdvanceCommand(detail)) {
        onAdvance();
      }
    }
    window.addEventListener(VOICE_COMMAND_EVENT, onVoice);
    return () => window.removeEventListener(VOICE_COMMAND_EVENT, onVoice);
  }, [onAdvance]);

  useEffect(() => {
    const Speech = window.SpeechRecognition ?? window.webkitSpeechRecognition;
    if (!Speech) {
      return undefined;
    }
    const recognition = new Speech();
    recognition.lang = 'es-PE';
    recognition.continuous = true;
    recognition.interimResults = false;
    recognition.onresult = (event) => {
      const last = event.results[event.results.length - 1];
      const text = last?.[0]?.transcript ?? '';
      if (parseAdvanceCommand(text)) {
        onAdvance();
      }
    };
    try {
      recognition.start();
    } catch {
      return undefined;
    }
    return () => recognition.stop();
  }, [onAdvance]);

  function submitCommand() {
    if (parseAdvanceCommand(command)) {
      onAdvance();
    }
    setCommand('');
  }

  return (
    <div className="physical-slate">
      <p>{t('physicalReady')}</p>
      <p className="physical-slate__step">{instruction}</p>
      <Button onClick={onAdvance}>{t('physicalNext')}</Button>
      <label className="physical-slate__toggle">
        <input
          type="checkbox"
          checked={handsFree}
          onChange={(event) => onHandsFreeChange(event.target.checked)}
        />
        {t('physicalHandsFree')}
      </label>
      <p>{t('physicalHandsFreeHelp')}</p>
      <Select<number>
        label={t('physicalPause')}
        value={pauseMs}
        onChange={onPauseChange}
        options={[
          { value: 3000, label: t('pause3') },
          { value: 5000, label: t('pause5') },
          { value: 8000, label: t('pause8') },
        ]}
      />
      <div className="physical-slate__voice">
        <label htmlFor="physical-voice-command">{t('voiceCommandLabel')}</label>
        <p id="physical-voice-help">{t('voiceCommandHelp')}</p>
        <input
          id="physical-voice-command"
          aria-describedby="physical-voice-help"
          value={command}
          onChange={(event) => setCommand(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              event.preventDefault();
              submitCommand();
            }
          }}
        />
        <Button variant="secondary" onClick={submitCommand}>
          {t('submitCommand')}
        </Button>
      </div>
    </div>
  );
}
