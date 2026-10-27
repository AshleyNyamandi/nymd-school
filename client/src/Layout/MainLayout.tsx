import type { MainLayoutProps } from '..'
import Footer from '../components/Footer'
import Navbar from '../components/Navbar'



const MainLayout = ({ children }: MainLayoutProps) => {
  return (
    <div className='flex flex-col min-h-screen'>
      <Navbar />
      <div className='flex-1'>
        {children} 
      </div>
      <Footer />
    </div>
  )
}

export default MainLayout