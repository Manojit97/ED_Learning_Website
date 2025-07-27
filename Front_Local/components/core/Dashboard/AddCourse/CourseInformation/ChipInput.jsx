import React from 'react'
import { useEffect } from 'react';
import { useState } from 'react';
import { useSelector } from 'react-redux'
import { GrFormClose } from "react-icons/gr"
const ChipInput = ({
    label, name,
  placeholder,
  register,
  errors,
  setValue,
  getValues,
}) => {
    const {course, editCourse} = useSelector((state)=>state.course);
    const [chips, setChips] = useState([])

    useEffect(() => {
      if(editCourse) {
        setChips(Array.isArray(course?.tag) ? course.tag : []);
      }
      register(name, {required:true, validate: (value)=> value.length > 0})

    }, [editCourse, course, register, name])
    
    useEffect(() => {
      setValue(name, chips)
    }, [chips])
    
    const handleKeyDown = (e) => {
        if (e.key === "Enter" || e.key === ",") {
            e.preventDefault();
            const chipValue = e.target.value.trim();

            if(chipValue && !chips.includes(chipValue)){
                setChips([...chips, chipValue])
                e.target.value = ""
            }
        }
    }

    const handleDeleteChip = (chipIndex) => {
        const newChips = chips.filter((curr, ind) => ind!==chipIndex )
        setChips(newChips)
    }
  return (
    <div className="flex flex-col space-y-2">
      {/* Render the label for the input */}
      <label className="text-sm text-[#F1F2FF]" htmlFor={name}>
        {label} <sup className="text-[#EF476F]">*</sup>
      </label>
      {/* Render the chips and input */}
      <div className="flex w-full flex-wrap gap-y-2">
        {/* Map over the chips array and render each chip */}
        
        {chips.map((chip, index) => (
          <div
            key={index}
            className="m-1 flex items-center rounded-full bg-[#9E8006] px-2 py-1 text-sm text-[#F1F2FF]"
          >

            {/* Render the chip value */}
            {chip}
            {/* Render the button to delete the chip */}
            <button
              type="button"
              className="ml-2 focus:outline-none"
              onClick={() => handleDeleteChip(index)}
            >
              <GrFormClose className="text-sm" />
            </button>

          </div>
        ))}

        
        {/* Render the input for adding new chips */}
        <input
          id={name}
          name={name}
          type="text"
          placeholder={placeholder}
          onKeyDown={handleKeyDown}
          className="form-style w-full"
        />
      </div>
      {/* Render an error message if the input is required and not filled */}
      {errors[name] && (
        <span className="ml-2 text-xs tracking-wide text-[#EF476F]">
          {label} is required
        </span>
      )}
    </div>
  )
}

export default ChipInput