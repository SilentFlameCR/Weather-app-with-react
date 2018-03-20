import React from "react";
import Titles from "./components/Titles";
import Form from "./components/Form";
import Weather from "./components/Weather";

const API_KEY = "ef0237b23e1f255a8a7faced93d0a3e7";

class App extends React.Component {
    state = {
        temperature: undefined,
        city: undefined,
        country: undefined,
        humidity: undefined,
        description: undefined,
        error: undefined,
        weatherConditions: 'cold'
    }
    
    getWeather = async (e) => {
        e.preventDefault();
        const city = e.target.elements.city.value;
        const country = e.target.elements.country.value;
        const api_call = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city},${country}&appid=${API_KEY}&units=metric`);
        const data = await api_call.json();
        
        if(city && country) {
            console.log(data);
        
            this.setState({
                temperature: data.main.temp,
                city: data.name,
                country: data.sys.country,
                humidity: data.main.humidity,
                description: data.weather[0].description,
                error: ""
            });
        } else {
            this.setState({
                temperature: undefined,
                city: undefined,
                country: undefined,
                humidity: undefined,
                description: undefined,
                error: "Please enter a valid city & country!",
                weatherConditions: 'cold'
            });
        }
        
        if(data.message == 'city not found') {
            this.setState({
                error: "Please enter a valid city & country!"
            });
        }
        
        if(this.state.description.includes('rain')){
            this.setState({
               weatherConditions: 'rain'
            });
        } else if(data.main.temp > 10 && data.main.temp < 20 && !this.state.description.includes('rain')) {
            // weatherConditions 1: Hot
            // weatherConditions 0: Cold/Default
            this.setState({
               weatherConditions: 'hot'
            });
        } else if(data.main.temp > 20 && !this.state.description.includes('rain')){
            this.setState({
               weatherConditions: 'very-hot'
            });
        }else if(data.main.temp < 0 && !this.state.description.includes('rain')) {
            this.setState({
               weatherConditions: 'ice-cold'
            });
        } else if(data.main.temp > 0 && data.main.temp < 10 && !this.state.description.includes('rain')) {
            this.setState({
               weatherConditions: 'cold'
            });
        }
    }
    

    

    
    render() {
    function wrapperClassName(temp) {
        const prefix = 'wrapper-gradient-';

        switch (temp) {
            case 'hot':
                return prefix + 'hot'
            case 'cold':
                return prefix + 'cold'
            case 'ice-cold':
                return prefix + 'ice-cold'
            case 'rain':
                return prefix + 'rain'
            case 'very-hot':
                return prefix + 'very-hot'
            default:
                return prefix + 'cold'
        }
    }

    function imageClassName(temp) {
        const prefix = 'weather-image-';

        switch (temp) {
            case 'hot':
                return prefix + 'hot'
            case 'cold':
                return prefix + 'cold'
            case 'ice-cold':
                return prefix + 'ice-cold'
            case 'rain':
                return prefix + 'rain'
            case 'very-hot':
                return prefix + 'very-hot'
            default:
                return prefix + 'cold'
        }
    }        
        
        return (
            <div>
                <div className={"wrapper " + wrapperClassName(this.state.weatherConditions) }>
                    <div className="main">
                        <div className="container">
                            <div className="row">
                                <div className={"col-xs-5 title-container " + imageClassName(this.state.weatherConditions)}>
                                    <Titles />
                                </div>
                                
                                <div className="col-xs-5 form-container">
                                    <button id="home-button"><a href="http://www.rahulrodrigues.ca">Home</a></button>
                                    <Form getWeather={this.getWeather}/>
                                    
                                    <Weather temperature={this.state.temperature}
                                    city={this.state.city}
                                    country={this.state.country}
                                    humidity={this.state.humidity}
                                    description={this.state.description}
                                    error={this.state.error}/>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default App;