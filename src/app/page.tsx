import { HomeLayout } from '@/layouts';
import { HomeView } from '@/sections/home/view';

export const metadata = {
  title: 'LangChain Explorer | Explore power of LangChain',
};

const Home = () => (
  <HomeLayout>
    <HomeView />
  </HomeLayout>
);

export default Home;
