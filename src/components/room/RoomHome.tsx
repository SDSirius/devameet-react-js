import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { RoomObjects } from "./RoomObjects";
import { RoomServices } from "../../services/RoomServices";
import { createPeerConectionContext } from "../../services/WebSocketServices";

import emptyIcon from '../../assets/images/empty_list.svg';
import copyIcon from '../../assets/images/copy.svg';
import upIcon from '../../assets/images/chevron_up.svg'
import downIcon from '../../assets/images/chevron_down.svg'
import leftIcon from '../../assets/images/chevron_left.svg'
import rightIcon from '../../assets/images/chevron_right.svg'

const roomServices = new RoomServices();
const wsServices = createPeerConectionContext();


export const RoomHome = () => {

    const navigate = useNavigate();
    const [color, setColor] = useState('');
    const [name, setName] = useState('');
    const [objects, setObjects] = useState([]);
    const [connectedUsers, setConnectedUsers] = useState([]);
    const [me, setMe] = useState<any>({});


    const {link} = useParams();
    const userId = localStorage.getItem('id') || '';
    const mobile = window.innerWidth<=992;

    const getRoom = async  () => {
        try {
            if(!link) {
                return navigate('/');
            }

            const result = await roomServices.getRoomByLink(link);

            if (!result || !result.data){
                return;
            }

            const {color, name, objects} = result.data;
            setColor(color)
            setName(name)

            const newObjects = objects.map((o:any) => {
                return {...o, type:o?.name?.split('_')[0]}
            });
            setObjects(newObjects)
            
        } catch (e:any) {
            if (e?.response?.data?.message){
                console.log('Erro ao buscar dados da sala ', e?.response?.data?.message)
            }else{
                console.log('Erro ao buscar dados da sala ', e )
            }
        }
        
    }
    useEffect(() => {
        getRoom();
    },[])

    const enterRoom = () => {
        if(!link || !userId){
            return navigate('/');
        }

        wsServices.joinRoom(link, userId);
        wsServices.onUpdateUserList(async(users:any)  => {
            if (users){
                setConnectedUsers(users);
                localStorage.setItem('connectedUsers', JSON.stringify(users));

                const me = users.find((u:any) => u.user === userId);
                if(me){
                    setMe(me);
                    localStorage.setItem('me', JSON.stringify(me));
                }
            }
        });
        wsServices.onRemoveUser((socketId:any) => {
            const connectedStr =  localStorage.getItem('connectedUsers') || "";
            const connectedUsers = JSON.parse(connectedStr);
            const filtered = connectedUsers?.filter((u:any) => u.clientId !== socketId)
            setConnectedUsers(filtered);
        });

    };

    const copyLink = () => {
        navigator.clipboard.writeText(window?.location.href);
    }

    const toggleMute = () => {
        const payload = {
            userId,
            link,
            muted: !me.muted
        }

        wsServices.updateUserMute(payload);
    }

    return (
        <div className="container-principal">
            <div className="container-room">
            {
                objects?.length > 0 
                ?
                <>
                    <div className="resume">
                        <div onClick={copyLink} >
                            <span><strong>Reunião: </strong>{link}</span>
                            <img src={copyIcon} />
                        </div>
                        <p style={{color}}>{name}</p>
                    </div>
                    <RoomObjects objects={objects} enterRoom={enterRoom}
                        connectedUsers={connectedUsers} me={me} toggleMute={toggleMute}/>
                    {mobile && me?.user && <div className="movement">
                        <div className="button" onClick={() => {}}>
                            <img src={upIcon} alt="Andar par acima"/>

                        </div>
                        <div className="line">
                            <div className="button" onClick={() => {}}>
                                <img src={leftIcon} onClick={() => {}}/>
                            </div>
                            <div className="button" onClick={() => {}}>
                                <img src={downIcon} onClick={() => {}}/>
                            </div>
                            <div className="button" onClick={() => {}}>
                                <img src={rightIcon} onClick={() => {}}/>
                            </div>
                        </div>
                        </div>}
                </>
                : 
                    <div className="empty">
                        <img src={emptyIcon} />
                        <p>Reunião Não Encontrada! :/</p>
                    </div>
            }
            </div>
        </div>
    );
}