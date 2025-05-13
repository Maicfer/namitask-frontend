import React, { useContext, useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Container, Card, Button, Spinner } from 'react-bootstrap';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const Login = () => {
  const { loginUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const [generalError, setGeneralError] = useState('');
  const [loading, setLoading] = useState(false);

  const validationSchema = Yup.object({
    email: Yup.string().email('Email inválido').required('Requerido'),
    password: Yup.string().required('Requerido'),
  });

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      setLoading(true);
      setGeneralError('');

      const response = await api.post('/token/', {
        email: values.email.trim().toLowerCase(),
        password: values.password,
      });

      loginUser(response.data);
      navigate('/dashboard');
    } catch (error) {
      if (error.response?.data?.detail) {
        setGeneralError(error.response.data.detail);
      } else {
        setGeneralError('Error desconocido. Intenta nuevamente.');
      }
    } finally {
      setLoading(false);
      setSubmitting(false);
    }
  };

  return (
    <Container className="mt-5">
      <Card className="p-4 mx-auto shadow" style={{ maxWidth: '500px' }}>
        <h3 className="text-center mb-3">Iniciar sesión</h3>
        {generalError && <div className="text-danger text-center mb-3">{generalError}</div>}
        <Formik
          initialValues={{ email: '', password: '' }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          <Form>
            <label>Correo</label>
            <Field className="form-control" name="email" type="email" />
            <ErrorMessage name="email" component="div" className="text-danger" />

            <label className="mt-3">Contraseña</label>
            <Field className="form-control" name="password" type="password" />
            <ErrorMessage name="password" component="div" className="text-danger" />

            <Button className="mt-4 w-100" type="submit" disabled={loading}>
              {loading ? <Spinner animation="border" size="sm" /> : 'Ingresar'}
            </Button>
          </Form>
        </Formik>
      </Card>
    </Container>
  );
};

export default Login;
