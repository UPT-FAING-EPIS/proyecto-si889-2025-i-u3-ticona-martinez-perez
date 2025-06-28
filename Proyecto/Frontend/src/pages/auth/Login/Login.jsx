import { Link, useNavigate } from "react-router-dom"
import AuthLayout from "../../../components/auth/AuthLayout/AuthLayout"
import LoginForm from "../../../components/auth/LoginForm/LoginForm"
import ApiDebugInfo from "../../../components/common/ApiDebugInfo/ApiDebugInfo"

const Login = () => {
  const navigate = useNavigate()

  const handleLoginSuccess = () => {
    navigate("/dashboard")
  }

  return (
    <>
      <AuthLayout
        title="Iniciar sesión"
        subtitle={
          <>
            ¿No tienes cuenta?{" "}
            <Link to="/register" className="font-medium text-indigo-600 hover:text-indigo-500">
              Regístrate aquí
            </Link>
          </>
        }
      >
        <LoginForm onSuccess={handleLoginSuccess} />
      </AuthLayout>
      <ApiDebugInfo show={true} />
    </>
  )
}

export default Login
