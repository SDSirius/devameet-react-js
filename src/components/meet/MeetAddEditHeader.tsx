import { useState } from 'react';
import arrowIcon from '../../assets/images/arrow_down_color.svg';
import { Modal, ModalBody } from 'react-bootstrap';

type MeetAddEditHeaderProps = {
    name:string,
    setName(s:string):void,
    color:string,
    setColor(s:string):void,
}

export const MeetAddEditHeader:React.FC<MeetAddEditHeaderProps> = ({name, setName, color, setColor}) => {

    const [showModal, setShowModal] = useState(false);
    const [selected, setSelected] = useState<string | null>(null);
    const colors = [
        "#800000", "#FF0000", "#FF4040", "#FF8080", "#FFC0C0", 
        "#808000", "#FFFF00", "#FFFF40", "#FFFF80", "#FFFFC0", 
        "#004000", "#00FF00", "#40FF40", "#80FF80", "#C0FFC0", 
        "#000080", "#0040FF", "#0080FF", "#40A0FF", "#80C0FF", 
        "#400040", "#800080", "#C040C0", "#FF00FF", "#FF80FF", 
        "#402000", "#804000", "#C08040", "#FFA040", "#FFC080", 
        "#000000", "#808080", "#A0A0A0", "#C0C0C0", "#FFFFFF"
    ]

    const cancelSelection = () => {
        setSelected(null);
        setShowModal(false);
    }

    const selectColor = () => {
        if (selected){
            setColor(selected);
        }
        setShowModal(false);
    }

    return (
        <>
            <div className='container-user-header'>
                <span>Nova Reunião</span>
                <div >
                    <input type='text' 
                        placeholder='Digite o nome da sua reunião'
                        value={name}
                        onChange={e => setName(e.target.value)}/>
                    <div className='color-select' onClick={() => setShowModal(true)}>
                        <div className='circle' style={color ? { backgroundColor : color } : {} }/>
                        <img src={arrowIcon} alt='Selecionar a cor da reunião'/>
                    </div>
                </div>
            </div>
            <Modal
                show={showModal}
                onHide={() => setShowModal(false)}
                className='container-modal'>
                    <ModalBody>
                        <div className='content'>
                            <div className='container'>
                                <span>Selecione a cor da reunião: </span>
                                <div className='colors'>
                                    {colors?.map(c => <div className={c === selected ? 'selected' : "" } style={{backgroundColor: c}}
                                        onClick={() => setSelected(c)}/>)}
                                </div>
                            </div>
                            <div className='actions'>
                                <span onClick={cancelSelection}>Cancelar</span>
                                <button onClick={selectColor}>Confirmar</button>
                            </div>
                        </div>

                    </ModalBody>

            </Modal>
        </>
    )
}