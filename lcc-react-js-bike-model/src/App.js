import React, { Component } from 'react';
import './App.css';
import Bike from './components/Bike';

// Root of App
export default class App extends Component {
    render() {
        return (
            <div className="App">
                <Bike />
            </div>
        );
    }
}
