interface ModalState {
  isOpen: boolean;
  type: 'drawer' | 'map' | null;
  props: Record<string, any>;
}

export const useModal = () => {
  const modalState = useState<ModalState>('modal-state', () => ({
    isOpen: false,
    type: null,
    props: {},
  }));

  const openModal = (
    type: 'drawer' | 'map',
    props: Record<string, any> = {}
  ) => {
    modalState.value = {
      isOpen: true,
      type,
      props,
    };
  };

  const closeModal = () => {
    modalState.value = {
      isOpen: false,
      type: null,
      props: {},
    };
  };

  const toggleModal = () => {
    if (modalState.value.isOpen) {
      closeModal();
    }
  };

  return {
    modalState: readonly(modalState),
    isOpen: computed(() => modalState.value.isOpen),
    modalType: computed(() => modalState.value.type),
    modalProps: computed(() => modalState.value.props),
    openModal,
    closeModal,
    toggleModal,
  };
};
