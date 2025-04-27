import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import ko from 'date-fns/locale/ko';
import { useEffect, useState } from 'react';
import { getScheduledPostByMoim } from '../../../../api/moimAPI';

const locales = { ko };
const localizer = dateFnsLocalizer({
    format, parse, startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 0 }), getDay, locales,
});

const MyCustomToolbar = ({ label, onNavigate }) => (
    <div className="flex flex-col items-center gap-2 mt-4">
        <div className="flex gap-5 text-xl font-bold">{label}</div>
        <div className="flex gap-5">
            <button onClick={() => onNavigate('PREV')} className="px-3 py-1 bg-blue-100 rounded-sm hover:bg-blue-300 transition">◀</button>
            <button onClick={() => onNavigate('TODAY')} className="px-3 py-1 bg-green-100 rounded-xl hover:bg-green-300 transition">⚫️</button>
            <button onClick={() => onNavigate('NEXT')} className="px-3 py-1 bg-blue-100 rounded-sm hover:bg-blue-300 transition">▶</button>
        </div>
    </div>
);

const MoimPostCalendarComponent = ({ moim, selectedPost }) => {
    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [events, setEvents] = useState([]);
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        if (posts.length === 0) return;
        const eventList = posts.map(post => {
            if (post.post_type !== 'Scheduled')
                return

            const [datePart, timePart] = post.schedule.split(' ');
            const [year, month, day] = datePart.split('-').map(Number);
            const [hour, minute] = timePart.split(':').map(Number);

            return {
                title: post.title,
                start: new Date(year, month - 1, day, hour, minute),
                end: new Date(year, month - 1, day, hour + 1, minute),
                description: post,
            };
        });

        setEvents(eventList);
    }, [posts]);

    const getPostsByScheduled = async () => {
        if (!moim.id || moim.id === '') {
            console.log('모임 아이디가 없는데?')
            return
        }
        console.log('스케줄 불러오는중...')

        const res = await getScheduledPostByMoim(moim.id)
        if (!res || res.statusCode != 200) {
            console.error('error', res)
            alert('게시글 불러오기가 실패하는데?')
        }
        const temp = JSON.parse(res.body)
        console.log('res is ', temp)
        setPosts(temp)
    }

    useEffect(() => {
        if (posts.length > 0) return

        getPostsByScheduled()

    }, [])


    const handleDateSelect = (slotInfo) => {
        console.log('22')

        const clickedDate = slotInfo.start;
        setSelectedDate(clickedDate);

        // 선택한 날짜의 이벤트 필터링
        const filteredEvents = events.filter(event => {
            if (!event) return
            return event.start.toDateString() === clickedDate.toDateString();
        });

        setSelectedEvent(filteredEvents); // 상태 업데이트
    };

    const handleEventClick = (event) => {
        console.log('11')
        setSelectedEvent(event);
    };

    const highlightSelectedDay = (date) => {
        const isSameDate = selectedDate &&
            date.getFullYear() === selectedDate.getFullYear() &&
            date.getMonth() === selectedDate.getMonth() &&
            date.getDate() === selectedDate.getDate();

        if (isSameDate) {
            return {
                style: {
                    backgroundColor: '#D1FAE5', // 예: 연한 민트색
                    borderRadius: '10%',
                },
            };
        }
        return {};
    };

    return (
        <div className="max-w-4xl mx-auto p-6 bg-white shadow-xl rounded-2xl">
            <Calendar
                localizer={localizer}
                events={events}
                style={{ height: '550px' }}
                components={{ toolbar: MyCustomToolbar }}
                selectable
                onSelectSlot={handleDateSelect}
                onSelectEvent={handleDateSelect}
                dayPropGetter={(date) => highlightSelectedDay(date)}
                views={['month']}
            />

            {/* 선택한 날짜 또는 이벤트 표시 */}
            <div className="mt-6 p-4 bg-gray-100 rounded-lg shadow-lg">
                {/* {selectedDate && (
                    <h2 className="text-[20px] font-semibold text-blue-400">
                        해당 날짜의 모임 정보
                    </h2>
                )} */}

                {selectedEvent && selectedEvent.length > 0 ? (
                    <ul className="mt-4 space-y-2">
                        {selectedEvent.map((event, index) => (
                            <li key={index} className="p-3 bg-white rounded-lg shadow-md hover:bg-gray-200 transition cursor-pointer" onClick={() => selectedPost?.(event.description)}>
                                <h3 className="text-md font-bold text-blue-600">{event.title}</h3>
                                <p className="text-gray-500">{event.description.content}</p>
                                <p className="text-sm text-gray-500">
                                    {event.start.toLocaleTimeString()}
                                </p>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-xs text-gray-500 text-center mt-3">
                        해당 날짜에 모임이 없습니다.
                    </p>
                )}
            </div>
        </div>
    );
};

export default MoimPostCalendarComponent;