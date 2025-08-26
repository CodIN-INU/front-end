import MainHeader from '@/components/Layout/header/MainHeader';
import DefaultBody from '@/components/Layout/Body/defaultBody';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <MainHeader />
      <DefaultBody hasHeader={2}>{children}</DefaultBody>
    </>
  );
}
