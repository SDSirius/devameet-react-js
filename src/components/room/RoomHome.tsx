import { useEffect, useState } from "react";
import emptyIcon from '../../assets/images/empty_list.svg';
import copyIcon from '../../assets/images/copy.svg';
import { useNavigate, useParams } from "react-router-dom";
import { RoomObjects } from "./RoomObjects";
import { RoomServices } from "../../services/RoomServices";

const roomServices = new RoomServices();


export const RoomHome = () => {

    const navigate = useNavigate();
    const [color, setColor] = useState('');
    const [name, setName] = useState('');
    const [objects, setObjects] = useState([]);
    const {link} = useParams();

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

    };

    const copyLink = () => {
        navigator.clipboard.writeText(window?.location.href);
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
                    <RoomObjects objects={objects} enterRoom={enterRoom}/>
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