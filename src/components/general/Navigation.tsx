import homeIcon from '../../assets/images/home.svg';
import homeActiveIcon from '../../assets/images/home_active.svg';
import linkIcon from '../../assets/images/link.svg';
import linkActiveIcon from '../../assets/images/link_active.svg';
import avatarIcon from '../../assets/images/avatar.svg';
import { useLocation, useNavigate } from 'react-router-dom';

export const Navigation = ( ) => {

    const navigate = useNavigate();
    const location = useLocation();

    const mobile = window.innerWidth <= 992;

    const getIcon = (name:string)=> {
        switch(name) {
            case 'home':
                if (location.pathname !== '/user' && 
                    location.pathname !== '/link' && 
                    location.pathname !== '/room'){
                    return homeActiveIcon;
                }
                return homeIcon; 
            case 'room':
                    if (location.pathname === '/room' ||  
                        location.pathname === '/link'){
                        return linkActiveIcon;
                    }
                    return linkIcon; 
            default:
                return '';
        }
    }

    const getSelectedClass = () => {
        if (location.pathname === '/user'){
            return 'selected';
        }
        return ''
    }

    const avatarImage = () => {
        const avatar = localStorage.getItem('avatar')
        if (avatar){
            const path = `../../assets/objects/avatar/${avatar}_front.png`;
            const imageUrl = new URL(path, import.meta.url);
            return imageUrl.href;
        }
        return avatarIcon
    }

    return (
        <div className='container-navigation'>
            <ul>
                <li>
                    <img src={getIcon('home')} alt='Minhar reuniões' className='iconNav' onClick={() => navigate('/')}/>
                </li>
                {mobile ? <li>
                    <img src={getIcon('room')} alt='Entrar na reunião' className='iconNav' onClick={() => navigate('/link')}/>
                </li> 
                :
                <li className="disabled">
                    <img src={getIcon('room')} alt='Entrar na reunião' className='iconNav' />
                </li> }
                
                <li>
                    <div className={'avatar mini ' + getSelectedClass()} >
                    <img src={avatarImage()} alt='Editar usuario' onClick={() => navigate('/user')}/>
                </div>
                </li>
            </ul>

        </div>
    );
}