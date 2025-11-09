import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { SidebarProvider } from '../components/SidebarContext';
import Header from '../components/Header';

export default function PrivateLayout() {
  return (
    <SidebarProvider>
      <div className="flex flex-col lg:flex-row h-screen overflow-hidden">
        
        <div className="lg:w-64 flex-shrink-0">
          <Sidebar />
        </div>
        
      
        <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
          <Header />
       
          <main className="flex-1 overflow-y-auto">
            <div className="p-4 pb-20 lg:pb-4"> 
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}