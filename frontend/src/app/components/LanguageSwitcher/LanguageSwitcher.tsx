'use client';

import { useRouter } from 'next/navigation';
import { usePathname } from 'next/navigation';
import { useLocale } from 'next-intl';

export default function LanguageSwitcher() {
  const router = useRouter();
  const pathname = usePathname();
  const currentLocale = useLocale();

  const switchLanguage = (newLocale) => {
    // حذف زبان فعلی از مسیر
    const pathWithoutLocale = pathname.replace(`/${currentLocale}`, '') || '/';
    
    // هدایت به زبان جدید
    router.push(`/${newLocale}${pathWithoutLocale}`);
  };

  return (
    <div className="flex items-center space-x-2 rtl:space-x-reverse">
      <button 
        onClick={() => switchLanguage('fa')}
        className={`px-3 py-1 rounded-md text-sm font-medium ${
          currentLocale === 'fa' 
            ? 'bg-blue-600 text-white' 
            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
        }`}
      >
        فارسی
      </button>
      
      <button 
        onClick={() => switchLanguage('en')}
        className={`px-3 py-1 rounded-md text-sm font-medium ${
          currentLocale === 'en' 
            ? 'bg-blue-600 text-white' 
            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
        }`}
      >
        English
      </button>
    </div>
  );
}