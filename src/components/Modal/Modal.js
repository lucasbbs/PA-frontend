import React, { useState } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

const ModalUI = (props) => {
  const { className } = props;

  const [modal, setModal] = useState(false);

  const toggle = () => setModal(!modal);

  return (
    <div>
      <Button color='primary' onClick={toggle}>
        Definir paginação
      </Button>
      <Modal isOpen={modal} className={className}>
        <ModalHeader>
          Defina quantas receitas por página serão exibidas
        </ModalHeader>
        <ModalBody>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolorem
          culpa, soluta enim harum aut, quos, et nihil maxime facilis optio
          commodi voluptatem quas? Illum, quod debitis! Fugit itaque placeat
          dolorum?Est eos optio accusamus eum corrupti molestiae temporibus,
          vitae repellat cum mollitia voluptas modi corporis facere dolores
          pariatur maiores debitis rem. Quam fuga odio tenetur. Voluptas,
          cupiditate? Veritatis, debitis rerum.
        </ModalBody>
        <ModalFooter>
          <Button
            color='primary'
            // onClick={console.log('teste')}
            style={{ margin: '0 20px 20px' }}
          >
            Definir
          </Button>
          <Button
            color='secondary'
            // onClick={toggle}
            style={{ margin: '0 20px 20px' }}
          >
            Voltar
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
};

export default ModalUI;
