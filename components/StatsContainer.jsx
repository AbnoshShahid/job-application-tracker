
import { FaSuitcaseRolling, FaCalendarCheck, FaBug } from 'react-icons/fa';

const StatsContainer = ({ defaultStats }) => {
    const stats = [
        {
            title: 'pending applications',
            count: defaultStats?.pending || 0,
            icon: <FaSuitcaseRolling />,
            color: '#e9b949',
            bcg: '#fcefc7',
        },
        {
            title: 'interviews scheduled',
            count: defaultStats?.interview || 0,
            icon: <FaCalendarCheck />,
            color: '#647acb',
            bcg: '#e0e8f9',
        },
        {
            title: 'jobs declined',
            count: defaultStats?.declined || 0,
            icon: <FaBug />,
            color: '#d66a6a',
            bcg: '#ffeeee',
        },
    ];

    return (
        <section className='grid gap-4 md:grid-cols-2 lg:grid-cols-3 mb-8'>
            {stats.map((item, index) => {
                return <StatsItem key={index} {...item} />;
            })}
        </section>
    );
};

const StatsItem = ({ count, title, icon, color, bcg }) => {
    return (
        <article className='p-8 bg-[#1a1a1e] rounded-lg border-b-4 shadow-sm' style={{ borderBottomColor: color }}>
            <header className='flex items-center justify-between'>
                <span className='text-5xl font-bold block text-gray-700'>{count}</span>
                <span className='w-14 h-14 rounded-md flex items-center justify-center text-3xl' style={{ background: bcg, color: color }}>
                    {icon}
                </span>
            </header>
            <h5 className='m-0 mt-4 capitalize text-xl tracking-wide text-gray-600 text-left'>{title}</h5>
        </article>
    );
};

export default StatsContainer;
