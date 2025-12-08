
"use client";

import { FaLocationArrow, FaBriefcase, FaCalendarAlt } from 'react-icons/fa';
import Link from 'next/link';
import moment from 'moment';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

const JobCard = ({ _id, position, company, location, type, createdAt, status }) => {
    const router = useRouter();

    const date = moment(createdAt).format('MMM Do, YYYY');

    const deleteJob = async () => {
        try {
            const res = await fetch(`/api/jobs/${_id}`, {
                method: 'DELETE',
            });
            if (res.ok) {
                toast.success('Job deleted successfully');
                router.refresh();
            } else {
                toast.error('Error deleting job');
            }
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <article className='bg-[#1a1a1e] rounded-lg shadow-sm border border-gray-800'>
            <header className='p-6 border-b border-gray-100 flex items-center gap-4'>
                <div className='w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center text-xl font-bold text-white uppercase'>
                    {company.charAt(0)}
                </div>
                <div>
                    <h5 className='mb-1 text-lg font-medium text-gray-800 tracking-wide'>{position}</h5>
                    <p className='text-gray-500 text-sm'>{company}</p>
                </div>
            </header>
            <div className='p-6'>
                <div className='grid grid-cols-2 gap-y-4 mb-6'>
                    <JobInfo icon={<FaLocationArrow />} text={location || 'Remote'} />
                    <JobInfo icon={<FaCalendarAlt />} text={date} />
                    <JobInfo icon={<FaBriefcase />} text={type} />
                    <div className={`capitalize tracking-wide font-medium rounded px-3 py-1 w-fit text-sm ${status === 'interview' ? 'text-blue-600 bg-blue-100' : status === 'declined' || status === 'rejected' ? 'text-red-600 bg-red-100' : 'text-yellow-600 bg-yellow-100'}`}>
                        {status}
                    </div>
                </div>
                <footer className='mt-4 flex gap-2'>
                    <Link
                        href={`/add-job?id=${_id}`}
                        className='bg-green-100 text-green-700 px-4 py-2 rounded shadow-sm text-sm hover:bg-green-200 transition'
                    >
                        Edit
                    </Link>
                    <Link
                        href={`/jobs/${_id}`}
                        className='bg-blue-100 text-blue-700 px-4 py-2 rounded shadow-sm text-sm hover:bg-blue-200 transition'
                    >
                        Details
                    </Link>
                    <button
                        type='button'
                        className='bg-red-100 text-red-700 px-4 py-2 rounded shadow-sm text-sm hover:bg-red-200 transition'
                        onClick={deleteJob}
                    >
                        Delete
                    </button>
                </footer>
            </div>
        </article>
    );
};

const JobInfo = ({ icon, text }) => {
    return (
        <div className='flex items-center gap-3 text-gray-600 whitespace-nowrap'>
            <span className='text-gray-400'>{icon}</span>
            <span className='capitalize'>{text}</span>
        </div>
    );
};

export default JobCard;
