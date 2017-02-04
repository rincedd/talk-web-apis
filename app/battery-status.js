import React, { Component } from 'react';

export default class BatteryStatus extends Component {
  constructor(props) {
    super(props);
    this.batteryManager = {};
    this._boundForceUpdate = this.forceUpdate.bind(this);
  }

  componentDidMount() {
    if (navigator.getBattery) {
      navigator.getBattery().then(batteryManager => {
        this.batteryManager = batteryManager;
        this.batteryManager.addEventListener('levelchange', this._boundForceUpdate);
        this.batteryManager.addEventListener('chargingchange', this._boundForceUpdate);
        this.forceUpdate();
      });
    }
  }

  componentWillUnmount() {
    this.batteryManager.removeEventListener('levelchange', this._boundForceUpdate);
    this.batteryManager.removeEventListener('chargingchange', this._boundForceUpdate);
  }

  render() {
    if (navigator.getBattery) {
      const classes = ['battery'];
      if (this.batteryManager.charging) {
        classes.push('charging');
      }
      return <div className={classes.join(' ')}>
        {this.batteryManager.level * 100} % remaining
      </div>;
    }
    return <div>Your browser does not support the Battery Status API.</div>;
  }
}
