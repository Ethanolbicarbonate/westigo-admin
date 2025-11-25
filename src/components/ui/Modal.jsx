import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { X } from 'lucide-react';
import { cn } from '../../utils/cn';

export function Modal({ isOpen, onClose, title, children, footer, className }) {
  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        
        {/* Backdrop */}
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/25 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            
            {/* Panel */}
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95 translate-y-4 sm:translate-y-0"
              enterTo="opacity-100 scale-100 translate-y-0"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100 translate-y-0"
              leaveTo="opacity-0 scale-95 translate-y-4 sm:translate-y-0"
            >
              <Dialog.Panel 
                className={cn(
                  "w-full max-w-lg transform overflow-hidden rounded-ios-lg bg-white text-left align-middle shadow-xl transition-all",
                  className
                )}
              >
                {/* Header */}
                <div className="flex items-center justify-between border-b border-ios-separator/50 px-6 py-4">
                  <Dialog.Title as="h3" className="text-lg font-semibold text-ios-label leading-6">
                    {title}
                  </Dialog.Title>
                  <button
                    onClick={onClose}
                    className="rounded-full p-1 text-ios-gray2 hover:bg-ios-gray6 hover:text-ios-label transition-colors"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                {/* Body */}
                <div className="px-6 py-4">
                  {children}
                </div>

                {/* Footer */}
                {footer && (
                  <div className="bg-ios-gray6/30 px-6 py-4 flex flex-row-reverse gap-2 border-t border-ios-separator/50">
                    {footer}
                  </div>
                )}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}