/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/require-default-props */
import React from 'react';
import { useHistory } from 'react-router-dom';
import TextButton from '../components/TextButton';

import successImage from '../images/success.svg';
import '../styles/pages/RegisterSuccessful.css';

interface RegisterSuccessfulProps {
  location: {
    state?: {
      orphanageCreated: boolean;
    }
  }
}

function RegisterSuccessful(props: RegisterSuccessfulProps) {
  const history = useHistory();

  const { state } = props.location;
  const orphanageCreated = Boolean(state?.orphanageCreated);

  if (!orphanageCreated) {
    history.push('/');
  }

  return (
    <div className="pageRegisterSuccessful">
      <div className="pageRegisterSuccessful__content">
        <h1 className="pageRegisterSuccessful__title">
          Ebaaa!
        </h1>

        <p className="pageRegisterSuccessful__description">
          Cadastro concluído com sucesso!
        </p>

        <TextButton
          className="pageRegisterSuccessful__goToMap"
          type="button"
          color="green-dark"
          onClick={() => history.push('/app')}
        >
          Voltar para o mapa
        </TextButton>
      </div>

      <img
        className="pageRegisterSuccessful__successImage"
        src={successImage}
        alt="Sucesso!"
      />
    </div>
  );
}

export default RegisterSuccessful;
