import { StarredBackgroundWrapper } from '@/layouts';

const Layout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => <StarredBackgroundWrapper>{children}</StarredBackgroundWrapper>;

export default Layout;
