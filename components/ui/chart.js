// components/ui/Chart.js

import React from 'react';
import { LineChart, Line, CartesianGrid, XAxis, Tooltip, ResponsiveContainer } from 'recharts';

const chartData = [
  { month: "January", desktop: 186, mobile: 80 },
  { month: "February", desktop: 305, mobile: 200 },
  { month: "March", desktop: 237, mobile: 120 },
  { month: "April", desktop: 73, mobile: 190 },
  { month: "May", desktop: 209, mobile: 130 },
  { month: "June", desktop: 214, mobile: 140 },
];

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "#8884d8",
  },
  mobile: {
    label: "Mobile",
    color: "#82ca9d",
  },
};

export default function Chart() {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" />
        <Tooltip />
        <Line type="monotone" dataKey="desktop" stroke={chartConfig.desktop.color} strokeWidth={2} />
        <Line type="monotone" dataKey="mobile" stroke={chartConfig.mobile.color} strokeWidth={2} />
      </LineChart>
    </ResponsiveContainer>
  );
}
