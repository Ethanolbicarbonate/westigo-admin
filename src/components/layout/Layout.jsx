import { useState, Fragment } from 'react';
import { Outlet } from 'react-router-dom';
import { Dialog, Transition } from '@headlessui/react';
import Sidebar from './Sidebar';
import Header from './Header';

export default function Layout() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-ios-bg flex">
      
      {/* --- Mobile Sidebar (Headless UI Dialog) --- */}
      <Transition.Root show={mobileOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50 lg:hidden" onClose={setMobileOpen}>
          {/* Backdrop Blur */}
          <Transition.Child
            as={Fragment}
            enter="transition-opacity ease-linear duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity ease-linear duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/20 backdrop-blur-sm" />
          </Transition.Child>

          <div className="fixed inset-0 flex">
            <Transition.Child
              as={Fragment}
              enter="transition ease-in-out duration-300 transform"
              enterFrom="-translate-x-full"
              enterTo="translate-x-0"
              leave="transition ease-in-out duration-300 transform"
              leaveFrom="translate-x-0"
              leaveTo="-translate-x-full"
            >
              <Dialog.Panel className="relative mr-16 flex w-full max-w-xs flex-1">
                <Sidebar onClose={() => setMobileOpen(false)} isMobile={true} />
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>

      {/* --- Desktop Sidebar --- */}
      <div className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0">
        <Sidebar isMobile={false} />
      </div>

      {/* --- Main Content Area --- */}
      <div className="flex flex-1 flex-col lg:pl-64 min-w-0">
        <Header onMobileToggle={() => setMobileOpen(true)} />
        
        {/* Scrollable Page Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-x-hidden">
          {/* Max-width container for large screens, 
            but allows full width on mobile for tables 
          */}
          <div className="mx-auto max-w-7xl animate-enter">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}