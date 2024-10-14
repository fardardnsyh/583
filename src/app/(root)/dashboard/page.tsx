import { auth } from '@/auth';
// import AllMessages from '@/components/dashboard/all-messages';
import HandleMessageAcceptance from '@/components/dashboard/handle-message-acceptance';
import ProfileLink from '@/components/dashboard/profile-link';
import { Separator } from '@/components/ui/separator';
import dynamic from 'next/dynamic';
const AllMessages = dynamic(() => import('@/components/dashboard/all-messages'), { ssr: false });
// const ProfileLink = dynamic(() => import('@/components/dashboard/profile-link'), { ssr: false });


const Dashboard = async () => {
  const session = await auth();

  if (!session || !session.user || !session.user.username) return;

  return (
    <div className='w-full max-w-6xl mx-auto p-6'>
      <h1 className='text-4xl font-bold mb-4'>User Dashboard</h1>
      <ProfileLink username={session.user.username} />
      <HandleMessageAcceptance />
      <Separator />
      <AllMessages />
    </div>
  );
};

export default Dashboard;
