import React,{useState,useEffect} from 'react'
import moment from 'moment'
import { toast } from 'react-toastify';
import './card.css'

const Card = () => {
    const[locationData,setLocationData] = useState("");
    const[query,setQuery] = useState("")
    const[tempData,setTempData] = useState("")
    const[dt,setDt] = useState('')
    const[main,setMain] = useState("")
    const[icon,setIcon] = useState('')

    const notify = ()=>{
        toast('Please Enter the Correct Country or City Name..', {
            position: "top-center",
            autoClose: 4000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            theme: "dark",
        });   
    }

    const handleOnchange = async(e)=>{
        if(e.key === 'Enter'){
                console.log(query);
                await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${query}&appid=60e3022aae377ec3684a7e98f0d3ad2a`)
                    .then(res => res.json())
                    .then(data => {
                        console.log(data)
                        if (data.message === 'city not found'){
                            notify()
                        }
                        else{
                        setLocationData(data.name)
                        setTempData(parseInt((data.main.temp)-273.15))
                        setMain(data.weather[0].main)
                        setIcon(data.weather[0].icon)
                        switch(data.weather[0].main){
                            case 'Clouds':
                                window.document.body.className = "cloudy"
                                break;
                            case 'Clear':
                                window.document.body.className = "clear"
                                break;
                            case 'Haze' || 'Mist' || 'Fog':
                                window.document.body.className = "hazy"
                                break;
                            case 'Snow':
                                window.document.body.className = "snowy"
                                break;
                            case 'Rain' || 'Drizzle' || 'Thunderstorm':
                                window.document.body.className = "rain"
                                break
                            default:
                                window.document.body.className = "clear"
                        }
                        setQuery('')
                    }
                    })
                    .catch(err =>{
                        console.log(err);
                    })

    }
}

    useEffect(()=>{

        const success= async(pos)=> {
            const crd = pos.coords;
            const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${crd.latitude}&lon=${crd.longitude}&appid=60e3022aae377ec3684a7e98f0d3ad2a`)
            const data = await response.json()
            setLocationData(data.name)
            setTempData(parseInt((data.main.temp)-273.15))
            setMain(data.weather[0].main)
            setIcon(data.weather[0].icon)
            switch(data.weather[0].main){
                case 'Clouds':
                    window.document.body.className = "cloudy"
                    break;
                case 'Clear':
                    window.document.body.className = "clear"
                    break;
                case 'Haze' || 'Mist' || 'Fog':
                    window.document.body.className = "hazy"
                    break;
                case 'Snow':
                    window.document.body.className = "snowy"
                    break;
                case 'Rain' || 'Drizzle' || 'Thunderstorm':
                    window.document.body.className = "rain"
                    break
                default:
                    window.document.body.className = "clear"
                    break
            }
        }
    
        function error(err) {
            console.warn(`ERROR(${err.code}): ${err.message}`);
        }
    
        navigator.geolocation.getCurrentPosition(success, error);
        setDt(moment().format('MMMM Do YYYY'))

        const card = document.querySelector('.card')

        moment().hours() > 6 && moment().hours() < 20 ? card.classList.add('day') : card.classList.add("night")


    },[])

  return (
    <>
    <div className='container rainy'>
        <div className="card">
            <div className="group">
                <input placeholder="Search" type="text" className="input" value={query} onKeyPress={handleOnchange} onChange={e => setQuery(e.target.value)}/>
                <svg className="icon" aria-hidden="true" viewBox="0 0 24 24"><g><path d="M21.53 20.47l-3.66-3.66C19.195 15.24 20 13.214 20 11c0-4.97-4.03-9-9-9s-9 4.03-9 9 4.03 9 9 9c2.215 0 4.24-.804 5.808-2.13l3.66 3.66c.147.146.34.22.53.22s.385-.073.53-.22c.295-.293.295-.767.002-1.06zM3.5 11c0-4.135 3.365-7.5 7.5-7.5s7.5 3.365 7.5 7.5-3.365 7.5-7.5 7.5-7.5-3.365-7.5-7.5z"></path></g></svg>
            </div>
            <div className="top">
                <h1 className='city'>{locationData !== undefined ? locationData : ''}</h1>
                <h5 className='date'>{dt}</h5>
            </div>
            <div className="bottom">
                <h5 className="temptrature">{tempData === undefined ? '' : tempData} &deg; C</h5>
                <div className="weather-img">
                    <img src={`http://openweathermap.org/img/wn/${icon}@2x.png`} className="weather-icon" alt="icon-img" height={50} width={50}/>
                    <h3 className="temp-main">{main !== undefined ? main : ''}</h3>
                </div>
            </div>
        </div>
    </div>
    </>
  )
}

export default Card