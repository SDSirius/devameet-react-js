import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { RoomObjects } from "./RoomObjects";
import { RoomServices } from "../../services/RoomServices";
import { createPeerConnectionContext } from "../../services/WebSocketServices";

import emptyIcon from '../../assets/images/empty_list.svg';
import copyIcon from '../../assets/images/copy.svg';
import upIcon from '../../assets/images/chevron_up.svg'
import downIcon from '../../assets/images/chevron_down.svg'
import leftIcon from '../../assets/images/chevron_left.svg'
import rightIcon from '../../assets/images/chevron_right.svg'
import { Modal, ModalBody } from "react-bootstrap";

const roomServices = new RoomServices();
const wsServices = createPeerConnectionContext();

let userMediaStream : any;


export const RoomHome = () => {

    const navigate = useNavigate();
    const [ color, setColor ] = useState('');
    const [ name, setName ] = useState('');
    const [ showModal, setShowModal ] = useState(false);
    const [ objects, setObjects ] = useState([]);
    const [ connectedUsers, setConnectedUsers ] = useState([]);
    const [ me, setMe ] = useState<any>({});


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

            userMediaStream = await navigator?.mediaDevices?.getUserMedia({
                video: {
                    width: {min:640, ideal:1280},
                    height: {min:400, ideal:1080},
                    aspectRatio: {ideal:1.7777},
                },
                audio:true
            });

            if (document.getElementById('localVideoRef')) {
                const videoRef: any = document.getElementById('localVideoRef');
                videoRef.srcObject = userMediaStream;
            }
            
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

    useEffect(() => {
        document.addEventListener('keyup', (event: any) => {
            console.log('Tecla pressionada:', event.key);
            doMovement(event);
        });
    
        return () => {
            document.removeEventListener('keyup', (event: any) => {
                console.log('Tecla liberada:', event.key);
                doMovement(event);
            });
        }
    }, []);

    const enterRoom = () => {
        if(!userMediaStream){
            return setShowModal(true);
        }

        if(!link || !userId){
            return navigate('/');
        }

        wsServices.joinRoom(link, userId);
        wsServices.onCallMade();
        wsServices.onUpdateUserList(async (users: any) => {
            if (users) {
                setConnectedUsers(users);
                localStorage.setItem('connectedUsers', JSON.stringify(users));

                const me = users.find((u: any) => u.user === userId);
                if (me) {
                    setMe(me);
                    localStorage.setItem('me', JSON.stringify(me));
                }

                const usersWithoutMe = users.filter((u : any) => u.user !== userId);
                for(const user of usersWithoutMe){
                    wsServices.addPeerConnection(user.clientId, userMediaStream, (_stream : any) => {
                        if (document.getElementById(user.clientId)) {
                            const videoRef: any = document.getElementById(user.clientId);
                            videoRef.srcObject = _stream;
                        }
                    });
                }
            }
        });
        wsServices.onRemoveUser((socketId:any) => {
            const connectedStr =  localStorage.getItem('connectedUsers') || "";
            const connectedUsers = JSON.parse(connectedStr);
            const filtered = connectedUsers?.filter((u:any) => u.clientId !== socketId)
            setConnectedUsers(filtered);
            wsServices.removePeerConnection(socketId);
        });

        wsServices.onAddUser((user: any) => {
            console.log('onAddUser', user);

            wsServices.addPeerConnection(user, userMediaStream, (_stream : any) => {
                if (document.getElementById(user)) {
                    const videoRef: any = document.getElementById(user);
                    videoRef.srcObject = _stream;
                }
            });

            wsServices.callUser(user);
        });

        wsServices.onAnswerMade((socket:any) => wsServices.callUser(socket));

    };

    const doMovement = (event: any) => {
        const meStr = localStorage.getItem('me') || '';
        const user = JSON.parse(meStr);

        if (event && user) {
            const payload = {
                userId,
                link
            } as any;

            switch (event.key) {
                case 'ArrowUp':
                    payload.x = user.x;
                    payload.orientation = 'back';
                    if (user.orientation === 'back') {
                        payload.y = user.y > 1 ? user.y - 1 : 1;
                    } else {
                        payload.y = user.y;
                    }
                    break;
                case 'ArrowDown':
                    payload.x=user.x;
                    payload.orientation = 'front';
                    if(user.orientation === 'front'){
                        payload.y = user.y < 7 ? user.y + 1 : 7;
                    }else{
                        payload.y = user.y;
                    }
                    break;
                case 'ArrowLeft':
                    payload.y=user.y;
                    payload.orientation = 'left';
                    if(user.orientation === 'left'){
                        payload.x = user.x > 0 ? user.x -1 : 0;
                    }else{
                        payload.x = user.x;
                    }
                    break;
                case 'ArrowRight':
                    payload.y = user.y;
                    payload.orientation = 'right';
                    if(user.orientation === 'right'){
                        payload.x = user.x < 7 ? user.x + 1 : 7;
                    }else{
                        payload.x = user.x;
                    }
                    break;
                            
                default: break;
            }

            console.log('Coordenadas atualizadas:', payload.x, payload.y, payload.orientation);

            if(payload.x >= 0 && payload.y >= 0 && payload.orientation){
                wsServices.updateUserMovement(payload);
            }
        }
    }

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

    const getUsersWithoutMe = () => {
        return connectedUsers.filter((u : any) => u.user !== userId);
    }

    return (
        <>
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
                            <div className="container-video">
                                <div className="mine-stream">
                                    <video className="me" id='localVideoRef' playsInline autoPlay muted />

                                </div>
                                {/* <audio id='localVideoRef' playsInline autoPlay muted/> */}

                                <div className="others">
                                    {getUsersWithoutMe()?.map((user:any) => 
                                        <div key={user.clientId} className="user-stream">
                                            <video className="user-video" id={user.clientId} playsInline autoPlay muted={user?.muted} />
                                        </div>
                                    )}
                                </div>
                            </div>

                            
                            {/* {getUsersWithoutMe()?.map((user:any) => 
                            <audio key={user.clientId} id={user.clientId}  
                                playsInline autoPlay muted={user?.muted} />
                            )} */}
                        </div>
                        <RoomObjects objects={objects} enterRoom={enterRoom}
                            connectedUsers={connectedUsers} me={me} toggleMute={toggleMute}/>
                        {mobile && me?.user && <div className="movement">
                            <div className="button" onClick={() => doMovement({key : 'ArrowUp'})}>
                                <img src={upIcon} alt="Andar par acima"/>

                            </div>
                            <div className="line">
                                <div className="button" onClick={() => doMovement({key : 'ArrowLeft'})}>
                                    <img src={leftIcon}/>
                                </div>
                                <div className="button" onClick={() => doMovement({key : 'ArrowDown'})}>
                                    <img src={downIcon} />
                                </div>
                                <div className="button" onClick={() => doMovement({key : 'ArrowRight'})}>
                                    <img src={rightIcon} />
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
            <Modal
                show={showModal}
                onHide={() => setShowModal(false)}
                className='container-modal'>
                    <ModalBody>
                        <div className='content'>
                            <div className='container'>
                                <span>Aviso! </span>
                                <p>Habilite a permissão de audio e video para partipar das reuuniões! </p>
                            </div>
                            <div className='actions'>
                                <button onClick={() => setShowModal(false)}>Ok</button>
                            </div>
                        </div>

                    </ModalBody>

            </Modal>
        </>
    );
}