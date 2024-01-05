 import { useState, useEffect } from 'react';
 import { MeetServices } from '../../services/MeetServices';
 import emptyIcon from '../../assets/images/empty_list.svg';
 import { MeetListItem } from './MeetListItem';
import { Modal, ModalBody } from 'react-bootstrap';

 const meetServices = new MeetServices();

 export const MeetList = () => {

    const [meets, setMeets] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [selected, setSelected] = useState<string | null>(null);

    const getMeets = async () => {
        try {
            const result = await meetServices.getMeets();
            if(result?.data){
                setMeets(result.data);
            }
            
        } catch (e) {
            console.log("Ocorreu um erro ao listar reuniões: ", e )
        }
    }

    const selectToRemove = (id:string) => {
        setSelected(id);
        setShowModal(true);
    }

    const cancelSelection = () => {
        setSelected(null);
        setShowModal(false);
    }

    useEffect(()=> {
        getMeets();
    },[]);

    const removeMeet = async () => {
        try {
            if(!selected){
                return ;
            }
            
            await meetServices.deleteMeet(selected);
            await getMeets();
            cancelSelection();
            
        } catch (e) {
            console.log("Ocorreu um erro ao excluir reunião: ", e )
        }
    }

    return (
        <>
            <div className="container-meet-list">
                {meets && meets.length > 0 
                    ?
                    meets.map((meet:any) => <MeetListItem key={meet.id} meet={meet} selectToRemove={selectToRemove}/>)
                    :
                    <div className='empty'>
                        <img src={emptyIcon} />
                        <p>Você não possui reuniões criadas! ;( </p>
                    </div>
                }
            </div>
            <Modal
                show={showModal}
                onHide={() => setShowModal(false)}
                className='container-modal'>
                    <ModalBody>
                        <div className='content'>
                            <div className='container'>
                                <span>Deletar Reunião</span>
                                <p>Deseja Deletar reunião?</p>
                                <p>Esta ação não poderá ser defeita.</p>
                            </div>
                            <div className='actions'>
                                <span onClick={cancelSelection}>Cancelar</span>
                                <button onClick={removeMeet}>Confirmar</button>
                            </div>
                        </div>

                    </ModalBody>

            </Modal>
        </>
    );
 }