import roomIcon from '../../assets/images/room.svg';
import copyIcon from '../../assets/images/copy.svg';
import editIcon from '../../assets/images/edit.svg';
import trashIcon from '../../assets/images/trash.svg';
import { useNavigate } from 'react-router-dom';
type MeetListItemProps = {
    meet :any;
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const MeetListItem:React.FC<MeetListItemProps> = ({meet}) => {
    console.log(meet)
    const mobile = window.innerWidth <= 992;
    const navigate = useNavigate();

    return (
        <div className="container-meet-list-item">
            <div className='meet'>
                <div className='color' style={{backgroundColor : meet?.color }}/>
                <span onClick={() => navigate(`/link/${meet.link}`)}>{meet.name}  </span>
            </div>
            <div className='actions'>
                {mobile && <img src={roomIcon} alt='Entrar na reunião' onClick={() => navigate(`/link/${meet.link}`)}/>}
                <img src={copyIcon} alt='Copiar link da reunião' onClick={() => navigate(`/${meet.link}`)}/>
                {!mobile && <img src={editIcon} alt='Editar reunião' onClick={() => navigate(`/link/${meet.link}`)}/>}
                <img src={trashIcon} alt='Deletar reunião' />


            </div>
        </div>
    )
}