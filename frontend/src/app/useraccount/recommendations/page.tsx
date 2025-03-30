import Sidebar from '@/app/components/Sidebar/Sidebar';
import WishList from '@/app/components/WishList/WishList';
import UserPageLayout from '@/app/components/UserPageLayout/UserPageLayout';
import Recommendations from './rec';

const Page = () => {
  return (
    <UserPageLayout>
      <div className="flex gap-6">
        {/* Sidebar */}
        <div className="w-1/4">
          <Sidebar />
        </div>

        {/* Main Content */}
        <div className="w-3/4">
          <Recommendations />
        </div>
      </div>
    </UserPageLayout>
  );
};

export default Page;
