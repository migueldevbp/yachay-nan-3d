import {
  createHashRouter,
  createRoutesFromElements,
  Route,
} from 'react-router-dom';
import { App } from '@/app/App';
import { AboutPage } from '@/pages/AboutPage';
import { ActivitiesPage } from '@/pages/ActivitiesPage';
import { AlphabetPage } from '@/pages/AlphabetPage';
import { BraillePage } from '@/pages/BraillePage';
import { BrailleWriting } from '@/pages/braille/BrailleWriting';
import { CameraPage } from '@/pages/CameraPage';
import { HomePage } from '@/pages/HomePage';
import { NotFoundPage } from '@/pages/NotFoundPage';
import { NumbersPage } from '@/pages/NumbersPage';
import { PrivacyPage } from '@/pages/PrivacyPage';
import { ProgressPage } from '@/pages/ProgressPage';
import { SignLanguagePage } from '@/pages/SignLanguagePage';
import { TeacherPage } from '@/pages/TeacherPage';
import { WordsPage } from '@/pages/WordsPage';

export const routeTree = (
  <Route path="/" element={<App />}>
    <Route index element={<HomePage />} />
    <Route path="alfabeto" element={<AlphabetPage />} />
    <Route path="numeros" element={<NumbersPage />} />
    <Route path="braille" element={<BraillePage />} />
    <Route path="braille/escritura" element={<BrailleWriting />} />
    <Route path="senas" element={<SignLanguagePage />} />
    <Route path="camara" element={<CameraPage />} />
    <Route path="actividades" element={<ActivitiesPage />} />
    <Route path="palabras" element={<WordsPage />} />
    <Route path="progreso" element={<ProgressPage />} />
    <Route path="docente" element={<TeacherPage />} />
    <Route path="acerca" element={<AboutPage />} />
    <Route path="privacidad" element={<PrivacyPage />} />
    <Route path="*" element={<NotFoundPage />} />
  </Route>
);

export function createAppRouter() {
  return createHashRouter(createRoutesFromElements(routeTree), {
    future: {
      v7_relativeSplatPath: true,
    },
  });
}

export const router = createAppRouter();
