import React from 'react';

import {ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend} from 'recharts';

const ColumnChart = React.createClass({
  render () {
    return (
      <div >
        <BarChart style={{"background-color":"white"}}
                  data={this.props.data}
                  margin={{top: 30, right: 120, left: 20, bottom: 20}}
                  height={300}
                  width={960}>
          <XAxis dataKey={this.props.xKey} label={this.props.xLabel}/>
          <YAxis label={this.props.yLabel}/>
          <CartesianGrid strokeDasharray="3 3"/>
          <Tooltip/>
          <Bar dataKey={this.props.yKey} fill="#2b879e" isAnimationActive={false} />
        </BarChart>
      </div>
    );
  }
});

ColumnChart.propTypes = {
  data: React.PropTypes.array.isRequired,
  xKey: React.PropTypes.oneOfType([React.PropTypes.string, React.PropTypes.func]).isRequired,
  yKey: React.PropTypes.oneOfType([React.PropTypes.string, React.PropTypes.func]).isRequired,
  label: React.PropTypes.string,
};

export default ColumnChart;