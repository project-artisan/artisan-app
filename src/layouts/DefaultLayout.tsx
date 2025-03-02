import { Outlet } from 'react-router-dom';

import Navbar from '@/components/navbar';
import { Sidebar } from '@/components/sidebar';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable';

export default function DefaultLayout() {
  return (
    <>
      <div className='flex flex-col h-screen fixed inset-0'>
        {/* 모바일 레이아웃 */}
        <div className='lg:hidden flex flex-1 overflow-hidden'>
          <main className='h-full w-full overflow-y-auto overscroll-none'>
            <div className='container p-4'>
              <Outlet />
            </div>
          </main>
        </div>


        <Navbar />
        {/* 데스크톱 레이아웃 */}
        <div className='hidden lg:flex flex-1 overflow-hidden'>
          <ResizablePanelGroup direction='horizontal'>
            <ResizablePanel
              className='flex-none'
              style={{
                minWidth: '200px',
              }}
              defaultSize={1}
              maxSize={20}
            >
              <main className='h-full overflow-y-auto overscroll-none'>
                <Sidebar />
              </main>
            </ResizablePanel>
            <ResizableHandle withHandle />
            <ResizablePanel defaultSize={80}>
              <main className='h-full overflow-y-auto overscroll-none'>
                <div className='container p-4'>
                  <Outlet />
                </div>
              </main>
            </ResizablePanel>
          </ResizablePanelGroup>
        </div>
      </div>
    </>
  );
}

