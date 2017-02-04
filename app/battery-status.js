/* @flow */
import React, { Component, PropTypes } from 'react';

type BatteryInfo = {
  charging: boolean,
  batteryLevel: number
}

type Props = {
  onChange: (BatteryInfo) => void
}

export default class BatteryStatus extends Component {
  constructor(props: Props) {
    super(props);
    this.batteryManager = {};
    this._boundUpdate = this._update.bind(this);
  }

  componentDidMount() {
    if (navigator.getBattery) {
      navigator.getBattery().then(batteryManager => {
        this.batteryManager = batteryManager;
        this.batteryManager.addEventListener('levelchange', this._boundUpdate);
        this.batteryManager.addEventListener('chargingchange', this._boundUpdate);
        this._update();
      });
    }
  }

  componentWillUnmount() {
    this.batteryManager.removeEventListener('levelchange', this._boundUpdate);
    this.batteryManager.removeEventListener('chargingchange', this._boundUpdate);
  }

  _update() {
    this.props.onChange({ batteryLevel: this.batteryManager.level, charging: this.batteryManager.charging });
    this.forceUpdate();
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
