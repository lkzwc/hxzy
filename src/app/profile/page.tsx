'use client'
import { useSession } from 'next-auth/react';

function Profile() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <p>Loading...</p>;
  }

  if (!session) {
    return <p>You are not signed in</p>;
  }

  return (
    <div>
      <p>Signed in as {session.user?.email}</p>
      <p>Name: {session.user?.name}</p>
      <p className='w-20 h -20'>Image: {session.user?.image && <img src={session.user.image} alt="Profile" />}</p>
    </div>
  );
}

export default Profile;