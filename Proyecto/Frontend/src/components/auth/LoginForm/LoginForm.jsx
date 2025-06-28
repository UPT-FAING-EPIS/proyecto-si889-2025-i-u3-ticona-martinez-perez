import React, { useState } from 'react';
import { useAuth } from '../../../hooks/useAuth';
import Button from '../../common/Button/Button';
import Input from '../../common/Input/Input';

const LoginForm = ({ onSuccess }) => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const { login, isLoading, error } = useAuth();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await login(formData.email, formData.password);
    
    if (result.success && onSuccess) {
      onSuccess();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Input
        name="email"
        type="email"
        label="Correo electrónico"
        placeholder="tu@email.com"
        value={formData.email}
        onChange={handleChange}
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
        Iniciar sesión
      </Button>
    </form>
  );
};

export default LoginForm;
