import { Search } from 'lucide-react'
import React from 'react'

const SearchHero = ({onSearchInput}:any) => {
  return (
    <div className="p-20 bg-gradient-to-br from-purple-400 via-purple-700 to-blue-800 flex justify-center items-center">
      <div className="text-center">
        <h2 className="text-5xl font-bold text-white">Browse All Templates</h2>
        <p className="text-xl  font-light text-white">What would you like to create today?</p>
        <div className="w-full flex justify-center">
            <div className="flex gap-2 items-center p-2 border rounded-md bg-white my-5 w-[100%]">
                <Search className=" text-gray-400" />
                <input type="text" placeholder="Search" className="bg-transparent w-full outline-none text-gray-600"  onChange={(event)=>onSearchInput(event.target.value)}/>
            </div>
        </div>
      </div>
    </div>
 
  )
}

export default SearchHero



 
