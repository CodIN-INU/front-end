/**
 * main feature - 공개 API
 * ✅ import { MainPage, MainHeader } from '@/features/main'
 * ❌ import MainPage from '@/features/main/pages/MainPage'
 */
export { default as MainPage } from './pages/MainPage';
export { default as DeptPage } from './pages/DeptPage';
export {
  MainHeader,
  MainCalendarSection,
  MainMenuSection,
  MainRoomStatusSection,
  MainRankingSection,
  MainSectionSkeleton,
} from './components';
