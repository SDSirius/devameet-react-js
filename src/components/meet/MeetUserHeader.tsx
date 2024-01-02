import { useNavigate} from 'react-router-dom';
import addIcon from '../../assets/images/add.svg';

export const MeetUserHeader = () => {
    const user = localStorage.getItem('name') || '';
    const navigate = useNavigate();
    const mobile = window.innerWidth <= 992;

    const navigateToAdd = () => {
        navigate('/add');
    }

    return (
        <div className='container-user-header'>
            <span>Minhas Reuniões</span>
            <div >
                <p>Olá, {user}</p>
                {!mobile && <img src={addIcon} alt='Adicionar reunião' onClick={navigateToAdd} />}
            </div>
        </div>
    )
}