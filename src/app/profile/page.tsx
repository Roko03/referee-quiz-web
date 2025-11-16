import { redirect } from 'next/navigation';

const ProfilePage = () => {
  redirect('/profile/edit');
};

export default ProfilePage;
