import React from 'react'
import '../../../styles/Trainer-styles/trainerCalendar.css'

const TrainerCalendar = () => {
    return (
        <div className="trainer-calendar">
            <h2 className='calendar-title'>Clients <span className='green-text'>1 on 1</span> Training</h2>
            <iframe
                src="https://calendar.google.com/calendar/embed?src=josejoakin10%40gmail.com&ctz=Europe%2FAmsterdam"

                width="800px"
                height="600px"
                frameBorder="0"
                scrolling="no"

                style={{
                    border: 0
                }}
            />
        </div>
    )
}

export default TrainerCalendar