
"use client";

import { useState } from 'react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    AreaChart,
    Area,
} from 'recharts';

const ChartsContainer = ({ data }) => {
    const [barChart, setBarChart] = useState(true);

    return (
        <section className='mt-16 text-center'>
            <h4 className='text-2xl font-semibold mb-6 capitalize'>Monthly Applications</h4>
            <button
                type='button'
                className='bg-transparent text-blue-500 text-lg border-none capitalize cursor-pointer mb-8 hover:underline'
                onClick={() => setBarChart(!barChart)}
            >
                {barChart ? 'Area Chart' : 'Bar Chart'}
            </button>
            {barChart ? <BarChartComponent data={data} /> : <AreaChartComponent data={data} />}
        </section>
    );
};

const BarChartComponent = ({ data }) => {
    return (
        <ResponsiveContainer width='100%' height={300}>
            <BarChart data={data} margin={{ top: 50 }}>
                <CartesianGrid strokeDasharray='3 3' />
                <XAxis dataKey='date' />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey='count' fill='#3b82f6' barSize={75} />
            </BarChart>
        </ResponsiveContainer>
    );
};

const AreaChartComponent = ({ data }) => {
    return (
        <ResponsiveContainer width='100%' height={300}>
            <AreaChart data={data} margin={{ top: 50 }}>
                <CartesianGrid strokeDasharray='3 3' />
                <XAxis dataKey='date' />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Area type='monotone' dataKey='count' stroke='#3b82f6' fill='#bef8fd' />
            </AreaChart>
        </ResponsiveContainer>
    );
};

export default ChartsContainer;
