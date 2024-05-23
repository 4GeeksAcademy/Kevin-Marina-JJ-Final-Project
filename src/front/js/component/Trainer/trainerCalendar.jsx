import React from 'react'

const TrainerCalendar = () => {
    return (
        <div className="trainer-calendar">
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