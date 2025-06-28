import { Link } from "react-router-dom"
import Button from "../../components/common/Button/Button"

const NotFound = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center">
          <div className="mx-auto h-24 w-24 bg-indigo-100 rounded-full flex items-center justify-center mb-6">
            <span className="text-indigo-600 text-4xl">🔍</span>
          </div>

          <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>

          <h2 className="text-2xl font-semibold text-gray-700 mb-2">Página no encontrada</h2>

          <p className="text-gray-600 mb-8">Lo sentimos, la página que buscas no existe o ha sido movida.</p>

          <div className="space-y-4">
            <Link to="/dashboard">
              <Button className="w-full" icon="🏠">
                Ir al Dashboard
              </Button>
            </Link>

            <Link to="/login">
              <Button variant="outline" className="w-full">
                Ir al Login
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default NotFound
