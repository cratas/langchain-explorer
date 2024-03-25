import { StarredBackgroundWrapper } from '@/frontend/layouts';

const Layout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => <StarredBackgroundWrapper>{children}</StarredBackgroundWrapper>;

export default Layout;
