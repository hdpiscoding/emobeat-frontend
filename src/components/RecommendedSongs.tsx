// // src/components/RecommendedSongs.tsx

// // Cập nhật interface Song
// interface Song {
//   id: number;
//   name: string;
//   description: string;
//   coverPhoto: string;
//   resourceLink: string;
// }

// interface RecommendedSongsProps {
//   songs: Song[];
//   onSongSelect: (song: Song) => void; // Prop mới để xử lý khi chọn bài hát
// }

// const RecommendedSongs = ({ songs, onSongSelect }: RecommendedSongsProps) => {
//   return (
//     <div className="w-full">
//       <h2 className="text-xl font-bold mb-4 text-white">Gợi ý cho bạn 🎶</h2>
//       <div className="space-y-4 overflow-y-auto max-h-[70vh]">
//         {songs.length > 0 ? (
//           songs.map((song) => (
//             // Thêm onClick và cursor-pointer
//             <div
//               key={song.id}
//               className="flex items-center p-2 bg-gray-800 bg-opacity-70 rounded-md hover:bg-gray-700 transition-colors duration-200 cursor-pointer"
//               onClick={() => onSongSelect(song)}
//             >
//               <img
//                 src={song.coverPhoto}
//                 alt={song.name}
//                 className="w-16 h-16 rounded-md object-cover mr-4"
//               />
//               <div className="flex-1">
//                 <h3 className="font-semibold text-white">{song.name}</h3>
//                 <p className="text-sm text-gray-400 truncate">{song.description}</p>
//               </div>
//             </div>
//           ))
//         ) : (
//           <p className="text-gray-400">Không tìm thấy bài hát gợi ý.</p>
//         )}
//       </div>
//     </div>
//   );
// };

// export default RecommendedSongs;


import { Heart } from 'lucide-react'; // Import icon trái tim

interface Song {
  id: number;
  name: string;
  description: string;
  coverPhoto: string;
  resourceLink: string;
}

interface RecommendedSongsProps {
  songs: Song[];
  onSongSelect: (song: Song) => void;
  onSongLike: (song: Song) => void; // Prop mới cho sự kiện like
}

const RecommendedSongs = ({ songs, onSongSelect, onSongLike }: RecommendedSongsProps) => {
  const handleLikeClick = (e: React.MouseEvent, song: Song) => {
    e.stopPropagation(); // Ngăn sự kiện click vào nút like làm phát nhạc
    onSongLike(song);
    // Có thể thêm hiệu ứng UI ở đây, ví dụ đổi màu nút like
    alert(`Đã thích bài hát: ${song.name}`);
  };

  return (
    <div className="w-full">
      <h2 className="text-xl font-bold mb-4 text-white">Gợi ý cho bạn 🎶</h2>
      <div className="space-y-4 overflow-y-auto max-h-[70vh]">
        {songs.length > 0 ? (
          songs.map((song) => (
            <div
              key={song.id}
              className="flex items-center p-2 pr-4 bg-gray-800 bg-opacity-70 rounded-md hover:bg-gray-700 transition-colors duration-200 cursor-pointer"
              onClick={() => onSongSelect(song)}
            >
              <img
                src={song.coverPhoto}
                alt={song.name}
                className="w-16 h-16 rounded-md object-cover mr-4"
              />
              <div className="flex-1">
                <h3 className="font-semibold text-white">{song.name}</h3>
                <p className="text-sm text-gray-400 truncate">{song.description}</p>
              </div>
              {/* Nút Like */}
              <button
                onClick={(e) => handleLikeClick(e, song)}
                className="ml-4 p-2 rounded-full hover:bg-red-500/20 text-gray-400 hover:text-red-500 transition-colors"
                title={`Thích bài hát ${song.name}`}
              >
                <Heart size={20} />
              </button>
            </div>
          ))
        ) : (
          <p className="text-gray-400">Không tìm thấy bài hát gợi ý.</p>
        )}
      </div>
    </div>
  );
};

export default RecommendedSongs;