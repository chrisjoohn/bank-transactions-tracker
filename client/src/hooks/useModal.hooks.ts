import { useState } from 'react';

const useModal = () => {
  const [showModal, setShowModal] = useState(false);

  const toggleModal = (show = false) => {
    setShowModal(show);
  };

  return {
    showModal,
    toggleModal,
  };
};

export default useModal;
