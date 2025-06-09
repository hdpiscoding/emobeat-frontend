// // src/components/MusicPlayer.tsx
// import { useEffect, useRef } from 'react';

// // Cập nhật interface Song để bao gồm resourceLink
// interface Song {
//   id: number;
//   name: string;
//   description: string;
//   coverPhoto: string;
//   resourceLink: string;
// }

// interface MusicPlayerProps {
//   song: Song | null;
//   audioUrl: string;
  
// }

// const MusicPlayer = ({ song, audioUrl }: MusicPlayerProps) => {
//   const audioRef = useRef<HTMLAudioElement>(null);

//   // useEffect sẽ chạy mỗi khi audioUrl thay đổi
//   useEffect(() => {
//     if (audioUrl && audioRef.current) {
//       audioRef.current.load(); // Tải nguồn audio mới
//       audioRef.current.play().catch(error => {
//         console.error("Lỗi tự động phát nhạc:", error);
//       });
//     }
//   }, [audioUrl]);

//   if (!song || !audioUrl) {
//     return null; // Không hiển thị gì nếu không có bài hát nào được chọn
//   }

//   return (
//     <div className="fixed bottom-0 left-0 right-0 bg-gray-900 border-t border-gray-700 p-4 z-50">
//       <div className="max-w-7xl mx-auto flex items-center space-x-4">
//         {/* Thông tin bài hát */}
//         <img src={song.coverPhoto} alt={song.name} className="w-16 h-16 rounded-md" />
//         <div>
//           <h3 className="font-bold text-white">{song.name}</h3>
//           <p className="text-sm text-gray-400">{song.description}</p>
//         </div>

//         {/* Trình phát audio */}
//         <audio ref={audioRef} controls className="w-full ml-auto">
//           <source src={audioUrl} type="audio/mpeg" />
//           Trình duyệt của bạn không hỗ trợ thẻ audio.
//         </audio>
//       </div>
//     </div>
//   );
// };

// export default MusicPlayer;


import React, { useEffect, forwardRef } from 'react';

// Cập nhật interface Song
interface Song {
  id: number;
  name: string;
  description: string;
  coverPhoto: string;
  resourceLink: string;
}

interface MusicPlayerProps {
  song: Song | null;
  audioUrl: string;
  onEnded: () => void; // Prop mới để xử lý khi bài hát kết thúc
}

// Sử dụng forwardRef để component cha có thể truy cập vào thẻ <audio>
const MusicPlayer = forwardRef<HTMLAudioElement, MusicPlayerProps>(
  ({ song, audioUrl, onEnded }, ref) => {

    useEffect(() => {
      // Logic này không thay đổi
      if (audioUrl && ref && 'current' in ref && ref.current) {
        ref.current.load();
        ref.current.play().catch(error => {
          console.error("Lỗi tự động phát nhạc:", error);
        });
      }
    }, [audioUrl, ref]);

    if (!song || !audioUrl) {
      return null;
    }

    return (
      <div className="fixed bottom-0 left-0 right-0 bg-gray-900 border-t border-gray-700 p-4 z-50">
        <div className="max-w-7xl mx-auto flex items-center space-x-4">
          <img src={song.coverPhoto} alt={song.name} className="w-16 h-16 rounded-md" />
          <div>
            <h3 className="font-bold text-white">{song.name}</h3>
            <p className="text-sm text-gray-400">{song.description}</p>
          </div>
          <audio
            ref={ref}
            controls
            className="w-full ml-auto"
            onEnded={onEnded} // Gán sự kiện onEnded
          >
            <source src={audioUrl} type="audio/mpeg" />
            Trình duyệt của bạn không hỗ trợ thẻ audio.
          </audio>
        </div>
      </div>
    );
  }
);

export default MusicPlayer;