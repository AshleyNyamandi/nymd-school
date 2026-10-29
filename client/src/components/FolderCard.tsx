import { useNavigate } from "react-router";

const FolderCard = ({ link, label= null, index }: { link: string; label?: string | null; index?: number }) => {
      const navigate = useNavigate();

  return (
          <button
            className='group relative w-full pt-9 pb-4 px-3 bg-linear-to-b from-zinc-300 to-zinc-500 text-zinc-900 font-medium rounded-b-lg rounded-tr-lg cursor-pointer shadow-md hover:shadow-xl hover:-translate-y-1 hover:from-zinc-200 hover:to-zinc-400 transition-all duration-200 text-left ring-1 ring-zinc-600/40'
            onClick={() => navigate(link)}
            key={index}
          >
            {/* Folder tab */}
            <span className='absolute -top-3 left-0 h-4 w-1/3 bg-linear-to-b from-zinc-300 to-zinc-400 rounded-t-md ring-1 ring-zinc-600/40 border-b-0' />
            {/* Top highlight (glassy sheen) */}
            <span className='absolute inset-x-1 top-1 h-1/3 rounded-tr-md bg-linear-to-b from-white/50 to-transparent pointer-events-none' />
            {/* Bottom shading for depth */}
            <span className='absolute inset-x-0 bottom-0 h-1/3 rounded-b-lg bg-linear-to-t from-black/15 to-transparent pointer-events-none' />
            {
                label && 
                <span className='relative flex items-center gap-2 drop-shadow-sm'>
                    <svg className='w-5 h-5 text-zinc-700' fill='currentColor' viewBox='0 0 20 20'>
                        <path d='M2 5.5A2.5 2.5 0 014.5 3h3.086a1 1 0 01.707.293L9.707 4.5H15.5A2.5 2.5 0 0118 7v7.5a2.5 2.5 0 01-2.5 2.5h-11A2.5 2.5 0 012 14.5v-9z' />
                    </svg>
                    {label}
                </span>
            }
          </button>
  )
}

export default FolderCard