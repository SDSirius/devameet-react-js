import { useState } from "react";

import logo from '..//assets/images/logo.svg'
import imgEmail from '..//assets/images/mail.svg'
import imgKey from '..//assets/images/key.svg'
import { PublicInput } from '../components/general/PublicInput';
import { LoginServices } from "../services/LoginServices";

const loginservices = new LoginServices(); 

export const Login = () => {

    const [login, setLogin] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const doLogin = async() =>{
        try {
            setError('')            
            if(!login || login.trim().length<5 || !password || password.trim().length < 4) {
                return setError('Favor preencher os campos corretamente')  
            }

            setLoading(true);
            await loginservices.login({login, password})
            setLoading(false)

            // setTimeout(()=>{
            //     setLoading(false);
            // }, 2000)
        } catch (e:any) {


            console.log("erro ao efetuar o login", e);
            setLoading(false);
            if (e?.response?.data?.message){
                return setError(e?.response?.data?.message)
            }
            return setError("Erro ao efetuar o Login, tente novamente.")
        }
    }

    return  (
        <div className="container-public">
            <img src={logo} alt="Logo Devameet" className='logo' />
            <form>
                {error && <p className="error">{error}</p>}

                <PublicInput 
                icon={imgEmail}
                alt='Email'
                name='Email'
                type='text'
                modelValue={login}
                setValue={setLogin}
                />
                <PublicInput 
                icon={imgKey}
                alt='Password'
                name='Password'
                type='password'
                modelValue={password}
                setValue={setPassword}
                />
                
                <button type='button' onClick={doLogin} disabled={loading}> 
                    {loading ? 'carregando' : 'Login.'} 
                </button>

                <div className='link'>
                    <p>Não tem uma conta?</p>
                    <a>Faça seu cadastro agora!</a>
                </div>
            </form>
        </div>

    );
}