import Navbar from '../components/Navbar'
import HeroSection from '../components/HeroSection'
import WachtlistPreview from '../components/WachtlistPreview'
import RecentComparisons from '../components/RecentComparisons'
import Footer from '../components/Footer'

const Index = () => {
  return (
    <div>
      <header>
        <Navbar />
      </header>
      <main>
        <HeroSection />
        <WachtlistPreview />
        <RecentComparisons />
      </main>
      <footer>
        <Footer />
      </footer>
    </div>
  )
}

export default Index
