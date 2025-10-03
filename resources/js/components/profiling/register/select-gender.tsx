export default function SelectGender({value = "Male", setValue, disabled}: {value: "Male" | "Female", setValue: (data: "Male" | "Female") => void, disabled?: boolean}) {
     const defaultClass: string = `text-center border rounded-lg p-2 text-sm ${!disabled && 'cursor-pointer'} transition`;

     const classSelected = "font-bold ring-2";
     const classDeselected = `${!disabled && 'hover:outline-2'} text-neutral-600`;

     const maleClassSelected = classSelected + " text-blue-500 bg-blue-500/20";
     const maleClassDeselected = classDeselected + `outline-blue-500/30 ${!disabled && 'hover:text-blue-500/80'}`;

     const femaleClassSelected = classSelected + " text-pink-500 bg-pink-500/20";
     const femaleClassDeselected = classDeselected + `outline-pink-500/30 ${!disabled && 'hover:text-pink-500/80'}`;

     return (
          <div className="grid gap-2 grid-cols-2">
               <div onClick={() => !disabled && setValue("Male")} className={`${defaultClass} ${value == "Male" ? maleClassSelected : maleClassDeselected}`}>
                    Male
               </div>
               <div onClick={() => !disabled && setValue("Female")} className={`${defaultClass} ${value == "Female" ? femaleClassSelected : femaleClassDeselected}`}>
                    Female
               </div>
          </div>
     )
}