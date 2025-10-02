import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ProfileContent } from "@/components/profile-content"
import { ProtectedRoute } from "@/components/protected-route"

export default function ProfilePage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <ProtectedRoute>
          <ProfileContent />
        </ProtectedRoute>
      </main>
      <Footer />
    </div>
  )
}
