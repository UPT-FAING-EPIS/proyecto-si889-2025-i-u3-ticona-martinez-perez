import { Link, useNavigate } from "react-router-dom"
import AuthLayout from "../../../components/auth/AuthLayout/AuthLayout"
import RegisterForm from "../../../components/auth/RegisterForm/RegisterForm"

const Register = () => {
  const navigate = useNavigate()

  const handleRegisterSuccess = () => {
    alert("¡Registro exitoso! Ahora puedes iniciar sesión.")
    navigate("/login")
  }

  return (
    <AuthLayout
      title="Crear cuenta"
      subtitle={
        <>
          ¿Ya tienes cuenta?{" "}
          <Link to="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
            Inicia sesión
          </Link>
        </>
      }
    >
      <RegisterForm onSuccess={handleRegisterSuccess} />
    </AuthLayout>
  )
}

export default Register
