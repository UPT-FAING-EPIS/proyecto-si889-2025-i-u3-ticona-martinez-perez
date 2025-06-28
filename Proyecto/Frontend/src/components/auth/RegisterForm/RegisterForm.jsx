import React, { useState } from 'react';
import { useAuth } from '../../../hooks/useAuth';
import Button from '../../common/Button/Button';
import Input from '../../common/Input/Input';

const RegisterForm = ({ onSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const { register, isLoading, error } = useAuth();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    
    // Limpiar error específico cuando el usuario empiece a escribir
    if (errors[e.target.name]) {
      setErrors({
        ...errors,
        [e.target.name]: ''
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'El nombre es requerido';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'El email es requerido';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'El email no es válido';
    }

    if (!formData.password) {
      newErrors.password = 'La contraseña es requerida';
    } else if (formData.password.length < 6) {
      newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const result = await register({
      name: formData.name,
      email: formData.email,
      password: formData.password
    });
    
    if (result.success && onSuccess) {
      onSuccess();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Input
        name="name"
        type="text"
        label="Nombre completo"
        placeholder="Tu nombre completo"
        value={formData.name}
        onChange={handleChange}
        error={errors.name}
        icon="👤"
        required
      />
      
      <Input
        name="email"
        type="email"
        label="Correo electrónico"
        placeholder="tu@email.com"
        value={formData.email}
        onChange={handleChange}
        error={errors.email}
        icon="📧"
        required
      />
      
      <Input
        name="password"
        type="password"
        label="Contraseña"
        placeholder="••••••••"
        value={formData.password}
        onChange={handleChange}
        error={errors.password}
        helperText="Mínimo 6 caracteres"
        icon="🔒"
        required
      />
      
      <Input
        name="confirmPassword"
        type="password"
        label="Confirmar contraseña"
        placeholder="••••••••"
        value={formData.confirmPassword}
        onChange={handleChange}
        error={errors.confirmPassword}
        icon="🔒"
        required
      />

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
          <div className="flex">
            <span className="mr-2">⚠️</span>
            <span className="text-sm">{error}</span>
          </div>
        </div>
      )}

      <Button
        type="submit"
        loading={isLoading}
        className="w-full"
        size="lg"
      >
        Crear cuenta
      </Button>
    </form>
  );
};

export default RegisterForm;
