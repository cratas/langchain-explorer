import { HomeLayout } from '@/frontend/layouts';
import { HomeView } from '@/frontend/sections/home/view';

export const metadata = {
  title: 'LangChain Explorer | Explore power of LangChain',
};

const Home = () => (
  <HomeLayout>
    <HomeView />
  </HomeLayout>
);

export default Home;
