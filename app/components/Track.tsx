import { FC, useState, useRef } from 'react'

interface TrackProps {
  title: string
  id: string
  mp3: string
  art: string
}

const Track: FC<TrackProps> = ({ title, id, mp3, art }) => {
  const audioRef = useRef<HTMLAudioElement>(null)
  const [playButton, setPlayButton] = useState(true)
  return (
    <div className="card-body flex-row items-center space-x-4 text-center">
      <div className="flex-1">
        <h2 className="card-title">{title}</h2>{' '}
        <div className="mb-1">
          <p className="text-2xs text-left">Track id:</p>
          <div
            className="badge badge-xs m-2 hover:cursor-pointer"
            onClick={() => {
              /* Copy the text inside the text field */
              navigator.clipboard.writeText(id)
            }}
          >
            {id}
          </div>
        </div>
        <div
          className="hover:cursor-pointer"
          onClick={() => {
            console.log('clicked')
            if (!audioRef.current?.paused) {
              console.log('pausing')
              setPlayButton(true)
              audioRef.current?.pause()
            } else {
              console.log('playing')
              setPlayButton(false)
              audioRef.current?.play()
            }
          }}
        >
          <figure>
            <img src={art} />
          </figure>
          {playButton ? (
            <p className="absolute left-4 top-1/3 h-full w-full text-9xl">►</p>
          ) : (
            <p className="absolute left-0 top-1/3 h-full w-full text-9xl">▮▮</p>
          )}
        </div>
        <audio ref={audioRef}>
          <source src={mp3} type="audio/mpeg" />
          Your browser does not support the audio element.
        </audio>
      </div>
    </div>
  )
}

export default Track
