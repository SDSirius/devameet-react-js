 import { useState, useEffect } from 'react';
 import { MeetServices } from '../../services/MeetServices';
 import emptyIcon from '../../assets/images/empty_list.svg';
 import { MeetListItem } from './MeetListItem';

 const meetServices = new MeetServices();

 export const MeetList = () => {

    
    const [meets, setMeets] = useState([]);

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

    useEffect(()=> {
        getMeets();
    },[]);

    return (
        <div className="container-meet-list">
            {meets && meets.length > 0 
                ?
                    meets.map((meet:any) => <MeetListItem key={meet.id} meet={meet}/>)
                :
                <div className='empty'>
                    <img src={emptyIcon} />
                    <p>Você não possui reuniões criadas! ;( </p>
                </div>
            }
        </div>
    );
 }